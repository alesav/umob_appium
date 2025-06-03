#!/bin/bash

echo "Cleaning up remaining PageObjects.accountButton.waitForExist calls..."

# Find all files in specs directory and update them
find /Users/alesav/Dev/umob/umob_appium/tests/specs -name "*.ts" -o -name "*.js" | while read file; do
    # Check if file contains the patterns we want to replace
    if grep -q "PageObjects\.accountButton\." "$file"; then
        echo "Processing: $file"
        
        # Replace any remaining PageObjects.accountButton.click() with PageObjects.clickAccountButton()
        sed -i '' 's/PageObjects\.accountButton\.click()/PageObjects.clickAccountButton()/g' "$file"
        
        # Remove lines with PageObjects.accountButton.waitForExist (with or without parentheses)
        sed -i '' '/PageObjects\.accountButton\.waitForExist/d' "$file"
        
        echo "Updated: $file"
    fi
done

echo "Cleanup completed!"
