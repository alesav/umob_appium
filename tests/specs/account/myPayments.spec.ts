describe('My Payments Screen Elements Validation', () => {
  beforeEach(async () => {
    await driver.activateApp("com.umob.umob");
    await driver.pause(7000);
  });

  it('should display all key My Payments screen elements', async () => {
    // Navigate to Account
    const accountButton = await driver.$("-android uiautomator:new UiSelector().text(\"Account\")");
    await accountButton.click();
    await driver.pause(3000);

    // Navigate to My Payments
    const myPaymentsButton = await driver.$("-android uiautomator:new UiSelector().text(\"My payments\")");
    await myPaymentsButton.click();
    await driver.pause(3000);

    // Verify screen header
    const screenHeader = await driver.$("-android uiautomator:new UiSelector().text(\"My payments\")");
    await expect(screenHeader).toBeDisplayed();

    // Verify back button is present
    const backButton = await driver.$("-android uiautomator:new UiSelector().description(\"back_button\")");
    await expect(backButton).toBeDisplayed();

    // Verify last payment section
    const lastPaymentSection = await driver.$("-android uiautomator:new UiSelector().text(\"Your last payment\")");
    await expect(lastPaymentSection).toBeDisplayed();

    // Verify last payment date
    const lastPaymentDateElement = await driver.$("-android uiautomator:new UiSelector().textMatches(\"\\d{1,2} \\w+ \\d{4}\")");
    await expect(lastPaymentDateElement).toBeDisplayed();
    const lastPaymentDateText = await lastPaymentDateElement.getText();
    
    // Validate date format (e.g., 17 December 2024)
    expect(lastPaymentDateText).toMatch(/^\d{1,2}\s[A-Z][a-z]+\s\d{4}$/);

    // Verify last payment amount contains € symbol
    const lastPaymentAmount = await driver.$("-android uiautomator:new UiSelector().textMatches(\".*€.*\")");
    await expect(lastPaymentAmount).toBeDisplayed();
    const lastPaymentAmountText = await lastPaymentAmount.getText();
    await expect(lastPaymentAmountText).toMatch(/€\d+\.\d+/);

    // Verify "Previous payments" section header
    const previousPaymentsHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Previous payments\")");
    await expect(previousPaymentsHeader).toBeDisplayed();

    // Check previous payments list
    //const previousPaymentsList = await driver.$$("-android uiautomator:new UiSelector().className(\"android.view.ViewGroup\").description(\"09 December 2024, €4.50\")");
    
    // Verify at least one previous payment exists
    //await expect(previousPaymentsList.length).toBeGreaterThan(0);

    // Validate each previous payment entry
    for (const paymentEntry of previousPaymentsList) {
      // Check date is present and in correct format
      const paymentDateElement = await paymentEntry.$("-android uiautomator:new UiSelector().textMatches(\"\\d{1,2} \\w+ \\d{4}\")");
      await expect(paymentDateElement).toBeDisplayed();
      const paymentDateText = await paymentDateElement.getText();
      expect(paymentDateText).toMatch(/^\d{1,2}\s[A-Z][a-z]+\s\d{4}$/);
      
      // Check amount contains € symbol
      const paymentAmountElement = await paymentEntry.$("-android uiautomator:new UiSelector().textMatches(\".*€.*\")");
      await expect(paymentAmountElement).toBeDisplayed();
      const paymentAmountText = await paymentAmountElement.getText();
      await expect(paymentAmountText).toMatch(/€\d+\.\d+/);
    }
  });

  afterEach(async () => {
    try {
      await driver.terminateApp("com.umob.umob");
    } catch (error) {
      console.log('Error terminating app:', error);
    }
  });
});