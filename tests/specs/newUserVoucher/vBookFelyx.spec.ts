import { execSync } from "child_process";
import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import submitTestRun from "../../helpers/SendResults.js";
import AppiumHelpers from "../../helpers/AppiumHelpers.js";
import { fetchScooterCoordinates, findFelyxScooter, type Scooter } from "../../helpers/ScooterCoordinates.js";
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
const USER = process.env.TEST_USER || "new15";

//////////////////////////////////////////////////////////////////////////////////////////////////////

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

/////////////////////////////////////////////////////////////////////////////////
describe("Felyx Booking Test with unlimited multi voucher", () => {
    let scooters: Scooter[];

    before(async () => {
        // Fetch scooter coordinates before running tests
        scooters = await fetchScooterCoordinates();

        const credentials = getCredentials(ENV, USER);
        await PageObjects.login({
            username: credentials.username,
            password: credentials.password,
        });

        const targetScooter = findFelyxScooter(scooters);

        // Set location to specific scooter coordinates
        await AppiumHelpers.setLocationAndRestartApp(
            targetScooter.coordinates.longitude,
            targetScooter.coordinates.latitude,
        );
        await driver.pause(3000);
    });

    beforeEach(async () => {
        await driver.activateApp("com.umob.umob");
        // Wait for screen to be loaded
    });

    ////////////////////////////////////////////////////////////////////////////////
    it("Book Felyx moped with multi voucher", async () => {
        const testId = "9a8a6f87-2ccd-42c9-9676-b1bd0b8b27a3";
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            await driver.pause(2000);


            const { centerX, centerY } = await getScreenCenter();


            //Click on middle of the screen
            await AppiumHelpers.clickCenterOfScreen();


            await driver.pause(3000);

            //verify that Euro simbol is displayed
            const euroSimbol = await driver.$(
                '-android uiautomator:new UiSelector().textContains("€")',
            );
            await expect(euroSimbol).toBeDisplayed();

            //verify that limitless multi user's vaucher is visible
            const vaucher = await driver.$(
                '-android uiautomator:new UiSelector().textContains("multi")',
            );
            await expect(vaucher).toBeDisplayed();

            //verify that payment card is displayed
            const selectPayment = await driver.$(
                '-android uiautomator:new UiSelector().text("**** **** 1115")',
            );
            await expect(selectPayment).toBeDisplayed();

            //verify start trip button is enabled AND CLICK
            const startTrip = await driver.$(
                '-android uiautomator:new UiSelector().text("START TRIP")',
            );
            await startTrip.waitForDisplayed();
            await startTrip.waitForEnabled();
            await driver.pause(8000);
            await startTrip.click();

            await driver.pause(8000);


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

            //verify instruction
            const instruction = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Open the top case by pressing the red button")',
            );
            await expect(instruction).toBeDisplayed();

            //verify open helmet case button
            const openCase = await driver.$(
                '-android uiautomator:new UiSelector().text("OPEN HELMET CASE")',
            );
            await expect(openCase).toBeDisplayed();

            //verify continue button
            await driver.pause(2000);
            const continueB = await driver.$(
                '-android uiautomator:new UiSelector().text("CONTINUE")',
            );
            await expect(continueB).toBeDisplayed();
            await continueB.click();

            //verify pause button
            const pauseButton = await driver.$(
                '-android uiautomator:new UiSelector().text("PAUSE")',
            );
            await expect(pauseButton).toBeDisplayed();
            await driver.pause(10000);

            // Click End Trip
            await driver
                .$('-android uiautomator:new UiSelector().text("END TRIP")')
                .waitForEnabled();

            await driver
                .$('-android uiautomator:new UiSelector().text("END TRIP")')
                .click();

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
                '-android uiautomator:new UiSelector().text("OPEN HELMET CASE")',
            );
            await expect(helmetButton).toBeDisplayed();
            await driver.pause(3000);

            //verify and click continue button
            const continueB2 = await driver.$(
                '-android uiautomator:new UiSelector().text("CONTINUE")',
            );
            await expect(continueB2).toBeDisplayed();
            await continueB2.click();

            await driver.pause(5000);

            //allow permissions for take a photo

            const permission = await driver.$(
                "id:com.android.permissioncontroller:id/permission_allow_foreground_only_button",
            );
            await expect(permission).toBeDisplayed();
            await permission.click();
            await driver.pause(5000);

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

            //take a picture (first option)
            // const photoButton = await driver.$("~endTrip");
            // await expect(photoButton).toBeDisplayed();
            // await driver.pause(2000);
            // await photoButton.click();
            // Tap a button for taking photo

            //take a picture (second option)
            const photoButton = await driver.$(
                '-android uiautomator:new UiSelector().resourceId("buttonContainer")',
            );
            await expect(photoButton).toBeDisplayed();
            await driver.pause(2000);
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
                '-android uiautomator:new UiSelector().text("RETAKE")',
            );
            await expect(retakeButton).toBeDisplayed();

            //verify use picture button
            const useButton = await driver.$(
                '-android uiautomator:new UiSelector().text("USE PICTURE")',
            );
            await expect(useButton).toBeDisplayed();
            await driver.pause(2000);
            await useButton.click();

            await driver.pause(2000);


            //click got it button
            const gotIt = await driver.$(
                '-android uiautomator:new UiSelector().text("GOT IT!")',
            );
            await expect(gotIt).toBeDisplayed();
            await gotIt.click();

            // Click not now button
            // const notNowButton = await driver.$(
            //     '-android uiautomator:new UiSelector().text("NOT NOW")',
            // );
            // await expect(notNowButton).toBeDisplayed();
            // await notNowButton.click();
            // await driver.pause(2000);

            //verify that main map screen is displayed
            await PageObjects.clickAccountButton();

            //verify that my account screen is displayed
            const myRides = await driver.$(
                '-android uiautomator:new UiSelector().text("My rides")',
            );
            await expect(myRides).toBeDisplayed();


            //click on my rides and tickets
            await driver.pause(2000);
            await myRides.click();

            //verify that payment is visible in my rides and tickets screen and it is 0 Euro
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
