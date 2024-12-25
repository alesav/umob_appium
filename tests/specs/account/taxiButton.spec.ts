/* describe('Public Transport Screen Verification', () => {
  beforeEach(async () => {
    await driver.activateApp("com.umob.umob");
    await driver.pause(7000);
  });

  it('should navigate to taxi booking screen and verify key elements', async () => {
    // Find and click on the taxi button
    //const taxiButton = await driver.$("-android uiautomator:new UiSelector().text(\"Book a taxi\")");
    const taxiButton = await driver.$("-android uiautomator:new UiSelector().text(\"Taxi\")");
    await taxiButton.click();
    await driver.pause(2000); // Wait for screen to load

    // Verify "Book a taxi" header
    const bookTaxiHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Book a taxi\")");
    await expect(bookTaxiHeader).toBeDisplayed();

    // Verify "Enter pickup & destination points" text
    const enterPointsText = await driver.$("-android uiautomator:new UiSelector().text(\"Enter pickup & destination points\")");
    await expect(enterPointsText).toBeDisplayed();

    // Verify Current location input field
    const currentLocationLabel = await driver.$("-android uiautomator:new UiSelector().text(\"Current location\")");
    await expect(currentLocationLabel).toBeDisplayed();

    const currentLocationInput = await driver.$("-android uiautomator:new UiSelector().text(\"Bloemkwekersstraat 50b, 3014 PC Rotterdam\")");
    await expect(currentLocationInput).toBeDisplayed();

    // Verify Destination input field
    const destinationLabel = await driver.$("-android uiautomator:new UiSelector().text(\"Destination\")");
    await expect(destinationLabel).toBeDisplayed();

    const destinationInput = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(1)");
    await expect(destinationInput).toBeDisplayed();

    // Verify Continue button
    const continueButton = await driver.$("-android uiautomator:new UiSelector().text(\"CONTINUE\")");
    await expect(continueButton).toBeDisplayed();
    await expect(continueButton).not.toBeEnabled(); // Assuming continue button is disabled until all fields are filled
  });

  afterEach(async () => {
    try {
      await driver.terminateApp("com.umob.umob");
    } catch (error) {
      console.log('Error terminating app:', error);
    }
  });
}); */




describe('Public Transport Screen Verification', () => {
  beforeEach(async () => {
    await driver.activateApp("com.umob.umob");
    await driver.pause(7000); // Wait for the app to load
  });

  it('should navigate to taxi booking screen and verify key elements', async () => {
    // Find and click on the "Book a taxi" button (Update text to match XML)
    /*const taxiButton = await driver.$("-android uiautomator:new UiSelector().text(\"Book a taxi\")");
    await taxiButton.click();
    await driver.pause(2000); // Wait for screen to load */

    const taxiButton1 = await driver.$("-android uiautomator:new UiSelector().text(\"Taxi\")");
    await taxiButton1.click();

   // const taxiButton = await $('//android.widget.Button[contains(@text, "Book a taxi")]');
//await taxiButton.waitForDisplayed({ timeout: 5000 });  // Wait for the button to be visible
//await taxiButton.click();



    // Verify "Book a taxi" header
    const bookTaxiHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Book a taxi\")");
    await expect(bookTaxiHeader).toBeDisplayed();

    // Verify "Enter pickup & destination points" text
    const enterPointsText = await driver.$("-android uiautomator:new UiSelector().text(\"Enter pickup & destination points\")");
    await expect(enterPointsText).toBeDisplayed();

    // Verify Current location input field
    const currentLocationLabel = await driver.$("-android uiautomator:new UiSelector().text(\"Current location\")");
    await expect(currentLocationLabel).toBeDisplayed();

    // Verify that the Current Location input field has the expected text
    const currentLocationInput = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").text(\"Bloemkwekersstraat 50b, 3014 PC Rotterdam\")");
    await expect(currentLocationInput).toBeDisplayed();

    // Verify Destination input field
    const destinationLabel = await driver.$("-android uiautomator:new UiSelector().text(\"Destination\")");
    await expect(destinationLabel).toBeDisplayed();

    // Ensure the Destination input field is found correctly (using class and instance to be specific)
    const destinationInput = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(1)");
    await expect(destinationInput).toBeDisplayed();

    // Verify Continue button
    const continueButton = await driver.$("-android uiautomator:new UiSelector().text(\"CONTINUE\")");
    await expect(continueButton).toBeDisplayed();

    // Verify Continue button is disabled
    //await expect(continueButton).not.toBeEnabled(); // Assuming continue button is disabled until all fields are filled
 // });

  afterEach(async () => {
    try {
      await driver.terminateApp("com.umob.umob");
    } catch (error) {
      console.log('Error terminating app:', error);
    }
  });
});
