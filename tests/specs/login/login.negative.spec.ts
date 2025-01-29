describe('Login Negative Scenarios', () => {
  beforeEach(async () => {
    // Ensure app is launched and initial screen is loaded
    await driver.activateApp("com.umob.umob");
  });

  it('should fail login with invalid username', async () => {
    // Find and click LOG IN button
    const logInBtn = await driver.$('-android uiautomator:new UiSelector().text("LOG IN")');
    await logInBtn.isClickable();
    await driver.pause(2000);
    await logInBtn.click();

    // Enter invalid username
    const usernameField = await driver.$("accessibility id:login_username_field");
    await expect(usernameField).toBeDisplayed();
    await usernameField.addValue("invalid.email@example.com");

    const passwordField = await driver.$("accessibility id:login_password_field");
    await passwordField.addValue("123Qwerty!");

    const loginButtonText = await driver.$("accessibility id:login_button-text");
    await loginButtonText.click();

    // Handle permissions
    const allowPermissionBtn = await driver.$("id:com.android.permissioncontroller:id/permission_allow_button");
    await expect(allowPermissionBtn).toBeDisplayed();
    await allowPermissionBtn.click();

    // Verify error message
    const errorMessage = await driver.$('-android uiautomator:new UiSelector().textContains("Invalid username or password")');
    await expect(errorMessage).toBeDisplayed();
  });

  it('should fail login with invalid password', async () => {
    // Find and click LOG IN button
    const logInBtn = await driver.$('-android uiautomator:new UiSelector().text("LOG IN")');
    await logInBtn.click();

    // Enter valid username with incorrect password
    const usernameField = await driver.$("accessibility id:login_username_field");
    await expect(usernameField).toBeDisplayed();
    await usernameField.addValue("4bigfoot+10@gmail.com");

    const passwordField = await driver.$("accessibility id:login_password_field");
    await passwordField.addValue("WrongPassword123!");

    const loginButtonText = await driver.$("accessibility id:login_button-text");
    await loginButtonText.click();

    // Verify error message
    const errorMessage = await driver.$('-android uiautomator:new UiSelector().textContains("Invalid username or password")');
    await expect(errorMessage).toBeDisplayed();
  });

  it('should fail login with empty credentials', async () => {
    // Find and click LOG IN button
    const logInBtn = await driver.$('-android uiautomator:new UiSelector().text("LOG IN")');
    await logInBtn.click();

    const loginButtonText = await driver.$("accessibility id:login_button").isEnabled();
    //await expect(loginButtonText).toBeFalsy();
    console.log(loginButtonText)
    await expect(loginButtonText).toBeFalsy();
  });


  afterEach(async () => {
    // Optional: Reset the app state after each test
    try {
      await driver.terminateApp("com.umob.umob");

    } catch (error) {
      console.log('Error terminating app:', error);
    }
  });
});