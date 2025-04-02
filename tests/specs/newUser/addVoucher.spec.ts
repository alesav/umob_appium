import { execSync } from "child_process";
import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import submitTestRun from "../../helpers/SendResults.js";


/////////////////////////////////////////////////////////////////////////////////
describe('Add voucher for the New User', () => {
  let scooters;

  before(async () => {

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
        //await driver.$(
        //  '-android uiautomator:new UiSelector().text("Account")'
       // ).waitForEnabled();


  });

  /*

  beforeEach(async () => {
    await driver.activateApp("com.umob.umob");
        // Wait for screen to be loaded
        await driver.$(
          '-android uiautomator:new UiSelector().text("Account")'
        ).waitForEnabled();
  });

*/

  ////////////////////////////////////////////////////////////////////////////////
  it('Add voucher for the New User', async () => {

    const testId = "91244991-8026-493d-a5ca-8b8bebfaba56"
    
    // Send results
    let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = ""
        let error = null;
    
        try {
    
    await driver.pause(2000);
          //click account button
    await PageObjects.accountButton.waitForExist();
    await PageObjects.accountButton.click();
     await driver.pause(2000);

        //go to ride credit
        const creditButton = await driver.$('-android uiautomator:new UiSelector().textContains("Ride credit")');
        await expect (creditButton).toBeDisplayed();
        await creditButton.click();
        const code = await driver.$('-android uiautomator:new UiSelector().textContains("Code")');
        await expect (code).toBeDisplayed();
        await driver.pause(2000);

        //click on code section and add value of voucher
        const codeSection = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\")");
        //await codeSection.click();
        await codeSection.addValue("multi5");

        //click on Submit button
        const submitButton = await driver.$('-android uiautomator:new UiSelector().text("SUBMIT PROMOTIONAL CODE")');
        await expect (submitButton).toBeDisplayed();
        await submitButton.click();

        //check that voucher was added
        const vControl = await driver.$('-android uiautomator:new UiSelector().textContains("multi")');
        await expect (vControl).toBeDisplayed();

          

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