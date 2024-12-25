describe('My Rides & Tickets Screen Elements Validation', () => {
  beforeEach(async () => {
    await driver.activateApp("com.umob.umob");
    await driver.pause(7000);
  });

  it('should display all key My Rides & Tickets screen elements', async () => {
    // Navigate to Account
    const accountButton = await driver.$("-android uiautomator:new UiSelector().text(\"Account\")");
    await accountButton.click();
    await driver.pause(3000);

    // Navigate to My Rides & Tickets
    const myRidesAndTicketsButton = await driver.$("-android uiautomator:new UiSelector().text(\"My Rides & Tickets\")");
    await myRidesAndTicketsButton.click();
    await driver.pause(3000);

    // Verify screen header
    const screenHeader = await driver.$("-android uiautomator:new UiSelector().text(\"My Rides & Tickets\")");
    await expect(screenHeader).toBeDisplayed();
    await driver.pause(3000);

    // Verify back button is present
    const backButton = await driver.$("-android uiautomator:new UiSelector().resourceId(\"back_button\")");
    await expect(backButton).toBeDisplayed();

    // Verify last ride section
    const lastRideSection = await driver.$("-android uiautomator:new UiSelector().text(\"Your last ride\")");
    await expect(lastRideSection).toBeDisplayed();

    /* Verify last ride date is present and contains a date
    const lastRideDateElement = await driver.$("-android uiautomator:new UiSelector().text(\"16 December 2024\")");
    await expect(lastRideDateElement).toBeDisplayed(); */

    // Verify last ride amount contains € symbol
    const lastRideAmount = await driver.$("-android uiautomator:new UiSelector().textMatches(\".*€.*\")");
    await expect(lastRideAmount).toBeDisplayed();
    const lastRideAmountText = await lastRideAmount.getText();
    // Updated regex to handle both "€0.-" and "€X.XX" formats
    await expect(lastRideAmountText).toMatch(/€(\d+\.\d+|0\.-)/);

    // Verify "Previous rides" section header
    const previousRidesHeader = await driver.$("-android uiautomator:new UiSelector().textContains(\"Previous rides\")");
    await expect(previousRidesHeader).toBeDisplayed();
    await driver.pause(3000);

    // Check previous rides list
    const previousRidesList = await driver.$$("-android uiautomator:new UiSelector().resourceId(\"undefined-AccountListItemButton\")");
    
    // Verify at least one previous ride exists
    await expect(previousRidesList.length).toBeGreaterThan(0);

    // Validate each previous ride entry
    for (const rideEntry of previousRidesList) {
      // Check date is present and in correct format
      const rideDateElement = await rideEntry.$("-android uiautomator:new UiSelector().textMatches(\"\\d{1,2} \\w+ \\d{4}\")");
      await expect(rideDateElement).toBeDisplayed();
      
      // Check amount contains € symbol and has valid format
      const rideAmountElement = await rideEntry.$("-android uiautomator:new UiSelector().textMatches(\".*€.*\")");
      await expect(rideAmountElement).toBeDisplayed();
      const rideAmountText = await rideAmountElement.getText();
      // Updated regex to handle both "€0.-" and "€X.XX" formats
      await expect(rideAmountText).toMatch(/€(\d+\.\d+|0\.-)/);
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