import { execSync } from "child_process";
import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import submitTestRun from "../../helpers/SendResults.js";
import AppiumHelpers from "../../helpers/AppiumHelpers.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = "https://backend-test.umobapp.com/api/tomp/mapboxmarkers";
const AUTH_TOKEN =
    "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkFGNkFBNzZCMUFEOEI4QUJCQzgzRTAzNjBEQkQ4MkYzRjdGNDE1MDMiLCJ4NXQiOiJyMnFuYXhyWXVLdThnLUEyRGIyQzhfZjBGUU0iLCJ0eXAiOiJhdCtqd3QifQ.eyJpc3MiOiJodHRwczovL2JhY2tlbmQtdGVzdC51bW9iYXBwLmNvbS8iLCJleHAiOjE3NDUxNTA0MjgsImlhdCI6MTczNzM3NDQyOCwiYXVkIjoidU1vYiIsInNjb3BlIjoib2ZmbGluZV9hY2Nlc3MgdU1vYiIsImp0aSI6ImQyM2Y2ZDY1LTQ2ZjEtNDcxZi1hMGRmLTUyOWU3ZmVlYTdiYSIsInN1YiI6IjY1NzAxOWU2LWFiMGItNGNkNS1hNTA0LTgwMjUwNmZiYzc0YyIsInVuaXF1ZV9uYW1lIjoibmV3NUBnbWFpbC5jb20iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJuZXc1QGdtYWlsLmNvbSIsImdpdmVuX25hbWUiOiJOZXc1IiwiZmFtaWx5X25hbWUiOiJOZXc1IiwiZW1haWwiOiJuZXc1QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoiRmFsc2UiLCJwaG9uZV9udW1iZXIiOiIrMzE5NzAxMDU4MDM0MSIsInBob25lX251bWJlcl92ZXJpZmllZCI6IlRydWUiLCJvaV9wcnN0IjoidU1vYl9BcHBfT3BlbklkZGljdCIsIm9pX2F1X2lkIjoiYTIyZWNjMjYtMWE4ZC01NDRkLThiN2ItM2ExNzk1YzJjMzRjIiwiY2xpZW50X2lkIjoidU1vYl9BcHBfT3BlbklkZGljdCIsIm9pX3Rrbl9pZCI6IjAwMjQ4OWYyLTAzODYtZTcxZC0xNjljLTNhMTc5NWMyYzQ2MSJ9.s9l5ytG-9PwwF3CVBMJKSG0pkZ5ZBKJrJ5AzNnbYzzuo88qfg1uqv0jE1B7qriZ4qnqoCVxCHkgRxouEGIvWpOezfvSeYlik-GoJAQa20Qf8KkEpa8JTXUXImDKkrmSa7b_4mlP3m1-D8mormBxHhRh4W0O9WreMh3TD3c2NAUNM7Ecq5-3Ax9DAM4lJf-KZYVH1uEb3kD3hFcx68wFNqU5EAjJHZjC0FcA3REJDIfMRoNilpZcNHz4Y8oejcpO2P9I19g3mr0ZDdIIs-HyzASiQr1Mfj6c6lV72HKMpfmlSMO1Iy9juxAPE_wjhXcpi7F9pn3zZmGNdDcukf_feWg";

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
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: AUTH_TOKEN,
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
                    radius: 1166.6137310913994,
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

        // await driver
        //   .action("pointer")
        //   .move({ x: centerX, y: centerY })
        //   .down()
        //   .up()
        //   .perform();

        //Click on middle of the screen
        await AppiumHelpers.clickCenterOfScreen();

        await driver.pause(3000);
    }

    static async verifySelectPaymentMethod() {
        const selectPayment = await driver.$(
            '-android uiautomator:new UiSelector().text("Select payment method")',
        );
        await expect(selectPayment).toBeDisplayed();
    }

    static async clickReserveButton() {
        const reserveButton = await driver.$(
            '-android uiautomator:new UiSelector().text("RESERVE")',
        );
        await reserveButton.waitForEnabled();
        await driver.pause(5000);
        await reserveButton.click();
    }

    static async verifyPaymentMethodsScreen() {
        const paymentHeader = await driver.$(
            "id:com.umob.umob:id/payment_method_header_title",
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
    }

    static async closePaymentPopup() {
        const closePopup = await driver.$(
            "id:com.umob.umob:id/imageView_close",
        );
        await closePopup.click();
    }

    static async clickStartTripButton() {
        const startTripButton = await driver.$(
            '-android uiautomator:new UiSelector().text("START TRIP")',
        );
        await startTripButton.waitForEnabled();
        await startTripButton.click();
    }

    static async verifyStartTripPaymentOptions() {
        const paymentHeader = await driver.$(
            "id:com.umob.umob:id/payment_method_header_title",
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
    const USER = process.env.TEST_USER || "newUser";

    const defaultLocation = {
        longitude: 4.46893572807312,
        latitude: 51.91743146298927,
    };

    let scooters;

    before(async () => {
        const credentials = TestHelpers.getCredentials(ENV, USER);
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
                await driver.pause(5000);

                // Click on center of screen to interact with map
                await FelyxScooterActions.clickCenterOfScreen();

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
            },
            targetScooter,
        );
    });
});
