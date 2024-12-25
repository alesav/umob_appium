describe('Personal Info Screen Elements Validation', () => {
  beforeEach(async () => {
    await driver.activateApp("com.umob.umob");
    await driver.pause(7000);
  });

  it('should display all key Personal Info screen elements', async () => {
    // Navigate to Account - try multiple selectors
    try {
      const accountButton = await driver.$("-android uiautomator:new UiSelector().textContains(\"Account\")");
      await accountButton.click();
    } catch (error) {
      // If text selector fails, try accessibility or resource ID
      const accountButton = await driver.$("//*[@content-desc='Account']");
      await accountButton.click();
    }
    await driver.pause(3000);

    // Navigate to Personal Info - use more flexible selector
   /* try {
      const personalInfoButton = await driver.$("//*[contains(@text, 'Personal') or contains(@content-desc, 'Personal')]");
      await personalInfoButton.click();
    } catch (error) {
      // If direct text/content-desc fails, try index-based or other strategies
      const personalInfoButtons = await driver.$$("android.widget.TextView");
      for (let button of personalInfoButtons) {
        const text = await button.getText();
        if (text.includes('Personal')) {
          await button.click();
          break;
        }
      }
    }*/
    await driver.pause(3000);

    const accountButton1 = await driver.$("-android uiautomator:new UiSelector().text(\"Personal info\")");
    await accountButton1.click();

    // Verify screen header
    const screenHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Personal Info\")");
    await expect(screenHeader).toBeDisplayed();

    // Verify back button is present
    const backButton = await driver.$("-android uiautomator:new UiSelector().description(\"back_button\")");
    await expect(backButton).toBeDisplayed();

    // Verify Email Section
    const emailQuestion = await driver.$("-android uiautomator:new UiSelector().text(\"What is your email?\")");
    await expect(emailQuestion).toBeDisplayed();

    /*const emailValue = await driver.$("-android uiautomator:new UiSelector().text(\"new@gmail.com\")");
    await expect(emailValue).toBeDisplayed(); */

    // Verify Edit button for email
    const emailEditButton = await driver.$("-android uiautomator:new UiSelector().text(\"Edit\")");
    await expect(emailEditButton).toBeDisplayed();

    // Verify Phone Number Section
    const phoneQuestion = await driver.$("-android uiautomator:new UiSelector().text(\"What is your phone number?\")");
    await expect(phoneQuestion).toBeDisplayed();

    /*const phoneValue = await driver.$("-android uiautomator:new UiSelector().text(\"+3197010586556\")");
    await expect(phoneValue).toBeDisplayed(); */

    // Verify Name Section
    const nameQuestion = await driver.$("-android uiautomator:new UiSelector().text(\"What is your name?\")");
    await expect(nameQuestion).toBeDisplayed();

    /*const nameValue = await driver.$("-android uiautomator:new UiSelector().text(\"New\")");
    await expect(nameValue).toBeDisplayed(); */

    // Verify Last Name Section
    const lastNameQuestion = await driver.$("-android uiautomator:new UiSelector().text(\"What is your last name?\")");
    await expect(lastNameQuestion).toBeDisplayed();

    /*const lastNameValue = await driver.$("-android uiautomator:new UiSelector().text(\"New\")");
    await expect(lastNameValue).toBeDisplayed(); */

    // Verify Address Section
    const addressQuestion = await driver.$("-android uiautomator:new UiSelector().text(\"What is your address?\")");
    await expect(addressQuestion).toBeDisplayed();

    // Verify Street field
    /*const streetLabel = await driver.$("-android uiautomator:new UiSelector().text(\"Street\")");
    await expect(streetLabel).toBeDisplayed(); */

    const streetInput = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(0)");
    await expect(streetInput).toBeDisplayed();

    // Verify Number field
    /*const numberLabel = await driver.$("-android uiautomator:new UiSelector().text(\"Number\")");
    await expect(numberLabel).toBeDisplayed(); */

    const numberInput = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(1)");
    await expect(numberInput).toBeDisplayed();

    // Verify Country field
   /* const countryLabel = await driver.$("-android uiautomator:new UiSelector().text(\"Country\")");
    await expect(countryLabel).toBeDisplayed(); */

    const countryInput = await driver.$("-android uiautomator:new UiSelector().className(\"android.view.ViewGroup\").description(\"\")");
    await expect(countryInput).toBeDisplayed();
  });

  afterEach(async () => {
    try {
      await driver.terminateApp("com.umob.umob");
    } catch (error) {
      console.log('Error terminating app:', error);
    }
  });
});