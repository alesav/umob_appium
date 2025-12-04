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
const USER = process.env.TEST_USER || "new61";

//////////////////////////////////////////////////////////////////////////////////////////////////////

const API_URL = "https://backend-test.umobapp.com/api/tomp/mapboxmarkers";
const AUTH_TOKEN =
    "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkFGNkFBNzZCMUFEOEI4QUJCQzgzRTAzNjBEQkQ4MkYzRjdGNDE1MDMiLCJ4NXQiOiJyMnFuYXhyWXVLdThnLUEyRGIyQzhfZjBGUU0iLCJ0eXAiOiJhdCtqd3QifQ.eyJpc3MiOiJodHRwczovL2JhY2tlbmQtdGVzdC51bW9iYXBwLmNvbS8iLCJleHAiOjE3NDUyMzc4ODUsImlhdCI6MTczNzQ2MTg4NSwiYXVkIjoidU1vYiIsInNjb3BlIjoib2ZmbGluZV9hY2Nlc3MgdU1vYiIsImp0aSI6IjI0ZGM1OTVlLWQwM2UtNDU3Ny04MGVmLWQ4MDI0NGM0NzFhZCIsInN1YiI6IjA1Nzg4NjE2LTc3NDUtNDJiZC05MjgyLTI2ZGM3MmU2OWJhNiIsInVuaXF1ZV9uYW1lIjoibmV3NkBnbWFpbC5jb20iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJuZXc2QGdtYWlsLmNvbSIsImdpdmVuX25hbWUiOiJMaW1pdGxlc3MgIiwiZmFtaWx5X25hbWUiOiJOZXc2IiwiZW1haWwiOiJuZXc2QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoiRmFsc2UiLCJwaG9uZV9udW1iZXIiOiIrMzE2MTY1NjE5MDkiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOiJUcnVlIiwib2lfcHJzdCI6InVNb2JfQXBwX09wZW5JZGRpY3QiLCJvaV9hdV9pZCI6IjM1MTY5ZDdmLTI4NDEtYTJlMi02OWQzLTNhMTc5YWY5NDI3NiIsImNsaWVudF9pZCI6InVNb2JfQXBwX09wZW5JZGRpY3QiLCJvaV90a25faWQiOiI5MDJiM2E4Ny1hMDVkLWI2MmQtY2UwNi0zYTE3OWFmOTQyOTUifQ.1A3cHFkl9yVIdO9eG4dFLDCu3JnfY3_nl59P8P2i038NAkiR1wlFZBfq2nNUuikKXnwFiqsDQwSzWjkdvb5zeyxKtcRTmD_f6-VZRDuYiSAa16Hr-panm65tQWsyqaWdEIjG9qFHhKxNj0f69f03V6sKOcOtTsJ03PJBKyrAzrg2R_Nb7Eeyer1XSlabfOpnHVcjdnT2wd9Ykun85KkBfRsKTxC4aRzqxVu84MwOr-RNwHr8JOvUI45n407IwAXKwo2MYNfHKDEm3JiUgVTm6FSWU3F5TP0ln9XvogcNnc54qmV3f09VrUk3XW3yO18GEbZeR0mLufUS4pjje-1Sww";

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

