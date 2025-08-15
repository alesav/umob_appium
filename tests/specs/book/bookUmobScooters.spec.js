import { execSync } from "child_process";
import submitTestRun from "../../helpers/SendResults.js";
import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import AppiumHelpers from "../../helpers/AppiumHelpers.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = "https://backend-test.umobapp.com/api/tomp/mapboxmarkers";
const AUTH_TOKEN =
    "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkFGNkFBNzZCMUFEOEI4QUJCQzgzRTAzNjBEQkQ4MkYzRjdGNDE1MDMiLCJ4NXQiOiJyMnFuYXhyWXVLdThnLUEyRGIyQzhfZjBGUU0iLCJ0eXAiOiJhdCtqd3QifQ.eyJpc3MiOiJodHRwczovL2JhY2tlbmQtdGVzdC51bW9iYXBwLmNvbS8iLCJleHAiOjE3NDY2MTAyMTgsImlhdCI6MTczODgzNDIxOCwiYXVkIjoidU1vYiIsInNjb3BlIjoib2ZmbGluZV9hY2Nlc3MgdU1vYiIsImp0aSI6IjE2ZWUzZjRjLTQzYzktNGE3Ni1iOTdhLTYxMGI0NmU0MGM3ZCIsInN1YiI6IjRhNGRkZmRhLTNmMWYtNDEyMS1iNzU1LWZmY2ZjYTQwYzg3MiIsInNlc3Npb25faWQiOiIzNGU4NDZmOC02MmI3LTRiMzgtODkxYS01NjE4NWM4ZDdhOGEiLCJ1bmlxdWVfbmFtZSI6Im5ld0BnbWFpbC5jb20iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJuZXdAZ21haWwuY29tIiwiZ2l2ZW5fbmFtZSI6Ik5ldyIsImZhbWlseV9uYW1lIjoiTmV3IiwiZW1haWwiOiJuZXdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOiJGYWxzZSIsInBob25lX251bWJlciI6IiszMTk3MDEwNTg2NTU2IiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjoiVHJ1ZSIsIm9pX3Byc3QiOiJ1TW9iX0FwcF9PcGVuSWRkaWN0Iiwib2lfYXVfaWQiOiI0ODZkYTI1OS05ZGViLTJmMDQtYmM2OS0zYTE3ZWNjNTY1YTEiLCJjbGllbnRfaWQiOiJ1TW9iX0FwcF9PcGVuSWRkaWN0Iiwib2lfdGtuX2lkIjoiMTQzZGNiNGUtZTFjYi01MmU0LWU5ZWUtM2ExN2VjYzU2NWI5In0.4slYA6XbzRDTNdPJSOmxGlsuetx1IywPojVVMooyyL8Whu4Go6I2V-wspetKGptQnG85X75lg6gWAOYwV5ES5mJQJ4unZuCUW82sDPMNZwEhw_Hzl6UyO5vd3pYJOzry07RcskSwonVKZqipiAEusiYRCvo0AjUx33g5NaRAhXUCE8p_9vdTgSMVjtQkFGpsXih-Hw8rcy7N_HH_LWz-C2ZIA9i2sV3tEHNpTgVhs9Z0WTISirTXdmSolv6JvlqkGETsq0CSFa-0xmhjWU036KB2C5nKBLpUP6AUwibcLDEc0_RoUka-Ia-a4QNVZuzME3pMxIaGOToYf1WLEHPeIQ";

/**
 * Test Helper Functions
 */
class TestHelpers {
    static getCredentials() {
        try {
            const credentialsPath = path.resolve(
                __dirname,
                "../../../config/credentials.json",
            );
            const credentials = JSON.parse(
                fs.readFileSync(credentialsPath, "utf8"),
            );

            if (!credentials.test?.new43) {
                throw new Error(
                    "User12 (new42) user credentials not found in test environment",
                );
            }

            return {
                username: credentials.test.new43.username,
                password: credentials.test.new43.password,
            };
        } catch (error) {
            console.error("Error loading credentials:", error);
            throw new Error("Failed to load credentials configuration");
        }
    }

    static async getScreenCenter() {
        return await AppiumHelpers.getScreenCenter();
    }

