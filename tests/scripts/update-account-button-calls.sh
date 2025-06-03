#!/bin/bash

# Script to update all remaining test files to use PageObjects.clickAccountButton()

echo "Updating all test files to use PageObjects.clickAccountButton()..."

# Files to update (excluding the ones already done)
files=(
    "/Users/alesav/Dev/umob/umob_appium/tests/specs/account/addAdress.spec.ts"
    "/Users/alesav/Dev/umob/umob_appium/tests/specs/account/addPaymentMethod.spec.ts"
    "/Users/alesav/Dev/umob/umob_appium/tests/specs/account/improvedPersonalInfoTest.spec.ts"
    "/Users/alesav/Dev/umob/umob_appium/tests/specs/book/reserveCheck.spec.ts"
    "/Users/alesav/Dev/umob/umob_appium/tests/specs/book/bookUmobScooters.spec.ts"
    "/Users/alesav/Dev/umob/umob_appium/tests/specs/book/reserveFelyx.spec.ts"
    "/Users/alesav/Dev/umob/umob_appium/tests/specs/login/login.positive.spec.ts"
    "/Users/alesav/Dev/umob/umob_appium/tests/specs/newUser/addVoucher.spec.ts"
    "/Users/alesav/Dev/umob/umob_appium/tests/specs/newUser/nReserveFelyxNoCard.spec.ts"
    "/Users/alesav/Dev/umob/umob_appium/tests/specs/newUser/welcomeBookDonkey.spec.ts"
    "/Users/alesav/Dev/umob/umob_appium/tests/specs/notLoggedTests/combinedNotLogged.spec.ts"
    "/Users/alesav/Dev/umob/umob_appium/tests/specs/newUserVoucher/vBookDonkeyMocked.spec.ts"
    "/Users/alesav/Dev/umob/umob_appium/tests/specs/newUser/nReserveCheckNoCard.spec.ts"
    "/Users/alesav/Dev/umob/umob_appium/tests/specs/newUserVoucher/vBookFelyx.spec.ts"
    "/Users/alesav/Dev/umob/umob_appium/tests/specs/newUserVoucher/vBookCheck.spec.ts"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "Processing: $file"
        
        # Replace PageObjects.accountButton.click() with PageObjects.clickAccountButton()
        sed -i '' 's/PageObjects\.accountButton\.click()/PageObjects.clickAccountButton()/g' "$file"
        
        # Remove unnecessary waitForExist lines
        sed -i '' '/PageObjects\.accountButton\.waitForExist/d' "$file"
        
        echo "Updated: $file"
    else
        echo "File not found: $file"
    fi
done

echo "All files updated successfully!"
