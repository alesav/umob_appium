import { execSync } from "child_process";
import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import submitTestRun from "../../helpers/SendResults.js";
import AppiumHelpers from "../../helpers/AppiumHelpers.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PostHogHelper from "../../helpers/PosthogHelper.js";
import { driver } from "@wdio/globals";

const posthog = new PostHogHelper();

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get environment from env variables
const ENV = process.env.TEST_ENV || "test";

/**
 * Get API configuration for the current environment
 */
function getApiConfig(environment = "test") {
    try {
        const credentialsPath = path.resolve(
            __dirname,
            "../../../config/credentials.json",
        );
        const credentials = JSON.parse(
            fs.readFileSync(credentialsPath, "utf8"),
        );

        if (!credentials[environment]) {
            console.warn(
                `Environment '${environment}' not found. Using 'test' environment.`,
            );
            environment = "test";
        }

        return {
            apiUrl: credentials[environment].apiUrl,
            authToken: credentials[environment].authToken,
        };
    } catch (error) {
        console.error("Error loading API config:", error);
        throw new Error("Failed to load API configuration");
    }
}

/**
 * Test Helper Functions
 */
class TestHelpers {
    static getCredentials(environment = "test", userKey = null) {
        try {
            const credentialsPath = path.resolve(
                __dirname,
                "../../../config/credentials.json",
            );
            const credentials = JSON.parse(
                fs.readFileSync(credentialsPath, "utf8"),
            );

            if (!credentials[environment]) {
                console.warn(
                    `Environment '${environment}' not found in credentials file. Using 'test' environment.`,
                );
                environment = "test";
            }

            const envUsers = credentials[environment];

            if (!userKey) {
                userKey = Object.keys(envUsers)[0];
            } else if (!envUsers[userKey]) {
                console.warn(
                    `User '${userKey}' not found in '${environment}' environment. Using first available user.`,
                );
                userKey = Object.keys(envUsers)[0];
            }

            return {
                username: envUsers[userKey].username,
                password: envUsers[userKey].password,
            };
        } catch (error) {
            console.error("Error loading credentials:", error);
            throw new Error("Failed to load credentials configuration");
        }
    }

    static async getScreenCenter() {
        return await AppiumHelpers.getScreenCenter();
    }

    static async setLocationAndRestartApp(longitude, latitude) {
        return await AppiumHelpers.setLocationAndRestartApp(
            longitude,
            latitude,
        );
    }

    static async captureScreenshot(testId) {
        const screenshotPath = `./screenshots/${testId}.png`;
        try {
            await driver.saveScreenshot(screenshotPath);
        } catch (error) {
            console.warn("Driver screenshot failed, using adb fallback");
            execSync(`adb exec-out screencap -p > ${screenshotPath}`);
        }
        return screenshotPath;
    }

