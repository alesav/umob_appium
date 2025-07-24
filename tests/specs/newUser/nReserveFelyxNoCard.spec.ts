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
const USER = process.env.TEST_USER || "newUser";

//////////////////////////////////////////////////////////////////////////////////////////////////////////

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

///////////////////////////////////////////////////////////////////////////////////////

describe("Trying to Reserve Felyx by a New User Without a Card", () => {
    let scooters: Scooter[];

    before(async () => {
        const credentials = getCredentials(ENV, USER);

        // await PageObjects.login(credentials);
        await PageObjects.login({
            username: credentials.username,
            password: credentials.password,
        });

        // Fetch scooter coordinates before running tests
        scooters = await fetchScooterCoordinates();

        // await PageObjects.login({ username:'new11@gmail.com', password: '123Qwerty!' });

        const longitude = 4.46893572807312;
        const latitude = 51.91743146298927;

        await AppiumHelpers.setLocationAndRestartApp(longitude, latitude);
        await driver.pause(3000);
    });

    beforeEach(async () => {
        await driver.activateApp("com.umob.umob");
        // Wait for screen to be loaded
    });

    ////////////////////////////////////////////////////////////////////////////////
    it("Trying to Reserve Felyx Moped Without a Card", async () => {
        const testId = "f8c39b91-153c-431c-8c49-8bf1246f7416";
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            // const targetScooter = scooters.find(
            //   scooter => scooter.id === 'Check:b76ce2d0-7fe5-4914-9d1b-580928859efd'
            // );
            const targetScooter = findFelyxScooter(scooters);
            await driver.pause(3000);
            // Set location to specific scooter coordinates
            await AppiumHelpers.setLocationAndRestartApp(
                targetScooter.coordinates.longitude,
                targetScooter.coordinates.latitude,
            );
            await driver.pause(5000);

            // Filter not needed results
            //await applyFilters();

            // Click on scooter marker
            // await driver
            //   .$(
            //     '-android uiautomator:new UiSelector().className("android.view.ViewGroup").instance(15)'
            //   )
            //   .click();

            const { centerX, centerY } = await getScreenCenter();

            // Click exactly in the center
            // await driver
            //   .action("pointer")
            //   .move({ x: centerX, y: centerY })
            //   .down()
            //   .up()
            //   .perform();

            //Click on middle of the screen
            await AppiumHelpers.clickCenterOfScreen();

            // Click Understood
            // await driver.$(
            //   '-android uiautomator:new UiSelector().text("UNDERSTOOD")'
            // ).waitForEnabled();

            // await driver.$(
            //   '-android uiautomator:new UiSelector().text("UNDERSTOOD")'
            // ).click();
            await driver.pause(3000);

            //verify that payment method not set up
            await driver
                .$(
                    '-android uiautomator:new UiSelector().text("Select payment method")',
                )
                .waitForDisplayed();

            // Click Reserve
            await driver
                .$('-android uiautomator:new UiSelector().text("RESERVE")')
                .waitForEnabled();

            await driver.pause(5000);

            const button = await driver.$(
                '-android uiautomator:new UiSelector().text("RESERVE")',
            );
            await button.click();

            //verify header and offer for choosing payment method
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

            //there is no google pay in github actions
            // const googlePay = await driver.$('-android uiautomator:new UiSelector().text("Google Pay")');
            // await expect(googlePay).toBeDisplayed();

            const payPal = await driver.$(
                '-android uiautomator:new UiSelector().text("PayPal")',
            );
            await expect(payPal).toBeDisplayed();

            //close the popup
            const closePopup = await driver.$(
                "id:com.umob.umob:id/imageView_close",
            );
            await closePopup.click();

            //verify start trip button is enabled AND CLICK
            await driver
                .$('-android uiautomator:new UiSelector().text("START TRIP")')
                .waitForEnabled();

            await driver
                .$('-android uiautomator:new UiSelector().text("START TRIP")')
                .click();

            //verify header and offer for choosing payment method
            //const paymentHeader = await driver.$("id:com.umob.umob:id/payment_method_header_title");
            await expect(paymentHeader).toBeDisplayed();

            //const cards = await driver.$('-android uiautomator:new UiSelector().text("Cards")');
            await expect(cards).toBeDisplayed();

            //const bancontactCard = await driver.$('-android uiautomator:new UiSelector().text("Bancontact card")');
            await expect(bancontactCard).toBeDisplayed();

            //const googlePay = await driver.$('-android uiautomator:new UiSelector().text("Google Pay")');
            //await expect(googlePay).toBeDisplayed();

            //const payPal = await driver.$('-android uiautomator:new UiSelector().text("PayPal")');
            await expect(payPal).toBeDisplayed();

            const closeBtn = await driver.$("accessibility id:Close");
            await expect(closeBtn).toBeDisplayed();
            await closeBtn.click();

            /*
                    // Click End Trip
                    await driver.$(
                      '-android uiautomator:new UiSelector().text("CANCEL")'
                    ).waitForEnabled();
                
                    await driver.$(
                      '-android uiautomator:new UiSelector().text("CANCEL")'
                    ).click();

                    await driver.pause(4000);

          // Wait for Home screen to be loaded
          await PageObjects.clickAccountButton();

          await driver.$(
            '-android uiautomator:new UiSelector().text("My Account")'
          ).isDisplayed();
          await driver.pause(2000);

*/
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
