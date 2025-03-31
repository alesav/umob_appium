import { execSync } from "child_process";
import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import submitTestRun from "../../helpers/SendResults.js";


/////////////////////////////////////////////////////////////////////////////////
describe('Add address for any user', () => {
  let scooters;

  before(async () => {

    const deviceCapabilities = await JSON.stringify(driver.capabilities).toString();

      // Find and click LOG IN button
      const logInBtn = await driver.$('-android uiautomator:new UiSelector().text("LOG IN")');
      //await logInBtn.isClickable();
      await driver.pause(2000);
      await logInBtn.click();
/*
      // Login form elements
      const usernameField = await driver.$("accessibility id:login_username_field");
      await expect(usernameField).toBeDisplayed();
      await usernameField.addValue("new12@gmail.com");

      const passwordField = await driver.$("accessibility id:login_password_field");
      await expect(passwordField).toBeDisplayed();
      await passwordField.addValue("123Qwerty!");

      const loginButtonText = await driver.$("accessibility id:login_button-text");
      await expect(loginButtonText).toBeDisplayed();
      await loginButtonText.click();

      const loginButton = await driver.$("accessibility id:login_button");
      await expect(loginButton).toBeDisplayed();
      await loginButton.click();

    // Wait for permissions popup
     const permissionsPopup = await driver.$('-android uiautomator:new UiSelector().textContains("Allow")');
     await permissionsPopup.isDisplayed();
     await expect(permissionsPopup).toBeDisplayed();


     console.log("deviceInfo "+ deviceCapabilities);
     if (!deviceCapabilities.includes("bstack:options")) {
      const enableNotifications = await driver.$("id:com.android.permissioncontroller:id/permission_allow_button");
      await expect(enableNotifications).toBeDisplayed();
      await enableNotifications.click();
     }

     const enableLocation = await driver.$("id:com.android.permissioncontroller:id/permission_allow_foreground_only_button");
     await expect(enableLocation).toBeDisplayed();
     await enableLocation.click();

        // Check Account is presented
        //await driver.$(
        //  '-android uiautomator:new UiSelector().text("Account")'
       // ).waitForEnabled();
*/

  });

  

  ////////////////////////////////////////////////////////////////////////////////
  it('Add address for any user', async () => {

    const testId = "ffddb0c7-90db-485d-a2d7-9857c6108e3d"
    
    // Send results
    let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = ""
        let error = null;

        screenshotPath = testId+".png";
        console.log("Screenshot saved to", screenshotPath);
        await driver.saveScreenshot(screenshotPath);
        await driver.saveScreenshot("/Users/runner/work/umob_appium/umob_appium/screenshots/"+ testId+".png");
    
        try {
     

        } catch (e) {
          error = e;
          console.error("Test failed:", error);
          testStatus = "Fail";
          testDetails = e.message;
      
        
          // Capture screenshot on failure
          screenshotPath = testId+".png";
          console.log("Screenshot saved to", screenshotPath);
          await driver.saveScreenshot(screenshotPath);
          await driver.saveScreenshot("/Users/runner/work/umob_appium/umob_appium/screenshots/"+ testId+".png");
          // execSync(
          //   `adb exec-out screencap -p > ${screenshotPath}`
          // );
          
        } finally {
          // Submit test run result
          try {
        
            await submitTestRun(testId, testStatus, testDetails, screenshotPath);
            await submitTestRun(testId, testStatus, testDetails, "/Users/runner/work/umob_appium/umob_appium/screenshots/"+ testId+".png");
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