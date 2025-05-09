import { execSync } from 'child_process';
import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import submitTestRun from '../../helpers/SendResults.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to load credentials based on environment and user
function getCredentials(environment = 'test', userKey = null) {
  try {
    const credentialsPath = path.resolve(__dirname, '../../../config/credentials.json');
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    
    // Check if environment exists
    if (!credentials[environment]) {
      console.warn(`Environment '${environment}' not found in credentials file. Using 'test' environment.`);
      environment = 'test';
    }
    
    const envUsers = credentials[environment];
    
    // If no specific user is requested, use the first user in the environment
    if (!userKey) {
      userKey = Object.keys(envUsers)[0];
    } else if (!envUsers[userKey]) {
      console.warn(`User '${userKey}' not found in '${environment}' environment. Using first available user.`);
      userKey = Object.keys(envUsers)[0];
    }
    
    // Return the user credentials
    return {
      username: envUsers[userKey].username,
      password: envUsers[userKey].password
    };
  } catch (error) {
    console.error('Error loading credentials:', error);
    throw new Error('Failed to load credentials configuration');
  }
}

// Get environment and user from env variables or use defaults
const ENV = process.env.TEST_ENV || 'test';
const USER = process.env.TEST_USER || 'new16';

/////////////////////////////////////////////////////////////////////////////////


