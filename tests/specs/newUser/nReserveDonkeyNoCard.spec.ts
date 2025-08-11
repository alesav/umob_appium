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
const USER = process.env.TEST_USER || "newUser";

//////////////////////////////////////////////////////////////////////////////////////////////////////

describe("Trying to Book Donkey bike by a New User Without a Card", () => {
    before(async () => {
        const credentials = getCredentials(ENV, USER);

        // await PageObjects.login(credentials);
        await PageObjects.login({
            username: credentials.username,
            password: credentials.password,
        });


        const longitude = 4.4744301;
        const latitude = 51.9155956;

        await AppiumHelpers.setLocationAndRestartApp(longitude, latitude);
        await driver.pause(3000);
    });

    beforeEach(async () => {
        await driver.activateApp("com.umob.umob");
    });

    it("New User is Trying to Book Donkey UMOB Bike 20 Without a Card", async () => {
        const testId = "a66df007-2bfa-4531-af52-87e3eec81280";
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            // Set initial location 51.91564074928743, 4.4744318279297906
            await AppiumHelpers.setLocationAndRestartApp(4.474431, 51.91564);
            await driver.pause(5000);

            // Get screen dimensions for click positioning
            const { width, height } = await driver.getWindowSize();
            const centerX = Math.round(width / 2);


            //Click on middle of the screen
            await AppiumHelpers.clickCenterOfScreen();

            await driver.pause(2000);

            // Click UMOB Bike 20 button
            const umob20Button = await driver.$(
                '-android uiautomator:new UiSelector().text("UMOB Bike 2 1")',
            );
            await umob20Button.click();

            //verify that new user vaucher is visible
            const vaucher = await driver.$(
                '-android uiautomator:new UiSelector().text("New User Donkey Republic")',
            );
            await expect(vaucher).toBeDisplayed();

            //verify that select payment method is displayed
            const selectPayment = await driver.$(
                '-android uiautomator:new UiSelector().text("Select payment method")',
            );
            await expect(selectPayment).toBeDisplayed();


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

            // Click continue button
            await driver.pause(5000);
            const continueButton = await driver.$(
                'android=new UiSelector().text("START TRIP")',
            );
            await expect(continueButton).toBeDisplayed();
            await expect(continueButton).toBeEnabled();

            await continueButton.click();

            await driver.pause(2000);

            //verify header and offer for choosing payment method
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
            await driver.pause(2000);

            await driver.performActions([
                {
                    type: "pointer",
                    id: "finger2",
                    parameters: { pointerType: "touch" },
                    actions: [
                        {
                            type: "pointerMove",
                            duration: 0,
                            x: width / 2,
                            y: 356,
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
            await driver.pause(2000);

            //there is no google pay in github actions emulated mobile device
            const googlePay = await driver.$('-android uiautomator:new UiSelector().text("Google Pay")');
            await expect(googlePay).toBeDisplayed();

            const payPal = await driver.$(
                '-android uiautomator:new UiSelector().text("PayPal")',
            );
            await expect(payPal).toBeDisplayed();

            const closeBtn = await driver.$("accessibility id:Close");
            await expect(closeBtn).toBeDisplayed();
            await closeBtn.click();
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
