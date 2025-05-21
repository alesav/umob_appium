#!/bin/bash

# Define API token and base URL
TOKEN="BGbTPWeB5gpD6uKXkuZ6z6YB5okLwrb4nONrBU5Rr1rcjlKi2LJqJQQJ99BDACAAAAAN5uH1AAASAZDO1l3e"
BASE_URL="https://dev.azure.com/umob/umob"

# Create temp directory for downloads
TEMP_DIR=$(mktemp -d)
echo "Created temporary directory: $TEMP_DIR"

# First, get the total number of build IDs
TOTAL_BUILD_COUNT=$(curl -s -u :$TOKEN "$BASE_URL/_apis/build/builds?definitions=9&api-version=7.1-preview.7" | \
  jq -r '.count')
echo "Total number of BUILD_IDS available: $TOTAL_BUILD_COUNT"

# Get 50 latest build IDs
echo "Fetching 50 latest build IDs..."
BUILD_IDS=$(curl -s -u :$TOKEN "$BASE_URL/_apis/build/builds?definitions=9&api-version=7.1-preview.7" | \
  jq -r '.value | sort_by(.startTime) | reverse | .[0:50] | map(.id) | .[]')

# Process each build ID until we find one with an android-Test artifact
for BUILD_ID in $BUILD_IDS; do
  echo "Checking build $BUILD_ID for android-Test artifact..."
  
  # Try to get the download URL for android-Test artifact
  DOWNLOAD_URL=$(curl -s -u :$TOKEN "$BASE_URL/_apis/build/builds/$BUILD_ID/artifacts?api-version=7.1-preview.5" | \
    jq -r '.value[] | select(.name=="android-Test") | .resource.downloadUrl')
  
  # If download URL exists (not empty), download the artifact
  if [ -n "$DOWNLOAD_URL" ]; then
    echo "Found android-Test artifact in build $BUILD_ID. Downloading..."
    
    ZIP_FILE="$TEMP_DIR/android-Test-build-$BUILD_ID.zip"
    
    # Download the artifact
    curl -s -u :$TOKEN "$DOWNLOAD_URL" -o "$ZIP_FILE"
    
    # Check if download was successful
    if [ -f "$ZIP_FILE" ] && [ -s "$ZIP_FILE" ]; then
      echo "✓ Successfully downloaded build $BUILD_ID to $ZIP_FILE"
      
      # Unzip the file
      echo "Extracting APK from zip file..."
      unzip -q "$ZIP_FILE" -d "$TEMP_DIR/extracted"
      
      # Find the APK file(s)
      APK_FILES=$(find "$TEMP_DIR/extracted" -name "*.apk")
      
      if [ -z "$APK_FILES" ]; then
        echo "No APK files found in the extracted archive!"
      else
        # Install the first APK file found
        FIRST_APK=$(echo "$APK_FILES" | head -1)
        echo "Installing $FIRST_APK to device..."
        adb install -r "$FIRST_APK"
        
        if [ $? -eq 0 ]; then
          echo "✓ Successfully installed the app on the device"
        else
          echo "✗ Failed to install the app. Make sure a device is connected and adb is working"
        fi
      fi
      
      # Clean up
      echo "Cleaning up temporary files..."
      rm -rf "$TEMP_DIR"
      
      # Exit after successful download and installation
      echo "Process completed successfully with build $BUILD_ID"
      exit 0
    else
      echo "✗ Failed to download build $BUILD_ID"
      # Remove empty file if download failed
      rm -f "$ZIP_FILE"
    fi
  else
    echo "✗ No android-Test artifact found in build $BUILD_ID"
  fi
  
  echo "------------------------"
done

echo "No android-Test artifacts were found in the latest 50 builds."
# Clean up if we didn't find any build
rm -rf "$TEMP_DIR"
exit 1