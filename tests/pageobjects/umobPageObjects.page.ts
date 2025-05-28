import Page from './page.js';
import submitTestRun from '../helpers/SendResults.js';
import fs from 'fs';
import path from 'path';

class PageObjects extends Page {
    constructor() {
        super();
        const screenshotsDir = './screenshots';
        if (!fs.existsSync(screenshotsDir)) {
            fs.mkdirSync(screenshotsDir, { recursive: true });
        }
    }
    
    // Element selectors
    get username() { return $('#username'); }
    get password() { return $('#password'); }
    get submitButton() { return $('#login button[type=submit]'); }
    get flash() { return $('#flash'); }
    get accountButton() { return $('-android uiautomator:new UiSelector().className("com.horcrux.svg.SvgView").instance(0)'); }
    get planTripBtn() { return $('-android uiautomator:new UiSelector().text("Plan Trip")'); }
    get promosBtn() { return $('-android uiautomator:new UiSelector().text("Promos")'); }
    get myRidesButton() { return $("-android uiautomator:new UiSelector().text(\"My Rides & Tickets\")"); }
    
    // Trip related elements
    get startTripButton() { return $('-android uiautomator:new UiSelector().text("START TRIP")'); }
    get endTripButton() { return $('-android uiautomator:new UiSelector().text("END TRIP")'); }
    get gotItButton() { return $('-android uiautomator:new UiSelector().text("GOT IT!")'); }
    get retryButton() { return $('-android uiautomator:new UiSelector().text("RETRY")'); }
    get inviteFriendsButton() { return $('-android uiautomator:new UiSelector().text("INVITE FRIENDS NOW!")'); }
    get backButton() { return $("-android uiautomator:new UiSelector().resourceId(\"back_button\")"); }
    
    // Payment elements
    get multiPaymentOption() { return $('-android uiautomator:new UiSelector().textContains("multi")'); }
    get noRideCreditOption() { return $('-android uiautomator:new UiSelector().text("No ride credit")'); }

    async login({ username, password }: {username: string; password: string;}) {
        const testId = "b6f88693-4e0a-4958-8d26-b4f3a4d0b7d6";
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            const deviceCapabilities = JSON.stringify(driver.capabilities);
            console.log("Login with: " + username + " and password: " + password);

            const logInBtn = await driver.$('-android uiautomator:new UiSelector().text("LOG IN")');
            await logInBtn.waitForDisplayed({ timeout: 200000 });
            await driver.pause(3000);
            await logInBtn.click();
     
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
     
            const permissionsPopup = await driver.$('-android uiautomator:new UiSelector().textContains("Allow")');
            await permissionsPopup.isDisplayed();
            await expect(permissionsPopup).toBeDisplayed();
            await permissionsPopup.click();
     
            console.log("deviceInfo " + deviceCapabilities);
            if (deviceCapabilities.includes("Local")) {
                const enableNotifications = await driver.$("id:com.android.permissioncontroller:id/permission_allow_button");
                await expect(enableNotifications).toBeDisplayed();
                await enableNotifications.click();
            }
            
            await driver.pause(2000);
            const permissionsPopup2 = await driver.$('-android uiautomator:new UiSelector().textContains("hile using the app")');
            await permissionsPopup2.isDisplayed();
            await permissionsPopup2.click();
            
            await this.accountButton.waitForExist();
            
        } catch (e) {
            error = e;
            console.error("Login failed:", error);
            testStatus = "Fail";
            testDetails = e.message;
            
            screenshotPath = "./screenshots/login_" + testId + ".png";
            await driver.saveScreenshot(screenshotPath);
            
            try {
                await submitTestRun(testId, testStatus, testDetails, screenshotPath);
                console.log("Login failure report submitted successfully");
            } catch (submitError) {
                console.error("Failed to submit login failure report:", submitError);
            }
            
            throw error;
        }
    }

    async selectPaymentMethod() {
        await this.multiPaymentOption.waitForEnabled();
        await this.multiPaymentOption.click();
        await this.noRideCreditOption.click();
    }

    async startTrip() {
        await this.startTripButton.waitForEnabled();
        await this.startTripButton.click();
    }

    async endTrip() {
        await this.endTripButton.waitForEnabled();
        await driver.pause(10000);
        await this.endTripButton.click();
    }

    async navigateToMyRides() {
        await this.accountButton.click();
        await driver.pause(1000);
        await this.myRidesButton.click();
        await driver.pause(5000);
    }

    async handleTripCompletion() {
        await this.gotItButton.waitForEnabled();
        await this.gotItButton.click();

        await this.inviteFriendsButton.waitForEnabled();
        await this.inviteFriendsButton.click();

        await driver.$('-android uiautomator:new UiSelector().text("Invite your friends")').waitForEnabled();

        await expect(this.backButton).toBeDisplayed();
        await this.backButton.click();

        await this.accountButton.waitForExist();
    }

    async waitForErrorMessage(errorText: string) {
        await driver.$(`-android uiautomator:new UiSelector().text("${errorText}")`).waitForDisplayed();
    }

    async clickRetryButton() {
        await this.retryButton.waitForEnabled();
        await this.retryButton.click();
    }

    async open(): Promise<string> {
        return super.open('login');
    }
}

export default new PageObjects();
