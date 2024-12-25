describe('My Account Screen Elements Validation', () => {
  beforeEach(async () => {
    await driver.activateApp("com.umob.umob");
    await driver.pause(7000);
  });

  it('should display all key account screen elements', async () => {
    // Click on Account button
    const accountButton = await driver.$("-android uiautomator:new UiSelector().text(\"Account\")");
    await accountButton.click();
    await driver.pause(2000);

    // Verify screen header
    const screenHeader = await driver.$("-android uiautomator:new UiSelector().resourceId(\"MyAccountContainer-header-title\")");
    await expect(screenHeader).toBeDisplayed();
    await expect(await screenHeader.getText()).toBe("My Account");

    // Verify user welcome message
    const welcomeText = await driver.$("-android uiautomator:new UiSelector().text(\"Welcome back,\")");
    await expect(welcomeText).toBeDisplayed();

    /* Verify user name is not empty
    const userName = await driver.$("-android uiautomator:new UiSelector().text(\"Aleks\")");
    await expect(userName).toBeDisplayed();
    const userNameText = await userName.getText();
    await expect(userNameText).not.toBe("");*/

    // Verify last ride section
    const lastRideSection = await driver.$("-android uiautomator:new UiSelector().text(\"Your last ride\")");
    await expect(lastRideSection).toBeDisplayed();
    await driver.pause(2000);
    /*const lastRideDateElement = await driver.$("-android uiautomator:new UiSelector().text(\"16 December 2024\")");
    await expect(lastRideDateElement).toBeDisplayed();
    const lastRideDate = await lastRideDateElement.getText();
    await expect(lastRideDate).not.toBe("");*/

        // Check last ride amount (flexible verification)
    const lastRideAmount = await driver.$("-android uiautomator:new UiSelector().textContains(\"€\")");
    await expect(lastRideAmount).toBeDisplayed();

    // Verify account menu items
    const accountMenuItems = [
      "My Rides & Tickets",
      "My payments",
      "Personal info",
      "Ride credit",
      "Invite friends",
      "Payment settings",
      "ID Document",
      "Delete account"
    ];

    await driver.executeScript('mobile: scrollGesture', [{
      left: 100, 
      top: 1000, 
      width: 200, 
      height: 800, 
      direction: 'down',
      percent: 10.0
    }]);

    for (const menuItem of accountMenuItems) {
      const menuElement = await driver.$(`-android uiautomator:new UiSelector().text("${menuItem}")`);
      await expect(menuElement).toBeDisplayed();
    }

    // Verify back button is present
    const backButton = await driver.$("-android uiautomator:new UiSelector().resourceId(\"back_button\")");
    await expect(backButton).toBeDisplayed();
  });

  afterEach(async () => {
    try {
      await driver.terminateApp("com.umob.umob");
    } catch (error) {
      console.log('Error terminating app:', error);
    }
  });
});