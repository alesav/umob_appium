import { execSync } from 'child_process';
import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import submitTestRun from '../../helpers/SendResults.js';


describe('verify that it is not possible to book a bike if you didnt pay for the previous ride', () => {

    before(async () => {
  
        // Find and click LOG IN button
        const logInBtn = await driver.$('-android uiautomator:new UiSelector().text("LOG IN")');
        await logInBtn.isClickable();    
        await driver.pause(5000);
        await logInBtn.click();
  
        await PageObjects.login({ username:'new16@gmail.com', password: '123Qwerty!' });
  
  
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

    // Set initial location
    execSync(
      `adb shell am startservice -e longitude 4.4744301 -e latitude 51.9155956 io.appium.settings/.LocationService`
    );
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

      //verify that there is notification about unpaid ride
      const failNotification = await driver.$('android=new UiSelector().textContains("You have a failed ride payment.")');
      await expect (failNotification).toBeDisplayed();


    // Click continue button
    await driver.pause(5000);
    const continueButton = await driver.$('android=new UiSelector().text("CONTINUE")');
    await expect (continueButton).toBeDisplayed();
    await expect (continueButton).toBeEnabled();

    await continueButton.click();

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