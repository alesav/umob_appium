// Hello
import { execSync } from "child_process";
import submitTestRun from '../../helpers/SendResults.js';
import PageObjects from "../../pageobjects/umobPageObjects.page.js";

const getScreenCenter = async () => {
    // Get screen dimensions
    const { width, height } = await driver.getWindowSize();

    return {
      centerX: Math.round(width / 2),
      centerY: Math.round(height / 2),
      screenWidth: width,
      screenHeight: height,
    };
  };

describe('Login positive scenarios,', () => {
    beforeEach(async () => {
      // Ensure app is launched and initial screen is loaded
      await driver.pause(7000);
    });

    it('should display all key elements on the initial screen', async () => {

      const testId = "97ad3bd3-1c89-4fbf-8f25-28c32e138a7f"
      // Send results
   let testStatus = "Pass";
   let screenshotPath = "";
   let testDetails = ""
   let error = null;
   
   try {

      // Check sign up and registration elements
      const signUpTitle = await driver.$('-android uiautomator:new UiSelector().text("Sign up & get €10,-")');
      await expect(signUpTitle).toBeDisplayed();

      const signUpDescription = await driver.$('-android uiautomator:new UiSelector().textContains("Sign up to explore or get started right away")');
      await expect(signUpDescription).toBeDisplayed();

      // Check registration buttons
      const startRegistrationBtn = await driver.$('-android uiautomator:new UiSelector().text("START REGISTRATION")');
      await expect(startRegistrationBtn).toBeDisplayed();

      const exploreMapBtn = await driver.$('-android uiautomator:new UiSelector().text("EXPLORE MAP")');
      await expect(exploreMapBtn).toBeDisplayed();

      const logInBtn = await driver.$('-android uiautomator:new UiSelector().text("LOG IN")');
      await expect(logInBtn).toBeDisplayed();

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


    it('should be able to login successfully', async () => {

      const testId = "0dcfc86c-c4da-41ca-93ec-2836b814721a"
      // Send results
   let testStatus = "Pass";
   let screenshotPath = "";
   let testDetails = ""
   let error = null;
   
   try {

      // Find and click LOG IN button
      const logInBtn = await driver.$('-android uiautomator:new UiSelector().text("LOG IN")');
      await logInBtn.click();

      // Login form elements
      const usernameField = await driver.$("accessibility id:login_username_field");
      await expect(usernameField).toBeDisplayed();
      await usernameField.addValue("4bigfoot+10@gmail.com");

      const passwordField = await driver.$("accessibility id:login_password_field");
      await expect(passwordField).toBeDisplayed();
      await passwordField.addValue("123Qwerty!");

      const loginButtonText = await driver.$("accessibility id:login_button-text");
      await expect(loginButtonText).toBeDisplayed();
      await loginButtonText.click();

      const loginButton = await driver.$("accessibility id:login_button");
      await expect(loginButton).toBeDisplayed();
      await loginButton.click();

      // Handle location permissions
      const allowForegroundPermissionBtn = await driver.$("id:com.android.permissioncontroller:id/permission_allow_foreground_only_button");
      await expect(allowForegroundPermissionBtn).toBeDisplayed();
      await allowForegroundPermissionBtn.click();

      // Handle permissions
      // const allowPermissionBtn = await driver.$("id:com.android.permissioncontroller:id/permission_allow_button");
      // await expect(allowPermissionBtn).toBeDisplayed();
      // await allowPermissionBtn.click();

      // Wait for welcome message
      //const welcomeMessage = await driver.$('-android uiautomator:new UiSelector().text("Welcome back!")');
      //await welcomeMessage.waitForEnabled({ timeout: 10000 });

      

      /*
      // Verify main screen elements
      const menuElements = [
        { selector: "accessibility id:menu_button_taxi", text: "Taxi" },
        { selector: "accessibility id:menu_button_pt", text: "Public transport" },
        { selector: "accessibility id:menu_button_account", text: "Account" },
        { selector: "accessibility id:menu_button_more", text: "Settings" }
      ];
      

      // Wait for main screen to be loaded

      await PageObjects.accountButton.waitForExist();

      // Check each menu element
      for (const menuItem of menuElements) {
        const element = await driver.$(menuItem.selector);
        await expect(element).toBeDisplayed();
        
        // Optional: Check text of the element
        const textElement = await driver.$(`-android uiautomator:new UiSelector().text("${menuItem.text}")`);
        await expect(textElement).toBeDisplayed();
      }

      */

      // Navigate to Account section
      
      await PageObjects.accountButton.waitForExist();
      await PageObjects.accountButton.click();


      const infoButton = await driver.$('-android uiautomator:new UiSelector().text("Personal info")');
      await expect (infoButton).toBeDisplayed();
      

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

    it('should be able to terminate the app', async () => {
      await driver.terminateApp("com.umob.umob");
    });
});
