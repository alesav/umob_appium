import Page from './page.js';
import submitTestRun from '../helpers/SendResults.js'; // Make sure the path is correct
import fs from 'fs';
import path from 'path';

class PageObjects extends Page {
    /**
     * Ensure screenshots directory exists
     */
    constructor() {
        super();
        // Ensure screenshots directory exists
        const screenshotsDir = './screenshots';
        if (!fs.existsSync(screenshotsDir)) {
            fs.mkdirSync(screenshotsDir, { recursive: true });
        }
    }
    
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
        const testId = "b6f88693-4e0a-4958-8d26-b4f3a4d0b7d6"; // The test ID you specified
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            const deviceCapabilities = await JSON.stringify(driver.capabilities).toString();
            console.log("Login with: " + username + " and password: " + password);

            // Find and click LOG IN button
            const logInBtn = await driver.$('-android uiautomator:new UiSelector().text("LOG IN")');
            await logInBtn.waitForDisplayed({ timeout: 200000 }); // wait for 200 seconds
            //await logInBtn.isClickable();
            await driver.pause(3000);
            
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
            
        } catch (e) {
            error = e;
            console.error("Login failed:", error);
            testStatus = "Fail";
            testDetails = e.message;
            
            // Capture screenshot on failure
            screenshotPath = "./screenshots/login_"+ testId + ".png";
            await driver.saveScreenshot(screenshotPath);
            
            // Submit test run result
            try {
                await submitTestRun(testId, testStatus, testDetails, screenshotPath);
                console.log("Login failure report submitted successfully");
            } catch (submitError) {
                console.error("Failed to submit login failure report:", submitError);
            }
            
            // Re-throw the error to indicate login failure
            throw error;
        }
        
    }

    /**
     * define or overwrite page methods
     */
    async open():Promise<string> {
        return super.open('login');
    }
}

export default new PageObjects();
