describe('Payment Settings Screen Elements Validation', () => {
  beforeEach(async () => {
    await driver.activateApp("com.umob.umob");
    await driver.pause(7000);
  });

  it('should display all key Payment Settings screen elements', async () => {
    // Navigate to Account screen first
    const accountButton = await driver.$("-android uiautomator:new UiSelector().text(\"Account\")");
    await accountButton.click();

    // Navigate to Payment Settings screen
    const paymentSettingsButton = await driver.$("-android uiautomator:new UiSelector().text(\"Payment settings\")");
    await expect(paymentSettingsButton).toBeDisplayed();
    await paymentSettingsButton.click();

    // Verify screen header
    const screenHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Payment method\")");
    await expect(screenHeader).toBeDisplayed();

    // Verify back button is present
    const backButton = await driver.$("-android uiautomator:new UiSelector().description(\"back_button\")");
    await expect(backButton).toBeDisplayed();

    // Verify card information
    const releaseText = await driver.$("-android uiautomator:new UiSelector().text(\"RELEASE 69\")");
    await expect(releaseText).toBeDisplayed();

    const cardType = await driver.$("-android uiautomator:new UiSelector().text(\"MasterCard\")");
    await expect(cardType).toBeDisplayed();

    const cardNumber = await driver.$("-android uiautomator:new UiSelector().text(\"**** **** **** 1115\")");
    await expect(cardNumber).toBeDisplayed();

    const expiryDate = await driver.$("-android uiautomator:new UiSelector().text(\"03/2030\")");
    await expect(expiryDate).toBeDisplayed();

    // Verify action buttons
    const removeButton = await driver.$("-android uiautomator:new UiSelector().text(\"REMOVE PAYMENT METHOD\")");
    await expect(removeButton).toBeDisplayed();

    const helpButton = await driver.$("-android uiautomator:new UiSelector().text(\"Help\")");
    await expect(helpButton).toBeDisplayed();

    // Optional: Verify container element
    const paymentDetailsContainer = await driver.$("-android uiautomator:new UiSelector().description(\"PaymentDetailsContainer\")");
    await expect(paymentDetailsContainer).toBeDisplayed();
  });

  

  afterEach(async () => {
    try {
      await driver.terminateApp("com.umob.umob");
    } catch (error) {
      console.log('Error terminating app:', error);
    }
  });
});