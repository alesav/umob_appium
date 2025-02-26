import { execSync } from 'child_process';
import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import submitTestRun from '../../helpers/SendResults.js';

describe('Trying to Book Donkey bike by a New User Without a Card', () => {

    before(async () => {
  
        // Find and click LOG IN button
        const logInBtn = await driver.$('-android uiautomator:new UiSelector().text("LOG IN")');
        await logInBtn.isClickable();
        await logInBtn.click();
  
        await PageObjects.login({ username:'new13@gmail.com', password: '123Qwerty!' });
  
  
    });

  beforeEach(async () => {
    await driver.activateApp("com.umob.umob");
  });

  it('New User is Trying to Book Donkey UMOB Bike 20 Without a Card', async () => {

    const testId = "a66df007-2bfa-4531-af52-87e3eec81280"
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

    //verify that new user vaucher is visible
    const vaucher = await driver.$('-android uiautomator:new UiSelector().text("New User Donkey Republic")');
    await expect (vaucher).toBeDisplayed();

    //verify that select payment method is displayed
    const selectPayment = await driver.$('-android uiautomator:new UiSelector().text("Select payment method")');
    await expect (selectPayment).toBeDisplayed();

    /* Click 2cm above bottom edge
    await driver
      .action("pointer")
      .move({ x: centerX, y: height - 20 })
      .down()
      .up()
      .perform(); */

    // Click continue button
    await driver.pause(5000);
    const continueButton = await driver.$('android=new UiSelector().text("CONTINUE")');
    await expect (continueButton).toBeDisplayed();
    await expect (continueButton).toBeEnabled();

    await continueButton.click();


    await driver.pause(2000);

    //verify header and offer for choosing payment method
    const paymentHeader = await driver.$("id:com.umob.umob:id/payment_method_header_title");
    await expect(paymentHeader).toBeDisplayed();

    const cards = await driver.$('-android uiautomator:new UiSelector().text("Cards")');
    await expect(cards).toBeDisplayed();

    const bancontactCard = await driver.$('-android uiautomator:new UiSelector().text("Bancontact card")');
    await expect(bancontactCard).toBeDisplayed();

    const googlePay = await driver.$('-android uiautomator:new UiSelector().text("Google Pay")');
    await expect(googlePay).toBeDisplayed();

    const payPal = await driver.$('-android uiautomator:new UiSelector().text("PayPal")');
    await expect(payPal).toBeDisplayed();


  } catch (e) {
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

    /*

    //Scroll to bottom
    await driver.executeScript('mobile: scrollGesture', [{
      left: 100,
      top: 1500,
      width: 200,
      height: 100,
      direction: 'down',
      percent: 10
    }]); 
    
    */

    /*
    
    const screen = await driver.getWindowRect();
    const screenWidth = screen.width;
    const screenHeight = screen.height;
    
    await driver.executeScript('mobile: scrollGesture', [{
      left: screenWidth / 2,  // горизонтальная середина экрана
      top: screenHeight * 0.65,  // точка начала скролла в нижней части экрана
      width: screenWidth / 2,  // ширина области для скролла
      height: screenHeight * 0.15,  // высота области для скролла
      direction: 'down',  // направление скролла
      percent: 100  // полное прокручивание
    }]); 
    
    */

  

  afterEach(async () => {
    await driver.terminateApp("com.umob.umob");
  });
});