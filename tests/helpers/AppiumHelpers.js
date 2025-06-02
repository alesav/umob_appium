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
  }
}
