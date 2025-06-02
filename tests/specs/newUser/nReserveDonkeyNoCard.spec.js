import { execSync } from 'child_process';
import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import submitTestRun from '../../helpers/SendResults.js';
import AppiumHelpers from "../../helpers/AppiumHelpers.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Test Helper Functions
 */
class TestHelpers {
  static getCredentials(environment = 'test', userKey = null) {
    try {
      const credentialsPath = path.resolve(__dirname, '../../../config/credentials.json');
      const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
      
      if (!credentials[environment]) {
        console.warn(`Environment '${environment}' not found in credentials file. Using 'test' environment.`);
        environment = 'test';
      }
      
      const envUsers = credentials[environment];
      
      if (!userKey) {
        userKey = Object.keys(envUsers)[0];
      } else if (!envUsers[userKey]) {
        console.warn(`User '${userKey}' not found in '${environment}' environment. Using first available user.`);
        userKey = Object.keys(envUsers)[0];
      }
      
      return {
        username: envUsers[userKey].username,
        password: envUsers[userKey].password
      };
    } catch (error) {
      console.error('Error loading credentials:', error);
      throw new Error('Failed to load credentials configuration');
    }
  }

  static async getScreenCenter() {
    return await AppiumHelpers.getScreenCenter();
  }

  static async setLocationAndRestartApp(longitude, latitude) {
    return await AppiumHelpers.setLocationAndRestartApp(longitude, latitude);
  }

  static async captureScreenshot(testId) {
    const screenshotPath = `./screenshots/${testId}.png`;
    try {
      await driver.saveScreenshot(screenshotPath);
    } catch (error) {
      console.warn("Driver screenshot failed, using adb fallback");
      execSync(`adb exec-out screencap -p > ${screenshotPath}`);
    }
    return screenshotPath;
  }
  static async performSwipeUp() {
    const { centerX, screenWidth, screenHeight } = await this.getScreenCenter();
    
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

  static async performSwipeDown() {
    const { centerX, screenWidth, screenHeight } = await this.getScreenCenter();
    
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
}

/**
 * Donkey Bike Booking Actions
 */
class DonkeyBikeActions {
  static async clickCenterOfScreen() {
    const { centerX, centerY } = await TestHelpers.getScreenCenter();
    
    await driver
      .action("pointer")
      .move({ x: centerX, y: centerY })
      .down()
      .up()
      .perform();
    
    await driver.pause(2000);
  }

  static async clickFinishLater() {
      const finishLater = await driver.$("-android uiautomator:new UiSelector().text(\"FINISH LATER\")");
      await finishLater.isDisplayed()
      await driver.pause(2000);
      await finishLater.click();
      await finishLater.click();
  }

  static async selectBike(bikeText) {
    const bikeButton = await driver.$(`-android uiautomator:new UiSelector().text("${bikeText}")`);
    await bikeButton.click();
  }

  static async verifyNewUserVoucher() {
    const voucher = await driver.$('-android uiautomator:new UiSelector().text("New User Donkey Republic")');
    await expect(voucher).toBeDisplayed();
  }

  static async verifySelectPaymentMethod() {
    const selectPayment = await driver.$('-android uiautomator:new UiSelector().text("Select payment method")');
    await expect(selectPayment).toBeDisplayed();
  }
  static async clickContinueButton() {
    await driver.pause(5000);
    const continueButton = await driver.$('android=new UiSelector().text("CONTINUE")');
    await expect(continueButton).toBeDisplayed();
    await expect(continueButton).toBeEnabled();
    await continueButton.click();
    await driver.pause(2000);
  }

  static async verifyPaymentMethodsScreen() {
    const paymentHeader = await driver.$("id:com.umob.umob:id/payment_method_header_title");
    await expect(paymentHeader).toBeDisplayed();

    const cards = await driver.$('-android uiautomator:new UiSelector().text("Cards")');
    await expect(cards).toBeDisplayed();

    const bancontactCard = await driver.$('-android uiautomator:new UiSelector().text("Bancontact card")');
    await expect(bancontactCard).toBeDisplayed();
  }

  static async verifyPaymentOptions() {
    const payPal = await driver.$('-android uiautomator:new UiSelector().text("PayPal")');
    await expect(payPal).toBeDisplayed();
  }
}

/**
 * Test Runner with proper error handling
 */
class TestRunner {
  static async runTest(testId, testFunction, bikeInfo = null) {
    let testStatus = "Pass";
    let screenshotPath = "";
    let testDetails = "";
    let error = null;

    try {
      await testFunction();
    } catch (e) {
      error = e;
      console.error("Test failed:", error);
      testStatus = "Fail";
      
      const bikeDetails = bikeInfo ? 
        `Bike: ${bikeInfo.name} (${bikeInfo.longitude}, ${bikeInfo.latitude}) | ` : '';
      testDetails = `${bikeDetails}Error: ${e.message}`;
      
      screenshotPath = await TestHelpers.captureScreenshot(testId);
    } finally {
      try {
        await submitTestRun(testId, testStatus, testDetails, screenshotPath);
        console.log("Test run submitted successfully");
      } catch (submitError) {
        console.error("Failed to submit test run:", submitError);
      }

      if (error) {
        throw error;
      }
    }
  }
}

/**
 * Main Test Suite
 */
describe('Donkey Bike Booking - New User Without Card', () => {
  const ENV = process.env.TEST_ENV || 'test';
  const USER = process.env.TEST_USER || 'new20';
  
  const bikeLocation = {
    name: "UMOB Bike 2 1",
    longitude: 4.4744301,
    latitude: 51.9155956
  };

  before(async () => {
    const credentials = TestHelpers.getCredentials(ENV, USER);
    await PageObjects.login({ username: credentials.username, password: credentials.password });
    
    await TestHelpers.setLocationAndRestartApp(
      bikeLocation.longitude, 
      bikeLocation.latitude
    );
    
    await driver.pause(3000);
  });

  beforeEach(async () => {
    await driver.activateApp("com.umob.umob");
  });

  afterEach(async () => {
    await driver.terminateApp("com.umob.umob");
  });

  it('New User Tries to Book Donkey UMOB Bike Without Card', async () => {
    await TestRunner.runTest("a66df007-2bfa-4531-af52-87e3eec81280", async () => {
      // Set specific location for the bike
      await TestHelpers.setLocationAndRestartApp(4.474431, 51.91564);

      await DonkeyBikeActions.clickFinishLater();
      
      // Click on center of screen to interact with map  
      await DonkeyBikeActions.clickCenterOfScreen();

      // Select the specific bike
      await DonkeyBikeActions.selectBike("UMOB Bike 2 1");

      // Verify new user voucher is displayed
      await DonkeyBikeActions.verifyNewUserVoucher();

      // Verify payment method selection is shown
      await DonkeyBikeActions.verifySelectPaymentMethod();

      // Swipe up to reveal more options
      await TestHelpers.performSwipeUp();

      // Click continue button
      await DonkeyBikeActions.clickContinueButton();

      // Verify payment methods screen
      await DonkeyBikeActions.verifyPaymentMethodsScreen();

      // Swipe down to see more payment options
      await driver.pause(2000);
      await TestHelpers.performSwipeDown();

      // Verify available payment options
      await DonkeyBikeActions.verifyPaymentOptions();

    }, bikeLocation);
  });
});
