import { AfterAll } from "@wdio/cucumber-framework";
import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import submitTestRun from "../../helpers/SendResults.js";
import AppiumHelpers from "../../helpers/AppiumHelpers.js";
import { exec, execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to load credentials based on environment and user
function getCredentials(environment = "test", userKey = null) {
    try {
        const credentialsPath = path.resolve(
            __dirname,
            "../../../config/credentials.json",
        );
        const credentials = JSON.parse(
            fs.readFileSync(credentialsPath, "utf8"),
        );

        // Check if environment exists
        if (!credentials[environment]) {
            console.warn(
                `Environment '${environment}' not found in credentials file. Using 'test' environment.`,
            );
            environment = "test";
        }

        const envUsers = credentials[environment];

        // If no specific user is requested, use the first user in the environment
        if (!userKey) {
            userKey = Object.keys(envUsers)[0];
        } else if (!envUsers[userKey]) {
            console.warn(
                `User '${userKey}' not found in '${environment}' environment. Using first available user.`,
            );
            userKey = Object.keys(envUsers)[0];
        }

        // Return the user credentials
        return {
            username: envUsers[userKey].username,
            password: envUsers[userKey].password,
        };
    } catch (error) {
        console.error("Error loading credentials:", error);
        throw new Error("Failed to load credentials configuration");
    }
}

// Get environment and user from env variables or use defaults
const ENV = process.env.TEST_ENV || 'test';
const USER = process.env.TEST_USER || 'new34';

describe("Book a Taxi", () => {
    before(async () => {
        const credentials = getCredentials(ENV, USER);

                await PageObjects.login({
            username: credentials.username,
            password: credentials.password,
        });

        const latitude = 51.9155956;
        const longitude = 4.4744301;

        await AppiumHelpers.setLocationAndRestartApp(longitude, latitude);



        /*

         await PageObjects.login({ username:'4bigfoot+10@gmail.com', password: '123Qwerty!' });

   */
    });

    it("test key elements for book a taxi, add destination", async () => {
        const testId = "bea0eebe-b441-4b73-9b11-cae5b162962c";

        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            await driver.activateApp("com.umob.umob");
            await driver.pause(7000);

            // const planTrip = await driver.$('-android uiautomator:new UiSelector().text("PLAN TRIP")');
            // await expect(planTrip).toBeDisplayed();
            await PageObjects.planTripBtn.waitForExist();

            //click PLAN TRIP button to verify taxi and public transport options
            //await planTrip.click();
            await PageObjects.planTripBtn.click();
            await driver.pause(2000);

            /*//scroll to bottom for mobile
 await driver.executeScript('mobile: scrollGesture', [{
   left: 100,
   top: 1000,
   width: 200,
   height: 800,
   direction: 'down',
   percent: 100.0
 }]);
 await driver.pause(1000);*/

            const { width, height } = await driver.getWindowSize();
            await driver.performActions([
                {
                    type: "pointer",
                    id: "finger1",
                    parameters: { pointerType: "touch" },
                    actions: [
                        {
                            type: "pointerMove",
                            duration: 0,
                            x: width / 2,
                            y: 400,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        {
                            type: "pointerMove",
                            duration: 1000,
                            x: width / 2,
                            y: 10,
                        },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

            const taxiButton = await driver.$(
                '-android uiautomator:new UiSelector().text("GRAB TAXI")',
            );
            await expect(taxiButton).toBeDisplayed();
            await taxiButton.click();

            await driver.pause(2000);
            // Verify screen header
            const screenHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Book a taxi")',
            );
            await expect(screenHeader).toBeDisplayed();

            // Verify departure and destination input section
            const departureDestinationLabel = await driver.$(
                '-android uiautomator:new UiSelector().text("Enter pickup & destination points")',
            );
            await expect(departureDestinationLabel).toBeDisplayed();
            await driver.pause(2000);

            /*
  // continue test with filling destination adress
  const el1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(1)");
  await el1.click();
  await el1.addValue("Blaak 31");
  await driver.pause(4000);



// First get the element's location and size
const location = await el1.getLocation();
const size = await el1.getSize();


// Create a touch action to tap 50 pixels below the element
await browser.action('pointer', { parameters: { pointerType: 'touch' }})
    .move({
        x: location.x +100,
        y: location.y + size.height + 160
    })
    .down()
    .up()
    .perform();

    await driver.hideKeyboard();
    */

            // Click on destination and text
            const el1 = await driver.$(
                '-android uiautomator:new UiSelector().className("android.widget.EditText").instance(1)',
            );
            await el1.addValue("Blaak 31");
            await driver.pause(4000);

            // First get the element's location and size
            const location = await el1.getLocation();
            const size = await el1.getSize();

            // Set location to specific scooter coordinates
            execSync(
                `adb shell input tap ${location.x + 100}  ${location.y + size.height + 70}`,
            );

            //Verify that location is the same that was added
            const toLocation = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Blaak 31")',
            );
            await expect(toLocation).toBeDisplayed();

            // click the continue button after adding destination
            const continueButton = await driver.$(
                '-android uiautomator:new UiSelector().text("CONTINUE")',
            );
            await expect(continueButton).toBeDisplayed();
            await continueButton.click();
            await driver.pause(15000);
        } catch (e) {
            error = e;
            console.error("Test failed:", error);
            testStatus = "Fail";
            testDetails = e.message;

            console.log("TEST 123");

            // Capture screenshot on failure
            screenshotPath = "./screenshots/" + testId + ".png";
            await driver.saveScreenshot(screenshotPath);
            // execSync(
            //   `adb exec-out screencap -p > ${screenshotPath}`
            // );
        } finally {
            // Submit test run result
            try {
                console.log("TEST 456");

                await submitTestRun(
                    testId,
                    testStatus,
                    testDetails,
                    screenshotPath,
                );
                console.log("Test run submitted successfully");
            } catch (submitError) {
                console.error("Failed to submit test run:", submitError);
            }

            // If there was an error in the main try block, throw it here to fail the test
            if (error) {
                throw error;
            }
        }
    });

    it("should display at least one option for taxi and click select button", async () => {
        const testId = "fb24bdfd-4eb6-410e-90d0-6a220971973a";

        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            await driver.pause(5000);
            // check if at least one option exists with euro price
            const firstRoutePrice = await driver.$(
                "(//android.widget.TextView[contains(@text, '€')])[1]",
            );
            await expect(firstRoutePrice).toBeDisplayed();

            const { width, height } = await driver.getWindowSize();
            await driver.performActions([
                {
                    type: "pointer",
                    id: "finger1",
                    parameters: { pointerType: "touch" },
                    actions: [
                        {
                            type: "pointerMove",
                            duration: 0,
                            x: width / 2,
                            y: height * 0.8,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        {
                            type: "pointerMove",
                            duration: 1000,
                            x: width / 2,
                            y: height * 0.2,
                        },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

            const selectButton = await driver.$(
                '-android uiautomator:new UiSelector().textContains("SELECT")',
            );
            await expect(selectButton).toBeDisplayed();
            await selectButton.click();
            await driver.pause(5000);
        } catch (e) {
            error = e;
            console.error("Test failed:", error);
            testStatus = "Fail";
            testDetails = e.message;

            console.log("TEST 123");

            // Capture screenshot on failure
            screenshotPath = "./screenshots/" + testId + ".png";
            await driver.saveScreenshot(screenshotPath);
            // execSync(
            //   `adb exec-out screencap -p > ${screenshotPath}`
            // );
        } finally {
            // Submit test run result
            try {
                console.log("TEST 456");

                await submitTestRun(
                    testId,
                    testStatus,
                    testDetails,
                    screenshotPath,
                );
                console.log("Test run submitted successfully");
            } catch (submitError) {
                console.error("Failed to submit test run:", submitError);
            }

            // If there was an error in the main try block, throw it here to fail the test
            if (error) {
                throw error;
            }
        }
    });

    it("should check confirm_your_ride screen for Taxi and cancel a ride", async () => {
        const testId = "4468d287-8cbd-458c-9531-c1ebeffd1093";

        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            //allow permissions for github actions
            //     const permission1 = await driver.$("-android uiautomator:new UiSelector().text(\"ALLOW\")");
            // await expect(permission1).toBeDisplayed();
            // await permission1.click();

            //check data for payment card is displayed
            await driver.pause(5000);
            const card = await driver.$(
                '-android uiautomator:new UiSelector().text("**** **** 1115")',
            );
            await expect(card).toBeDisplayed();

            //check header is displayed
            const travelDetails = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Confirm")',
            );
            await expect(travelDetails).toBeDisplayed();

            //check destination is displayed
            // const destRotter = await driver.$("-android uiautomator:new UiSelector().textContains(\"Zoo\")");
            // await expect(destRotter).toBeDisplayed();

            //check driver note is displayed
            const driverNote = await driver.$(
                '-android uiautomator:new UiSelector().text("Add a note to the driver (optional)")',
            );
            await expect(driverNote).toBeDisplayed();

            //permission for github actions
            // const permission3 = await driver.$("-android uiautomator:new UiSelector().text(\"ALLOW)\")");
            // await permission3.click();

            // check if price in euro
            const firstRoutePrice = await driver.$(
                "(//android.widget.TextView[contains(@text, '€')])[1]",
            );
            await expect(firstRoutePrice).toBeDisplayed();

            const { width, height } = await driver.getWindowSize();
            await driver.performActions([
             {
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
           { type: 'pointerMove', duration: 0, x: width/2, y: height*0.7 },
           { type: 'pointerDown', button: 0 },
           { type: 'pause', duration: 100 },
           { type: 'pointerMove', duration: 1000, x: width/2, y: height*0.2 },
           { type: 'pointerUp', button: 0 },
             ],
            },]);

            //check notification is displayed
            const notification = await driver.$(
                '-android uiautomator:new UiSelector().text("All rentals are subject to terms & conditions of umob and transport providers. Fees may apply for waiting or cancellation.")',
            );
            await expect(notification).toBeDisplayed();

            //check destination is displayed
            const confirmButton = await driver.$(
                '-android uiautomator:new UiSelector().text("CONFIRM YOUR RIDE")',
            );
            await expect(confirmButton).toBeDisplayed();
            await confirmButton.click();
            await driver.pause(7000);

            // Verify booking confirmation header
            //const bookingConfirmedText = await driver.$('-android uiautomator:new UiSelector().text("Booking confirmed")');
            //await expect(bookingConfirmedText).toBeDisplayed();

            // Verify operator acceptance message
            //const operatorMessage = await driver.$('-android uiautomator:new UiSelector().textContains("Operator has accepted your booking")');
            //await expect(operatorMessage).toBeDisplayed();

            // Verify destination location
            //  const destinationLocation = await driver.$("-android uiautomator:new UiSelector().textContains(\"Zoo\")");
            //  await expect(destinationLocation).toBeDisplayed();

            // Verify and click Cancel trip button
            await driver.pause(7000);
            const cancelTripButton = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Cancel")',
            );
            await expect(cancelTripButton).toBeDisplayed();
            await driver.pause(1000);
            await cancelTripButton.click();

            // Wait for confirmation dialog and confirm cancellation
            //await driver.pause(2000);
            const confirmCancelButton = await driver.$(
                '-android uiautomator:new UiSelector().text("CANCEL MY BOOKING")',
            );
            await expect(confirmCancelButton).toBeDisplayed();
            await confirmCancelButton.click();

            //check main screen is displayed
        } catch (e) {
            error = e;
            console.error("Test failed:", error);
            testStatus = "Fail";
            testDetails = e.message;

            // Capture screenshot on failure
            screenshotPath = "./screenshots/" + testId + ".png";
            await driver.saveScreenshot(screenshotPath);
            // execSync(
            //   `adb exec-out screencap -p > ${screenshotPath}`
            // );
        } finally {
            // Submit test run result
            try {
                console.log("TEST 456");

                await submitTestRun(
                    testId,
                    testStatus,
                    testDetails,
                    screenshotPath,
                );
                console.log("Test run submitted successfully");
            } catch (submitError) {
                console.error("Failed to submit test run:", submitError);
            }

            // If there was an error in the main try block, throw it here to fail the test
            if (error) {
                throw error;
            }
        }
    });

    after(async () => {
        try {
            await driver.terminateApp("com.umob.umob");
        } catch (error) {
            console.log("Error terminating app:", error);
        }
    });
});