    static async fetchScooterCoordinates() {
        const apiConfig = getApiConfig(ENV);

        try {
            const response = await fetch(apiConfig.apiUrl, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: apiConfig.authToken,
                    "Accept-Language": "en",
                    "X-Requested-With": "XMLHttpRequest",
                    "App-Version": "1.24057.3.24057",
                    "App-Platform": "android",
                },
                body: JSON.stringify({
                    regionId: "",
                    stationId: "",
                    longitude: 4.46893572807312,
                    latitude: 51.91743146298927,
                    radius: 116.6137310913994,
                    zoomLevel: 15.25,
                    subOperators: [],
                    assetClasses: [23],
                    operatorAvailabilities: [2, 1, 3],
                    showEmptyStations: false,
                    skipCount: 0,
                    sorting: "",
                    defaultMaxResultCount: 10,
                    maxMaxResultCount: 1000,
                    maxResultCount: 10,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Fetched scooter coordinates:", JSON.stringify(data));
            return data.assets;
        } catch (error) {
            console.error("Error fetching scooter coordinates:", error);
            throw error;
        }
    }
}

/**
 * Felyx Scooter Booking Actions
 */
class FelyxScooterActions {
    static async clickCenterOfScreen() {
        const { centerX, centerY } = await TestHelpers.getScreenCenter();

        //Click on middle of the screen
        await AppiumHelpers.clickCenterOfScreen();

        await driver.pause(3000);
    }

    static async verifySelectPaymentMethod() {
        await PageObjects.selectPayment.waitForDisplayed();
    }

    static async clickReserveButton() {
        await PageObjects.reserveButton.waitForEnabled();

        await driver.pause(5000);
        await PageObjects.reserveButton.click();
    }

    static async verifyPaymentMethodsScreen() {
        await PageObjects.paymentHeader.waitForDisplayed();

        const cards = await driver.$(
            '-android uiautomator:new UiSelector().text("Cards")',
        );
        await expect(cards).toBeDisplayed();

        const bancontactCard = await driver.$(
            '-android uiautomator:new UiSelector().text("Bancontact card")',
        );
        await expect(bancontactCard).toBeDisplayed();

        const payPal = await driver.$(
            '-android uiautomator:new UiSelector().text("PayPal")',
        );
        await expect(payPal).toBeDisplayed();
    }

    static async closePaymentPopup() {
        const closePopup = await driver.$(
            "id:com.umob.umob:id/imageView_close",
        );
        await closePopup.click();
    }

    static async clickStartTripButton() {
        await PageObjects.startTripButton.waitForEnabled();
        await driver.pause(2000);
        await PageObjects.startTripButton.click();
    }

    static async verifyStartTripPaymentOptions() {
        const paymentHeader = await driver.$(
            '-android uiautomator:new UiSelector().text("PAYMENT METHODS")',
        );
        await expect(paymentHeader).toBeDisplayed();

        const cards = await driver.$(
            '-android uiautomator:new UiSelector().text("Cards")',
        );
        await expect(cards).toBeDisplayed();

        const bancontactCard = await driver.$(
            '-android uiautomator:new UiSelector().text("Bancontact card")',
        );
        await expect(bancontactCard).toBeDisplayed();

        const payPal = await driver.$(
            '-android uiautomator:new UiSelector().text("PayPal")',
        );
        await expect(payPal).toBeDisplayed();

        const closeBtn = await driver.$("accessibility id:Close");
        await expect(closeBtn).toBeDisplayed();
        await closeBtn.click();
    }
}

/**
 * Test Runner with proper error handling
 */
class TestRunner {
    static async runTest(testId, testFunction, scooterInfo = null) {
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            await testFunction();
        } catch (e) {
            error = e;
            console.error("Test failed:", error);
            testStatus = "Fail";

            const scooterDetails = scooterInfo
                ? `Scooter: ${scooterInfo.id} (${scooterInfo.coordinates.longitude}, ${scooterInfo.coordinates.latitude}) | `
                : "";
            testDetails = `${scooterDetails}Error: ${e.message}`;

            screenshotPath = await TestHelpers.captureScreenshot(testId);
        } finally {
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

            if (error) {
                throw error;
            }
        }
    }
}

/**
 * Main Test Suite
 */
describe("Felyx Scooter Booking - New User Without Card", () => {
    const ENV = process.env.TEST_ENV || "test";
    const TEST_USER = "newUser";

    const defaultLocation = {
        longitude: 4.46893572807312,
        latitude: 51.91743146298927,
    };

    let scooters;

    before(async () => {
        const credentials = TestHelpers.getCredentials(ENV, TEST_USER);
        await PageObjects.login({
            username: credentials.username,
            password: credentials.password,
        });

        // Fetch scooter coordinates before running tests
        scooters = await TestHelpers.fetchScooterCoordinates();

        await TestHelpers.setLocationAndRestartApp(
            defaultLocation.longitude,
            defaultLocation.latitude,
        );
    });

    beforeEach(async () => {
        await driver.activateApp("com.umob.umob");
    });

    afterEach(async () => {
        await driver.terminateApp("com.umob.umob");
    });

    it("New User Tries to Reserve Felyx Scooter Without Card", async () => {
        let targetScooter;

        await TestRunner.runTest(
            "f8c39b91-153c-431c-8c49-8bf1246f7416",
            async () => {
                // Find a Felyx scooter from the fetched coordinates
                const targetScooter = scooters.find((scooter) =>
                    scooter.id.includes("Felyx"),
                );

                if (!targetScooter) {
                    throw new Error(
                        "No Felyx scooter found in the fetched coordinates",
                    );
                }

                // Set location to specific scooter coordinates
                await AppiumHelpers.setLocationAndRestartApp(
                    targetScooter.coordinates.longitude,
                    targetScooter.coordinates.latitude,
                );
                await driver.pause(6000);

                // Click on center of screen to interact with map
                //await FelyxScooterActions.clickCenterOfScreen();

                // get center of the map (not the center of the screen!)
                const { x, y } = await AppiumHelpers.getMapCenterCoordinates();
                await driver.pause(3000);

                // CLick on map center (operator located in the center of the map)
                await driver.execute("mobile: clickGesture", { x, y });

                // Verify that payment method is not set up
                await FelyxScooterActions.verifySelectPaymentMethod();

                // Click Reserve button
                await FelyxScooterActions.clickReserveButton();

                // Verify payment methods screen is displayed
                await FelyxScooterActions.verifyPaymentMethodsScreen();

                // Close the payment popup
                await FelyxScooterActions.closePaymentPopup();

                // Click Start Trip button
                await FelyxScooterActions.clickStartTripButton();

                // Verify payment methods screen appears again for start trip
                await FelyxScooterActions.verifyStartTripPaymentOptions();
                await driver.pause(4000);

                // Verify PostHog events
                try {
                    // Get Transporter Clicked event
                    const TCEvent = await posthog.waitForEvent(
                        {
                            eventName: "Transporter Clicked",
                        },
                        {
                            maxRetries: 10,
                            retryDelayMs: 3000,
                            searchLimit: 20,
                            maxAgeMinutes: 5,
                        },
                    );

                    // If we got here, event was found with all criteria matching
                    posthog.printEventSummary(TCEvent);

                    // Verify Transporter Clicked event
                    expect(TCEvent.event).toBe("Transporter Clicked");
                    expect(TCEvent.person?.is_identified).toBe(true);
                } catch (posthogError) {
                    console.error("PostHog verification failed:", posthogError);
                    throw posthogError;
                }
            },
        );
    });
});
