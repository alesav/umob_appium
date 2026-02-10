import { execSync } from "child_process";
import PageObjects from "../pageobjects/umobPageObjects.page.js";

/**
 * Reusable Appium Helper Methods
 * Contains common utility methods for mobile testing operations
 */
export default class AppiumHelpers {
    /**
     * Get the center coordinates of the device screen
     * @returns {Object} Object containing centerX, centerY, screenWidth, and screenHeight
     */
    static async getScreenCenter() {
        const { width, height } = await driver.getWindowSize();
        return {
            centerX: Math.round(width / 2),
            centerY: Math.round(height / 2),
            screenWidth: width,
            screenHeight: height,
        };
    }

    /**
     * Perform a double click gesture at the specified coordinates
     * @param {number} x - X coordinate for the double click
     * @param {number} y - Y coordinate for the double click
     */
    static async performDoubleClick(x, y) {
        try {
            await driver.execute("mobile: doubleClickGesture", { x, y });
        } catch (error) {
            console.log("Mobile double click failed, using fallback method");
            await driver.performActions([
                {
                    type: "pointer",
                    id: "finger1",
                    parameters: { pointerType: "touch" },
                    actions: [
                        { type: "pointerMove", duration: 0, x, y },
                        { type: "pointerDown" },
                        { type: "pointerUp" },
                        { type: "pause", duration: 50 },
                        { type: "pointerDown" },
                        { type: "pointerUp" },
                    ],
                },
            ]);
            await driver.releaseActions();
        }
    }

    /**
     * Set device location and restart the app
     * @param {number} longitude - Longitude coordinate
     * @param {number} latitude - Latitude coordinate
     */
    static async setLocationAndRestartApp(longitude, latitude) {
        execSync(
            `adb shell am startservice -e longitude ${longitude} -e latitude ${latitude} io.appium.settings/.LocationService`,
        );
        await driver.pause(2000);
        try {
            execSync(`adb emu geo fix ${longitude} ${latitude}`);
        } catch (error) {
            console.error("Failed to set location:", error);
        }

        await driver.pause(5000);
        //await driver.terminateApp("com.umob.umob");
        //await driver.activateApp("com.umob.umob");
        //await PageObjects.accountButton.waitForExist();
        //await driver.pause(1000);
        // const locationButton = await driver.$(
        //     '-android uiautomator:new UiSelector().className("com.horcrux.svg.SvgView").instance(3)',
        // );
        const locationButton = await driver.$(
            '-android uiautomator:new UiSelector().resourceId("home_location_button")',
        );
        await locationButton.waitForEnabled();
        await driver.pause(1000);
        await locationButton.click();

        await driver.pause(5000);
    }

    static async setLocationAndRestartAppFotLocationPermissionOffTest(
        longitude,
        latitude,
    ) {
        execSync(
            `adb shell am startservice -e longitude ${longitude} -e latitude ${latitude} io.appium.settings/.LocationService`,
        );
        await driver.pause(2000);
        try {
            execSync(`adb emu geo fix ${longitude} ${latitude}`);
        } catch (error) {
            console.error("Failed to set location:", error);
        }

        await driver.pause(5000);
    }

    /**
     * Perform a swipe up gesture on the screen
     * Swipes from 70% of screen height to 20% of screen height
     */
    static async performSwipeUp() {
        const { centerX, screenHeight } = await this.getScreenCenter();

        await driver.performActions([
            {
                type: "pointer",
                id: "finger1",
                parameters: { pointerType: "touch" },
                actions: [
                    {
                        type: "pointerMove",
                        duration: 0,
                        x: centerX,
                        y: screenHeight * 0.7,
                    },
                    { type: "pointerDown", button: 0 },
                    { type: "pause", duration: 100 },
                    {
                        type: "pointerMove",
                        duration: 1000,
                        x: centerX,
                        y: screenHeight * 0.2,
                    },
                    { type: "pointerUp", button: 0 },
                ],
            },
        ]);
        await driver.pause(2000);
    }

    /**
     * Perform a swipe down gesture on the screen
     * Swipes from Y coordinate 356 to Y coordinate 10
     */
    static async performSwipeDown() {
        const { centerX } = await this.getScreenCenter();

        await driver.performActions([
            {
                type: "pointer",
                id: "finger2",
                parameters: { pointerType: "touch" },
                actions: [
                    { type: "pointerMove", duration: 0, x: centerX, y: 356 },
                    { type: "pointerDown", button: 0 },
                    { type: "pause", duration: 100 },
                    { type: "pointerMove", duration: 1000, x: centerX, y: 10 },
                    { type: "pointerUp", button: 0 },
                ],
            },
        ]);
        await driver.pause(2000);
    }

    static async clickReserveButton() {
        const reserveButton = await driver.$(
            '-android uiautomator:new UiSelector().text("RESERVE")',
        );
        await reserveButton.waitForEnabled();
        await driver.pause(5000);
        await reserveButton.click();
    }

    static async clickMyLocation() {
        // const locationButton = await driver.$(
        //     '-android uiautomator:new UiSelector().className("com.horcrux.svg.SvgView").instance(3)',
        // ;
        const locationButton = await driver.$(
            '-android uiautomator:new UiSelector().resourceId("home_location_button")',
        );
        await locationButton.waitForEnabled();
        await driver.pause(1000);
        await locationButton.click();
        await driver.pause(1000);
    }

    static async clickCenterOfScreen() {
        const { centerX, centerY } = await this.getScreenCenter();
        await driver.pause(4000);
        //this option of clicking center of the screen stopped working
        // const middleScreen = await driver.$(
        //     '-android uiautomator:new UiSelector().resourceId("com.umob.umob:id/action_bar_root")',
        // );

        // await expect(middleScreen).toBeDisplayed();
        // await middleScreen.click();
        // await driver.pause(2000);

        //tap on center screen
        await driver.performActions([
            {
                type: "pointer",
                id: "finger1",
                parameters: { pointerType: "touch" },
                actions: [
                    {
                        type: "pointerMove",
                        duration: 0,
                        x: centerX,
                        y: centerY - 180,
                    },
                    { type: "pointerDown", button: 0 },
                    { type: "pause", duration: 100 },
                    { type: "pointerUp", button: 0 },
                ],
            },
        ]);

        await driver.pause(2000);
        // clearing the state of action
        await driver.releaseActions();

        await driver.pause(4000);
    }

    static async getMapCenterCoordinates() {
        // 1. Получаем размер экрана динамически
        const { width, height } = await driver.getWindowSize();
        console.log(`Screen size: ${width}x${height}`);

        // 2. Находим bottom sheet handle
        const bottomSheet = await driver.$("~Bottom sheet handle");

        // 3. Получаем координаты элемента
        const location = await bottomSheet.getLocation();
        console.log(`Bottom sheet Y coordinate: ${location.y}`);

        // 4. Вычисляем центр карты
        // Карта занимает пространство от верха экрана (0) до начала bottom sheet (location.y)
        // Центр карты = половина этого расстояния
        const mapCenterX = width / 2;
        const mapCenterY = location.y / 2;

        console.log(`Map center coordinates: X=${mapCenterX}, Y=${mapCenterY}`);

        return { x: Math.round(mapCenterX), y: Math.round(mapCenterY) };
    }
}
