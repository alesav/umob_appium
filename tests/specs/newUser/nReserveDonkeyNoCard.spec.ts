import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import AppiumHelpers from "../../helpers/AppiumHelpers.js";
import { getCredentials, executeTest } from "../../helpers/TestHelpers.js";

const ENV = process.env.TEST_ENV || "test";
const USER = process.env.TEST_USER || "newUser";

describe("Trying to Book Donkey bike by a New User Without a Card", () => {
    before(async () => {
        const credentials = getCredentials(ENV, USER);

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

        await executeTest(testId, async () => {
            // Set initial location
            await AppiumHelpers.setLocationAndRestartApp(4.474431, 51.91564);
            await driver.pause(5000);

            // Get screen dimensions for click positioning
            const { width, height } = await driver.getWindowSize();

            // Click on middle of the screen
            //await AppiumHelpers.clickCenterOfScreen();

            // get center of the map (not the center of the screen!)
            const { x, y } = await AppiumHelpers.getMapCenterCoordinates();
            await driver.pause(3000);

            // CLick on map center (operator located in the center of the map)
            await driver.execute("mobile: clickGesture", { x, y });

            await driver.pause(2000);

            // Click UMOB Bike 20 button
            const umob20Button = await driver.$(
                '-android uiautomator:new UiSelector().text("UMOB Bike 2 1")',
            );
            await umob20Button.click();

            // Verify that new user voucher is visible
            const voucher = await driver.$(
                '-android uiautomator:new UiSelector().text("New User Donkey Republic")',
            );
            await expect(voucher).toBeDisplayed();

            // Verify that select payment method is displayed
            const selectPayment = await driver.$(
                '-android uiautomator:new UiSelector().text("Select payment method")',
            );
            await expect(selectPayment).toBeDisplayed();

            // INDIVIDUAL SCROLL (DO NOT MODIFY)
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
                'android=new UiSelector().text("Start Trip")',
            );
            await expect(continueButton).toBeDisplayed();
            await expect(continueButton).toBeEnabled();

            await continueButton.click();

            await driver.pause(2000);

            // Verify header and offer for choosing payment method
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

            // INDIVIDUAL SCROLL (DO NOT MODIFY)
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

            // There is no google pay in github actions emulated mobile device
            const googlePay = await driver.$(
                '-android uiautomator:new UiSelector().text("Google Pay")',
            );
            await expect(googlePay).toBeDisplayed();

            const payPal = await driver.$(
                '-android uiautomator:new UiSelector().text("PayPal")',
            );
            await expect(payPal).toBeDisplayed();

            await expect(PageObjects.closeButton).toBeDisplayed();
            await PageObjects.closeButton.click();
        });
    });

    afterEach(async () => {
        await driver.terminateApp("com.umob.umob");
    });
});
