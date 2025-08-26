import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import submitTestRun from "../../helpers/SendResults.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to get fixed credentials for the new12 user from credentials file
function getCredentials() {
    try {
        const credentialsPath = path.resolve(
            __dirname,
            "../../../config/credentials.json",
        );
        const credentials = JSON.parse(
            fs.readFileSync(credentialsPath, "utf8"),
        );

        // Always use the new12 user from test environment
        if (!credentials.test || !credentials.test.new12) {
            throw new Error("new12 user not found in test environment");
        }

        // Return the new12 user credentials
        return {
            username: credentials.test.new12.username,
            password: credentials.test.new12.password,
        };
    } catch (error) {
        console.error("Error loading credentials:", error);
        throw new Error("Failed to load credentials configuration");
    }
}

/////////////////////////////////////////////////////////////////////////////////

describe("Test for the QR feature", () => {
    beforeEach(async () => {
        await driver.activateApp("com.umob.umob");
        await driver.pause(7000);
    });

    before(async () => {
        const credentials = getCredentials();

        // await PageObjects.login(credentials);
        await PageObjects.login({
            username: credentials.username,
            password: credentials.password,
        });
    });

    it("Round QR code button should exist and admit text code", async () => {
        const testId = "";

        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            // Check for map root element
            const mapRoot = await driver.$(
                '-android uiautomator:new UiSelector().resourceId("map_root")',
            );
            await expect(mapRoot).toBeDisplayed();

            // Verify navigation menu item
            await PageObjects.planTripBtn.waitForExist();

            //verify that box with side control buttons is loaded
            const sideButtons = await driver.$(
                '-android uiautomator:new UiSelector().resourceId("home-controls")',
            );
            await expect(sideButtons).toBeDisplayed();

            // Verify QR code button is displayed
            const qrButton = await driver.$(
                "accessibility id:scan-to-ride-button",
            );

            await qrButton.click();

            //possibly "while using the app" button required to be clicked

            //manual instruction
            const instruction = await driver.$(
                '-android uiautomator:new UiSelector().text("Enter the vehicle ID manually")',
            );

            // Verify back button is present
            const backButton = await driver.$(
                '-android uiautomator:new UiSelector().resourceId("back_button")',
            );
            await expect(backButton).toBeDisplayed();

            //vehicle ID contaner for manual input
            const idContainer = await driver.$(
                "class name:android.widget.EditText",
            );
            await idContainer.click();

            // Verify back button is present
            await expect(backButton).toBeDisplayed();
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

    it("should display all key account screen elements", async () => {
        const testId = "";

        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            // Click on Account button
            await PageObjects.clickAccountButton();
            await driver.pause(2000);

            // Verify bottom navigation menu items
            await PageObjects.planTripBtn.waitForExist();
            await PageObjects.promosBtn.waitForExist();

            //click PLAN TRIP button to verify taxi and public transport options
            //await planTrip.click();
            await PageObjects.planTripBtn.click();

            //scroll to bottom
            await driver.pause(2000);
            const { width, height } = await driver.getWindowSize();
            await driver.executeScript("mobile: scrollGesture", [
                {
                    left: width / 2,
                    top: 0,
                    width: 0,
                    height: height * 0.8,
                    direction: "down",
                    percent: 2,
                },
            ]);
            await driver.pause(1000);

            const taxiButton = await driver.$(
                '-android uiautomator:new UiSelector().text("GRAB TAXI")',
            );
            await expect(taxiButton).toBeDisplayed();

            const publicTransportButton = await driver.$(
                '-android uiautomator:new UiSelector().text("PUBLIC TRANSPORT")',
            );
            await expect(publicTransportButton).toBeDisplayed();

            // Verify back button is present
            const backButton = await driver.$(
                '-android uiautomator:new UiSelector().resourceId("back_button")',
            );
            await expect(backButton).toBeDisplayed();
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

    it("should display QR button in the bottom slide window", async () => {
        const testId = "";

        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            // Click on Account button
            await PageObjects.clickAccountButton();

            await driver.pause(2000);

            await driver.pause(3000);

            // back to common list of account menu
            await backButton.click();
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

    afterEach(async () => {
        try {
            await driver.terminateApp("com.umob.umob");
        } catch (error) {
            console.log("Error terminating app:", error);
        }
    });
});
