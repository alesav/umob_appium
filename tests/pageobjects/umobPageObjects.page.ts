import Page from './page.js';

class PageObjects extends Page {
    /**
     * define elements
     */

    // Initial page objects
    get username () { return $('#username'); }
    get password () { return $('#password'); }
    get submitButton () { return $('#login button[type=submit]'); }
    get flash () { return $('#flash'); }

    // The main screen with the map
    //get accountButton () { return $('-android uiautomator:new UiSelector().text("Account")'); } 
    get accountButton () { return $('-android uiautomator:new UiSelector().className("com.horcrux.svg.SvgView").instance(0)'); } 

    // My account screen
    get planTripBtn () {return $('-android uiautomator:new UiSelector().text("Plan Trip")');}
    get promosBtn () {return $('-android uiautomator:new UiSelector().text("Promos")');}
    // ....
    // my rides and tickets button


    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    async login ({ username, password }: {username:string; password: string;}) {
            const deviceCapabilities = await JSON.stringify(driver.capabilities).toString();

           // Find and click LOG IN button
           const logInBtn = await driver.$('-android uiautomator:new UiSelector().text("LOG IN")');
           await logInBtn.waitForDisplayed({ timeout: 200000 }); // wait for 200 seconds
           //await logInBtn.isClickable();
           await driver.pause(2000);
           await logInBtn.click();
     
           // Login form elements
           const usernameField = await driver.$("accessibility id:login_username_field");
           await expect(usernameField).toBeDisplayed();
           await usernameField.addValue(username);
     
           const passwordField = await driver.$("accessibility id:login_password_field");
           await expect(passwordField).toBeDisplayed();
           await passwordField.addValue(password);
     
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
           await permissionsPopup.click();
     
          console.log("deviceInfo "+ deviceCapabilities);
          if (deviceCapabilities.includes("Local")) {
           const enableNotifications = await driver.$("id:com.android.permissioncontroller:id/permission_allow_button");
           await expect(enableNotifications).toBeDisplayed();
           await enableNotifications.click();
         }
         await driver.pause(2000);
         const permissionsPopup2 = await driver.$('-android uiautomator:new UiSelector().textContains("hile using the app")');
         await permissionsPopup2.isDisplayed();
          await permissionsPopup2.click();


        
        // Check Account is presented
        await this.accountButton.waitForExist();



        //await this.username.setValue(username);
        //await this.password.setValue(password);
        // only for mobile, if you test on a desktop browser `hideKeyboard` won't exist.
    
        // if (driver.isMobile) {
            /**
             * Normally we would hide the keyboard with this command `driver.hideKeyboard()`, but there is an issue for hiding the keyboard
             * on iOS when using the command. You will get an error like below
             *
             *  Request failed with status 400 due to Error Domain=com.facebook.WebDriverAgent Code=1 "The keyboard on iPhone cannot be
             *  dismissed because of a known XCTest issue. Try to dismiss it in the way supported by your application under test."
             *  UserInfo={NSLocalizedDescription=The keyboard on iPhone cannot be dismissed because of a known XCTest issue. Try to dismiss
             *  it in the way supported by your application under test.}
             *
             * That's why we click outside of the keyboard.
             */
         //    await $('h2').click();
        // }
        // await this.submitButton.click();
        
    }

    /**
     * define or overwrite page methods
     */
    async open():Promise<string> {
        return super.open('login');
    }
}

export default new PageObjects();
