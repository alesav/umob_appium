@echo off
setlocal enabledelayedexpansion

echo ===== Android Build Downloader and Installer for Windows =====

REM Define API token and base URL
set TOKEN="TOKEN_PLACEHOLDER"
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

REM Get 50 latest build IDs - save JSON response to a file first to avoid pipe issues
echo Fetching 50 latest build IDs...

for /f "tokens=*" %%a in ('curl -s -u :%TOKEN% "%BASE_URL%/_apis/build/builds?definitions=9^&api-version=7.1-preview.7" ^| jq -r ".value | sort_by(.startTime) | reverse | .[0:50] | map(.id) | .[]"') do (

    set BUILD_IDS=!BUILD_IDS! %%a
)

REM Process each build ID until we find one with an android-Test artifact
for %%b in (%BUILD_IDS%) do (
    set BUILD_ID=%%b
    echo Checking build !BUILD_ID! for android-Test artifact...
    
    REM Get artifact info for this build
    curl -s -u :%TOKEN% "%BASE_URL%/_apis/build/builds/!BUILD_ID!/artifacts?api-version=7.1-preview.5" > "%TEMP_DIR%\artifacts.json"
    
    REM Extract download URL if android-Test artifact exists
    jq -r ".value[] | select(.name==\"android-Test\") | .resource.downloadUrl" "%TEMP_DIR%\artifacts.json" > "%TEMP_DIR%\download_url.txt"
    
    REM Check if download URL file has content
    set "DOWNLOAD_URL="
    for /f "usebackq tokens=*" %%u in ("%TEMP_DIR%\download_url.txt") do (
        set "DOWNLOAD_URL=%%u"
    )
    
    REM If download URL exists (not empty), download the artifact
    if defined DOWNLOAD_URL (
        if not "!DOWNLOAD_URL!"=="" (
            echo Found android-Test artifact in build !BUILD_ID!. Downloading...
            
            set ZIP_FILE=%TEMP_DIR%\android-Test-build-!BUILD_ID!.zip
            
            REM Download the artifact
            curl -s -u :%TOKEN% "!DOWNLOAD_URL!" -o "!ZIP_FILE!"
            
            REM Check if download was successful
            if exist "!ZIP_FILE!" (
                echo ✓ Successfully downloaded build !BUILD_ID! to !ZIP_FILE!
                
                REM Create extraction directory
                mkdir "%TEMP_DIR%\extracted"
                
                REM Unzip the file using PowerShell (built into Windows)
                echo Extracting APK from zip file...
                powershell -command "Expand-Archive -Path '!ZIP_FILE!' -DestinationPath '%TEMP_DIR%\extracted' -Force"
                
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
                ) else (
                    REM Install the APK file
                    echo Installing !APK_FILE! to device...
                    adb install -r "!APK_FILE!"
                    
                    if !ERRORLEVEL! EQU 0 (
                        echo ✓ Successfully installed the app on the device
                    ) else (
                        echo ✗ Failed to install the app. Make sure a device is connected and adb is working
                    )
                )
                
                REM Exit after successful download and installation attempt
                echo Process completed with build !BUILD_ID!
                goto :cleanup_and_exit
            ) else (
                echo ✗ Failed to download build !BUILD_ID!
                if exist "!ZIP_FILE!" del "!ZIP_FILE!"
            )
        )
    ) else (
        echo ✗ No android-Test artifact found in build !BUILD_ID!
    )
    
    echo ------------------------
)

echo No android-Test artifacts were found in the latest 50 builds.

:cleanup_and_exit
REM Clean up
echo Cleaning up temporary files...
rd /s /q "%TEMP_DIR%" 2>nul

echo Script execution completed.
pause
exit /b