    static async clickMyLocation() {
        return await AppiumHelpers.clickMyLocation();
    }

    static async performDoubleClick(x, y) {
        return await AppiumHelpers.performDoubleClick(x, y);
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
                    "App-Version": "1.23776.3.23776",
                    "App-Platform": "android",
                },
                body: JSON.stringify({
                    regionId: "",
                    stationId: "",
                    longitude: 4.477300196886063,
                    latitude: 51.92350013464292,
                    radius: 1166.6137310913994,
                    zoomLevel: 15.25,
                    subOperators: [],
                    assetClasses: [24, 17],
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

    static findScooterById(scooters, scooterId) {
        const scooter = scooters.find((s) => s.id === scooterId);
        if (!scooter) {
            throw new Error(`Scooter with ID ${scooterId} not found`);
        }
        return scooter;
    }
}

/**
 * Scooter Booking Actions
 */
class ScooterBookingActions {
    // static async selectPaymentMethod() {
    //     await PageObjects.selectPaymentMethod();
    // }

    static async startTrip() {
        await PageObjects.startTrip();
    }

    static async endTrip() {
        await PageObjects.endTrip();
    }

    static async handleTripCompletion() {
        await PageObjects.handleTripCompletion();
    }

    static async verifyRideDetails() {
        const firstTicketItem = await driver.$(
            '//android.view.ViewGroup[@content-desc="undefined-AccountListItemButton"][1]',
        );
        await expect(firstTicketItem).toBeDisplayed();
        await firstTicketItem.click();

        const headerTitle = await driver.$(
            '//*[@resource-id="undefined-header-title"]',
        );
        await expect(headerTitle).toBeDisplayed();
        await expect(await headerTitle.getText()).toBe("Ride");

        const providerElement = await driver.$('//*[@text="UmobMock"]');
        await expect(providerElement).toBeDisplayed();

        const priceElement = await driver.$('//*[@text="€1.25"]');
        await expect(priceElement).toBeDisplayed();

        const travelCostElement = await driver.$('//*[@text="Travel cost"]');
        await expect(travelCostElement).toBeDisplayed();

        const totalAmountElement = await driver.$('//*[@text="Total amount"]');
        await expect(totalAmountElement).toBeDisplayed();

        const paymentsHeaderElement = await driver.$('//*[@text="Payments"]');
        await expect(paymentsHeaderElement).toBeDisplayed();

        await driver.executeScript("mobile: scrollGesture", [
            {
                left: 100,
                top: 1000,
                width: 200,
                height: 800,
                direction: "down",
                percent: 100.0,
            },
        ]);

        const statusElement = await driver.$('//*[@text="Completed"]');
        await expect(statusElement).toBeDisplayed();

        await driver
            .$('-android uiautomator:new UiSelector().text("GOT IT")')
            .waitForEnabled();

        await driver
            .$('-android uiautomator:new UiSelector().text("GOT IT")')
            .click();
    }

    static async navigateToMyRides() {
        await PageObjects.navigateToMyRides();
    }
}

/**
 * Test Runner with proper error handling
 */
class TestRunner {
    static async runTest(testId, testFunction, targetScooter = null) {
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

            // Include scooter information in test details
            const scooterInfo = targetScooter
                ? `Scooter: ${targetScooter.id} (${targetScooter.coordinates.longitude}, ${targetScooter.coordinates.latitude}) | `
                : "";
            testDetails = `${scooterInfo}Error: ${e.message}`;

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
describe("Umob Scooter Booking Tests", () => {
    let scooters;

    before(async () => {
        scooters = await TestHelpers.fetchScooterCoordinates();
        const credentials = TestHelpers.getCredentials();
        await PageObjects.login({
            username: credentials.username,
            password: credentials.password,
        });

        await driver.terminateApp("com.umob.umob");
    });

    beforeEach(async () => {
        await driver.activateApp("com.umob.umob");
    });

    afterEach(async () => {
        await driver.terminateApp("com.umob.umob");
    });

    it("Positive Scenario: Book Mocked Umob Scooter Successfully", async () => {
        const targetScooter = TestHelpers.findScooterById(
            scooters,
            "UmobMock:QZGKL2BP2CI45_ROTTERDAM_EBIKE",
        );

        await TestRunner.runTest(
            "d9a5953f-e2ab-42f4-9193-ed2fece1bd08",
            async () => {
                await TestHelpers.setLocationAndRestartApp(
                    targetScooter.coordinates.longitude,
                    targetScooter.coordinates.latitude,
                );
                console.log(
                    `Scooter coordinates set to: ${targetScooter.coordinates.longitude}, ${targetScooter.coordinates.latitude}`,
                );

                await AppiumHelpers.clickCenterOfScreen();
                await ScooterBookingActions.selectPaymentMethod();
                await ScooterBookingActions.startTrip();
                await driver.pause(10000);

                await ScooterBookingActions.endTrip();
                await driver.pause(10000);

                await ScooterBookingActions.handleTripCompletion();
                await ScooterBookingActions.navigateToMyRides();
                await ScooterBookingActions.verifyRideDetails();
            },
            targetScooter,
        );
    });

    it("Negative Scenario: Vehicle Not Operational Error", async () => {
        const targetScooter = TestHelpers.findScooterById(
            scooters,
            "UmobMock:SCOOTER_UNLOCK_ERROR_VEHICLE_NOT_OPERATIONAL",
        );

        await TestRunner.runTest(
            "ed09a7fa-5dd5-40df-b9d2-8624f46ba77b",
            async () => {
                await TestHelpers.setLocationAndRestartApp(
                    targetScooter.coordinates.longitude,
                    targetScooter.coordinates.latitude,
                );

                await AppiumHelpers.clickCenterOfScreen();
                await ScooterBookingActions.selectPaymentMethod();
                await ScooterBookingActions.startTrip();

                await PageObjects.waitForErrorMessage(
                    "VEHICLE_NOT_OPERATIONAL (60000)",
                );
            },
            targetScooter,
        );
    });

    it("Negative Scenario: User Blocked Error", async () => {
        const targetScooter = TestHelpers.findScooterById(
            scooters,
            "UmobMock:SCOOTER_UNLOCK_ERROR_USER_BLOCKED",
        );

        await TestRunner.runTest(
            "6a795f12-ef0e-441b-8922-24b3cf1c35cb",
            async () => {
                await TestHelpers.setLocationAndRestartApp(
                    targetScooter.coordinates.longitude,
                    targetScooter.coordinates.latitude,
                );

                await AppiumHelpers.clickCenterOfScreen();
                await ScooterBookingActions.selectPaymentMethod();
                await ScooterBookingActions.startTrip();

                await PageObjects.waitForErrorMessage("USER_BLOCKED (60000)");
            },
            targetScooter,
        );
    });

    it("Negative Scenario: Trip Geo Error", async () => {
        const targetScooter = TestHelpers.findScooterById(
            scooters,
            "UmobMock:SCOOTER_LOCK_ERROR_TRIP_GEO_ERROR",
        );

        await TestRunner.runTest(
            "0936a98c-92e6-45da-a673-22d127c1a7d5",
            async () => {
                await TestHelpers.setLocationAndRestartApp(
                    targetScooter.coordinates.longitude,
                    targetScooter.coordinates.latitude,
                );

                await AppiumHelpers.clickCenterOfScreen();
                await ScooterBookingActions.selectPaymentMethod();
                await ScooterBookingActions.startTrip();
                await driver.pause(10000);

                await ScooterBookingActions.endTrip();

                await driver
                    .$(
                        '-android uiautomator:new UiSelector().textContains("TRIP_GEO_ERROR (60000)")',
                    )
                    .waitForDisplayed();

                // Handle retry attempts
                for (let i = 0; i < 3; i++) {
                    await PageObjects.clickRetryButton();
                    await driver.pause(5000);
                }

                await driver.pause(10000);

                await PageObjects.gotItButton.waitForEnabled();
                await PageObjects.gotItButton.click();
                await PageObjects.notNowButton.waitForEnabled();
                await PageObjects.notNowButton.click();

                await ScooterBookingActions.navigateToMyRides();
                await ScooterBookingActions.verifyRideDetails();
            },
            targetScooter,
        );
    });
});