// Filter mopeds and stations
const applyFilters = async () => {
    // Click ? icon
    await driver
        .$(
            '-android uiautomator:new UiSelector().resourceId("home_asset_filter_toggle")',
        )
        .waitForEnabled();

    await driver
        .$(
            '-android uiautomator:new UiSelector().resourceId("home_asset_filter_toggle")',
        )
        .click();

    // Click Moped to unselect it
    await driver
        .$('-android uiautomator:new UiSelector().text("Scooter")')
        .waitForEnabled();

    await driver
        .$('-android uiautomator:new UiSelector().text("Scooter")')
        .click();

    // Click Bike to unselect it
    await driver
        .$('-android uiautomator:new UiSelector().text("Bike")')
        .waitForEnabled();

    await driver
        .$('-android uiautomator:new UiSelector().text("Bike")')
        .click();

    // Click Openbaar vervoer to unselect it
    await driver
        .$('-android uiautomator:new UiSelector().text("Openbaar vervoer")')
        .waitForEnabled();

    await driver
        .$('-android uiautomator:new UiSelector().text("Openbaar vervoer")')
        .click();

    // Minimize drawer
    await driver
        .$(
            '-android uiautomator:new UiSelector().className("com.horcrux.svg.PathView").instance(10)',
        )
        .click();
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
                "App-Version": "1.22959.3.22959",
                "App-Platform": "android",
            },
            body: JSON.stringify({
                regionId: "",
                stationId: "",
                longitude: 4.465013357657082,
                latitude: 51.915053266230686,
                radius: 200.6137310913994,
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
};
/////////////////////////////////////////////////////////////////////////////////
describe("Check Booking Test with unlimited multi voucher", () => {
    let scooters;

    before(async () => {
        // Fetch scooter coordinates before running tests
        scooters = await fetchScooterCoordinates();

        const credentials = getCredentials(ENV, USER);
        await PageObjects.login({
            username: credentials.username,
            password: credentials.password,
        });

        const longitude = 4.465013357657082;
        const latitude = 51.915053266230686;

        await AppiumHelpers.setLocationAndRestartApp(longitude, latitude);
        await driver.pause(3000);
    });

    beforeEach(async () => {
        await driver.activateApp("com.umob.umob");
        // Wait for screen to be loaded
    });

    ////////////////////////////////////////////////////////////////////////////////
    it("Book Check moped with multi voucher. Moped ID Check:b76ce2d0-7fe5-4914-9d1b-580928859efd", async () => {
        const testId = "d4866e43-1015-4cf3-aa2c-2f32b6842f6a";
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            const targetScooter = scooters.find((scooter) =>
                scooter.id.includes("Check"),
            );

            // Set location to specific scooter coordinates
            await AppiumHelpers.setLocationAndRestartApp(
                targetScooter.coordinates.longitude,
                targetScooter.coordinates.latitude,
            );
            await driver.pause(2000);
            await AppiumHelpers.clickCenterOfScreen();

            await driver.pause(4000);

            //verify that Euro simbol is displayed
            const euroSimbol = await driver.$(
                '-android uiautomator:new UiSelector().textContains("€")',
            );
            await expect(euroSimbol).toBeDisplayed();

            //verify pricing (lines are equal to Felyx)
            await PageObjects.felyxPriceInfo();

            //verify that multi voucher is visible
            const vaucher = await driver.$(
                '-android uiautomator:new UiSelector().textContains("multi")',
            );
            await expect(vaucher).toBeDisplayed();

            //verify that payment card is displayed
            const selectPayment = await driver.$(
                '-android uiautomator:new UiSelector().text("**** **** 1115")',
            );
            await expect(selectPayment).toBeDisplayed();

            //click to choose limitless vaucher
            await vaucher.click();

            //confirm that you can choose payment without vauchers and select limitless vaucher "multi"
            const noVaucher = await driver.$(
                '-android uiautomator:new UiSelector().text("No voucher")',
            );
            await expect(noVaucher).toBeDisplayed();

            const multiVaucher = await driver.$(
                '-android uiautomator:new UiSelector().textContains("multi")',
            );
            await expect(multiVaucher).toBeDisplayed();
            await multiVaucher.click();

            // Click for booking
            await PageObjects.startTripButton.waitForEnabled();

            await driver.pause(2000);
            await PageObjects.startTripButton.click();

            //verify grab helmet header
            const grabHelmet = await driver.$(
                '-android uiautomator:new UiSelector().text("Grab the helmet")',
            );
            await expect(grabHelmet).toBeDisplayed();

            //verify anouncement
            const anouncement = await driver.$(
                '-android uiautomator:new UiSelector().textContains("A helmet is mandatory for this scooter.")',
            );
            await expect(anouncement).toBeDisplayed();

            // //verify instruction (not in use in some UI)
            // const instruction = await driver.$(
            //     '-android uiautomator:new UiSelector().textContains("Open the top case by pressing the red button")',
            // );
            // await expect(instruction).toBeDisplayed();
            /*
            //old UI booking procedure

            //verify open helmet case button
            const openCase = await driver.$(
                '-android uiautomator:new UiSelector().text("Open Helmet Case")',
            );
            await expect(openCase).toBeDisplayed();

            //verify continue button
            await driver.pause(3000);
            const continueB = await driver.$(
                '-android uiautomator:new UiSelector().text("Continue")',
            );
            await expect(continueB).toBeDisplayed();
            await continueB.click();

            //verify pause button
            const pauseButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Pause")',
            );
            await expect(pauseButton).toBeDisplayed();
            await driver.pause(3000);

            // Click End Trip
            await PageObjects.endTripButton.waitForEnabled();

            await PageObjects.endTripButton.click();

            await driver.pause(3000);

            //verify anouncement for return helmet
            const helmetBack = await driver.$(
                '-android uiautomator:new UiSelector().text("Return the helmet")',
            );
            await expect(helmetBack).toBeDisplayed();

            //verify helmet putting back instruction
            const instruction2 = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Open the top case by pressing the red button")',
            );
            await expect(instruction2).toBeDisplayed();

            //verify open case button for the helmet
            const helmetButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Open Helmet Case")',
            );
            await expect(helmetButton).toBeDisplayed();
            await driver.pause(4000);

            //verify and click continue button
            const continueB2 = await driver.$(
                '-android uiautomator:new UiSelector().text("Continue")',
            );
            await expect(continueB2).toBeDisplayed();
            await continueB2.click();
*/
            await driver.pause(2000);
            await expect(PageObjects.continueButton).toBeDisplayed();
            await PageObjects.continueButton.click();

            // Verify warning message (not in use in some UI)
            // const helmetWarning = await driver.$(
            //     '-android uiautomator:new UiSelector().text("Helmet on, safety first!")',
            // );
            // await expect(helmetWarning).toBeDisplayed();

            // // Verify continue2 button (not in use in some UI)
            // await driver.pause(2000);
            // await expect(PageObjects.continue2Button).toBeDisplayed();
            // await PageObjects.continue2Button.click();

            // Verify pause button
            await PageObjects.pauseButton.waitForDisplayed();
            await driver.pause(10000);

            // Verify report issue button
            await PageObjects.reportButton.waitForDisplayed();

            //mark arrival button
            await PageObjects.markArrivalButton.waitForDisplayed();
            await PageObjects.markArrivalButton.click();

            // continue instead of end trip button should be tapped in some UI when switching between UI
            // await PageObjects.continueInsteadEndBtn.waitForDisplayed();
            // await PageObjects.continueInsteadEndBtn.click();

            // Verify announcement for return helmet
            const helmetBack = await driver.$(
                '-android uiautomator:new UiSelector().text("Return the helmet")',
            );
            await expect(helmetBack).toBeDisplayed();

            // Verify helmet putting back instruction
            const instruction2 = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Open the top case by pressing the red button")',
            );
            await expect(instruction2).toBeDisplayed();

            // Click 3rd continue button
            await PageObjects.continue3Button.waitForDisplayed();
            await PageObjects.continue3Button.click();

            // // Verify helmet return message (not in use in some UI)
            // const helmetBackmsg = await driver.$(
            //     '-android uiautomator:new UiSelector().text("Return helmet before you end ride")',
            // );
            // await expect(helmetBackmsg).toBeDisplayed();

            // Click 4th continue button (not in use in some UI)
            // await PageObjects.continue4Button.waitForDisplayed();
            // await PageObjects.continue4Button.click();

            // Allow permissions for take a photo
            await expect(PageObjects.whileUsingAppPermission).toBeDisplayed();
            await PageObjects.whileUsingAppPermission.click();
            await driver.pause(5000);

            //allow permissions for take a photo

            // const permission = await driver.$(
            //     "id:com.android.permissioncontroller:id/permission_allow_foreground_only_button",
            // );
            // await expect(permission).toBeDisplayed();
            // await permission.click();
            // await driver.pause(4000);

            //verify parking photo header
            const parkingHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Parking photo required")',
            );
            await expect(parkingHeader).toBeDisplayed();

            //verify photo instruction
            const photoInstruction = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Take a photo of your vehicle to end your ride")',
            );
            await expect(photoInstruction).toBeDisplayed();

            /*
            // Tap a button for taking photo in old UI
            const photoButton = await driver.$(
                '-android uiautomator:new UiSelector().resourceId("buttonContainer")',
            );
            await expect(photoButton).toBeDisplayed();
            await driver.pause(2000);
            await photoButton.click();
*/

            //take a picture in new UI
            const photoButton = await driver.$(
                '-android uiautomator:new UiSelector().className("com.horcrux.svg.CircleView").instance(2)',
            );
            await photoButton.click();

            await driver.pause(4000);
            //verify confirmation for using a picture
            const pictureHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Use this picture?")',
            );
            await expect(pictureHeader).toBeDisplayed();

            //verify parking rules
            const parkingRules = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Please check if the vehicle is parked")',
            );
            await expect(parkingRules).toBeDisplayed();

            //verify retake picture button
            const retakeButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Retake")',
            );
            await expect(retakeButton).toBeDisplayed();

            //verify use picture button
            const useButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Use Picture")',
            );
            await expect(useButton).toBeDisplayed();
            await driver.pause(4000);
            await useButton.click();

            await driver.pause(2000);

            //click got it button
            await PageObjects.gotItButton.waitForDisplayed();
            await PageObjects.gotItButton.click();

            // Click not now button
            // const notNowButton = await driver.$(
            //     '-android uiautomator:new UiSelector().text("NOT NOW")',
            // );
            // await expect(notNowButton).toBeDisplayed();
            // await notNowButton.click();

            // Verify that main map screen is displayed
            await PageObjects.clickAccountButton();

            // Verify that my account screen is displayed
            await expect(PageObjects.myRidesButton).toBeDisplayed();

            // Click on my rides and tickets
            await driver.pause(2000);
            await PageObjects.myRidesButton.click();

            // Verify that payment is visible in my rides and tickets screen and it is 0 Euro
            const lastRide1 = await driver.$(
                '-android uiautomator:new UiSelector().textContains("€0")',
            );
            await expect(lastRide1).toBeDisplayed();
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
        await driver.terminateApp("com.umob.umob");
    });
});
