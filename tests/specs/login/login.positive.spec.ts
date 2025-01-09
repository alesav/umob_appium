// Hello
import { execSync } from "child_process";

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
    });

    it('should be able to login successfully', async () => {
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

      // Verify main screen elements
      const menuElements = [
        { selector: "accessibility id:menu_button_taxi", text: "Taxi" },
        { selector: "accessibility id:menu_button_pt", text: "Public transport" },
        { selector: "accessibility id:menu_button_account", text: "Account" },
        { selector: "accessibility id:menu_button_more", text: "Settings" }
      ];

      // Check each menu element
      for (const menuItem of menuElements) {
        const element = await driver.$(menuItem.selector);
        await expect(element).toBeDisplayed();
        
        // Optional: Check text of the element
        const textElement = await driver.$(`-android uiautomator:new UiSelector().text("${menuItem.text}")`);
        await expect(textElement).toBeDisplayed();
      }

      // Navigate to Account section
      const accountButton = await driver.$("accessibility id:menu_button_account");
      await accountButton.click();
    });

    it('should be able to terminate the app', async () => {
      await driver.terminateApp("com.umob.umob");
    });
});
