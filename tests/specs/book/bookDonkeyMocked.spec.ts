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
const USER = process.env.TEST_USER || "new45";

describe("Donkey Bike Booking Test", () => {
    before(async () => {
        const credentials = getCredentials(ENV, USER);

        // await PageObjects.login(credentials);
        await PageObjects.login({
            username: credentials.username,
            password: credentials.password,
        });

        const latitude = 51.9155956;
        const longitude = 4.4744301;

        await AppiumHelpers.setLocationAndRestartApp(longitude, latitude);
    });

    beforeEach(async () => {
        await driver.activateApp("com.umob.umob");
    });

    it("Book Donkey UMOB Bike 20", async () => {
        const testId = "4421c5ee-46d9-40d9-867c-0ea5c0a5ddce";
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            await driver.pause(4000);

            // Get screen dimensions for click positioning
            const { width, height } = await driver.getWindowSize();
            const centerX = Math.round(width / 2);

            // Center screen click
            // await driver
            //     .action("pointer")
            //     .move({ x: centerX, y: Math.round(height / 2) })
            //     .down()
            //     .up()
            //     .perform();

            //Click on middle of the screen
            await AppiumHelpers.clickCenterOfScreen();

            // Click UMOB Bike 20 button
            const umob20Button = await driver.$(
                '-android uiautomator:new UiSelector().text("UMOB Bike 0 1")',
            );
            await umob20Button.click();

            //const selectUmob = await driver.$('-android uiautomator:new UiSelector().text("SELECT UMOB BIKE 2 0")');
            //await selectUmob.click();

            /* Click 2cm above bottom edge
    await driver
      .action("pointer")
      .move({ x: centerX, y: height - 20 })
      .down()
      .up()
      .perform(); */

            // Click continue button
            await driver.pause(5000);
            const continueButton = await driver.$(
                'android=new UiSelector().text("START TRIP")',
            );
            await expect(continueButton).toBeDisplayed();
            await expect(continueButton).toBeEnabled();

            await continueButton.click();

            // Handle allow permissions

            const permission = await driver.$(
                "id:com.android.permissioncontroller:id/permission_allow_button",
            );
            await expect(permission).toBeDisplayed();
            await permission.click();
            await driver.pause(2000);

            /*
    await driver.pause(5000);
    //Scroll to bottom
    await driver.executeScript('mobile: scrollGesture', [{
      left: 100,
      top: 1500,
      width: 200,
      height: 100,
      direction: 'down',
      percent: 100
    }]);
    */

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
                            y: height * 0.65,
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

            /*const screen = await driver.getWindowRect();
    const screenWidth = screen.width;
    const screenHeight = screen.height;

    await driver.executeScript('mobile: scrollGesture', [{
      left: screenWidth / 2,  // горизонтальная середина экрана
      top: screenHeight * 0.65,  // точка начала скролла в нижней части экрана
      width: screenWidth / 2,  // ширина области для скролла
      height: screenHeight * 0.15,  // высота области для скролла
      direction: 'down',  // направление скролла
      percent: 100  // полное прокручивание
    }]); */

            // Click 5cm above bottom
            /*await driver
      .action("pointer")
      .move({ x: centerX, y: height - 50 })
      .down()
      .up()
      .perform();*/

            await driver.pause(3000);

            //click to start and unlock the bike
            const umob20Button1 = await driver.$(
                '-android uiautomator:new UiSelector().text("START TRIP")',
            );
            await expect(umob20Button1).toBeDisplayed();
            await driver.pause(1000);
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

            /*
            // Click close button
            const closeButton = await driver.$(
                "accessibility id:closeButton-text",
                
            );
            await closeButton.click();
            */
            // Click got it button
            const gotButton = await driver.$(
                '-android uiautomator:new UiSelector().text("GOT IT!")',
            );
            await expect(gotButton).toBeDisplayed();
            await gotButton.click();

            // Click not now button
            const notNowButton = await driver.$(
                '-android uiautomator:new UiSelector().text("NOT NOW")',
            );
            await expect(notNowButton).toBeDisplayed();
            await notNowButton.click();
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
