import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import AppiumHelpers from "../../helpers/AppiumHelpers.js";
import { getCredentials, executeTest } from "../../helpers/TestHelpers.js";

const ENV = process.env.TEST_ENV || "test";
const USER = process.env.TEST_USER || "new36";

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

        await executeTest(testId, async () => {
            await driver.activateApp("com.umob.umob");
            await driver.pause(5000);

            const { width, height } = await driver.getWindowSize();

            await PageObjects.locationButton.click();
            await driver.pause(5000);

            await AppiumHelpers.clickCenterOfScreen();

            const umob20Button = await driver.$(
                '-android uiautomator:new UiSelector().text("UMOB Bike 1 1")',
            );
            await expect(umob20Button).toBeDisplayed();
            await umob20Button.click();

            const voucher = await driver.$(
                '-android uiautomator:new UiSelector().textContains("multi")',
            );
            await expect(voucher).toBeDisplayed();

            const selectPayment = await driver.$(
                '-android uiautomator:new UiSelector().text("**** **** 1115")',
            );
            await expect(selectPayment).toBeDisplayed();

            await voucher.click();
            await driver.pause(2000);

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

            await expect(selectPayment).toBeDisplayed();
            await expect(multiVoucher).toBeDisplayed();
            await driver.pause(3000);

            const timeText = await driver.$(
                '-android uiautomator:new UiSelector().textContains("15 minutes")',
            );
            await expect(timeText).toBeDisplayed();

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

            await driver.pause(5000);
            await PageObjects.startTripButton.waitForDisplayed();
            await driver.pause(3000);
            await PageObjects.startTripButton.click();
            await driver.pause(3000);

            await expect(PageObjects.androidPermissionButton).toBeDisplayed();
            await PageObjects.androidPermissionButton.click();
            await driver.pause(3000);

            // INDIVIDUAL SCROLL (DO NOT MODIFY)
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

            await expect(PageObjects.donkeyStartButton2).toBeDisplayed();
            await driver.pause(1000);
            await expect(PageObjects.donkeyStartButton2).toBeEnabled();
            await PageObjects.donkeyStartButton2.click();

            await expect(PageObjects.donkeyLockText1).toBeDisplayed();

            await expect(PageObjects.donkeyLockText2).toBeDisplayed();

            // INDIVIDUAL SCROLL (DO NOT MODIFY)
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

            await expect(PageObjects.continueButton).toBeDisplayed();
            await PageObjects.continueButton.click();

            await driver.pause(8000);

            await PageObjects.endTripText.click();

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

            await PageObjects.gotItButton.waitForDisplayed();
            await PageObjects.gotItButton.click();

            await PageObjects.clickAccountButton();

            await expect(PageObjects.myRidesButton).toBeDisplayed();
            await PageObjects.myRidesButton.click();

            const lastRide1 = await driver.$(
                '-android uiautomator:new UiSelector().textContains("€0")',
            );
            await expect(lastRide1).toBeDisplayed();
        });
    });

    afterEach(async () => {
        await driver.terminateApp("com.umob.umob");
    });
});
