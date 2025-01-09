describe('Plan Your Trip Screen Verification', () => {
  beforeEach(async () => {
    await driver.activateApp("com.umob.umob");
    await driver.pause(7000);

    // Navigate to Public Transport screen
    // Note: The exact selector might need adjustment based on the actual UI
    const publicTransportButton = await driver.$("-android uiautomator:new UiSelector().text(\"Public transport\")");
    await publicTransportButton.click();
    await driver.pause(2000);
  });

  it('should display all key elements on Plan Your Trip screen', async () => {
    // Verify screen header
    const screenHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Plan your trip\")");
    await expect(screenHeader).toBeDisplayed();

    // Verify departure and destination input section
    const departureDestinationLabel = await driver.$("-android uiautomator:new UiSelector().resourceId(\"PlanYourTripDepartureDestinationLabel\")");
    await expect(departureDestinationLabel).toBeDisplayed();
    await expect(departureDestinationLabel.getText()).toBe("Enter departure & destination points"); 

    /* Verify current location input
    const currentLocationInput = await driver.$("-android uiautomator:new UiSelector().text(\"Bloemkwekersstraat 50b Rotterdam\")");
    await expect(currentLocationInput).toBeDisplayed();

    const currentLocationLabel = await driver.$("-android uiautomator:new UiSelector().text(\"Current location\")");
    await expect(currentLocationLabel).toBeDisplayed(); */

    // Verify destination input
    const destinationInput = await driver.$("-android uiautomator:new UiSelector().text(\"Destination\")");
    await expect(destinationInput).toBeDisplayed();

    // Verify time section
    const enterTimeLabel = await driver.$("-android uiautomator:new UiSelector().resourceId(\"PlanYourTripEnterTimeLabel\")");
    await expect(enterTimeLabel).toBeDisplayed();
    await expect(enterTimeLabel.getText()).toBe("Enter time");

    // Verify time switch buttons
    const departAtButton = await driver.$("-android uiautomator:new UiSelector().text(\"Depart at\")");
    const arriveByButton = await driver.$("-android uiautomator:new UiSelector().text(\"Arrive by\")");
    await expect(departAtButton).toBeDisplayed();
    await expect(arriveByButton).toBeDisplayed();

    // Verify date input
    const dateInput = await driver.$("-android uiautomator:new UiSelector().text(\"Today\")");
    await expect(dateInput).toBeDisplayed();

    // Verify time input
    const timeInput = await driver.$("-android uiautomator:new UiSelector().text(\"Now\")");
    await expect(timeInput).toBeDisplayed();

    // Verify train class section
    const selectClassLabel = await driver.$("-android uiautomator:new UiSelector().resourceId(\"PlanYourTripSelectClassLabel\")");
    await expect(selectClassLabel).toBeDisplayed();
    await expect(selectClassLabel.getText()).toBe("Select class (for trains)");

    // Verify train class switch buttons
    const secondClassButton = await driver.$("-android uiautomator:new UiSelector().text(\"2nd class\")");
    const firstClassButton = await driver.$("-android uiautomator:new UiSelector().text(\"1st class\")");
    await expect(secondClassButton).toBeDisplayed();
    await expect(firstClassButton).toBeDisplayed();

    // Verify Continue button
    const continueButton = await driver.$("-android uiautomator:new UiSelector().text(\"CONTINUE\")");
    await expect(continueButton).toBeDisplayed();
    await expect(continueButton.isEnabled()).toBe(false);

    // Verify Help button
    const helpButton = await driver.$("-android uiautomator:new UiSelector().text(\"Help\")");
    await expect(helpButton).toBeDisplayed();
  });

  afterEach(async () => {
    try {
      await driver.terminateApp("com.umob.umob");
    } catch (error) {
      console.log('Error terminating app:', error);
    }
  });
});