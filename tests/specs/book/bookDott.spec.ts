import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import AppiumHelpers from "../../helpers/AppiumHelpers.js";
import { getCredentials, executeTest } from "../../helpers/TestHelpers.js";

const ENV = process.env.TEST_ENV || "test";
const USER = process.env.TEST_USER || "new65";

describe("Dott Bike Booking Test in Antwerpen", () => {
    before(async () => {
        const credentials = getCredentials(ENV, USER);
        await PageObjects.login({
            username: credentials.username,
            password: credentials.password,
        });

        const longitude = 4.417879655990368;
        const latitude = 51.2177198085309;

        await AppiumHelpers.setLocationAndRestartApp(longitude, latitude);
        await driver.pause(3000);
    });

    beforeEach(async () => {
        await driver.activateApp("com.umob.umob");
    });

    it("Book Dott Bike in Antwerpen", async () => {
        const testId = "964b36ab-8d22-4b96-8aa4-95f1f64c28e2";

        await executeTest(testId, async () => {
            await driver.activateApp("com.umob.umob");
            await driver.pause(5000);

            const { width, height } = await driver.getWindowSize();

            await PageObjects.locationButton.click();
            await driver.pause(5000);

            await AppiumHelpers.clickCenterOfScreen();
            await driver.pause(2000);

            // Verify that Euro symbol is displayed
            const euroSymbol = await driver.$(
                '-android uiautomator:new UiSelector().textContains("€")',
            );
            await expect(euroSymbol).toBeDisplayed();

            //verify pricing
            await PageObjects.dottPriceInfo();

            const selectPayment = await driver.$(
                '-android uiautomator:new UiSelector().text("**** **** 1115")',
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

            // await expect(PageObjects.androidPermissionButton).toBeDisplayed();
            // await PageObjects.androidPermissionButton.click();
            // await driver.pause(3000);

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

            await expect(PageObjects.donkeyLockText1).toBeDisplayed();

            await expect(PageObjects.donkeyLockText2).toBeDisplayed();

            await expect(PageObjects.dottContinueBtn).toBeDisplayed();
            await driver.pause(1000);
            await expect(PageObjects.dottContinueBtn).toBeEnabled();
            await PageObjects.dottContinueBtn.click();

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

            await expect(PageObjects.dottContinue2Btn).toBeDisplayed();
            await PageObjects.dottContinue2Btn.click();

            await driver.pause(3000);
            await expect(PageObjects.reportButton).toBeDisplayed();
            await expect(PageObjects.markArrivalButton).toBeDisplayed();
            await PageObjects.markArrivalButton.click();

            await driver.pause(5000);

            // Allow permissions for take a photo
            await expect(PageObjects.whileUsingAppPermission).toBeDisplayed();
            await PageObjects.whileUsingAppPermission.click();
            await driver.pause(5000);

            // Verify parking photo header
            const parkingHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Parking photo required")',
            );
            await expect(parkingHeader).toBeDisplayed();

            // Verify photo instruction
            const photoInstruction = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Take a photo of your vehicle to end your ride")',
            );
            await expect(photoInstruction).toBeDisplayed();

            //take a picture in new UI
            const photoButton = await driver.$(
                '-android uiautomator:new UiSelector().className("com.horcrux.svg.CircleView").instance(2)',
            );
            await photoButton.click();
            // Verify confirmation for using a picture
            const pictureHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Use this picture?")',
            );
            await expect(pictureHeader).toBeDisplayed();

            // Verify parking rules
            const parkingRules = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Please check if the vehicle is parked")',
            );
            await expect(parkingRules).toBeDisplayed();

            // Verify retake picture button
            const retakeButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Retake")',
            );
            await expect(retakeButton).toBeDisplayed();

            // Verify use picture button
            const useButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Use Picture")',
            );
            await expect(useButton).toBeDisplayed();
            await driver.pause(2000);
            await useButton.click();
            await driver.pause(3000);

            await PageObjects.gotItButton.waitForDisplayed();
            await PageObjects.gotItButton.click();

            await PageObjects.clickAccountButton();

            await expect(PageObjects.myRidesButton).toBeDisplayed();
            await PageObjects.myRidesButton.click();

            const lastRide1 = await driver.$(
                '-android uiautomator:new UiSelector().textContains("€")',
            );
            await expect(lastRide1).toBeDisplayed();
        });
    });

    afterEach(async () => {
        await driver.terminateApp("com.umob.umob");
    });
});
