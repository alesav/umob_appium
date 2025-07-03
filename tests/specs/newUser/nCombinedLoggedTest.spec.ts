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
const USER = process.env.TEST_USER || 'newUser';

/////////////////////////////////////////////////////////////////////////////////

describe('Combined Tests For Logged in New User Without Rides', () => {

  
  beforeEach(async () => {
    await driver.activateApp("com.umob.umob");
    await driver.pause(7000);
  });

  before(async () => {

    const credentials = getCredentials(ENV, USER);

    await PageObjects.login({ username: credentials.username, password: credentials.password });

    
    //await PageObjects.login({ username:'new13@gmail.com', password: '123Qwerty!' });
});


it('should verify main screen elements and welcome vouchers on PROMOS screen', async () => {

  const testId = "3ce0c6b4-2ed7-40c4-adf7-a8838233f18c"
  // Send results
let testStatus = "Pass";
let screenshotPath = "";
let testDetails = ""
let error = null;

try {

  // Verify filter button is displayed
     const assetFilterToggle = await driver.$('-android uiautomator:new UiSelector().resourceId("home_asset_filter_toggle")');
     await expect(assetFilterToggle).toBeDisplayed();

   // Check for map root element
   const mapRoot = await driver.$('-android uiautomator:new UiSelector().resourceId("map_root")');
   await expect(mapRoot).toBeDisplayed();

    // Verify bottom navigation menu items and click Promos button
    await PageObjects.planTripBtn.waitForExist();
    //const planTrip = await driver.$('-android uiautomator:new UiSelector().text("Plan Trip")');
    //await expect(planTrip).toBeDisplayed();
    await PageObjects.promosBtn.waitForExist();
    await PageObjects.promosBtn.click();
    // const promos = await driver.$('-android uiautomator:new UiSelector().text("PROMOS")');
    // await expect(promos).toBeDisplayed();
    // await promos.click();

    //verify welcome vouchers

    const donkeyVoucher = await driver.$('-android uiautomator:new UiSelector().text("New User Donkey Republic")');
    await expect(donkeyVoucher).toBeDisplayed();
    const checkVoucher = await driver.$('-android uiautomator:new UiSelector().text("New User Check")');
    await expect(checkVoucher).toBeDisplayed();

  

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

    const testId = "4a6deca6-6d69-42fe-bef5-e2d9adf47398"
    // Send results
  let testStatus = "Pass";
  let screenshotPath = "";
  let testDetails = ""
  let error = null;
  
  try {

    //click on finish later button to avoid payment method registration
    // const finishLater = await driver.$("-android uiautomator:new UiSelector().text(\"FINISH LATER\")");
    // await expect(finishLater).toBeDisplayed();
    // await finishLater.click();

    // Click on Account button
    await PageObjects.clickAccountButton();

    await driver.pause(2000);

    // Verify screen header
    //const screenHeader = await driver.$("-android uiautomator:new UiSelector().resourceId(\"MyAccountContainer-header-title\")");
    //await expect(screenHeader).toBeDisplayed();
    //await expect(await screenHeader.getText()).toBe("My Account");

    // Verify user welcome message
    //const welcomeText = await driver.$("-android uiautomator:new UiSelector().text(\"Welcome back,\")");
    //await expect(welcomeText).toBeDisplayed();

    
    // Verify not completed registration (payment method not added)
    //const notRegist = await driver.$("-android uiautomator:new UiSelector().text(\"Continue registration\")");
    //await expect(notRegist).toBeDisplayed();
    //await driver.pause(2000);
    
    
    /*
    //verify that add payment screen is displayed after clicking PAYMENT
    const payment = await driver.$("-android uiautomator:new UiSelector().text(\"PAYMENT\")");
    await expect(payment).toBeDisplayed();
    await (payment).click();

    const paymentButton = await driver.$("-android uiautomator:new UiSelector().text(\"ADD PAYMENT METHOD\")");
    await expect(paymentButton).toBeDisplayed();
    await (paymentButton).click(); 
    
    */

    //const paymentHeader = await driver.$("id:com.umob.umob:id/payment_method_header_title");
    //await expect(paymentHeader).toBeDisplayed();

    /*
    const paymentHeader = await driver.$('-android uiautomator:new UiSelector().text("Bancontact card")');
    await expect(paymentHeader).toBeDisplayed();

    const cards = await driver.$('-android uiautomator:new UiSelector().text("Cards")');
    await expect(cards).toBeDisplayed();

    const bancontactCard = await driver.$('-android uiautomator:new UiSelector().text("Bancontact card")');
    await expect(bancontactCard).toBeDisplayed();

    const googlePay = await driver.$('-android uiautomator:new UiSelector().text("Google Pay")');
    await expect(googlePay).toBeDisplayed();

    const payPal = await driver.$('-android uiautomator:new UiSelector().text("PayPal")');
    await expect(payPal).toBeDisplayed();

    //close popup
    const closePopup = await driver.$("id:com.umob.umob:id/imageView_close");
    await closePopup.click();

    //click back button
    const backButton1 = await driver.$("accessibility id:back_button");
    await backButton1.click();

    */

    //or click it this way
    //const backButton2 = await driver.$("-android uiautomator:new UiSelector().resourceId(\"back_button\")");
    //await expect(backButton2).toBeDisplayed();
    //await backButton2.click();

    
    // Verify account menu items
    const accountMenuItems = [
      "Invite friends",
       "Personal info",
       "Payment settings",
       "ID Document",
       "My Rides & Tickets",
     ];
 
     for (const menuItem of accountMenuItems) {
       const menuElement = await driver.$(`-android uiautomator:new UiSelector().text("${menuItem}")`);
       await expect(menuElement).toBeDisplayed();
 
     }
 
      /*
    await driver.executeScript('mobile: scrollGesture', [{
      left: 100, 
      top: 1000, 
      width: 200, 
      height: 800, 
      direction: 'down',
      percent: 10.0
    }]);
    */

/*
      //scroll to verify other account options
    await driver.executeScript('mobile: scrollGesture', [{
      left: 100, 
      top: 1000, 
      width: 200, 
      height: 800, 
      direction: 'down',
      percent: 100.0
    }]);
*/
const { width, height } = await driver.getWindowSize();
await driver.performActions([
  {
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
          { type: 'pointerMove', duration: 0, x: width/2, y: height*0.8 },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerMove', duration: 1000, x: width/2, y: height*0.3 },
          { type: 'pointerUp', button: 0 },
      ],
  },]);


       
 // Verify account menu items after first scrolling
const accountMenuItems2 = [
  "Ride credit",
  "My payments",
  "Language",
  "Map theme settings",
];

for (const menuItem of accountMenuItems2) {
  const menuElement = await driver.$(`-android uiautomator:new UiSelector().text("${menuItem}")`);
  await expect(menuElement).toBeDisplayed();}

  await driver.performActions([
    {
        type: 'pointer',
        id: 'finger2',
        parameters: { pointerType: 'touch' },
        actions: [
            { type: 'pointerMove', duration: 0, x: width/2, y: height*0.9 },
            { type: 'pointerDown', button: 0 },
            { type: 'pause', duration: 100 },
            { type: 'pointerMove', duration: 1000, x: width/2, y: 10 },
            { type: 'pointerUp', button: 0 },
        ],
    },]);
    await driver.pause(2000);
  

  // Verify account menu items after second scrolling
const accountMenuItems3 = [
"Support",
"Delete account"
];

for (const menuItem of accountMenuItems3) {
const menuElement = await driver.$(`-android uiautomator:new UiSelector().text("${menuItem}")`);
await expect(menuElement).toBeDisplayed();
}

    // Verify Log Out button
    const screenHeader = await driver.$("-android uiautomator:new UiSelector().text(\"LOG OUT\")");
    await expect(screenHeader).toBeDisplayed();

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


  
  it('should display all key Invite Friends screen elements', async () => {

    const testId = "bb19b9f3-22b4-4577-9227-29b183649e94"
    // Send results
  let testStatus = "Pass";
  let screenshotPath = "";
  let testDetails = ""
  let error = null;
  
  try {

    //click on finish later button to avoid payment method registration
    // const finishLater = await driver.$("-android uiautomator:new UiSelector().text(\"FINISH LATER\")");
    // await expect(finishLater).toBeDisplayed();
    // await finishLater.click();

    // Click on Account button
    // const accountButton = await driver.$("-android uiautomator:new UiSelector().text(\"Account\")");
    // await accountButton.click();
    // await driver.pause(2000);
    await PageObjects.clickAccountButton();
     await driver.pause(3000);
     
    // Navigate to Invite Friends
    const inviteFriendsButton = await driver.$("-android uiautomator:new UiSelector().text(\"Invite friends\")");
    await inviteFriendsButton.click();
    await driver.pause(3000);

    // Verify back button is present
    const backButton = await driver.$("-android uiautomator:new UiSelector().description(\"back_button\")");
    await expect(backButton).toBeDisplayed();

    // Verify screen title
    //const screenTitle = await driver.$("-android uiautomator:new UiSelector().text(\"Invite friends and earn €10 for each one!\")");
    const screenTitle = await driver.$("-android uiautomator:new UiSelector().text(\"Invite your friends\")");
    await expect(screenTitle).toBeDisplayed();

    
        const descriptionHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Give €10, Get €10\")");
    await expect(descriptionHeader).toBeDisplayed();


    // Verify screen description
    //const screenDescription = await driver.$("-android uiautomator:new UiSelector().textContains(\"Make a friend ride with umob - both get €10,- ride credit. Make them all ride and enjoy!\")");
    const screenDescription = await driver.$("-android uiautomator:new UiSelector().textContains(\"Invite a friend to join umob, and\")");
    await expect(screenDescription).toBeDisplayed();

    // Verify Your Code section
    const yourCodeLabel = await driver.$("-android uiautomator:new UiSelector().text(\"Your code\")");
    await expect(yourCodeLabel).toBeDisplayed();

    /* Verify the actual referral code
    const referralCode = await driver.$("-android uiautomator:new UiSelector().text(\"QYI-S50\")");
    await expect(referralCode).toBeDisplayed(); */

    /*
    await driver.pause(3000);
    const { width, height } = await driver.getWindowSize();
    await driver.executeScript('mobile: scrollGesture', [{
     left: width/2,
     top: 0,
     width: 0,
     height: height*0.8,
     direction: 'down',
     percent: 2
    }]);
    await driver.pause(2000);
    */

    const { width, height } = await driver.getWindowSize();
await driver.performActions([
  {
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
          { type: 'pointerMove', duration: 0, x: width/2, y: 500 },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerMove', duration: 1000, x: width/2, y: 10 },
          { type: 'pointerUp', button: 0 },
      ],
  },]);

    // Verify usage count
    //const usageCount = await driver.$("-android uiautomator:new UiSelector().text(\"Your code has been used 0 out of 5 times\")");
    //await expect(usageCount).toBeDisplayed();

    // Verify Share Code button
    //const shareCodeButton = await driver.$("-android uiautomator:new UiSelector().text(\"SHARE CODE\")");
    const shareCodeButton = await driver.$("-android uiautomator:new UiSelector().text(\"INVITE FRIENDS\")");
    await expect(shareCodeButton).toBeDisplayed();

    const viewStats = await driver.$("-android uiautomator:new UiSelector().text(\"VIEW YOUR STATS\")");
    await expect(viewStats).toBeDisplayed();

/*
    await driver.executeScript('mobile: scrollGesture', [{
      left: width/2,
      top: 0,
      width: 0,
      height: height*0.8,
      direction: 'up',
      percent: 2
     }]);
     await driver.pause(2000);
*/

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



  it('should display all key Personal Info screen elements', async () => {

    const testId = "d224e3c1-e296-4c4c-b8ad-fc19cfe35c4f"
    // Send results
  let testStatus = "Pass";
  let screenshotPath = "";
  let testDetails = ""
  let error = null;
  
  try {

    //click on finish later button to avoid payment method registration
    // const finishLater = await driver.$("-android uiautomator:new UiSelector().text(\"FINISH LATER\")");
    // await expect(finishLater).toBeDisplayed();
    // await finishLater.click();

    // Click on Account button
    // const accountButton = await driver.$("-android uiautomator:new UiSelector().text(\"Account\")");
    // await accountButton.click();
    // await driver.pause(2000);
    await PageObjects.clickAccountButton();
     await driver.pause(3000);

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

    const { width, height } = await driver.getWindowSize();
    await driver.performActions([
      {
          type: 'pointer',
          id: 'finger1',
          parameters: { pointerType: 'touch' },
          actions: [
              { type: 'pointerMove', duration: 0, x: width/2, y: 500 },
              { type: 'pointerDown', button: 0 },
              { type: 'pause', duration: 100 },
              { type: 'pointerMove', duration: 1000, x: width/2, y: 20 },
              { type: 'pointerUp', button: 0 },
          ],
      },]);
    

    // // Verify Street field
    const streetLabel = await driver.$("-android uiautomator:new UiSelector().text(\"Street\")");
    await expect(streetLabel).toBeDisplayed();


    // // Verify Number field
    const numberLabel = await driver.$("-android uiautomator:new UiSelector().text(\"Number\")");
    await expect(numberLabel).toBeDisplayed();

    
    // // Verify Country field
    const countryLabel = await driver.$("-android uiautomator:new UiSelector().text(\"Country\")");
    await expect(countryLabel).toBeDisplayed();

    /*
  
      //Scroll to bottom
   await driver.executeScript('mobile: scrollGesture', [{
    left: 100,
    top: 1500,
    width: 200,
    height: 100,
    direction: 'down',
    percent: 100.0
  }]); 
  await driver.pause(5000);
  */

  
    await driver.performActions([
      {
          type: 'pointer',
          id: 'finger1',
          parameters: { pointerType: 'touch' },
          actions: [
              { type: 'pointerMove', duration: 0, x: width/2, y: 950 },
              { type: 'pointerDown', button: 0 },
              { type: 'pause', duration: 100 },
              { type: 'pointerMove', duration: 1000, x: width/2, y: 10 },
              { type: 'pointerUp', button: 0 },
          ],
      },]);
    

  
   // Verify Zip Code field
   const zipCode = await driver.$("-android uiautomator:new UiSelector().text(\"Zip Code\")");
   await expect(zipCode).toBeDisplayed();

    // Verify City field
   const city = await driver.$("-android uiautomator:new UiSelector().text(\"City\")");
   await expect(city).toBeDisplayed();

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


  it('should display all key ID Document screen elements and verify Onfido screen of document verification', async () => {

    const testId = "46893f57-5045-4d7e-8483-6c1e24ad4aed"
    // Send results
  let testStatus = "Pass";
  let screenshotPath = "";
  let testDetails = ""
  let error = null;
  
  try {

    //click on finish later button to avoid payment method registration
    // const finishLater = await driver.$("-android uiautomator:new UiSelector().text(\"FINISH LATER\")");
    // await expect(finishLater).toBeDisplayed();
    // await finishLater.click();

    // Navigate to Account screen first
    // const accountButton = await driver.$("-android uiautomator:new UiSelector().text(\"Account\")");
    // await accountButton.click();
    await PageObjects.clickAccountButton();
     await driver.pause(2000);

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

    // Verify status text
    const verifiedStatus = await driver.$("-android uiautomator:new UiSelector().text(\"No Submitted\")");
    await expect(verifiedStatus).toBeDisplayed();

    // Verify Home adress section
    const homeAdress = await driver.$("-android uiautomator:new UiSelector().text(\"Home address\")");
    await expect(verifiedStatus).toBeDisplayed();

    // Verify Add adress button
    const addButton = await driver.$("-android uiautomator:new UiSelector().text(\"ADD\")");
    await expect(verifiedStatus).toBeDisplayed();

    /*

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

    // Verify Home Address section
    // const homeAddressStreet = await driver.$("-android uiautomator:new UiSelector().textContains(\"Bloemstraat 80\")");
    // await expect(homeAddressStreet).toBeDisplayed();

    // const homeAddressZip = await driver.$("-android uiautomator:new UiSelector().textContains(\"3014\")");
    // await expect(homeAddressZip).toBeDisplayed();

    // const homeAddressCity = await driver.$("-android uiautomator:new UiSelector().textContains(\"Rotterdam\")");
    // await expect(homeAddressCity).toBeDisplayed();

    */

    const { width, height } = await driver.getWindowSize();
    await driver.performActions([
      {
          type: 'pointer',
          id: 'finger1',
          parameters: { pointerType: 'touch' },
          actions: [
              { type: 'pointerMove', duration: 0, x: width/2, y: 500 },
              { type: 'pointerDown', button: 0 },
              { type: 'pause', duration: 100 },
              { type: 'pointerMove', duration: 1000, x: width/2, y: 10 },
              { type: 'pointerUp', button: 0 },
          ],
      },]);
    
    // Verify bottom buttons
    const changeDocumentButton = await driver.$("-android uiautomator:new UiSelector().text(\"ADD ID DOCUMENT\")");
    await expect(changeDocumentButton).toBeDisplayed();

    // Verify bottom buttons
    //const changeDocumentButton = await driver.$("-android uiautomator:new UiSelector().text(\"CHANGE DOCUMENT\")");
    //await expect(changeDocumentButton).toBeDisplayed();



    /*

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

  */


    const helpButton = await driver.$("-android uiautomator:new UiSelector().text(\"Help\")");
    await expect(helpButton).toBeDisplayed();

    // Optional: Verify main container
    const idDocumentContainer = await driver.$("-android uiautomator:new UiSelector().description(\"IdDocumentContainer\")");
    await expect(idDocumentContainer).toBeDisplayed();

    //verify that app is connecting with Onfido service
    await changeDocumentButton.click();

    const idHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Add your identification document\")");
    await expect(idHeader).toBeDisplayed();

    
    const question = await driver.$("-android uiautomator:new UiSelector().text(\"Which document to use?\")");
    await expect(question).toBeDisplayed();

    
    const text = await driver.$("-android uiautomator:new UiSelector().textContains(\"Enable camera and microphone\")");
    await expect(text).toBeDisplayed();

    
    const text1 = await driver.$("-android uiautomator:new UiSelector().textContains(\"Verify\")");
    await expect(text1).toBeDisplayed();

    
    const text2 = await driver.$("-android uiautomator:new UiSelector().textContains(\"Verify your ID\")");
    await expect(text2).toBeDisplayed();

    const startVerification = await driver.$("-android uiautomator:new UiSelector().textContains(\"START ID VERIFICATION\")");
    await expect(startVerification).toBeDisplayed();

    await startVerification.click();

    //allow permission for mobile
    const permission = await driver.$("id:com.android.permissioncontroller:id/permission_allow_foreground_only_button");
    await expect(permission).toBeDisplayed();
    await permission.click();
    await driver.pause(2000);

    //allow permission for mobile
    // const permission2 = await driver.$("id:com.android.permissioncontroller:id/permission_allow_foreground_only_button");
    // await expect(permission2).toBeDisplayed();
    // await permission2.click();

    const allowBut = await driver.$("-android uiautomator:new UiSelector().textContains(\"While using\")");
    await expect(allowBut).toBeDisplayed();
    await allowBut.click();

    //verify onfido screen
    const el2 = await driver.$("-android uiautomator:new UiSelector().text(\"Select issuing country to see which documents we accept\")");
    await expect(el2).toBeDisplayed();

    const el3 = await driver.$("-android uiautomator:new UiSelector().text(\"ISSUING COUNTRY\")");
    await expect(el3).toBeDisplayed();

    
    const el4 = await driver.$("-android uiautomator:new UiSelector().text(\"ACCEPTED DOCUMENTS\")");
    await expect(el4).toBeDisplayed();

    
    await driver.performActions([
      {
          type: 'pointer',
          id: 'finger1',
          parameters: { pointerType: 'touch' },
          actions: [
              { type: 'pointerMove', duration: 0, x: width/2, y: 500 },
              { type: 'pointerDown', button: 0 },
              { type: 'pause', duration: 100 },
              { type: 'pointerMove', duration: 1000, x: width/2, y: 10 },
              { type: 'pointerUp', button: 0 },
          ],
      },]);
    

  
    const el6 = await driver.$("-android uiautomator:new UiSelector().textContains(\"National identity card\")");
    await expect(el6).toBeDisplayed();

    
    const el7 = await driver.$("-android uiautomator:new UiSelector().textContains(\"Passport\")");
    await expect(el7).toBeDisplayed();

    const el5 = await driver.$("-android uiautomator:new UiSelector().textContains(\"Driver’s license\")");
    await expect(el5).toBeDisplayed();



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

    const testId = "f9801780-f8a4-48f4-8620-c99ce3c80667"
    // Send results
  let testStatus = "Pass";
  let screenshotPath = "";
  let testDetails = ""
  let error = null;
  
  try {

    //click on finish later button to avoid payment method registration
    // const finishLater = await driver.$("-android uiautomator:new UiSelector().text(\"FINISH LATER\")");
    // await expect(finishLater).toBeDisplayed();
    // await finishLater.click();

    
    // Click on Account button
  //  const accountButton = await driver.$("-android uiautomator:new UiSelector().text(\"Account\")");
  //  await accountButton.click();
    await PageObjects.clickAccountButton();
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
    const lastRideSection = await driver.$("-android uiautomator:new UiSelector().text(\"You have not made any rides yet. If you have finished a ride you will find all details here. Enjoy!\")");
    await expect(lastRideSection).toBeDisplayed();


    // Check previous payments list
    //const previousPaymentsList = await driver.$$("-android uiautomator:new UiSelector().textContains(\"€\")");
    //console.log("previousPaymentsList" + previousPaymentsList.length)

    // Verify at least one previous payment exists
    //await expect(previousPaymentsList.length).toBeGreaterThan(1);

    
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


  it('should display all key Ride Credit screen elements', async () => {

    const testId = "309008c8-d517-418c-b2b2-f2bff94af78f"
    // Send results
  let testStatus = "Pass";
  let screenshotPath = "";
  let testDetails = ""
  let error = null;
  
  try {

    //click on finish later button to avoid payment method registration
    // const finishLater = await driver.$("-android uiautomator:new UiSelector().text(\"FINISH LATER\")");
    // await expect(finishLater).toBeDisplayed();
    // await finishLater.click();

    // Click on Account button
    // const accountButton = await driver.$("-android uiautomator:new UiSelector().text(\"Account\")");
    // await accountButton.click();
    // await driver.pause(2000);
    await driver.pause(3000);
    await PageObjects.clickAccountButton();
     await driver.pause(3000);

     const { width, height } = await driver.getWindowSize();
 await driver.performActions([
   {
       type: 'pointer',
       id: 'finger1',
       parameters: { pointerType: 'touch' },
       actions: [
           { type: 'pointerMove', duration: 0, x: width/2, y: height*0.7 },
           { type: 'pointerDown', button: 0 },
           { type: 'pause', duration: 100 },
           { type: 'pointerMove', duration: 1000, x: width/2, y: height*0.4 },
           { type: 'pointerUp', button: 0 },
       ],
   },]);
    
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

    await driver.performActions([
      {
          type: 'pointer',
          id: 'finger1',
          parameters: { pointerType: 'touch' },
          actions: [
              { type: 'pointerMove', duration: 0, x: width/2, y: height*0.81 },
              { type: 'pointerDown', button: 0 },
              { type: 'pause', duration: 100 },
              { type: 'pointerMove', duration: 1000, x: width/2, y: height*0.2 },
              { type: 'pointerUp', button: 0 },
          ],
      },]);
    
    

    // Verify promotional code input field
    const promotionalCodeInput = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\")");
    await expect(promotionalCodeInput).toBeDisplayed();

    // Verify "SUBMIT PROMOTIONAL CODE" button
    const submitPromotionalCodeButton = await driver.$("-android uiautomator:new UiSelector().text(\"SUBMIT PROMOTIONAL CODE\")");
    await expect(submitPromotionalCodeButton).toBeDisplayed();

    //verify that new user vaucher is visible
    const checkVaucher = await driver.$('-android uiautomator:new UiSelector().text("New User Check")');
    await expect (checkVaucher).toBeDisplayed();

    //verify that new user vaucher is visible
    const donkeyVaucher = await driver.$('-android uiautomator:new UiSelector().text("New User Donkey Republic")');
    await expect (donkeyVaucher).toBeDisplayed();

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



  it('should display all key My Payments screen elements', async () => {

    const testId = "e079b628-09f9-4125-9602-3bdf41f428de"
    // Send results
  let testStatus = "Pass";
  let screenshotPath = "";
  let testDetails = ""
  let error = null;
  
  try {

    //click on finish later button to avoid payment method registration
    // const finishLater = await driver.$("-android uiautomator:new UiSelector().text(\"FINISH LATER\")");
    // await expect(finishLater).toBeDisplayed();
    // await finishLater.click();

    // Click on Account button
    // const accountButton = await driver.$("-android uiautomator:new UiSelector().text(\"Account\")");
    // await accountButton.click();
    // await driver.pause(2000);
    await driver.pause(3000);
    await PageObjects.clickAccountButton();
     await driver.pause(3000);

     const { width, height } = await driver.getWindowSize();
    await driver.performActions([
      {
          type: 'pointer',
          id: 'finger1',
          parameters: { pointerType: 'touch' },
          actions: [
              { type: 'pointerMove', duration: 0, x: width/4, y: height*0.7 },
              { type: 'pointerDown', button: 0 },
              { type: 'pause', duration: 100 },
              { type: 'pointerMove', duration: 1000, x: width/4, y: height*0.3 },
              { type: 'pointerUp', button: 0 },
          ],
      },]);
    
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
    const lastPaymentSection = await driver.$("-android uiautomator:new UiSelector().text(\"You have not yet made any payments yet. In this list you will find an overview of all your payments and the status.\")");
    await expect(lastPaymentSection).toBeDisplayed();

    
    // // Verify "Previous payments" section header
    // const previousPaymentsHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Previous payments\")");
    // await expect(previousPaymentsHeader).toBeDisplayed();

    // // Check previous payments list
    // const previousPaymentsList = await driver.$$("-android uiautomator:new UiSelector().textContains(\"€\")");
    // console.log("previousPaymentsList" + previousPaymentsList.length)

    // // Verify at least one previous payment exists
    // await expect(previousPaymentsList.length).toBeGreaterThan(1);


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



  it('should display all key language screen elements', async () => {

    const testId = "0001c001-def2-4180-928e-16f59a412e54"
    // Send results
  let testStatus = "Pass";
  let screenshotPath = "";
  let testDetails = ""
  let error = null;
  
  try {

    //click on finish later button to avoid payment method registration
    // const finishLater = await driver.$("-android uiautomator:new UiSelector().text(\"FINISH LATER\")");
    // await expect(finishLater).toBeDisplayed();
    // await finishLater.click();
    
    //const settingsButton = await driver.$("-android uiautomator:new UiSelector().text(\"Settings\")");
    //await settingsButton.click();
    //await driver.pause(2000);

    await driver.pause(3000);
    await PageObjects.clickAccountButton();
     await driver.pause(3000);

     /*
    // Scroll down to make Language button visible
    await driver.executeScript('mobile: scrollGesture', [{
      left: 100,
      top: 1000,
      width: 200,
      height: 800,
      direction: 'down',
      percent: 100.0
    }]);
    await driver.pause(1000);

    */

    const { width, height } = await driver.getWindowSize();
await driver.performActions([
  {
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
          { type: 'pointerMove', duration: 0, x: width/4, y: height*0.85 },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerMove', duration: 1000, x: width/4, y: height*0.35 },
          { type: 'pointerUp', button: 0 },
      ],
  },]);
  await driver.pause(3000);

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

    //click the back button to the account screen
    await backButton.click();
    await driver.pause(2000);

  

/*


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

    */

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

    const testId = "e0c819eb-052d-4163-b7d2-276069b6964d"
    // Send results
  let testStatus = "Pass";
  let screenshotPath = "";
  let testDetails = ""
  let error = null;
  
  try {

    //click on finish later button to avoid payment method registration
    // const finishLater = await driver.$("-android uiautomator:new UiSelector().text(\"FINISH LATER\")");
    // await expect(finishLater).toBeDisplayed();
    // await finishLater.click();

    //go to account
    await driver.pause(3000);
    await PageObjects.clickAccountButton();
     await driver.pause(3000);

     /*
     // Scroll down to map theme settings
    await driver.executeScript('mobile: scrollGesture', [{
      left: 100,
      top: 1000,
      width: 200,
      height: 800,
      direction: 'down',
      percent: 100.0
    }]);
    await driver.pause(1000);

    */

    const { width, height } = await driver.getWindowSize();
await driver.performActions([
  {
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
          { type: 'pointerMove', duration: 0, x: width/4, y: height*0.8 },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerMove', duration: 1000, x: width/4, y: 10 },
          { type: 'pointerUp', button: 0 },
      ],
  },]);


    // Click on Settings button to navigate to settings
    //const settingsButton = await driver.$("-android uiautomator:new UiSelector().text(\"Settings\")");
    //await settingsButton.click();
    //await driver.pause(2000);

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


  it('it should test support screen', async () => {

    const testId = "789d3b57-8cc7-43f8-ae4c-436f141d5261"
    // Send results
 let testStatus = "Pass";
 let screenshotPath = "";
 let testDetails = ""
 let error = null;
 
 try {

  //click on finish later button to avoid payment method registration
  // const finishLater = await driver.$("-android uiautomator:new UiSelector().text(\"FINISH LATER\")");
  // await expect(finishLater).toBeDisplayed();
  // await finishLater.click();

    //await driver.activateApp("com.umob.umob");
    //await driver.pause(7000);    
    // const qButton = await driver.$("-android uiautomator:new UiSelector().className(\"com.horcrux.svg.PathView\").instance(2)");
    // await expect(qButton).toBeDisplayed();
    // await driver.pause(2000);
    // await qButton.click();

    //go to account
    await driver.pause(3000);
    await PageObjects.clickAccountButton();
     await driver.pause(2000);

     /*
     // Scroll down to support option
    await driver.executeScript('mobile: scrollGesture', [{
      left: 100,
      top: 1000,
      width: 200,
      height: 800,
      direction: 'down',
      percent: 100.0
    }]);
    await driver.pause(1000);

    */

    const { width, height } = await driver.getWindowSize();
await driver.performActions([
  {
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
          { type: 'pointerMove', duration: 0, x: width/4, y: height*0.85 },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerMove', duration: 1000, x: width/4, y: height*0.15 },
          { type: 'pointerUp', button: 0 },
      ],
  },
]);

    // click on support button
    const supportButton = await driver.$("-android uiautomator:new UiSelector().text(\"Support\")");
    await supportButton.click();


    // Verify screen header
    const screenHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Support\")");
    await expect(screenHeader).toBeDisplayed();
    await screenHeader.waitForDisplayed({ timeout: 4000 });

    // Verify tabs
    const faq = await driver.$("-android uiautomator:new UiSelector().text(\"FAQ\")");
    await expect(faq).toBeDisplayed();

    const chat = await driver.$("-android uiautomator:new UiSelector().text(\"Chat\")");
    await expect(chat).toBeDisplayed();

    const about = await driver.$("-android uiautomator:new UiSelector().text(\"About\")");
    await expect(about).toBeDisplayed();

    const where = await driver.$("-android uiautomator:new UiSelector().text(\"Where\")");
    await expect(where).toBeDisplayed();

    // Click on "FAQ" to be sure you are in the right place
    await driver.pause(2000);
    await faq.click()
    
        // Verify main content headers and text
        const contentElements = [
          "How does it work (e-bike)",
          "Looking for your e-bike",
          "Open the umob app to see all available e-bikes.",
          "Start race",
          "Find your e-bike and press 'Start' in the app to begin your ride.",
          "Pause",
          "Do you want to take a break while on the go? Switch the e-bike to 'parking mode' at a small fee per minute. The e-bike will be turned off, but remains reserved for you.",
          "Flexible travel",
          "Enjoy the freedom to stop wherever you want, while your e-bike waits for you safely."
      ];

      for (const text of contentElements) {
          const element = await driver.$(`-android uiautomator:new UiSelector().text("${text}")`);
          await expect(element).toBeDisplayed();
      }

      /*
      //Scroll to bottom
  await driver.executeScript('mobile: scrollGesture', [{
    left: 100,
    top: 1500,
    width: 200,
    height: 100,
    direction: 'down',
    percent: 100
  }]); 
  await driver.pause(6000);

  */

  await driver.performActions([
    {
        type: 'pointer',
        id: 'finger2',
        parameters: { pointerType: 'touch' },
        actions: [
            { type: 'pointerMove', duration: 0, x: width/2, y: 900 },
            { type: 'pointerDown', button: 0 },
            { type: 'pause', duration: 100 },
            { type: 'pointerMove', duration: 1000, x: width/2, y: 10 },
            { type: 'pointerUp', button: 0 },
        ],
    },]);

  const contentElements2 = [
    "End ride",
    "End your ride only within the service area, indicated by green in the app.",
    "Park neatly",
    "Make sure the e-bike is parked correctly before you end the ride in the app.",
    "Driving in the city",
    "With e-bikes, you can ride and park almost anywhere in the city within designated zones to keep the public roads accessible.",
    "Follow the rules",
    "Always respect local traffic rules and ensure a safe and responsible ride."
    
];

for (const text of contentElements2) {
    const element2 = await driver.$(`-android uiautomator:new UiSelector().text("${text}")`);
    await expect(element2).toBeDisplayed();
}
  // go to chat tab
  await chat.click();
  await driver.pause(2000);

  const openChat = await driver.$(`-android uiautomator:new UiSelector().text("OPEN CHAT")`);
  await expect(openChat).toBeDisplayed();
  await openChat.click();

  //send test message to chat
  //const textField = await driver.$("-android uiautomator:new UiSelector().className(\"android.view.ViewGroup\").instance(58)");
  const welcomeMessage = await driver.$(`-android uiautomator:new UiSelector().text("Start typing here")`);
  await expect(welcomeMessage).toBeDisplayed();
      //await expect(textField).toBeDisplayed();
      await welcomeMessage.addValue("test");
      await driver.pause(2000);

      //click on send button

      const sendButton = await driver.$("-android uiautomator:new UiSelector().description(\"Send\")");
      await expect(sendButton).toBeDisplayed();
      await sendButton.click();

      //check if message was sent
      const messageCheck = await driver.$(`-android uiautomator:new UiSelector().text("test")`);
      await expect(messageCheck).toBeDisplayed();

      //if the message is sent then after seeing "test" you should see welcome message again: "Start typing here")`);
      await expect(welcomeMessage).toBeDisplayed();

      // Press the device back button (this method works on mobile)
      await driver.back();
      //option 2 for clicking back
      // const backButton = await driver.$('~back_button');
      // await expect(backButton).toBeDisplayed();
      // await backButton.click();



      //go to about tab
     await about.click();
     await driver.pause(2000);

     //check for text on about tab

     const contentElements3 = [
      "On a mission",
      "We're here to evolutionize mobility into seamless, accessible, and sustainable journeys.",
      "Making movement a breeze, not a burden.",
      "The problem we solve",
      "Urban mobility is complex. Too many apps & accounts cause frustration. But less congestion and more green travel is imperative for a sustainable future."
            
  ];
  
  for (const text of contentElements3) {
      const element3 = await driver.$(`-android uiautomator:new UiSelector().text("${text}")`);
      await expect(element3).toBeDisplayed();
  }

  /*
    //Scroll to bottom
    await driver.executeScript('mobile: scrollGesture', [{
    left: 100,
    top: 1500,
    width: 200,
    height: 100,
    direction: 'down',
    percent: 100
    }]); 
    await driver.pause(6000);
    */

    await driver.performActions([
      {
          type: 'pointer',
          id: 'finger3',
          parameters: { pointerType: 'touch' },
          actions: [
              { type: 'pointerMove', duration: 0, x: width/2, y: 500 },
              { type: 'pointerDown', button: 0 },
              { type: 'pause', duration: 100 },
              { type: 'pointerMove', duration: 1000, x: width/2, y: 10 },
              { type: 'pointerUp', button: 0 },
          ],
      },]);
    

    //test the text after scrolling
    const text1 = await driver.$("-android uiautomator:new UiSelector().text(\"The solution\")");
    await expect(text1).toBeDisplayed();

    const text2 = await driver.$("-android uiautomator:new UiSelector().text(\"One app for all rides simplifies travel and cuts the clutter. Shift from owning to sharing.\")");
    await expect(text2).toBeDisplayed();

    //const text3 = await driver.$("-android uiautomator:new UiSelector().text(\"We're shaping a better world.\")");
    //await expect(text3).toBeDisplayed();

    //go to where tab
    await where.click();
    await driver.pause(2000);

    //check key elements for "where" tab
    const availability = await driver.$("-android uiautomator:new UiSelector().text(\"Availability\")");
    await expect(availability).toBeDisplayed();

    //languages check
    // const tick = await driver.$("-android uiautomator:new UiSelector().className(\"com.horcrux.svg.PathView\").instance(10)");
    // await tick.click();
    // await driver.pause(2000);

    const netherlands = await driver.$("-android uiautomator:new UiSelector().text(\"Netherlands\")");
    await expect(netherlands).toBeDisplayed();
    await netherlands.click();
    await driver.pause(2000);

    // const Portugal = await driver.$("-android uiautomator:new UiSelector().text(\"Portugal\")");
    // await expect(Portugal).toBeDisplayed();

    // const Spain = await driver.$("-android uiautomator:new UiSelector().text(\"Spain\")");
    // await expect(Spain).toBeDisplayed();

    // const unitedKingdom = await driver.$("-android uiautomator:new UiSelector().text(\"United Kingdom\")");
    // await expect(unitedKingdom).toBeDisplayed();

    // const France = await driver.$("-android uiautomator:new UiSelector().text(\"France\")");
    // await expect(France).toBeDisplayed();


    //checking amount of providers
    const bicycle = await driver.$("-android uiautomator:new UiSelector().text(\"Bicycle\")");
    await expect(bicycle).toBeDisplayed();

    const bicycleProviders = await driver.$("-android uiautomator:new UiSelector().text(\"8 providers\")");
    await expect(bicycleProviders).toBeDisplayed();

    const moped = await driver.$("-android uiautomator:new UiSelector().text(\"Moped\")");
    await expect(moped).toBeDisplayed();

    const mopedProviders = await driver.$("-android uiautomator:new UiSelector().text(\"5 providers\")");
    await expect(mopedProviders).toBeDisplayed();
    
    const step = await driver.$("-android uiautomator:new UiSelector().text(\"Step\")");
    await expect(moped).toBeDisplayed();

    const stepProviders = await driver.$("-android uiautomator:new UiSelector().text(\"3 providers\")");
    await expect(stepProviders).toBeDisplayed();

    /*
    //Scroll to bottom
   await driver.executeScript('mobile: scrollGesture', [{
    left: 100,
    top: 1500,
    width: 200,
    height: 100,
    direction: 'down',
    percent: 100
   }]); 
    await driver.pause(6000);
    */

    await driver.performActions([
      {
          type: 'pointer',
          id: 'finger4',
          parameters: { pointerType: 'touch' },
          actions: [
              { type: 'pointerMove', duration: 0, x: width/2, y: 500 },
              { type: 'pointerDown', button: 0 },
              { type: 'pause', duration: 100 },
              { type: 'pointerMove', duration: 1000, x: width/2, y: 100 },
              { type: 'pointerUp', button: 0 },
          ],
      },]);

    const taxi = await driver.$("-android uiautomator:new UiSelector().text(\"Taxi\")");
    await expect(taxi).toBeDisplayed();

    const taxiProviders = await driver.$("-android uiautomator:new UiSelector().text(\"4 providers\")");
    await expect(taxiProviders).toBeDisplayed();

    const any = await driver.$("-android uiautomator:new UiSelector().text(\"Any\")");
    await expect(any).toBeDisplayed();

    const anyProviders = await driver.$("-android uiautomator:new UiSelector().text(\"1 provider\")");

    await driver.performActions([
      {
          type: 'pointer',
          id: 'finger4',
          parameters: { pointerType: 'touch' },
          actions: [
              { type: 'pointerMove', duration: 0, x: width/2, y: height*0.8 },
              { type: 'pointerDown', button: 0 },
              { type: 'pause', duration: 100 },
              { type: 'pointerMove', duration: 1000, x: width/2, y: 10 },
              { type: 'pointerUp', button: 0 },
          ],
      },]);

    await expect(anyProviders).toBeDisplayed();

    const publicTransport = await driver.$("-android uiautomator:new UiSelector().text(\"Public transport\")");
    await expect(publicTransport).toBeDisplayed();

    const publicProviders = await driver.$("-android uiautomator:new UiSelector().text(\"1 provider\")");
    await expect(publicProviders).toBeDisplayed();

    //quit support screen
    const quit = await driver.$("class name:com.horcrux.svg.RectView");
    await quit.click();

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
  
  it('should display all key Payment Settings screen elements', async () => {

    const testId = "d901dc5f-f20f-41d9-afbf-ba15b6a36815"
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

    const cardType = await driver.$("-android uiautomator:new UiSelector().text(\"Add payment method\")");
    await expect(cardType).toBeDisplayed();

    const cardNumber = await driver.$("-android uiautomator:new UiSelector().text(\"Add your paymentmethod for free.\")");
    await expect(cardNumber).toBeDisplayed();

    // const expiryDate = await driver.$("-android uiautomator:new UiSelector().text(\"03/2030\")");
    // await expect(expiryDate).toBeDisplayed();

    // Verify action buttons
    const addButton = await driver.$("-android uiautomator:new UiSelector().text(\"ADD PAYMENT METHOD\")");
    await expect(addButton).toBeDisplayed();
    /*await addButton.click();

    //verify header and offer for choosing payment method
    //const paymentHeader = await driver.$("id:com.umob.umob:id/payment_method_header_title");
    const paymentHeader = await driver.$('-android uiautomator:new UiSelector().text("PAYMENT METHODS")');
    await expect(paymentHeader).toBeDisplayed();

    const cards = await driver.$('-android uiautomator:new UiSelector().text("Cards")');
    await expect(cards).toBeDisplayed();

    const bancontactCard = await driver.$('-android uiautomator:new UiSelector().text("Bancontact card")');
    await expect(bancontactCard).toBeDisplayed();

    const googlePay = await driver.$('-android uiautomator:new UiSelector().text("Google Pay")');
    await expect(googlePay).toBeDisplayed();

    const payPal = await driver.$('-android uiautomator:new UiSelector().text("PayPal")');
    await expect(payPal).toBeDisplayed();

    //close the popup
    const closePopup = await driver.$("id:com.umob.umob:id/imageView_close");
    await closePopup.click();


    //const helpButton = await driver.$("-android uiautomator:new UiSelector().text(\"Help\")");
    //await expect(helpButton).toBeDisplayed();

    // Optional: Verify container element
    // const paymentDetailsContainer = await driver.$("-android uiautomator:new UiSelector().description(\"PaymentDetailsContainer\")");
    // await expect(paymentDetailsContainer).toBeDisplayed();

    

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

*/
 

  it('should display all key delete account screen elements', async () => {

    const testId = "9dbc289a-319f-47ee-b30e-4773e297c67a"
    // Send results
  let testStatus = "Pass";
  let screenshotPath = "";
  let testDetails = ""
  let error = null;
  
  try {

    //click on finish later button to avoid payment method registration
    // const finishLater = await driver.$("-android uiautomator:new UiSelector().text(\"FINISH LATER\")");
    // await expect(finishLater).toBeDisplayed();
    // await finishLater.click();

    // Click on Account button
    //const accountButton = await driver.$("-android uiautomator:new UiSelector().text(\"Account\")");
    //await accountButton.click();
    //await driver.pause(2000);

    //go to account
    await driver.pause(3000);
    await PageObjects.clickAccountButton();
     await driver.pause(3000);

     /*
     // Scroll down to delete account option
    await driver.executeScript('mobile: scrollGesture', [{
      left: 100,
      top: 1000,
      width: 200,
      height: 800,
      direction: 'down',
      percent: 100.0
    }]);
    await driver.pause(1000);

    */

    const { width, height } = await driver.getWindowSize();
await driver.performActions([
  {
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
          { type: 'pointerMove', duration: 0, x: width/4, y: height*0.8 },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerMove', duration: 1000, x: width/4, y: 10 },
          { type: 'pointerUp', button: 0 },
      ],
  },]);
    

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
    await cancelButtonText.click();

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

    const testId = "87874cb4-321f-4a63-8fde-0b1d6e90ff5e"
    // Send results
  let testStatus = "Pass";
  let screenshotPath = "";
  let testDetails = ""
  let error = null;
  
  try {

    //click on finish later button to avoid payment method registration
    // const finishLater = await driver.$("-android uiautomator:new UiSelector().text(\"FINISH LATER\")");
    // await expect(finishLater).toBeDisplayed();
    // await finishLater.click();

    // Click on Settings button to navigate to settings
    // const settingsButton = await driver.$("-android uiautomator:new UiSelector().text(\"Settings\")");
    // await settingsButton.click();
    // await driver.pause(2000);

    //go to account
    await PageObjects.clickAccountButton();
     await driver.pause(2000);

     /*
     // Scroll down to Log Out option
    await driver.executeScript('mobile: scrollGesture', [{
      left: 100,
      top: 1000,
      width: 200,
      height: 800,
      direction: 'down',
      percent: 100.0
    }]);
    await driver.pause(1000);

    */

    const { width, height } = await driver.getWindowSize();
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


    // Click on LogOut option 
    const logoutButton = await driver.$("-android uiautomator:new UiSelector().text(\"LOG OUT\")");
    await expect(logoutButton).toBeDisplayed();
    await logoutButton.click();

    // verify Login button appeared
    const signUpButton = await driver.$("-android uiautomator:new UiSelector().text(\"LOGIN\")");
    await expect(signUpButton).toBeDisplayed();

    
    // verify Register button appeared
    const register = await driver.$("-android uiautomator:new UiSelector().text(\"REGISTER\")");
    await expect(register).toBeDisplayed();

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