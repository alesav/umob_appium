import { execSync } from "child_process";
import submitTestRun from "../../helpers/SendResults.js";
import PageObjects from "../../pageobjects/umobPageObjects.page.js";
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

//////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////
describe('Add Payment Method through popup for the New User', () => {
  let scooters;

  before(async () => {

    const credentials = getCredentials(ENV, USER);

    // await PageObjects.login(credentials);
    await PageObjects.login({ username: credentials.username, password: credentials.password });

    /*

      // Find and click LOG IN button
      const logInBtn = await driver.$('-android uiautomator:new UiSelector().text("LOG IN")');
      await logInBtn.isClickable();
      await driver.pause(2000);
      await logInBtn.click();

      // Login form elements
      const usernameField = await driver.$("accessibility id:login_username_field");
      await expect(usernameField).toBeDisplayed();
      await usernameField.addValue("new20@gmail.com");

      const passwordField = await driver.$("accessibility id:login_password_field");
      await expect(passwordField).toBeDisplayed();
      await passwordField.addValue("123Qwerty!");

      const loginButtonText = await driver.$("accessibility id:login_button-text");
      await expect(loginButtonText).toBeDisplayed();
      await loginButtonText.click();

      const loginButton = await driver.$("accessibility id:login_button");
      await expect(loginButton).toBeDisplayed();
      await loginButton.click();

      // Handle permissions
      const allowPermissionBtn = await driver.$("id:com.android.permissioncontroller:id/permission_allow_button");
      await expect(allowPermissionBtn).toBeDisplayed();
      await allowPermissionBtn.click();

      // Wait for welcome message
      //const welcomeMessage = await driver.$('-android uiautomator:new UiSelector().text("Welcome back!")');
      //await welcomeMessage.waitForEnabled({ timeout: 10000 });

      // Handle location permissions
      const allowForegroundPermissionBtn = await driver.$("id:com.android.permissioncontroller:id/permission_allow_foreground_only_button");
      await expect(allowForegroundPermissionBtn).toBeDisplayed();
      await allowForegroundPermissionBtn.click();


        
        // Check Account is presented

        */


  });

  

  beforeEach(async () => {
    //await driver.activateApp("com.umob.umob");
    await driver.terminateApp("com.umob.umob");
    await driver.activateApp("com.umob.umob");
        // Wait for main screen to be loaded
  });



  ////////////////////////////////////////////////////////////////////////////////
  it('Add credit card through popup', async () => {

    const testId = "490ea927-eebf-452a-9227-4f4098cac232"
    
    // Send results
    let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = ""
        let error = null;
    
        try {
    
    await driver.pause(2000);

        //verify that popup is present
        const notification = await driver.$('-android uiautomator:new UiSelector().textContains("You have not finished your registration")');
        await expect (notification).toBeDisplayed();
        const finishLater = await driver.$('-android uiautomator:new UiSelector().text("FINISH LATER")');
        await expect (finishLater).toBeDisplayed();
        await driver.pause(5000);

        //click on Continue button
        const contButton = await driver.$('-android uiautomator:new UiSelector().text("CONTINUE")');
        await expect (contButton).toBeDisplayed();
        await driver.pause(5000);
        await contButton.click();

          //verify header
        const headerPayment = await driver.$('-android uiautomator:new UiSelector().text("Payment method")');
        await expect (headerPayment).toBeDisplayed();
        await driver.pause(4000);

           
           //CLick Add payment method
           await driver.$(
            '-android uiautomator:new UiSelector().text("ADD PAYMENT METHOD")'
          ).waitForDisplayed();
          await driver.pause(6000);
          await driver.$(
            '-android uiautomator:new UiSelector().text("ADD PAYMENT METHOD")'
          ).click();
          await driver.pause(6000);
          //second click on button because it looks like it is required
          // await driver.$(
          //   '-android uiautomator:new UiSelector().text("ADD PAYMENT METHOD")'
          // ).click();

           //CLick Remove payment method
           /*
           await driver.$(
            '-android uiautomator:new UiSelector().text("REMOVE PAYMENT METHOD")'
          ).waitForDisplayed();
          await driver.$(
            '-android uiautomator:new UiSelector().text("REMOVE PAYMENT METHOD")'
          ).click();          
          */

           //CLick Cards
           await driver.$(
            '-android uiautomator:new UiSelector().text("Cards")'
          ).waitForDisplayed();
          await driver.$(
            '-android uiautomator:new UiSelector().text("Cards")'
          ).click();

          const el1 = await driver.$("id:com.umob.umob:id/editText_cardNumber");
          await el1.click();
          await el1.addValue("5555341244441115");
          const el2 = await driver.$("id:com.umob.umob:id/editText_expiryDate");
          await el2.click();
          await el2.addValue("0330");
          const el3 = await driver.$("id:com.umob.umob:id/editText_securityCode");
          await el3.click();
          await el3.addValue("737");
          const el4 = await driver.$("id:com.umob.umob:id/editText_cardHolder");
          await el4.click();
          await el4.addValue("Test Account");
          const el5 = await driver.$("id:com.umob.umob:id/payButton");
          await el5.click();

           //Assert Remove payment method button is displayed
            const removeBtn =await driver.$(
             '-android uiautomator:new UiSelector().text("REMOVE PAYMENT METHOD")'
           )
           await removeBtn.waitForDisplayed();
           await driver.pause(2000);
           //await removeBtn.click();

          //  await driver.pause(5000);
          //  const el6 = await driver.$("accessibility id:back_button");
          //  await el6.click();

          /*

           //CLick Payment Settings
           await driver.$(
            '-android uiautomator:new UiSelector().text("Payment settings")'
          ).waitForDisplayed();
          await driver.$(
            '-android uiautomator:new UiSelector().text("Payment settings")'
          ).click();

           //Verify Add payment method
           await driver.$(
            '-android uiautomator:new UiSelector().text("ADD PAYMENT METHOD")'
          ).waitForDisplayed();

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



  afterEach(async () => {
    await driver.terminateApp("com.umob.umob");
  });
});