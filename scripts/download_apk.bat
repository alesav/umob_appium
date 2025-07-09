@echo off
setlocal enabledelayedexpansion

echo ===== Android Build Downloader and Installer for Windows =====

REM Define API token and base URL
REM TODO: Replace TOKEN_PLACEHOLDER with your actual Azure DevOps PAT
set TOKEN=YOUR_TOKEN
set BASE_URL=https://dev.azure.com/umob/umob

REM Create temp directory for downloads
set TEMP_DIR=%TEMP%\android_build_%RANDOM%
mkdir "%TEMP_DIR%"
echo Created temporary directory: %TEMP_DIR%

REM Check for required tools
where curl >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: curl is not installed or not in PATH.
    echo Please install curl for Windows and add it to your PATH.
    goto :cleanup_and_exit
)

where jq >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: jq is not installed or not in PATH.
    echo Please download jq.exe from https://stedolan.github.io/jq/download/ and add it to your PATH.
    goto :cleanup_and_exit
)

where adb >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: adb is not installed or not in PATH.
    echo Please install Android SDK Platform Tools and add adb to your PATH.
    goto :cleanup_and_exit
)

REM Test API connection first
echo Testing API connection...
curl -s -u :%TOKEN% "%BASE_URL%/_apis/build/builds?definitions=9&$top=1&api-version=7.1-preview.7" > "%TEMP_DIR%\api_test.json"

REM Check if API test was successful
jq . "%TEMP_DIR%\api_test.json" >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to get valid JSON response from Azure DevOps API.
    echo Response received:
    type "%TEMP_DIR%\api_test.json"
    echo.
    echo Please check:
    echo 1. Your TOKEN is correct
    echo 2. You have access to the Azure DevOps project
    echo 3. Your network connection allows access to Azure DevOps
    goto :cleanup_and_exit
)

echo ✓ API connection successful

REM Get total build count for information
curl -s -u :%TOKEN% "%BASE_URL%/_apis/build/builds?definitions=9&api-version=7.1-preview.7" > "%TEMP_DIR%\builds_response.json"

REM Check if the main API call was successful
jq . "%TEMP_DIR%\builds_response.json" >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to get builds list from Azure DevOps API.
    echo Response:
    type "%TEMP_DIR%\builds_response.json"
    goto :cleanup_and_exit
)

REM Get total count
for /f %%c in ('jq -r ".count" "%TEMP_DIR%\builds_response.json"') do set TOTAL_COUNT=%%c
echo Total number of builds available: %TOTAL_COUNT%

REM Get 50 latest build IDs and save to file
echo Fetching 50 latest build IDs...
jq -r ".value | sort_by(.startTime) | reverse | .[0:50] | map(.id) | .[]" "%TEMP_DIR%\builds_response.json" > "%TEMP_DIR%\build_ids.txt"

REM Check if we got any build IDs
if not exist "%TEMP_DIR%\build_ids.txt" (
    echo Error: Could not extract build IDs
    goto :cleanup_and_exit
)

REM Count lines to see how many builds we got
for /f %%c in ('type "%TEMP_DIR%\build_ids.txt" ^| find /c /v ""') do set BUILD_COUNT=%%c
echo Found %BUILD_COUNT% builds to check

