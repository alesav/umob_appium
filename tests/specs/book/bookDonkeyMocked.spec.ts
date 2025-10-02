import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import AppiumHelpers from "../../helpers/AppiumHelpers.js";
import { getCredentials, executeTest } from "../../helpers/TestHelpers.js";

const ENV = process.env.TEST_ENV || "test";
const USER = process.env.TEST_USER || "new45";

describe("Donkey Bike Booking Test", () => {
    before(async () => {
        const credentials = getCredentials(ENV, USER);

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

        await executeTest(testId, async () => {
            await driver.activateApp("com.umob.umob");
            await driver.pause(4000);

            // Get screen dimensions for click positioning
            const { width, height } = await driver.getWindowSize();

            await PageObjects.locationButton.click();
            await driver.pause(5000);

            // Click on middle of the screen
            await AppiumHelpers.clickCenterOfScreen();

            // Click UMOB Bike 20 button
            const umob20Button = await driver.$(
                '-android uiautomator:new UiSelector().text("UMOB Bike 0 1")',
            );
            await umob20Button.click();

            await driver.pause(3000);

            // Verify that Euro symbol is displayed
            const euroSymbol = await driver.$(
                '-android uiautomator:new UiSelector().textContains("€")',
            );
            await expect(euroSymbol).toBeDisplayed();
            await driver.pause(5000);

            // Click Start Trip button
            await PageObjects.startTripButton.waitForDisplayed();
            await PageObjects.startTripButton.click();

            // Handle allow permissions
            await expect(PageObjects.androidPermissionButton).toBeDisplayed();
            await PageObjects.androidPermissionButton.click();
            await driver.pause(2000);

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

            await driver.pause(3000);

            // Click to start and unlock the bike

            await PageObjects.donkeyStartButton2.waitForDisplayed({
                timeout: 15000,
                timeoutMsg: "start trip button not found after 15 seconds",
            });

            await expect(PageObjects.donkeyStartButton2).toBeDisplayed();
            await expect(PageObjects.donkeyStartButton2).toBeEnabled();
            await driver.pause(1000);
            console.log(
                "before start trip button click",
                await PageObjects.donkeyStartButton2.isDisplayed(),
            );
            console.log("App package:", await driver.getCurrentPackage());

            // Click start trip button
            await PageObjects.donkeyStartButton2.click();

            console.log(
                "after start trip button click",
                await PageObjects.donkeyStartButton2.isDisplayed(),
            );
            console.log("Current activity:", await driver.getCurrentActivity());
            console.log("App package:", await driver.getCurrentPackage());

            await PageObjects.donkeyLockText1.waitForDisplayed({
                timeout: 10000,
                timeoutMsg:
                    "text Use the handle to open the lock not found after 10 seconds",
            });

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

            // Pause for ride duration
            await driver.pause(8000);

            // Click end trip button
            await PageObjects.endTripText.click();

            await driver.pause(2000);

            // Click got it button
            await PageObjects.gotItButton.waitForDisplayed();
            await PageObjects.gotItButton.click();
        });
    });

    afterEach(async () => {
        await driver.terminateApp("com.umob.umob");
    });
});
