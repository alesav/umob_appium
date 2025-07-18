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
const ENV = process.env.TEST_ENV || "test";
const USER = process.env.TEST_USER || "new35";

describe("Book Public Transport", () => {
    before(async () => {
        const credentials = getCredentials(ENV, USER);
        const { width, height } = await driver.getWindowSize();

        await PageObjects.login({
            username: credentials.username,
            password: credentials.password,
        });
        execSync(
            "adb shell pm grant com.umob.umob android.permission.ACCESS_FINE_LOCATION",
        );
        execSync(
            "adb shell pm grant com.umob.umob android.permission.ACCESS_COARSE_LOCATION",
        );

        const latitude = 51.9155956;
        const longitude = 4.4744301;

        await AppiumHelpers.setLocationAndRestartApp(longitude, latitude);
    });

    it("should display all key elements on Plan Your Trip screen for Public Transport", async () => {
        const testId = "ef526412-4497-470b-bcf8-1854b13613c4";
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            await driver.activateApp("com.umob.umob");
            await driver.pause(7000);

            await PageObjects.planTripBtn.waitForExist();
            await PageObjects.planTripBtn.click();

            await driver.pause(2000);
            /*
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
                            y: height / 2 + 200,
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

            await driver.pause(1000);
            */
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
                            y: height * 0.95,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        {
                            type: "pointerMove",
                            duration: 1000,
                            x: width / 2,
                            y: height * 0.1,
                        },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);
            await driver.pause(2000);
            /*
            //scroll to bottom
await driver.pause(2000);
const { width, height } = await driver.getWindowSize();
await driver.executeScript('mobile: scrollGesture', [{
 left: width/2,
 top: 0,
 width: 0,
 height: height*0.8,
 direction: 'down',
 percent: 2
}]);
await driver.pause(1000);
*/

            // Click to choose public transport
            const ptButton = await driver.$(
                '-android uiautomator:new UiSelector().text("PUBLIC TRANSPORT")',
            );
            await expect(ptButton).toBeDisplayed();
            await ptButton.click();

            // Verify screen header
            const screenHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Plan your trip")',
            );
            await expect(screenHeader).toBeDisplayed();

            // Verify departure and destination input section
            const departureDestinationLabel = await driver.$(
                '-android uiautomator:new UiSelector().text("Enter starting point & destination")',
            );
            await expect(departureDestinationLabel).toBeDisplayed();

            // Verify destination input
            const destinationInput = await driver.$(
                '-android uiautomator:new UiSelector().text("Destination")',
            );
            await expect(destinationInput).toBeDisplayed();

            // Verify time switch buttons
            const departAtButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Depart at")',
            );
            const arriveByButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Arrive by")',
            );
            await expect(departAtButton).toBeDisplayed();
            await expect(arriveByButton).toBeDisplayed();

            // Verify date input
            const dateInput = await driver.$(
                '-android uiautomator:new UiSelector().text("Today")',
            );
            await expect(dateInput).toBeDisplayed();

            // Verify time input
            const timeInput = await driver.$(
                '-android uiautomator:new UiSelector().text("Now")',
            );
            await expect(timeInput).toBeDisplayed();

            // Verify train class section
            const selectClassLabel = await driver.$(
                '-android uiautomator:new UiSelector().text("Select class (for trains)")',
            );
            await expect(selectClassLabel).toBeDisplayed();

            await driver.performActions([
                {
                    type: "pointer",
                    id: "finger1",
                    parameters: { pointerType: "touch" },
                    actions: [
                        {
                            type: "pointerMove",
                            duration: 0,
                            x: 160,
                            y: height / 2 + 200,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        { type: "pointerMove", duration: 1000, x: 160, y: 10 },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

            // Verify train class switch buttons
            const secondClassButton = await driver.$(
                '-android uiautomator:new UiSelector().text("2nd class")',
            );
            const firstClassButton = await driver.$(
                '-android uiautomator:new UiSelector().text("1st class")',
            );
            await expect(secondClassButton).toBeDisplayed();
            await expect(firstClassButton).toBeDisplayed();

            // Verify Continue button
            const continueButton = await driver.$(
                '-android uiautomator:new UiSelector().text("CONTINUE")',
            );
            await expect(continueButton).toBeDisplayed();

            // Verify Help button
            const helpButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Help")',
            );
            await expect(helpButton).toBeDisplayed();
        } catch (e) {
            error = e;
            console.error("Test failed:", error);
            testStatus = "Fail";
            testDetails = e.message;

            // Capture screenshot on failure
            screenshotPath = "./screenshots/" + testId + ".png";
            await driver.saveScreenshot(screenshotPath);
        } finally {
            // Submit test run result
            try {
                await submitTestRun(
                    testId,
                    testStatus,
                    testDetails,
                    screenshotPath,
                );
            } catch (submitError) {
                console.error("Failed to submit test run:", submitError);
            }

            // If there was an error in the main try block, throw it here to fail the test
            if (error) {
                throw error;
            }
        }
    });

    it("should put in destination and book a ticket for Public Transport", async () => {
        const testId = "25c6b504-c751-443e-9092-cc33a650d19c";
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            const { width, height } = await driver.getWindowSize();
            await driver.performActions([
                {
                    type: "pointer",
                    id: "finger1",
                    parameters: { pointerType: "touch" },
                    actions: [
                        { type: "pointerMove", duration: 0, x: 400, y: 300 },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        { type: "pointerMove", duration: 1000, x: 100, y: 800 },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

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

            const chooseFromList = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Blaak 31")',
            );
            await expect(chooseFromList).toBeDisplayed();

            // Verify the continue button becomes enabled after adding destination
            const continuePress = await driver.$(
                '-android uiautomator:new UiSelector().text("CONTINUE")',
            );
            await expect(continuePress).toBeDisplayed();
            await continuePress.click();
            await driver.pause(10000);
        } catch (e) {
            error = e;
            console.error("Test failed:", error);
            testStatus = "Fail";
            testDetails = e.message;

            // Capture screenshot on failure
            screenshotPath = "./screenshots/" + testId + ".png";
            await driver.saveScreenshot(screenshotPath);
        } finally {
            // Submit test run result
            try {
                await submitTestRun(
                    testId,
                    testStatus,
                    testDetails,
                    screenshotPath,
                );
            } catch (submitError) {
                console.error("Failed to submit test run:", submitError);
            }

            // If there was an error in the main try block, throw it here to fail the test
            if (error) {
                throw error;
            }
        }
    });

    it("should display all key elements and pick up the route", async () => {
        const testId = "a9cd327a-1c6c-450e-b299-48656dac1663";
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            // Check key elements on route selection screen
            const routeHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Travel Options")',
            );
            await expect(routeHeader).toBeDisplayed();

            // Select first route by clicking euro symbol
            const firstRoutePrice = await driver.$(
                "(//android.widget.TextView[contains(@text, '€')])[1]",
            );
            await expect(firstRoutePrice).toBeDisplayed();
            await firstRoutePrice.click();
            await driver.pause(2000);
        } catch (e) {
            error = e;
            console.error("Test failed:", error);
            testStatus = "Fail";
            testDetails = e.message;

            // Capture screenshot on failure
            screenshotPath = "./screenshots/" + testId + ".png";
            await driver.saveScreenshot(screenshotPath);
        } finally {
            // Submit test run result
            try {
                await submitTestRun(
                    testId,
                    testStatus,
                    testDetails,
                    screenshotPath,
                );
            } catch (submitError) {
                console.error("Failed to submit test run:", submitError);
            }

            // If there was an error in the main try block, throw it here to fail the test
            if (error) {
                throw error;
            }
        }
    });

    it("should check screen and buy e-ticket", async () => {
        const testId = "b7149cf2-3c8f-40d2-ac3b-3f4c4362fa89";
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            // Check header is displayed
            const travelDetails = await driver.$(
                '-android uiautomator:new UiSelector().text("Travel details")',
            );
            await expect(travelDetails).toBeDisplayed();

            // Check data for payment card is displayed
            const card = await driver.$(
                '-android uiautomator:new UiSelector().text("**** **** 1115")',
            );
            await expect(card).toBeDisplayed();

            await driver.pause(2000);

            // Scroll to bottom
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
                            x: 160,
                            y: height / 2 + 100,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        { type: "pointerMove", duration: 1000, x: 160, y: 10 },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);
            await driver.pause(6000);

            // Check back button is displayed
            const backButton = await driver.$("accessibility id:back_button");
            await expect(backButton).toBeDisplayed();
            await driver.pause(2000);

            // Check "buy e-tickets" button is enabled and click it
            const buyButton = await driver.$(
                '-android uiautomator:new UiSelector().text("BUY E-TICKETS")',
            );
            await buyButton.click();
            await driver.pause(7000);
        } catch (e) {
            error = e;
            console.error("Test failed:", error);
            testStatus = "Fail";
            testDetails = e.message;

            // Capture screenshot on failure
            screenshotPath = "./screenshots/" + testId + ".png";
            await driver.saveScreenshot(screenshotPath);
        } finally {
            // Submit test run result
            try {
                await submitTestRun(
                    testId,
                    testStatus,
                    testDetails,
                    screenshotPath,
                );
            } catch (submitError) {
                console.error("Failed to submit test run:", submitError);
            }

            // If there was an error in the main try block, throw it here to fail the test
            if (error) {
                throw error;
            }
        }
    });

    it("final step of confirmation for buying a ticket", async () => {
        const testId = "2923bdca-4d57-4962-94d7-09907c0068d3";
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            // Check key elements are displayed (header)
            const header = await driver.$(
                '-android uiautomator:new UiSelector().text("Buy e-tickets")',
            );
            await expect(header).toBeDisplayed();

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
                            y: height * 0.85,
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
            await driver.pause(2000);

            // Check key elements are displayed (conditions,travel costs)
            const travelCosts = await driver.$(
                '-android uiautomator:new UiSelector().text("Travel costs")',
            );
            await expect(travelCosts).toBeDisplayed();

            // Check key elements are displayed (total amount and service fee)
            const serviceFee = await driver.$(
                '-android uiautomator:new UiSelector().text("Service fee")',
            );
            const totalAmount = await driver.$(
                '-android uiautomator:new UiSelector().text("Total amount")',
            );
            await expect(serviceFee).toBeDisplayed();
            await expect(totalAmount).toBeDisplayed();

            // Check key elements are displayed (back button)
            const backButton = await driver.$("accessibility id:back_button");
            await expect(backButton).toBeDisplayed();

            // Check key elements are displayed (agreement text: "i agree to the sharing...")
            const agreementText = await driver.$(
                "~I agree to the sharing of personal data required for purchasing e-tickets with carriers and Tranzer, and the ticketing conditions of umob and carriers.",
            );
            await expect(agreementText).toBeDisplayed();

            // Click to the checking box
            const checkbox = await driver.$(
                "accessibility id:terms-and-conditions-checkbox",
            );
            await expect(checkbox).toBeDisplayed();
            await checkbox.click();

            // Click on enabled confirm button and wait 10seconds
            const confirmButton = await driver.$(
                '-android uiautomator:new UiSelector().text("CONFIRM")',
            );
            await confirmButton.click();
            await driver.pause(15000);
        } catch (e) {
            error = e;
            console.error("Test failed:", error);
            testStatus = "Fail";
            testDetails = e.message;

            // Capture screenshot on failure
            screenshotPath = "./screenshots/" + testId + ".png";
            await driver.saveScreenshot(screenshotPath);
        } finally {
            // Submit test run result
            try {
                await submitTestRun(
                    testId,
                    testStatus,
                    testDetails,
                    screenshotPath,
                );
            } catch (submitError) {
                console.error("Failed to submit test run:", submitError);
            }

            // If there was an error in the main try block, throw it here to fail the test
            if (error) {
                throw error;
            }
        }
    });

    it("check key elements, scroll and click show e-tickets", async () => {
        const testId = "bf5c25a6-a863-4635-820f-5459703ccbe2";
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            // Checking header is displayed
            const headerBooking = await driver.$(
                '-android uiautomator:new UiSelector().text("Booking complete")',
            );
            await headerBooking.waitForDisplayed({ timeout: 15000 });
            await expect(headerBooking).toBeDisplayed();

            // Scroll to bottom
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
                            x: 160,
                            y: height / 2 + 200,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        { type: "pointerMove", duration: 1000, x: 160, y: 10 },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);
            await driver.pause(7000);

            // Check text "make sure you download your..."
            const assureText = await driver.$(
                '-android uiautomator:new UiSelector().text("Make sure you download your tickets at least 15 mins before the trip. You can always find your tickets in My Rides & Tickets.")',
            );
            await expect(assureText).toBeDisplayed();

            // Button "show e-tickets" is enabled and click the button
            const showButton = await driver.$(
                '-android uiautomator:new UiSelector().text("SHOW E-TICKETS")',
            );
            await showButton.click();
            await driver.pause(10000);
        } catch (e) {
            error = e;
            console.error("Test failed:", error);
            testStatus = "Fail";
            testDetails = e.message;

            // Capture screenshot on failure
            screenshotPath = "./screenshots/" + testId + ".png";
            await driver.saveScreenshot(screenshotPath);
        } finally {
            // Submit test run result
            try {
                await submitTestRun(
                    testId,
                    testStatus,
                    testDetails,
                    screenshotPath,
                );
            } catch (submitError) {
                console.error("Failed to submit test run:", submitError);
            }

            // If there was an error in the main try block, throw it here to fail the test
            if (error) {
                throw error;
            }
        }
    });

    it("check ticket information and click got_it button", async () => {
        const testId = "f8b9d103-0549-434c-ba15-a133b7e806b6";
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            // Check header is displayed
            const ticketHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Ticket")',
            );
            await expect(ticketHeader).toBeDisplayed();

            // Check route information using direct text selector
            const fromSection = await driver.$(
                'android=new UiSelector().text("From")',
            );
            await expect(fromSection).toBeDisplayed();

            const toSection = await driver.$(
                'android=new UiSelector().text("To")',
            );
            await expect(toSection).toBeDisplayed();

            // Check valid between section using compound selector
            const validBetweenSection = await driver.$(
                'android=new UiSelector().className("android.widget.TextView").text("Valid between")',
            );
            await expect(validBetweenSection).toBeDisplayed();

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
                            x: 160,
                            y: height / 2 + 100,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        { type: "pointerMove", duration: 1000, x: 160, y: 10 },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

            // Check vehicle section is displayed
            const vehicleHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Vehicle")',
            );
            await expect(vehicleHeader).toBeDisplayed();

            // Check vehicle type is displayed
            const vehicleType = await driver.$(
                '-android uiautomator:new UiSelector().text("Vehicle type")',
            );
            await expect(vehicleType).toBeDisplayed();

            // Check booking number is displayed
            const bookingNo = await driver.$(
                '-android uiautomator:new UiSelector().text("Booking no")',
            );
            await expect(bookingNo).toBeDisplayed();

            // Scroll to bottom
            await driver.performActions([
                {
                    type: "pointer",
                    id: "finger1",
                    parameters: { pointerType: "touch" },
                    actions: [
                        {
                            type: "pointerMove",
                            duration: 0,
                            x: 160,
                            y: height / 2 + 100,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        { type: "pointerMove", duration: 1000, x: 160, y: 10 },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

            await driver.performActions([
                {
                    type: "pointer",
                    id: "finger1",
                    parameters: { pointerType: "touch" },
                    actions: [
                        {
                            type: "pointerMove",
                            duration: 0,
                            x: 160,
                            y: height / 2 + 100,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        { type: "pointerMove", duration: 1000, x: 160, y: 10 },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

            // Check payment details are displayed
            const travelCost = await driver.$(
                '-android uiautomator:new UiSelector().text("Travel cost")',
            );
            await expect(travelCost).toBeDisplayed();

            const serviceFee = await driver.$(
                '-android uiautomator:new UiSelector().text("Service fee")',
            );
            await expect(serviceFee).toBeDisplayed();

            const totalAmount = await driver.$(
                '-android uiautomator:new UiSelector().text("Total amount")',
            );
            await expect(totalAmount).toBeDisplayed();

            // Click GOT IT button using multiple fallback strategies
            try {
                const gotItButton = await driver.$(
                    'android=new UiSelector().text("GOT IT").resourceId("ride-details-primary-button-text")',
                );
                await gotItButton.waitForDisplayed({ timeout: 5000 });
                await gotItButton.click();
            } catch (error) {
                // Fallback to content-desc
                const gotItButtonAlt = await driver.$(
                    '[content-desc="ride-details-primary-button"]',
                );
                await gotItButtonAlt.click();
            }
        } catch (e) {
            error = e;
            console.error("Test failed:", error);
            testStatus = "Fail";
            testDetails = e.message;

            // Capture screenshot on failure
            screenshotPath = "./screenshots/" + testId + ".png";
            await driver.saveScreenshot(screenshotPath);
        } finally {
            // Submit test run result
            try {
                await submitTestRun(
                    testId,
                    testStatus,
                    testDetails,
                    screenshotPath,
                );
            } catch (submitError) {
                console.error("Failed to submit test run:", submitError);
            }

            // If there was an error in the main try block, throw it here to fail the test
            if (error) {
                throw error;
            }
        }
    });

    // terminate the app afterAll
    after(async () => {
        await driver.terminateApp("com.umob.umob");
    });
});