describe('verify that it is not possible to book a bike if you didnt pay for the previous ride', () => {

    before(async () => {

        const credentials = getCredentials(ENV, USER);

        // await PageObjects.login(credentials);
        await PageObjects.login({ username: credentials.username, password: credentials.password });
        //execSync("adb shell pm grant com.umob.umob android.permission.ACCESS_FINE_LOCATION")
        //execSync("adb shell pm grant com.umob.umob android.permission.ACCESS_COARSE_LOCATION")
  
        const latitude = 51.9155956;
        const longitude = 4.4744301;
        
        execSync(
          `adb shell am startservice -e longitude ${longitude} -e latitude ${latitude} io.appium.settings/.LocationService`
        );

        try {
          execSync("adb emu geo fix "+ longitude+" "+ latitude);
        } catch (error) {
          console.error("Failed to set location:", error);
        }
    });

  beforeEach(async () => {
    await driver.activateApp("com.umob.umob");
  });

  it('unsuccesful bike booking with unpaid previous ride. Booking attempt leads to payment screen', async () => {

    const testId = "5d1a3c41-80da-4423-8a01-d2437b068ad2"
// Send results
let testStatus = "Pass";
    let screenshotPath = "";
    let testDetails = ""
    let error = null;

    try {

      await driver.pause(7000);

    // Set initial location
    execSync(
      `adb shell am startservice -e longitude 4.4744301 -e latitude 52.9155956 io.appium.settings/.LocationService`
    );

    //execSync("adb -P 5555 -s emulator-5554 emu geo fix 56.37827115375647 21.789664775133134")
    await driver.pause(5000);



    // Get screen dimensions for click positioning
    const { width, height } = await driver.getWindowSize();
    const centerX = Math.round(width / 2);
    
    // Center screen click
    await driver
      .action("pointer")
      .move({ x: centerX, y: Math.round(height / 2) })
      .down()
      .up()
      .perform();

    // Click UMOB Bike 20 button
    const umob20Button = await driver.$('-android uiautomator:new UiSelector().text("UMOB Bike 2 0")');
    await umob20Button.click();

    //const selectUmob = await driver.$('-android uiautomator:new UiSelector().text("SELECT UMOB BIKE 2 0")');
    //await selectUmob.click();

    /* Click 2cm above bottom edge
    await driver
      .action("pointer")
      .move({ x: centerX, y: height - 20 })
      .down()
      .up()
      .perform(); */
/*
      await driver.performActions([
        {
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x: 16, y: 450 },
                { type: 'pointerDown', button: 0 },
                { type: 'pause', duration: 100 },
                { type: 'pointerMove', duration: 1000, x: 160, y: 10 },
                { type: 'pointerUp', button: 0 },
            ],
        },]);
*/

// get window size 
const windowSize = await driver.getWindowSize();
const screenWidth = windowSize.width;
const screenHeight = windowSize.height;

// calculate points for scroll
// starting point: a little bit more down from the screen center
const startX = Math.round(screenWidth / 2);
const startY = Math.round(screenHeight * 0.6);

// end point: upper side of the screen
const endX = startX; // save the same position for X for vertical scroll
const endY = Math.round(screenHeight * 0.2); // about 20% from upper side of the screen

// scroll
await driver.performActions([
    {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
            { type: 'pointerMove', duration: 0, x: startX, y: startY },
            { type: 'pointerDown', button: 0 },
            { type: 'pause', duration: 100 },
            { type: 'pointerMove', duration: 1000, x: endX, y: endY },
            { type: 'pointerUp', button: 0 },
        ],
    },
]);


      //verify that there is notification about unpaid ride
      const failNotification = await driver.$('android=new UiSelector().textContains("You have a failed ride payment.")');
      await expect (failNotification).toBeDisplayed();


    // Click continue button
    await driver.pause(5000);
    const continueButton = await driver.$('android=new UiSelector().text("CONTINUE")');
    await expect (continueButton).toBeDisplayed();
    await expect (continueButton).toBeEnabled();

    await continueButton.click();

    // scroll
await driver.performActions([
  {
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
          { type: 'pointerMove', duration: 0, x: startX, y: startY },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerMove', duration: 1000, x: endX, y: endY },
          { type: 'pointerUp', button: 0 },
      ],
  },
]);



          // // Handle permissions
          // const allowPermissionBtn = await driver.$("id:com.android.permissioncontroller:id/permission_allow_button");
          // await expect(allowPermissionBtn).toBeDisplayed();
          // await allowPermissionBtn.click();

          //verify that we are on payment detail screen for the previous unpaid ride
          const paymentDetail = await driver.$('android=new UiSelector().text("Payment detail")');
    await expect (paymentDetail).toBeDisplayed();

    
          //verify that payment status failed
          const status = await driver.$('android=new UiSelector().textContains("Failed")');
    await expect (status).toBeDisplayed();



    await driver.pause(2000);
    //Scroll to bottom
    await driver.executeScript('mobile: scrollGesture', [{
      left: 100,
      top: 1500,
      width: 200,
      height: 100,
      direction: 'down',
      percent: 100
    }]); 

    //verify pay now button
    const payNow = await driver.$('android=new UiSelector().textContains("PAY NOW")');
    await expect (payNow).toBeDisplayed();

    /*const screen = await driver.getWindowRect();
    const screenWidth = screen.width;
    const screenHeight = screen.height;
    
    await driver.executeScript('mobile: scrollGesture', [{
      left: screenWidth / 2,  // горизонтальная середина экрана
      top: screenHeight * 0.65,  // точка начала скролла в нижней части экрана
      width: screenWidth / 2,  // ширина области для скролла
      height: screenHeight * 0.15,  // высота области для скролла
      direction: 'down',  // направление скролла
      percent: 100  // полное прокручивание
    }]); */


    // Click 5cm above bottom
    /*await driver
      .action("pointer")
      .move({ x: centerX, y: height - 50 })
      .down()
      .up()
      .perform();*/

    } 
    
    catch (e) {
    error = e;
    console.error("Test failed:", error);
    testStatus = "Fail";
    testDetails = e.message;

    console.log("TEST 123")

    // Capture screenshot on failure
    screenshotPath = "./screenshots/"+ testId+".png";
    await driver.saveScreenshot(screenshotPath);
    // execSync(
    //   `adb exec-out screencap -p > ${screenshotPath}`
    // );
    
  } finally {
    // Submit test run result
    try {
        console.log("TEST 456")

      await submitTestRun(testId, testStatus, testDetails, screenshotPath);
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