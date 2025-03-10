import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import submitTestRun from '../../helpers/SendResults.js';

describe('Combined tests for logged in user with unlimited multi voucher', () => {

  
  beforeEach(async () => {
    await driver.activateApp("com.umob.umob");
    await driver.pause(7000);
  });

  before(async () => {
    

    // Find and click LOG IN button
    const logInBtn = await driver.$('-android uiautomator:new UiSelector().text("LOG IN")');
    await logInBtn.isClickable();
    await logInBtn.click();

    await PageObjects.login({ username:'new6@gmail.com', password: '123Qwerty!' });
});


it('should display key navigation elements on the main screen', async () => {

  const testId = "f66e0031-f31a-4694-b769-3aa9772b80fe"
  // Send results
let testStatus = "Pass";
let screenshotPath = "";
let testDetails = ""
let error = null;

try {

  // Verify bottom navigation menu items
  const taxiButton = await driver.$('-android uiautomator:new UiSelector().text("Taxi")');
  await expect(taxiButton).toBeDisplayed();

  const publicTransportButton = await driver.$('-android uiautomator:new UiSelector().text("Public transport")');
  await expect(publicTransportButton).toBeDisplayed();

  const accountButton = await driver.$('-android uiautomator:new UiSelector().text("Account")');
  await expect(accountButton).toBeDisplayed();

  const settingsButton = await driver.$('-android uiautomator:new UiSelector().text("Settings")');
  await expect(settingsButton).toBeDisplayed();

  // Verify filter button is displayed
  const assetFilterToggle = await driver.$('-android uiautomator:new UiSelector().resourceId("home_asset_filter_toggle")');
  await expect(assetFilterToggle).toBeDisplayed();

  // Check for map root element
  const mapRoot = await driver.$('-android uiautomator:new UiSelector().resourceId("map_root")');
  await expect(mapRoot).toBeDisplayed();

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



  it('should display all key account screen elements', async () => {

    const testId = "18fb8bc3-a1db-44af-81a4-53df167418cd"
  // Send results
let testStatus = "Pass";
let screenshotPath = "";
let testDetails = ""
let error = null;

try {

    // Click on Account button
    await PageObjects.accountButton.waitForExist();
    await PageObjects.accountButton.click();

    await driver.pause(2000);

    // Verify screen header
    const screenHeader = await driver.$("-android uiautomator:new UiSelector().resourceId(\"MyAccountContainer-header-title\")");
    await expect(screenHeader).toBeDisplayed();
    await expect(await screenHeader.getText()).toBe("My Account");

    // Verify user welcome message
    const welcomeText = await driver.$("-android uiautomator:new UiSelector().text(\"Welcome back,\")");
    await expect(welcomeText).toBeDisplayed();

    
    // Verify last ride section
    const lastRideSection = await driver.$("-android uiautomator:new UiSelector().text(\"Your last ride\")");
    await expect(lastRideSection).toBeDisplayed();
    await driver.pause(2000);
    
    // Check last ride amount (flexible verification)
    const lastRideAmount = await driver.$("-android uiautomator:new UiSelector().textContains(\"€\")");
    await expect(lastRideAmount).toBeDisplayed();

    // Verify account menu items
    const accountMenuItems = [
      "My Rides & Tickets",
      "My payments",
      "Personal info",
      "Ride credit",
      "Invite friends",
      "Payment settings",
      "ID Document",
      "Delete account"
    ];

    await driver.executeScript('mobile: scrollGesture', [{
      left: 100, 
      top: 1000, 
      width: 200, 
      height: 800, 
      direction: 'down',
      percent: 10.0
    }]);

    for (const menuItem of accountMenuItems) {
      const menuElement = await driver.$(`-android uiautomator:new UiSelector().text("${menuItem}")`);
      await expect(menuElement).toBeDisplayed();
    }

    // Verify back button is present
    const backButton = await driver.$("-android uiautomator:new UiSelector().resourceId(\"back_button\")");
    await expect(backButton).toBeDisplayed();

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



  it('should display all key My Rides & Tickets screen elements', async () => {

    const testId = "cbbfbc83-2d4c-484f-88c6-9ac7da5fdbef"
    // Send results
  let testStatus = "Pass";
  let screenshotPath = "";
  let testDetails = ""
  let error = null;
  
  try {
    
    // Click on Account button
   const accountButton = await driver.$("-android uiautomator:new UiSelector().text(\"Account\")");
   await accountButton.click();
   await driver.pause(2000);

    // Navigate to My Rides & Tickets
    const myRidesAndTicketsButton = await driver.$("-android uiautomator:new UiSelector().text(\"My Rides & Tickets\")");
    await myRidesAndTicketsButton.click();
    await driver.pause(3000);

    // Verify screen header
    const screenHeader = await driver.$("-android uiautomator:new UiSelector().text(\"My Rides & Tickets\")");
    await expect(screenHeader).toBeDisplayed();
    await driver.pause(3000);

    // Verify back button is present
    const backButton = await driver.$("-android uiautomator:new UiSelector().resourceId(\"back_button\")");
    await expect(backButton).toBeDisplayed();

    // Verify last ride section
    const lastRideSection = await driver.$("-android uiautomator:new UiSelector().text(\"Your last ride\")");
    await expect(lastRideSection).toBeDisplayed();


    // Check previous payments list
    const previousPaymentsList = await driver.$$("-android uiautomator:new UiSelector().textContains(\"€\")");
    console.log("previousPaymentsList" + previousPaymentsList.length)

    // Verify at least one previous payment exists
    await expect(previousPaymentsList.length).toBeGreaterThan(1);

    
    // Verify "Previous rides" section header
    const previousRidesHeader = await driver.$("-android uiautomator:new UiSelector().textContains(\"Previous rides\")");
    await expect(previousRidesHeader).toBeDisplayed();
    await driver.pause(3000);


    // back to common list of account menu
    await backButton.click();
    await driver.pause(2000);

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



  it('should display all key My Payments screen elements', async () => {

    const testId = "da75bc89-8bb5-4db1-9e42-524161e964a5"
    // Send results
  let testStatus = "Pass";
  let screenshotPath = "";
  let testDetails = ""
  let error = null;
  
  try {

    // Click on Account button
    const accountButton = await driver.$("-android uiautomator:new UiSelector().text(\"Account\")");
    await accountButton.click();
    await driver.pause(2000);
    
    // Navigate to My Payments
    const myPaymentsButton = await driver.$("-android uiautomator:new UiSelector().text(\"My payments\")");
    await myPaymentsButton.click();
    await driver.pause(3000);

    // Verify screen header
    const screenHeader = await driver.$("-android uiautomator:new UiSelector().text(\"My payments\")");
    await expect(screenHeader).toBeDisplayed();

    // Verify back button is present
    const backButton = await driver.$("-android uiautomator:new UiSelector().description(\"back_button\")");
    await expect(backButton).toBeDisplayed();

    // Verify last payment section
    //const lastPaymentSection = await driver.$("-android uiautomator:new UiSelector().text(\"Your last payment\")");
    //await expect(lastPaymentSection).toBeDisplayed();

    
    // Verify "Previous payments" section header
    const previousPaymentsHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Previous payments\")");
    await expect(previousPaymentsHeader).toBeDisplayed();

    // Check previous payments list
    const previousPaymentsList = await driver.$$("-android uiautomator:new UiSelector().textContains(\"€\")");
    console.log("previousPaymentsList" + previousPaymentsList.length)

    // Verify at least one previous payment exists
    await expect(previousPaymentsList.length).toBeGreaterThan(1);


    // back to common list of account menu
    await backButton.click();
    await driver.pause(2000);

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



  it('should display all key Personal Info screen elements', async () => {

    const testId = "6a7a6836-8165-4e41-acca-16665c6539dc"
    // Send results
 let testStatus = "Pass";
 let screenshotPath = "";
 let testDetails = ""
 let error = null;
 
 try {


    // Click on Account button
    const accountButton = await driver.$("-android uiautomator:new UiSelector().text(\"Account\")");
    await accountButton.click();
    await driver.pause(2000);

    //navigate to personal info

    const personalInfo = await driver.$("-android uiautomator:new UiSelector().text(\"Personal info\")");
    await personalInfo.click();

    // Verify screen header
    const screenHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Personal Info\")");
    await expect(screenHeader).toBeDisplayed();

    // Verify back button is present
    const backButton = await driver.$("-android uiautomator:new UiSelector().description(\"back_button\")");
    await expect(backButton).toBeDisplayed();

    // Verify Email Section
    const emailQuestion = await driver.$("-android uiautomator:new UiSelector().text(\"What is your email?\")");
    await expect(emailQuestion).toBeDisplayed();

    /*const emailValue = await driver.$("-android uiautomator:new UiSelector().text(\"new@gmail.com\")");
    await expect(emailValue).toBeDisplayed(); */

    // Verify Edit button for email
    const emailEditButton = await driver.$("-android uiautomator:new UiSelector().text(\"Edit\")");
    await expect(emailEditButton).toBeDisplayed();

    // Verify Phone Number Section
    const phoneQuestion = await driver.$("-android uiautomator:new UiSelector().text(\"What is your phone number?\")");
    await expect(phoneQuestion).toBeDisplayed();

    /*const phoneValue = await driver.$("-android uiautomator:new UiSelector().text(\"+3197010586556\")");
    await expect(phoneValue).toBeDisplayed(); */

    // Verify Name Section
    const nameQuestion = await driver.$("-android uiautomator:new UiSelector().text(\"What is your name?\")");
    await expect(nameQuestion).toBeDisplayed();

    /*const nameValue = await driver.$("-android uiautomator:new UiSelector().text(\"New\")");
    await expect(nameValue).toBeDisplayed(); */

    // Verify Last Name Section
    const lastNameQuestion = await driver.$("-android uiautomator:new UiSelector().text(\"What is your last name?\")");
    await expect(lastNameQuestion).toBeDisplayed();

    /*const lastNameValue = await driver.$("-android uiautomator:new UiSelector().text(\"New\")");
    await expect(lastNameValue).toBeDisplayed(); */

    // Verify Address Section
    const addressQuestion = await driver.$("-android uiautomator:new UiSelector().text(\"What is your address?\")");
    await expect(addressQuestion).toBeDisplayed();

    /*
    // Verify Street field
    const streetLabel = await driver.$("-android uiautomator:new UiSelector().text(\"Bloemstraat\")");
    await expect(streetLabel).toBeDisplayed();


    // Verify Number field
    const numberLabel = await driver.$("-android uiautomator:new UiSelector().text(\"80\")");
    await expect(numberLabel).toBeDisplayed();

    
    // Verify Country field
    const countryLabel = await driver.$("-android uiautomator:new UiSelector().text(\"Netherlands\")");
    await expect(countryLabel).toBeDisplayed();

    */

  
      //Scroll to bottom
   await driver.executeScript('mobile: scrollGesture', [{
    left: 100,
    top: 1500,
    width: 200,
    height: 100,
    direction: 'down',
    percent: 100
  }]); 
  await driver.pause(5000);

  /*
   // Verify Zip Code field
   const zipCode = await driver.$("-android uiautomator:new UiSelector().text(\"3014\")");
   await expect(zipCode).toBeDisplayed();

    // Verify City field
   const city = await driver.$("-android uiautomator:new UiSelector().text(\"Rotterdam\")");
   await expect(city).toBeDisplayed();

   */

   // Verify Save button
   const saveButton = await driver.$("-android uiautomator:new UiSelector().text(\"SAVE\")");
   await expect(saveButton).toBeDisplayed();

   // Verify Help button
   const helpButton = await driver.$("-android uiautomator:new UiSelector().text(\"Help\")");
   await expect(helpButton).toBeDisplayed();


    // click back button to main acount menu
    await backButton.click();
    await driver.pause(2000);

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



  it('should display all key Ride Credit screen elements', async () => {

    const testId = "3f9c12b7-8c3f-4a3e-bc2c-fdb09536c0a2"
    // Send results
 let testStatus = "Pass";
 let screenshotPath = "";
 let testDetails = ""
 let error = null;
 
 try {

    // Click on Account button
    const accountButton = await driver.$("-android uiautomator:new UiSelector().text(\"Account\")");
    await accountButton.click();
    await driver.pause(2000);
    
    // Navigate to Ride Credit
    const rideCreditButton = await driver.$("-android uiautomator:new UiSelector().text(\"Ride credit\")");
    await rideCreditButton.click();
    await driver.pause(3000);

    // Verify screen header
    const screenHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Ride credit\")");
    await expect(screenHeader).toBeDisplayed();

    // Verify back button is present
    const backButton = await driver.$("-android uiautomator:new UiSelector().description(\"back_button\")");
    await expect(backButton).toBeDisplayed();


    // Verify "Your promotional code" section header
    const promotionalCodeHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Your promotional code\")");
    await expect(promotionalCodeHeader).toBeDisplayed();

    // Verify promotional code description
    const promotionalCodeDescription = await driver.$("-android uiautomator:new UiSelector().textContains(\"Received a promotional code?\")");
    await expect(promotionalCodeDescription).toBeDisplayed();

    // Verify promotional code input field
    const promotionalCodeInput = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\")");
    await expect(promotionalCodeInput).toBeDisplayed();

    // Verify "SUBMIT PROMOTIONAL CODE" button
    const submitPromotionalCodeButton = await driver.$("-android uiautomator:new UiSelector().text(\"SUBMIT PROMOTIONAL CODE\")");
    await expect(submitPromotionalCodeButton).toBeDisplayed();

    //verify that new user vaucher is visible
    const checkVaucher = await driver.$('-android uiautomator:new UiSelector().text("New User Check")');
    await expect (checkVaucher).toBeDisplayed();

    //verify that new user voucher is visible
    const donkeyVaucher = await driver.$('-android uiautomator:new UiSelector().text("New User Donkey Republic")');
    await expect (donkeyVaucher).toBeDisplayed();

    //verify that limitless user's voucher is visible
    const limitlessVoucher = await driver.$('-android uiautomator:new UiSelector().textContains("multi")');
    await expect (limitlessVoucher).toBeDisplayed();



    // click back button to main acount menu
    await backButton.click();
    await driver.pause(2000);

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



  it('should display all key Invite Friends screen elements', async () => {

    const testId = "9c072b4f-6df0-41f8-a64e-42b410edb3e0"
    // Send results
 let testStatus = "Pass";
 let screenshotPath = "";
 let testDetails = ""
 let error = null;
 
 try {

    // Click on Account button
    const accountButton = await driver.$("-android uiautomator:new UiSelector().text(\"Account\")");
    await accountButton.click();
    await driver.pause(2000);
    
    // Navigate to Invite Friends
    const inviteFriendsButton = await driver.$("-android uiautomator:new UiSelector().text(\"Invite friends\")");
    await inviteFriendsButton.click();
    await driver.pause(3000);

    // Verify back button is present
    const backButton = await driver.$("-android uiautomator:new UiSelector().description(\"back_button\")");
    await expect(backButton).toBeDisplayed();

    // Verify screen title
    const screenTitle = await driver.$("-android uiautomator:new UiSelector().text(\"Invite friends and earn €10 for each one!\")");
    await expect(screenTitle).toBeDisplayed();

    // Verify screen description
    const screenDescription = await driver.$("-android uiautomator:new UiSelector().textContains(\"Make a friend ride with umob - both get €10,- ride credit\")");
    await expect(screenDescription).toBeDisplayed();

    // Verify Your Code section
    const yourCodeLabel = await driver.$("-android uiautomator:new UiSelector().text(\"Your code\")");
    await expect(yourCodeLabel).toBeDisplayed();

    /* Verify the actual referral code
    const referralCode = await driver.$("-android uiautomator:new UiSelector().text(\"QYI-S50\")");
    await expect(referralCode).toBeDisplayed(); */

    // Verify usage count
    const usageCount = await driver.$("-android uiautomator:new UiSelector().text(\"Your code has been used 0 out of 5 times\")");
    await expect(usageCount).toBeDisplayed();

    // Verify Share Code button
    const shareCodeButton = await driver.$("-android uiautomator:new UiSelector().text(\"SHARE CODE\")");
    await expect(shareCodeButton).toBeDisplayed();

    // click back button to main acount menu
    await backButton.click();
    await driver.pause(2000);

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


  
  it('should display all key Payment Settings screen elements', async () => {

    const testId = "40a243d5-466e-4a01-8de2-7e40b713f260"
    // Send results
 let testStatus = "Pass";
 let screenshotPath = "";
 let testDetails = ""
 let error = null;
 
 try {

    // Click on Account button
    const accountButton = await driver.$("-android uiautomator:new UiSelector().text(\"Account\")");
    await accountButton.click();
    await driver.pause(2000);
    
    // Navigate to Payment Settings screen
    const paymentSettingsButton = await driver.$("-android uiautomator:new UiSelector().text(\"Payment settings\")");
    await expect(paymentSettingsButton).toBeDisplayed();
    await paymentSettingsButton.click();

    // Verify screen header
    const screenHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Payment method\")");
    await expect(screenHeader).toBeDisplayed();

    // Verify back button is present
    const backButton = await driver.$("-android uiautomator:new UiSelector().description(\"back_button\")");
    await expect(backButton).toBeDisplayed();

    // Verify card information
    //const releaseText = await driver.$("-android uiautomator:new UiSelector().text(\"NEW\")");
    //await expect(releaseText).toBeDisplayed();

    const cardType = await driver.$("-android uiautomator:new UiSelector().text(\"MasterCard\")");
    await expect(cardType).toBeDisplayed();

    const cardNumber = await driver.$("-android uiautomator:new UiSelector().text(\"**** **** **** 1115\")");
    await expect(cardNumber).toBeDisplayed();

    const expiryDate = await driver.$("-android uiautomator:new UiSelector().text(\"03/2030\")");
    await expect(expiryDate).toBeDisplayed();

    // Verify action buttons
    const removeButton = await driver.$("-android uiautomator:new UiSelector().text(\"REMOVE PAYMENT METHOD\")");
    await expect(removeButton).toBeDisplayed();

    const helpButton = await driver.$("-android uiautomator:new UiSelector().text(\"Help\")");
    await expect(helpButton).toBeDisplayed();

    // Optional: Verify container element
    const paymentDetailsContainer = await driver.$("-android uiautomator:new UiSelector().description(\"PaymentDetailsContainer\")");
    await expect(paymentDetailsContainer).toBeDisplayed();

    // click back button to main acount menu
    await backButton.click();
    await driver.pause(2000);

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


  it('should display all key ID Document screen elements', async () => {

    const testId = "a4ff4276-103e-439b-9e0a-f13ff1900ec4"
    // Send results
 let testStatus = "Pass";
 let screenshotPath = "";
 let testDetails = ""
 let error = null;
 
 try {

    // Navigate to Account screen first
    const accountButton = await driver.$("-android uiautomator:new UiSelector().text(\"Account\")");
    await accountButton.click();

    // Navigate to ID Document screen
    const idDocumentButton = await driver.$("-android uiautomator:new UiSelector().text(\"ID Document\")");
    await expect(idDocumentButton).toBeDisplayed();
    await idDocumentButton.click();

    // Verify screen header
    const screenHeader = await driver.$("-android uiautomator:new UiSelector().text(\"ID document\")");
    await expect(screenHeader).toBeDisplayed();

    // Verify back button is present
    const backButton = await driver.$("-android uiautomator:new UiSelector().description(\"back_button\")");
    await expect(backButton).toBeDisplayed();

    // Verify "Verified" status text
    const verifiedStatus = await driver.$("-android uiautomator:new UiSelector().text(\"Verified\")");
    await expect(verifiedStatus).toBeDisplayed();

    // Verify Document Type section
    const documentTypeTitle = await driver.$("-android uiautomator:new UiSelector().text(\"Document type\")");
    await expect(documentTypeTitle).toBeDisplayed();

    const driverLicenseText = await driver.$("-android uiautomator:new UiSelector().text(\"Driver license\")");
    await expect(driverLicenseText).toBeDisplayed();

    // Verify Status section
    const statusTitle = await driver.$("-android uiautomator:new UiSelector().text(\"Status\")");
    await expect(statusTitle).toBeDisplayed();

    const statusVerifiedText = await driver.$("-android uiautomator:new UiSelector().description(\"IdDocumentStatusIdDocumentItemContent\")");
    await expect(statusVerifiedText).toBeDisplayed();

    // Verify Expiration Date section
    const expirationTitle = await driver.$("-android uiautomator:new UiSelector().text(\"Expiration date\")");
    await expect(expirationTitle).toBeDisplayed();

    const expirationDate = await driver.$("-android uiautomator:new UiSelector().text(\"28 May 2031\")");
    await expect(expirationDate).toBeDisplayed();

    // Verify Categories section
    const categoriesTitle = await driver.$("-android uiautomator:new UiSelector().text(\"Categories\")");
    await expect(categoriesTitle).toBeDisplayed();

    // Verify all license categories
    const categoryB = await driver.$("-android uiautomator:new UiSelector().description(\"undefinedIdDocumentItemContentB\")");
    await expect(categoryB).toBeDisplayed();

    const categoryA = await driver.$("-android uiautomator:new UiSelector().description(\"undefinedIdDocumentItemContentA\")");
    await expect(categoryA).toBeDisplayed();

    const categoryB1 = await driver.$("-android uiautomator:new UiSelector().description(\"undefinedIdDocumentItemContentB1\")");
    await expect(categoryB1).toBeDisplayed();

    const categoryAM = await driver.$("-android uiautomator:new UiSelector().description(\"undefinedIdDocumentItemContentAM\")");
    await expect(categoryAM).toBeDisplayed();

    /*

    // Verify Home Address section
    const homeAddressStreet = await driver.$("-android uiautomator:new UiSelector().textContains(\"Bloemstraat 80\")");
    await expect(homeAddressStreet).toBeDisplayed();

    const homeAddressZip = await driver.$("-android uiautomator:new UiSelector().textContains(\"3014\")");
    await expect(homeAddressZip).toBeDisplayed();

    const homeAddressCity = await driver.$("-android uiautomator:new UiSelector().textContains(\"Rotterdam\")");
    await expect(homeAddressCity).toBeDisplayed();

    */

    // Verify bottom buttons
    const changeDocumentButton = await driver.$("-android uiautomator:new UiSelector().text(\"CHANGE DOCUMENT\")");
    await expect(changeDocumentButton).toBeDisplayed();

     //Scroll to bottom
   await driver.executeScript('mobile: scrollGesture', [{
    left: 100,
    top: 1500,
    width: 200,
    height: 100,
    direction: 'down',
    percent: 100
  }]); 
  await driver.pause(3000);


    const helpButton = await driver.$("-android uiautomator:new UiSelector().text(\"Help\")");
    await expect(helpButton).toBeDisplayed();

    // Optional: Verify main container
    const idDocumentContainer = await driver.$("-android uiautomator:new UiSelector().description(\"IdDocumentContainer\")");
    await expect(idDocumentContainer).toBeDisplayed();

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


  it('should display all key delete account screen elements', async () => {

    const testId = "a3b733a8-a9ba-42cf-b0d9-5b5dff6af6f6"
    // Send results
 let testStatus = "Pass";
 let screenshotPath = "";
 let testDetails = ""
 let error = null;
 
 try {

    // Click on Account button
    const accountButton = await driver.$("-android uiautomator:new UiSelector().text(\"Account\")");
    await accountButton.click();
    await driver.pause(2000);

    // Scroll down to make Delete account button visible
    await driver.executeScript('mobile: scrollGesture', [{
      left: 100,
      top: 1000,
      width: 200,
      height: 800,
      direction: 'down',
      percent: 50.0
    }]);
    await driver.pause(1000);

    // Click on Delete account button
    const deleteAccountButton = await driver.$("-android uiautomator:new UiSelector().text(\"Delete account\")");
    await expect(deleteAccountButton).toBeDisplayed();
    await deleteAccountButton.click();
    await driver.pause(2000);

    // Verify delete account screen title
    const screenTitle = await driver.$("-android uiautomator:new UiSelector().resourceId(\"DeleteAccountDetailsTitle\")");
    await expect(screenTitle).toBeDisplayed();
    await expect(await screenTitle.getText()).toBe("Are you sure you want to delete your account?");

    // Verify warning message
    const warningMessage = await driver.$("-android uiautomator:new UiSelector().resourceId(\"DeleteAccountDetailsMessage\")");
    await expect(warningMessage).toBeDisplayed();
    const messageText = await warningMessage.getText();
    await expect(messageText).toContain("Please note that by confirming deletion");
    await expect(messageText).toContain("Delete Policy");

    // Verify checkbox and its text
    const checkbox = await driver.$("-android uiautomator:new UiSelector().resourceId(\"DeleteAccountDetailsCheckBox\")");
    await expect(checkbox).toBeDisplayed();
    const checkboxText = await checkbox.getText();
    await expect(checkboxText).toBe("I understand that all my data will be deleted and I can no longer use the umob service");

    // Verify DELETE button
    const deleteButton = await driver.$("-android uiautomator:new UiSelector().resourceId(\"DeleteAccountDetailsDelete\")");
    await expect(deleteButton).toBeDisplayed();
    const deleteButtonText = await driver.$("-android uiautomator:new UiSelector().resourceId(\"DeleteAccountDetailsDelete-text\")");
    await expect(await deleteButtonText.getText()).toBe("DELETE");
    // Verify DELETE button is initially disabled
    await expect(await deleteButton.isEnabled()).toBe(false);

    // Verify CANCEL button
    const cancelButton = await driver.$("-android uiautomator:new UiSelector().resourceId(\"DeleteAccountDetailsCancel\")");
    await expect(cancelButton).toBeDisplayed();
    const cancelButtonText = await driver.$("-android uiautomator:new UiSelector().resourceId(\"DeleteAccountDetailsCancel-text\")");
    await expect(await cancelButtonText.getText()).toBe("CANCEL");
    // Verify CANCEL button is enabled
    await expect(await cancelButton.isEnabled()).toBe(true);

    // Verify Help button
    const helpButton = await driver.$("-android uiautomator:new UiSelector().text(\"Help\")");
    await expect(helpButton).toBeDisplayed();

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


  it('should display all key map theme settings screen elements', async () => {

    const testId = "3b2fecf4-01af-4c36-9a14-819cbbe70f1b"
    // Send results
 let testStatus = "Pass";
 let screenshotPath = "";
 let testDetails = ""
 let error = null;
 
 try {


    // Click on Settings button to navigate to settings
    const settingsButton = await driver.$("-android uiautomator:new UiSelector().text(\"Settings\")");
    await settingsButton.click();
    await driver.pause(2000);

    // Click on Map theme settings option
    const mapThemeOption = await driver.$("-android uiautomator:new UiSelector().text(\"Map theme settings\")");
    await mapThemeOption.click();
    await driver.pause(2000);

    // Verify header elements
    const backButton = await driver.$('~back_button');
    await expect(backButton).toBeDisplayed();

    const headerTitle = await driver.$('~settings_menu_map_theme_comp-header-title');
    await expect(headerTitle).toBeDisplayed();
    await expect(await headerTitle.getText()).toBe("Map theme settings");

    // Verify map preview image is displayed
    const mapPreviewImage = await driver.$('android.widget.ImageView');
    await expect(mapPreviewImage).toBeDisplayed();

    // Verify all theme options are displayed and check their properties
    const themeOptions = [
      { name: 'Dark' },
      { name: 'Light' },
      { name: 'Terrain' },
      { name: 'Playground' }
    ];

    for (const theme of themeOptions) {
      // Verify the theme text using UiSelector
      const themeText = await driver.$(`-android uiautomator:new UiSelector().text("${theme.name}")`);
      await expect(themeText).toBeDisplayed();

      // Verify the theme container using content-desc
      const themeContainer = await driver.$(`~${theme.name}`);
      await expect(themeContainer).toBeDisplayed();

      // If it's the Light theme (which appears selected in the XML), verify the selection indicator
      if (theme.name === 'Light') {
        const container = await driver.$(`-android uiautomator:new UiSelector().text("${theme.name}").fromParent(new UiSelector().className("com.horcrux.svg.SvgView"))`);
        await expect(container).toBeDisplayed();
      }
    }
    // click back button to go to the app settings
    await backButton.click();
    await driver.pause(2000);

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



  it('should display all key language screen elements and settings screen key elements', async () => {

    const testId = "73556f25-f1ad-4985-abc5-4d9459a2509c"
    // Send results
 let testStatus = "Pass";
 let screenshotPath = "";
 let testDetails = ""
 let error = null;
 
 try {
    
    const settingsButton = await driver.$("-android uiautomator:new UiSelector().text(\"Settings\")");
    await settingsButton.click();
    await driver.pause(2000);

    // Click on Language option to navigate to language screen
    const languageOption = await driver.$("-android uiautomator:new UiSelector().text(\"Language\")");
    await languageOption.click();
    await driver.pause(2000);

    // Verify header elements
    const backButton = await driver.$('~back_button');
    await expect(backButton).toBeDisplayed();

    const headerTitle = await driver.$('~undefined-header-title');
    await expect(headerTitle).toBeDisplayed();
    await expect(await headerTitle.getText()).toBe("Language");

    // Verify all language options are displayed
    const languageOptions = [
      { name: "English", selected: true },
      { name: "Français", selected: false },
      { name: "Dutch", selected: false },
      { name: "Deutsche", selected: false },
      { name: "Español", selected: false }
    ];

    for (const language of languageOptions) {
      const languageElement = await driver.$(`~${language.name}`);
      await expect(languageElement).toBeDisplayed();
      
      // Verify the language text
      const languageText = await driver.$(`-android uiautomator:new UiSelector().text("${language.name}")`);
      await expect(languageText).toBeDisplayed();

      // If it's the selected language (English by default), verify the selection indicator
      if (language.selected) {
        // The SVG checkmark is present only for the selected language
        const checkmark = await languageElement.$('com.horcrux.svg.SvgView');
        await expect(checkmark).toBeDisplayed();
      }
    }

    //click the back button to the app settings screen
    await backButton.click();
    await driver.pause(2000);

    // Verify "App settings" header is present
    const appSettingsHeader = await driver.$("-android uiautomator:new UiSelector().text(\"App settings\")");
    await expect(appSettingsHeader).toBeDisplayed();

    // Verify Support section header
    const supportHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Support\")");
    await expect(supportHeader).toBeDisplayed();

    // Verify Privacy & Legal section
    const privacyLegalButton = await driver.$("-android uiautomator:new UiSelector().text(\"Privacy & Legal\")");
    await expect(privacyLegalButton).toBeDisplayed();

    // Verify LogOut button
    const logoutButton = await driver.$("-android uiautomator:new UiSelector().text(\"LOG OUT\")");
    await expect(logoutButton).toBeDisplayed();

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

  
  it('should successfully logout from the app', async () => {

    const testId = "fc651985-1b70-4dbe-96a9-87e00a3f96b1"
    // Send results
 let testStatus = "Pass";
 let screenshotPath = "";
 let testDetails = ""
 let error = null;
 
 try {


    // Click on Settings button to navigate to settings
    const settingsButton = await driver.$("-android uiautomator:new UiSelector().text(\"Settings\")");
    await settingsButton.click();
    await driver.pause(2000);

    // Click on LogOut option 
    const logoutButton = await driver.$("-android uiautomator:new UiSelector().text(\"LOG OUT\")");
    await expect(logoutButton).toBeDisplayed();
    await logoutButton.click();

    // verify Sign up button appeared
    const signUpButton = await driver.$("-android uiautomator:new UiSelector().text(\"Sign up\")");
    await expect(signUpButton).toBeDisplayed();

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




  afterEach(async () => {
    try {
      await driver.terminateApp("com.umob.umob");
    } catch (error) {
      console.log('Error terminating app:', error);
    }
  });
})