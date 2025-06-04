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
      await driver.execute('mobile: doubleClickGesture', { x, y });
    } catch (error) {
      console.log('Mobile double click failed, using fallback method');
      await driver.performActions([{
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x, y },
          { type: 'pointerDown' },
          { type: 'pointerUp' },
          { type: 'pause', duration: 50 },          { type: 'pointerDown' },
          { type: 'pointerUp' }
        ]
      }]);
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
      `adb shell am startservice -e longitude ${longitude} -e latitude ${latitude} io.appium.settings/.LocationService`
    );
    await driver.pause(1000);
    try {
      execSync(`adb emu geo fix ${longitude} ${latitude}`);
    } catch (error) {
      console.error("Failed to set location:", error);
    }

    await driver.pause(5000);
    await driver.terminateApp("com.umob.umob");
    await driver.activateApp("com.umob.umob");
    await PageObjects.accountButton.waitForExist();
    await driver.pause(5000);
    const locationButton = await driver.$('-android uiautomator:new UiSelector().className("com.horcrux.svg.SvgView").instance(3)');
    await locationButton.waitForEnabled();
    await driver.pause(1000);
    await locationButton.click();

    await driver.pause(1000);
  }

  /**
   * Perform a swipe up gesture on the screen
   * Swipes from 70% of screen height to 20% of screen height
   */
  static async performSwipeUp() {
    const { centerX, screenHeight } = await this.getScreenCenter();
    
    await driver.performActions([{
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: centerX, y: screenHeight * 0.7 },
        { type: 'pointerDown', button: 0 },
        { type: 'pause', duration: 100 },
        { type: 'pointerMove', duration: 1000, x: centerX, y: screenHeight * 0.2 },
        { type: 'pointerUp', button: 0 },
      ],
    }]);
    await driver.pause(2000);
  }

  /**
   * Perform a swipe down gesture on the screen
   * Swipes from Y coordinate 356 to Y coordinate 10
   */
  static async performSwipeDown() {
    const { centerX } = await this.getScreenCenter();
    
    await driver.performActions([{
      type: 'pointer',
      id: 'finger2',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: centerX, y: 356 },
        { type: 'pointerDown', button: 0 },
        { type: 'pause', duration: 100 },
        { type: 'pointerMove', duration: 1000, x: centerX, y: 10 },
        { type: 'pointerUp', button: 0 },
      ],
    }]);
    await driver.pause(2000);
  }

    static async clickReserveButton() {
    const reserveButton = await driver.$('-android uiautomator:new UiSelector().text("RESERVE")');
    await reserveButton.waitForEnabled();
    await driver.pause(5000);
    await reserveButton.click();
  }

    static async clickMyLocation() {
    const locationButton = await driver.$('-android uiautomator:new UiSelector().className("com.horcrux.svg.SvgView").instance(3)');
    await locationButton.waitForEnabled();
    await driver.pause(1000);
    await locationButton.click();
    await driver.pause(1000);
  }
}
