import { execSync } from "child_process";


/////////////////////////////////////////////////////////////////////////////////
describe('Lime Scooter Booking Tests', () => {
  let scooters;

  before(async () => {

      // Find and click LOG IN button
      const logInBtn = await driver.$('-android uiautomator:new UiSelector().text("LOG IN")');
      await logInBtn.isClickable();
      await logInBtn.click();

      // Login form elements
      const usernameField = await driver.$("accessibility id:login_username_field");
      await expect(usernameField).toBeDisplayed();
      await usernameField.addValue("4bigfoot+11@gmail.com");

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
        await driver.$(
          '-android uiautomator:new UiSelector().text("Account")'
        ).waitForEnabled();


  });

  beforeEach(async () => {
    await driver.activateApp("com.umob.umob");
        // Wait for screen to be loaded
        await driver.$(
          '-android uiautomator:new UiSelector().text("Account")'
        ).waitForEnabled();
  });

  ////////////////////////////////////////////////////////////////////////////////
  it('Positive Scenario: Add credit card', async () => {
    await driver.pause(2000);

        // Check Account is presented
        await driver.$(
          '-android uiautomator:new UiSelector().text("Account")'
        ).waitForEnabled();
                // Click Account
                await driver.$(
                  '-android uiautomator:new UiSelector().text("Account")'
                ).click();

           //CLick Payment Settings
          await driver.$(
            '-android uiautomator:new UiSelector().text("Payment settings")'
          ).waitForDisplayed();
          await driver.$(
            '-android uiautomator:new UiSelector().text("Payment settings")'
          ).click();

           //CLick Add payment method
           await driver.$(
            '-android uiautomator:new UiSelector().text("ADD PAYMENT METHOD")'
          ).waitForDisplayed();
          await driver.$(
            '-android uiautomator:new UiSelector().text("ADD PAYMENT METHOD")'
          ).click();

           //CLick Remove payment method
           await driver.$(
            '-android uiautomator:new UiSelector().text("REMOVE PAYMENT METHOD")'
          ).waitForDisplayed();
          await driver.$(
            '-android uiautomator:new UiSelector().text("REMOVE PAYMENT METHOD")'
          ).click();          

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
            await driver.$(
             '-android uiautomator:new UiSelector().text("REMOVE PAYMENT METHOD")'
           ).waitForDisplayed();

           const el6 = await driver.$("accessibility id:back_button");
           await el6.click();
           const el7 = await driver.$("-android uiautomator:new UiSelector().text(\"Welcome back,\")");
           await el7.waitForDisplayed();

          // Wait for Home screen to be loaded
          // await driver.$(
          //   '-android uiautomator:new UiSelector().text("Account")'
          // ).waitForDisplayed();
          // await driver.$(
          //   '-android uiautomator:new UiSelector().text("Account")'
          // ).click();
          // await driver.$(
          //   '-android uiautomator:new UiSelector().text("My Account")'
          // ).isDisplayed();
          await driver.pause(2000);


  });



  afterEach(async () => {
    await driver.terminateApp("com.umob.umob");
  });
});