REM Process each build ID until we find one with an android-Test artifact
for /f "usebackq" %%b in ("%TEMP_DIR%\build_ids.txt") do (
    set BUILD_ID=%%b
    echo Checking build !BUILD_ID! for android-Test artifact...
    
    REM Get artifact info for this build
    curl -s -u :%TOKEN% "%BASE_URL%/_apis/build/builds/!BUILD_ID!/artifacts?api-version=7.1-preview.5" > "%TEMP_DIR%\artifacts.json"
    
    REM Check if we got valid JSON
    jq . "%TEMP_DIR%\artifacts.json" >nul 2>nul
    if !ERRORLEVEL! NEQ 0 (
        echo Warning: Invalid response for build !BUILD_ID! artifacts
        echo Response:
        type "%TEMP_DIR%\artifacts.json"
        echo ========================
        goto :next_build
    )
    
    REM Extract download URL if android-Test artifact exists
    jq -r ".value[] | select(.name==\"android-Test\") | .resource.downloadUrl" "%TEMP_DIR%\artifacts.json" > "%TEMP_DIR%\download_url.txt"
    
    REM Check if download URL file has content
    set "DOWNLOAD_URL="
    for /f "usebackq tokens=*" %%u in ("%TEMP_DIR%\download_url.txt") do (
        set "DOWNLOAD_URL=%%u"
    )
    
    REM If download URL exists (not empty and not "null"), download the artifact
    if defined DOWNLOAD_URL (
        if not "!DOWNLOAD_URL!"=="" (
            if not "!DOWNLOAD_URL!"=="null" (
                echo Found android-Test artifact in build !BUILD_ID!. Downloading...
                
                set ZIP_FILE=%TEMP_DIR%\android-Test-build-!BUILD_ID!.zip
                
                REM Download the artifact
                curl -s -u :%TOKEN% "!DOWNLOAD_URL!" -o "!ZIP_FILE!"
                
                REM Check if download was successful
                if exist "!ZIP_FILE!" (
                    REM Check file size to ensure it's not empty
                    for %%F in ("!ZIP_FILE!") do set FILE_SIZE=%%~zF
                    if !FILE_SIZE! GTR 0 (
                        echo ✓ Successfully downloaded build !BUILD_ID! to !ZIP_FILE! ^(!FILE_SIZE! bytes^)
                        
                        REM Create extraction directory
                        mkdir "%TEMP_DIR%\extracted"
                        
                        REM Unzip the file using PowerShell (built into Windows)
                        echo Extracting APK from zip file...
                        powershell -command "try { Expand-Archive -Path '!ZIP_FILE!' -DestinationPath '%TEMP_DIR%\extracted' -Force; exit 0 } catch { Write-Host 'Error extracting archive:' $_.Exception.Message; exit 1 }"
                        
                        if !ERRORLEVEL! EQU 0 (
                            REM Find the APK file(s)
                            set APK_FOUND=0
                            
                            REM Search for APK files recursively
                            for /r "%TEMP_DIR%\extracted" %%f in (*.apk) do (
                                echo Found APK: %%f
                                set APK_FILE=%%f
                                set APK_FOUND=1
                                goto install_apk
                            )
                            
                            :install_apk
                            if !APK_FOUND! EQU 0 (
                                echo No APK files found in the extracted archive!
                                echo Archive contents:
                                dir /s "%TEMP_DIR%\extracted"
                            ) else (
                                REM Install the APK file
                                echo Installing !APK_FILE! to device...
                                adb install -r "!APK_FILE!"
                                
                                if !ERRORLEVEL! EQU 0 (
                                    echo ✓ Successfully installed the app on the device
                                ) else (
                                    echo ✗ Failed to install the app. Make sure a device is connected and adb is working
                                    echo Checking adb devices:
                                    adb devices
                                )
                            )
                            
                            REM Exit after successful download and installation attempt
                            echo Process completed with build !BUILD_ID!
                            goto :cleanup_and_exit
                        ) else (
                            echo ✗ Failed to extract the archive
                        )
                    ) else (
                        echo ✗ Downloaded file is empty
                        del "!ZIP_FILE!"
                    )
                ) else (
                    echo ✗ Failed to download build !BUILD_ID!
                )
            )
        )
    ) else (
        echo ✗ No android-Test artifact found in build !BUILD_ID!
    )
    
    :next_build
    echo ------------------------
)

echo No android-Test artifacts were found in the latest %BUILD_COUNT% builds.

:cleanup_and_exit
REM Clean up
echo Cleaning up temporary files...
rd /s /q "%TEMP_DIR%" 2>nul

echo Script execution completed.
pause
exit /b