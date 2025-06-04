import { execSync } from 'child_process';
import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import submitTestRun from '../../helpers/SendResults.js';
import AppiumHelpers from "../../helpers/AppiumHelpers.js";

describe('Donkey Bike Booking Test with Welcome voucher for the New User', () => {

    before(async () => {
  
  
        await PageObjects.login({ username:'new20@gmail.com', password: '123Qwerty!' });

        const longitude = 4.4744300;
        const latitude = 51.9155956;

        await AppiumHelpers.setLocationAndRestartApp(
          longitude, 
          latitude
        );
        await driver.pause(3000);
  
  
    });

  beforeEach(async () => {
    await driver.activateApp("com.umob.umob");
  });

  it('Book Donkey UMOB Bike 20 with Welcome voucher for the New User', async () => {

    const testId = "594c7a95-242a-48f6-9fbf-6a6d29911fc5"
    // Send results
 let testStatus = "Pass";
 let screenshotPath = "";
 let testDetails = ""
 let error = null;
 
 try {

    // Set initial location
    await AppiumHelpers.setLocationAndRestartApp(
      4.4744301, 
      51.9155956
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

    //verify that new user voucher is visible
    const voucher = await driver.$('-android uiautomator:new UiSelector().textContains("New User Donkey")');
    await expect (voucher).toBeDisplayed();

    //verify that payment card is displayed
    const selectPayment = await driver.$('-android uiautomator:new UiSelector().text("**** **** 1115")');
    await expect (selectPayment).toBeDisplayed();

    /*
    //click to choose limitless voucher
    await voucher.click();
    await driver.pause(2000);

    //confirm that you can choose payment without vouchers and select limitless voucher "multi1"
    const noVoucher = await driver.$('-android uiautomator:new UiSelector().text("No ride credit")');
    await expect (noVoucher).toBeDisplayed();

    const multiVoucher = await driver.$('-android uiautomator:new UiSelector().textContains("multi")');
    await expect (multiVoucher).toBeDisplayed();
    await multiVoucher.click();
    await driver.pause();



    //verify that we are on a booking screen and limitless voucher selected
        await expect (selectPayment).toBeDisplayed();
        await expect (multiVoucher).toBeDisplayed();

    
      */

        
await driver.performActions([
  {
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
          { type: 'pointerMove', duration: 0, x: width/2, y: height*0.95 },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerMove', duration: 1000, x: width/2, y: height*0.1 },
          { type: 'pointerUp', button: 0 },
      ],
  },]);
  await driver.pause(1000);

    // Click continue button
    await driver.pause(5000);
    const continueButton = await driver.$('android=new UiSelector().text("CONTINUE")');
    await expect (continueButton).toBeDisplayed();
    await expect (continueButton).toBeEnabled();

    await continueButton.click();


    await driver.pause(2000);

    //allow permission 
    const permission = await driver.$("id:com.android.permissioncontroller:id/permission_allow_button");
    await expect(permission).toBeDisplayed();
    await permission.click();
    await driver.pause(3000);

    //Scroll to bottom
    await driver.executeScript('mobile: scrollGesture', [{
      left: 100,
      top: 1500,
      width: 200,
      height: 100,
      direction: 'down',
      percent: 100
    }]); 

    

    //click to start and unlock the bike
    const umob20Button1 = await driver.$('-android uiautomator:new UiSelector().text("START TRIP")');
    await umob20Button1.click();

    const umob20Button2 = await driver.$('-android uiautomator:new UiSelector().text("UNLOCK BIKE")');
    await umob20Button2.click();

    const umob20Button3 = await driver.$('-android uiautomator:new UiSelector().text("CONFIRM")');
    await umob20Button3.click();

    //pause for ride duration
    await driver.pause(10000);

    // Click end trip button
    const endTripButton = await driver.$("accessibility id:endTrip-text");
    await endTripButton.click();

    //click to see details
    const detailsButton3 = await driver.$('-android uiautomator:new UiSelector().text("DETAILS")');
    await driver.pause(10000);
    await detailsButton3.click();

    //verify header Ride
    const header = await driver.$('-android uiautomator:new UiSelector().text("Ride")');
    await expect(header).toBeDisplayed();

     //verify used voucher is dispayed
     const usedVoucher = await driver.$('-android uiautomator:new UiSelector().text("Used voucher")');
     await expect(usedVoucher).toBeDisplayed();

    //verify that there is 0euro price
    const zeroEuro = await driver.$('-android uiautomator:new UiSelector().textContains("€0.")');
    await expect(zeroEuro).toBeDisplayed();

   

    //verify used voucher is dispayed
    const multiVoucher1 = await driver.$('-android uiautomator:new UiSelector().textContains("New User")');
    await expect(multiVoucher1).toBeDisplayed();

    //Scroll to bottom
    await driver.executeScript('mobile: scrollGesture', [{
      left: 100,
      top: 1500,
      width: 200,
      height: 100,
      direction: 'down',
      percent: 100
    }]); 

    //click got it button
    const gotIt = await driver.$('-android uiautomator:new UiSelector().text("GOT IT")');
    await expect(gotIt).toBeDisplayed();
    await gotIt.click();

    // Click on Account button
    await PageObjects.clickAccountButton();

    await driver.pause(2000);

    //verify that my account screen is displayed
    const myRides = await driver.$('-android uiautomator:new UiSelector().text("My Rides & Tickets")');
    await expect(myRides).toBeDisplayed();

    //verify that payment is visible in my account and it is 0 Euro
    // const lastRide = await driver.$('-android uiautomator:new UiSelector().textContains("€0")');
    // await expect(lastRide).toBeDisplayed();

    //click on my rides and tickets
    await myRides.click();

    //verify that payment is visible in my rides and tickets screen and it is 0 Euro
    const lastRide1 = await driver.$('-android uiautomator:new UiSelector().textContains("€0")');
    await expect(lastRide1).toBeDisplayed();


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
    // Click close button
    const closeButton = await driver.$("accessibility id:closeButton-text");
    await closeButton.click();
  });

  */

  afterEach(async () => {
    await driver.terminateApp("com.umob.umob");
  });
});