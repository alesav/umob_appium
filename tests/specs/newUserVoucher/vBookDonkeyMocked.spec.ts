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
const USER = process.env.TEST_USER || "new36";

//////////////////////////////////////////////////////////////////////////////////////////////////////

describe("Donkey Bike Booking Test with unlimited multi voucher", () => {
    before(async () => {
        const credentials = getCredentials(ENV, USER);
        await PageObjects.login({
            username: credentials.username,
            password: credentials.password,
        });


        const longitude = 4.4734301;
        const latitude = 51.9145956;

        await AppiumHelpers.setLocationAndRestartApp(longitude, latitude);
        await driver.pause(3000);
    });

    beforeEach(async () => {
        await driver.activateApp("com.umob.umob");
    });

    it("Book Donkey UMOB Bike 20 with multi voucher", async () => {
        const testId = "5599063f-c9d2-427c-89eb-bcc23d3c669f";
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {

            await driver.pause(5000);

            // Get screen dimensions for click positioning
            const { width, height } = await driver.getWindowSize();
            const centerX = Math.round(width / 2);



            //Click on middle of the screen
            await AppiumHelpers.clickCenterOfScreen();


            // Click UMOB Bike 20 button
            const umob20Button = await driver.$(
                '-android uiautomator:new UiSelector().text("UMOB Bike 1 1")',
            );
            await expect(umob20Button).toBeDisplayed();
            await umob20Button.click();

            //verify that new user voucher is visible
            const voucher = await driver.$(
                '-android uiautomator:new UiSelector().textContains("multi")',
            );
            await expect(voucher).toBeDisplayed();

            //verify that payment card is displayed
            const selectPayment = await driver.$(
                '-android uiautomator:new UiSelector().text("**** **** 1115")',
            );
            await expect(selectPayment).toBeDisplayed();

            //click to choose limitless voucher
            await voucher.click();
            await driver.pause(2000);

            //confirm that you can choose payment without vouchers and select limitless voucher "multi1"
            const noVoucher = await driver.$(
                '-android uiautomator:new UiSelector().text("No voucher")',
            );
            await expect(noVoucher).toBeDisplayed();

            const multiVoucher = await driver.$(
                '-android uiautomator:new UiSelector().textContains("multi")',
            );
            await expect(multiVoucher).toBeDisplayed();
            await multiVoucher.click();
            await driver.pause(2000);

            //verify that we are on a booking screen and limitless voucher selected
            await expect(selectPayment).toBeDisplayed();
            await expect(multiVoucher).toBeDisplayed();


            await driver.pause(2000);
            await driver.performActions([
                {
                    type: "pointer",
                    id: "finger1",
                    parameters: { pointerType: "touch" },
                    actions: [
                        {
                            type: "pointerMove",
                            duration: 0,
                            x: width / 4,
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
            await driver.pause(2000);

            // Click continue button
            await driver.pause(5000);
            const continueButton = await driver.$(
                'android=new UiSelector().text("START TRIP")',
            );
            await expect(continueButton).toBeDisplayed();
            await expect(continueButton).toBeEnabled();

            await continueButton.click();

            await driver.pause(3000);

            //there is no permission in github actions
            //allow permission
            const permission = await driver.$(
                "id:com.android.permissioncontroller:id/permission_allow_button",
            );
            await expect(permission).toBeDisplayed();
            await permission.click();
            await driver.pause(3000);


            // await driver.pause(2000);
            await driver.performActions([
                {
                    type: "pointer",
                    id: "finger1",
                    parameters: { pointerType: "touch" },
                    actions: [
                        {
                            type: "pointerMove",
                            duration: 0,
                            x: width / 25,
                            y: height * 0.66,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        {
                            type: "pointerMove",
                            duration: 1000,
                            x: width / 25,
                            y: height * 0.2,
                        },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);
            await driver.pause(3000);

            //click to start and unlock the bike
            const umob20Button1 = await driver.$(
                '-android uiautomator:new UiSelector().text("START TRIP")',
            );
            await expect(umob20Button1).toBeDisplayed();
            await driver.pause(1000);
            await expect(umob20Button1).toBeEnabled();
            await umob20Button1.click();

            const umobText1 = await driver.$(
                '-android uiautomator:new UiSelector().text("Use the handle to open the lock")',
            );
            await expect(umobText1).toBeDisplayed();

            const umobText2 = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Pull the lock from")',
            );
            await expect(umobText2).toBeDisplayed();

            await driver.performActions([
                {
                    type: "pointer",
                    id: "finger6",
                    parameters: { pointerType: "touch" },
                    actions: [
                        {
                            type: "pointerMove",
                            duration: 0,
                            x: width / 2,
                            y: height * 0.7,
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

            const continueBtn = await driver.$(
                '-android uiautomator:new UiSelector().textContains("CONTINUE")',
            );
            await expect(continueBtn).toBeDisplayed();
            await continueBtn.click();

            //pause for ride duration
            await driver.pause(8000);

            // Click end trip button
            const endTripButton = await driver.$(
                "accessibility id:endTrip-text",
            );
            await endTripButton.click();


            await driver.pause(2000);
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
                            y: height * 0.7,
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

            //verify that main map screen is displayed
            await PageObjects.clickAccountButton();

            //verify that my account screen is displayed
            const myRides = await driver.$(
                '-android uiautomator:new UiSelector().text("My rides")',
            );
            await expect(myRides).toBeDisplayed();


            //click on my rides and tickets
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
