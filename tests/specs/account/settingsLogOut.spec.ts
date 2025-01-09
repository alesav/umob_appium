describe('Logout Functionality Test', () => {
  beforeEach(async () => {
    await driver.activateApp("com.umob.umob");
    await driver.pause(7000);
  });

  it('should successfully logout from the app', async () => {
    // Click on Settings button to navigate to settings
    const settingsButton = await driver.$("-android uiautomator:new UiSelector().text(\"Settings\")");
    await settingsButton.click();
    await driver.pause(2000);

    // Click on LogOut option 
    const logoutButton = await driver.$("-android uiautomator:new UiSelector().text(\"LOG OUT\")");
    await expect(logoutButton).toBeDisplayed();
    await logoutButton.click();

    // verify Sign up button appeared
    const signUpButton = await driver.$("-android uiautomator:new UiSelector().text(\"Sign up\")");
    await expect(signUpButton).toBeDisplayed();
  });

  afterEach(async () => {
    try {
      await driver.terminateApp("com.umob.umob");
    } catch (error) {
      console.log('Error terminating app:', error);
    }
  });
});