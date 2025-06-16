import { execSync } from "child_process";
import submitTestRun from "../../helpers/SendResults.js";
import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to load credentials based on environment and user
function getCredentials(environment = "test", userKey = null) {
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
const USER = process.env.TEST_USER || "4bigfoot+11";

/////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////
describe("Add Payment Method", () => {
    let scooters;

    before(async () => {
        const credentials = getCredentials(ENV, USER);

        // await PageObjects.login(credentials);
        await PageObjects.login({
            username: credentials.username,
            password: credentials.password,
        });
    });

    /*
  before(async () => {

        await PageObjects.login({ username:'4bigfoot+11@gmail.com', password: '123Qwerty!' });


  });

  */

    beforeEach(async () => {
        await driver.activateApp("com.umob.umob");
        // Wait for screen to be loaded
    });

    ////////////////////////////////////////////////////////////////////////////////
    it("Positive Scenario: Add credit card", async () => {
        const testId = "19f3aab0-8cd8-4770-9093-d329714dc817";

        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            await driver.pause(2000);

            // Check Account is presented
            await PageObjects.clickAccountButton();
            await driver.pause(3000);

            //CLick Payment Settings
            await driver
                .$(
                    '-android uiautomator:new UiSelector().text("Payment settings")',
                )
                .waitForDisplayed();
            await driver.pause(2000);
            await driver
                .$(
                    '-android uiautomator:new UiSelector().text("Payment settings")',
                )
                .click();

            // looking for "REMOVE PAYMENT METHOD"
            try {
                const removeButton = await driver.$(
                    '-android uiautomator:new UiSelector().text("REMOVE PAYMENT METHOD")',
                );

                // short timeout
                await removeButton.waitForDisplayed({ timeout: 5000 });

                // if we are here then button exists and we click it
                await removeButton.click();
                await driver.pause(4000);
            } catch (error) {
                // if the button not found then go further
            }

            // anyway looking for the "ADD PAYMENT METHOD" button and click it
            await driver
                .$(
                    '-android uiautomator:new UiSelector().text("ADD PAYMENT METHOD")',
                )
                .waitForDisplayed();
            await driver.pause(2000);
            await driver
                .$(
                    '-android uiautomator:new UiSelector().text("ADD PAYMENT METHOD")',
                )
                .click();

            //CLick Remove payment method
            /*
           await driver.$(
            '-android uiautomator:new UiSelector().text("REMOVE PAYMENT METHOD")'
          ).waitForDisplayed();
          await driver.$(
            '-android uiautomator:new UiSelector().text("REMOVE PAYMENT METHOD")'
          ).click();
          */

            //CLick Cards
            await driver
                .$('-android uiautomator:new UiSelector().text("Cards")')
                .waitForDisplayed();
            await driver
                .$('-android uiautomator:new UiSelector().text("Cards")')
                .click();

            const el1 = await driver.$(
                "id:com.umob.umob:id/editText_cardNumber",
            );
            await el1.click();
            await el1.addValue("5555341244441115");
            const el2 = await driver.$(
                "id:com.umob.umob:id/editText_expiryDate",
            );
            await el2.click();
            await el2.addValue("0330");
            const el3 = await driver.$(
                "id:com.umob.umob:id/editText_securityCode",
            );
            await el3.click();
            await el3.addValue("737");
            const el4 = await driver.$(
                "id:com.umob.umob:id/editText_cardHolder",
            );
            await el4.click();
            await el4.addValue("Test Account");
            const el5 = await driver.$("id:com.umob.umob:id/payButton");
            await el5.click();

            //Assert Remove payment method button is displayed
            const removeBtn = await driver.$(
                '-android uiautomator:new UiSelector().text("REMOVE PAYMENT METHOD")',
            );
            await removeBtn.waitForDisplayed();
            await driver.pause(2000);
            await removeBtn.click();

            //  await driver.pause(5000);
            //  const el6 = await driver.$("accessibility id:back_button");
            //  await el6.click();

            //CLick Payment Settings
            await driver
                .$(
                    '-android uiautomator:new UiSelector().text("Payment settings")',
                )
                .waitForDisplayed();
            await driver
                .$(
                    '-android uiautomator:new UiSelector().text("Payment settings")',
                )
                .click();

            //Verify Add payment method
            await driver
                .$(
                    '-android uiautomator:new UiSelector().text("ADD PAYMENT METHOD")',
                )
                .waitForDisplayed();
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
