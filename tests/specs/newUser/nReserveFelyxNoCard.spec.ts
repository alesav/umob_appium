import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import AppiumHelpers from "../../helpers/AppiumHelpers.js";
import { getCredentials, executeTest, ENV } from "../../helpers/TestHelpers.js";
import {
    fetchScooterCoordinates,
    findFelyxScooter,
    type Scooter,
} from "../../helpers/ScooterCoordinates.js";

const TEST_USER = "newUser";

describe("Trying to Reserve Felyx by a New User Without a Card", () => {
    let scooters: Scooter[];

    before(async () => {
        const credentials = getCredentials(ENV, TEST_USER);

        await PageObjects.login({
            username: credentials.username,
            password: credentials.password,
        });

        // Fetch scooter coordinates before running tests
        scooters = await fetchScooterCoordinates();

        const longitude = 4.46893572807312;
        const latitude = 51.91743146298927;

        await AppiumHelpers.setLocationAndRestartApp(longitude, latitude);
        await driver.pause(3000);
    });

    beforeEach(async () => {
        await driver.activateApp("com.umob.umob");
    });

    it("Trying to Reserve Felyx Moped Without a Card", async () => {
        const testId = "f8c39b91-153c-431c-8c49-8bf1246f7416";

        await executeTest(testId, async () => {
            const targetScooter = findFelyxScooter(scooters);
            await driver.pause(3000);

            // Set location to specific scooter coordinates
            await AppiumHelpers.setLocationAndRestartApp(
                targetScooter.coordinates.longitude,
                targetScooter.coordinates.latitude,
            );
            await driver.pause(5000);

            // Click on middle of the screen
            //await AppiumHelpers.clickCenterOfScreen();

            // get center of the map (not the center of the screen!)
            const { x, y } = await AppiumHelpers.getMapCenterCoordinates();
            await driver.pause(3000);

            // CLick on map center (operator located in the center of the map)
            await driver.execute("mobile: clickGesture", { x, y });
            await driver.pause(3000);

            // Verify that payment method not set up
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

            // Verify header and offer for choosing payment method
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

            const googlePay = await driver.$(
                '-android uiautomator:new UiSelector().text("Google Pay")',
            );
            await expect(googlePay).toBeDisplayed();

            const payPal = await driver.$(
                '-android uiautomator:new UiSelector().text("PayPal")',
            );
            await expect(payPal).toBeDisplayed();

            // Close the popup
            const closePopup = await driver.$(
                "id:com.umob.umob:id/imageView_close",
            );
            await closePopup.click();

            // Verify start trip button is enabled AND CLICK
            await driver
                .$('-android uiautomator:new UiSelector().text("START TRIP")')
                .waitForEnabled();
            await driver
                .$('-android uiautomator:new UiSelector().text("START TRIP")')
                .click();

            // Verify header and offer for choosing payment method again
            await expect(paymentHeader).toBeDisplayed();
            await expect(cards).toBeDisplayed();
            await expect(bancontactCard).toBeDisplayed();
            await expect(googlePay).toBeDisplayed();
            await expect(payPal).toBeDisplayed();

            const closeBtn = await driver.$("accessibility id:Close");
            await expect(closeBtn).toBeDisplayed();
            await closeBtn.click();
        });
    });

    afterEach(async () => {
        await driver.terminateApp("com.umob.umob");
    });
});
