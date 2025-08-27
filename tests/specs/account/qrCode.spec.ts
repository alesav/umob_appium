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

// Function to load credentials based on environment and user
function getCredentials(
    environment: string = "test",
    userKey: string | null = null,
) {
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
const USER = process.env.TEST_USER || "new12";

///////////////////////////////////////////////////////////////////////////////////////////////////

const API_URL = "https://backend-test.umobapp.com/api/tomp/mapboxmarkers";
const AUTH_TOKEN =
    "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkFGNkFBNzZCMUFEOEI4QUJCQzgzRTAzNjBEQkQ4MkYzRjdGNDE1MDMiLCJ4NXQiOiJyMnFuYXhyWXVLdThnLUEyRGIyQzhfZjBGUU0iLCJ0eXAiOiJhdCtqd3QifQ.eyJpc3MiOiJodHRwczovL2JhY2tlbmQtdGVzdC51bW9iYXBwLmNvbS8iLCJleHAiOjE3NDY2MTAyMTgsImlhdCI6MTczODgzNDIxOCwiYXVkIjoidU1vYiIsInNjb3BlIjoib2ZmbGluZV9hY2Nlc3MgdU1vYiIsImp0aSI6IjE2ZWUzZjRjLTQzYzktNGE3Ni1iOTdhLTYxMGI0NmU0MGM3ZCIsInN1YiI6IjRhNGRkZmRhLTNmMWYtNDEyMS1iNzU1LWZmY2ZjYTQwYzg3MiIsInNlc3Npb25faWQiOiIzNGU4NDZmOC02MmI3LTRiMzgtODkxYS01NjE4NWM4ZDdhOGEiLCJ1bmlxdWVfbmFtZSI6Im5ld0BnbWFpbC5jb20iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJuZXdAZ21haWwuY29tIiwiZ2l2ZW5fbmFtZSI6Ik5ldyIsImZhbWlseV9uYW1lIjoiTmV3IiwiZW1haWwiOiJuZXdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOiJGYWxzZSIsInBob25lX251bWJlciI6IiszMTk3MDEwNTg2NTU2IiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjoiVHJ1ZSIsIm9pX3Byc3QiOiJ1TW9iX0FwcF9PcGVuSWRkaWN0Iiwib2lfYXVfaWQiOiI0ODZkYTI1OS05ZGViLTJmMDQtYmM2OS0zYTE3ZWNjNTY1YTEiLCJjbGllbnRfaWQiOiJ1TW9iX0FwcF9PcGVuSWRkaWN0Iiwib2lfdGtuX2lkIjoiMTQzZGNiNGUtZTFjYi01MmU0LWU5ZWUtM2ExN2VjYzU2NWI5In0.4slYA6XbzRDTNdPJSOmxGlsuetx1IywPojVVMooyyL8Whu4Go6I2V-wspetKGptQnG85X75lg6gWAOYwV5ES5mJQJ4unZuCUW82sDPMNZwEhw_Hzl6UyO5vd3pYJOzry07RcskSwonVKZqipiAEusiYRCvo0AjUx33g5NaRAhXUCE8p_9vdTgSMVjtQkFGpsXih-Hw8rcy7N_HH_LWz-C2ZIA9i2sV3tEHNpTgVhs9Z0WTISirTXdmSolv6JvlqkGETsq0CSFa-0xmhjWU036KB2C5nKBLpUP6AUwibcLDEc0_RoUka-Ia-a4QNVZuzME3pMxIaGOToYf1WLEHPeIQ";

const getScreenCenter = async () => {
    // Get screen dimensions
    const { width, height } = await driver.getWindowSize();

    return {
        centerX: Math.round(width / 2),
        centerY: Math.round(height / 2),
        screenWidth: width,
        screenHeight: height,
    };
};

const fetchScooterCoordinates = async () => {
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
                longitude: 4.481574296951294,
                latitude: 51.92120617890777,
                radius: 1166.6137310913994,
                zoomLevel: 15.25,
                subOperators: [],
                assetClasses: [23, 24, 17],
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
};

/////////////////////////////////////////////////////////////////////////////////

describe("Test for the QR feature", () => {
    let scooters;

    before(async () => {
        scooters = await fetchScooterCoordinates();

        const credentials = getCredentials(ENV, USER);

        // await PageObjects.login(credentials);
        await PageObjects.login({
            username: credentials.username,
            password: credentials.password,
        });

        const targetScooter = scooters.find(
            (scooter) => scooter.id === "UmobMock:ROTTERDAM_MOPED_1",
        );

        await AppiumHelpers.setLocationAndRestartApp(
            targetScooter.coordinates.longitude,
            targetScooter.coordinates.latitude,
        );

        // Check Account is presented
    });

    beforeEach(async () => {
        await driver.activateApp("com.umob.umob");
        // Wait for screen to be loaded
    });

    it("Round QR code button should exist on the main screen and admit text code", async () => {
        const testId = "704e2a56-6252-4334-bf3f-f31ead93a501";

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
            await driver.pause(3000);
            const permissionsPopup = await driver.$(
                '-android uiautomator:new UiSelector().textContains("hile using the app")',
            );

            await permissionsPopup.isDisplayed();
            await permissionsPopup.click();

            //manual instruction
            const instruction = await driver.$(
                '-android uiautomator:new UiSelector().text("Enter the vehicle ID manually")',
            );
            await expect(instruction).toBeDisplayed();

            // Verify back button is present
            const backButton = await driver.$(
                '-android uiautomator:new UiSelector().resourceId("back_button")',
            );
            await expect(backButton).toBeDisplayed();

            //vehicle ID contaner for manual input
            const idContainer = await driver.$(
                "class name:android.widget.EditText",
            );
            await expect(idContainer).toBeDisplayed();
            await idContainer.click();

            //insert vehicle id
            const idSection = await driver.$(
                "class name:android.widget.EditText",
            );
            await idSection.addValue("MOP_YFTZ22");

            //press continue button
            const continueBtn = await driver.$(
                '-android uiautomator:new UiSelector().text("CONTINUE")',
            );
            await expect(continueBtn).toBeDisplayed();
            await continueBtn.click();
            await driver.pause(2000);

            //should start trip button be available
            const srartTrip = await driver.$(
                '-android uiautomator:new UiSelector().text("START TRIP")',
            );
            await expect(srartTrip).toBeDisplayed();

            // Verify back button is present
            //await expect(backButton).toBeDisplayed();
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

    it("should display QR/Scan Vehicle button in the bottom slide window and test for the back buttons", async () => {
        const testId = "ddce8758-2bb3-40ac-8d0e-2a759ccd40ee";

        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            const targetScooter = scooters.find(
                (scooter) => scooter.id === "UmobMock:ROTTERDAM_MOPED_1",
            );

            // Set location to specific scooter coordinates
            await AppiumHelpers.setLocationAndRestartApp(
                targetScooter.coordinates.longitude,
                targetScooter.coordinates.latitude,
            );
            await driver.pause(5000);

            // Verify bottom navigation menu items
            await PageObjects.planTripBtn.waitForExist();
            await PageObjects.promosBtn.waitForExist();

            //click PLAN TRIP button to verify scan vehicle option
            await PageObjects.planTripBtn.click();

            await driver.pause(1000);

            const scanBtn = await driver.$(
                '-android uiautomator:new UiSelector().text("SCAN VEHICLE")',
            );
            await expect(scanBtn).toBeDisplayed();
            await scanBtn.click();

            //manual instruction is visible after pressed scan vehicle button
            const instruction = await driver.$(
                '-android uiautomator:new UiSelector().text("Enter the vehicle ID manually")',
            );
            await expect(instruction).toBeDisplayed();

            // Verify back button is present
            //const backButton2 = await driver.$("accessibility id:back_button");
            const backButton = await driver.$(
                '-android uiautomator:new UiSelector().resourceId("back_button")',
            );
            await expect(backButton).toBeDisplayed();

            //vehicle ID contaner for manual input
            const idContainer = await driver.$(
                "class name:android.widget.EditText",
            );
            await expect(idContainer).toBeDisplayed();
            await idContainer.click();
            await driver.pause(1500);

            //insert vehicle id to dissapear Vehicle ID text
            const idSection = await driver.$(
                "class name:android.widget.EditText",
            );
            await idSection.addValue("MOP_YFTZ22");

            //click back button to go on previous screen
            await backButton.click();
            await driver.pause(1500);

            //verify that screen changed
            const textId = await driver.$(
                '-android uiautomator:new UiSelector().text("Vehicle ID")',
            );
            await expect(textId).toBeDisplayed();

            //click back button to go on previous screen
            await backButton.click();
            await driver.pause(1500);

            //verify that screen changed
            await expect(scanBtn).toBeDisplayed();
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
