describe('Ride Credit Screen Elements Validation', () => {
  beforeEach(async () => {
    await driver.activateApp("com.umob.umob");
    await driver.pause(7000);
  });

  it('should display all key Ride Credit screen elements', async () => {
    // Navigate to Account
    const accountButton = await driver.$("-android uiautomator:new UiSelector().text(\"Account\")");
    await accountButton.click();
    await driver.pause(3000);

    // Navigate to Ride Credit
    const rideCreditButton = await driver.$("-android uiautomator:new UiSelector().text(\"Ride credit\")");
    await rideCreditButton.click();
    await driver.pause(3000);

    // Verify screen header
    const screenHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Ride credit\")");
    await expect(screenHeader).toBeDisplayed();

    // Verify back button is present
    const backButton = await driver.$("-android uiautomator:new UiSelector().description(\"back_button\")");
    await expect(backButton).toBeDisplayed();

    /* Verify New User Check voucher
    const newUserCheckVoucher = await driver.$("-android uiautomator:new UiSelector().text(\"New User Check\")");
    await expect(newUserCheckVoucher).toBeDisplayed();

    // Verify voucher amount
    const voucherAmount = await driver.$("-android uiautomator:new UiSelector().text(\"€20.-\")");
    await expect(voucherAmount).toBeDisplayed();

    // Verify voucher expiration date
    const voucherExpirationDate = await driver.$("-android uiautomator:new UiSelector().text(\"Expires on 01 September 2026\")");
    await expect(voucherExpirationDate).toBeDisplayed(); */

    // Verify "Your promotional code" section header
    const promotionalCodeHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Your promotional code\")");
    await expect(promotionalCodeHeader).toBeDisplayed();

    // Verify promotional code description
    const promotionalCodeDescription = await driver.$("-android uiautomator:new UiSelector().textContains(\"Received a promotional code?\")");
    await expect(promotionalCodeDescription).toBeDisplayed();

    // Verify promotional code input field
    const promotionalCodeInput = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\")");
    await expect(promotionalCodeInput).toBeDisplayed();

    // Verify "SUBMIT PROMOTIONAL CODE" button
    const submitPromotionalCodeButton = await driver.$("-android uiautomator:new UiSelector().text(\"SUBMIT PROMOTIONAL CODE\")");
    await expect(submitPromotionalCodeButton).toBeDisplayed();
  });

  afterEach(async () => {
    try {
      await driver.terminateApp("com.umob.umob");
    } catch (error) {
      console.log('Error terminating app:', error);
    }
  });
});