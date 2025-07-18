import Page from "./page.js";
import submitTestRun from "../helpers/SendResults.js";
import fs from "fs";
import path from "path";

class PageObjects extends Page {
    constructor() {
        super();
        const screenshotsDir = "./screenshots";
        if (!fs.existsSync(screenshotsDir)) {
            fs.mkdirSync(screenshotsDir, { recursive: true });
        }
    }

    // Element selectors
    get username() {
        return $("#username");
    }
    get password() {
        return $("#password");
    }
    get submitButton() {
        return $("#login button[type=submit]");
    }
    get flash() {
        return $("#flash");
    }
    // get accountButton() {
    //     return $(
    //         '-android uiautomator:new UiSelector().className("com.horcrux.svg.SvgView").instance(0)',
    //     );
    // }
        get accountButton() {
        return $(
            "accessibility id:menu_account_button",
        );
    }
    get planTripBtn() {
        return $('-android uiautomator:new UiSelector().text("Plan Trip")');
    }
    get promosBtn() {
        return $('-android uiautomator:new UiSelector().text("Promos")');
    }
    get myRidesButton() {
        return $(
            '-android uiautomator:new UiSelector().text("My rides")',
        );
    }

    // Trip related elements
    get startTripButton() {
        return $('-android uiautomator:new UiSelector().text("START TRIP")');
    }
    get endTripButton() {
        return $('-android uiautomator:new UiSelector().text("END TRIP")');
    }
    get gotItButton() {
        return $('-android uiautomator:new UiSelector().text("GOT IT!")');
    }
    get notNowButton() {
        return $('-android uiautomator:new UiSelector().text("NOT NOW")');
    }
    get retryButton() {
        return $('-android uiautomator:new UiSelector().text("RETRY")');
    }
    get inviteFriendsButton() {
        return $(
            '-android uiautomator:new UiSelector().text("INVITE FRIENDS NOW!")',
        );
    }
    get backButton() {
        return $(
            '-android uiautomator:new UiSelector().resourceId("back_button")',
        );
    }

    // Payment elements
    get multiPaymentOption() {
        return $('-android uiautomator:new UiSelector().textContains("multi")');
    }
    get noRideCreditOption() {
        return $(
            '-android uiautomator:new UiSelector().text("No voucher")',
        );
    }

    async login({
        username,
        password,
    }: {
        username: string;
        password: string;
    }) {
        const testId = "b6f88693-4e0a-4958-8d26-b4f3a4d0b7d6";
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            const deviceCapabilities = JSON.stringify(driver.capabilities);
            console.log(
                "Login with: " + username + " and password: " + password,
            );
            await driver.pause(3000);
            const logInBtn = await driver.$(
                '-android uiautomator:new UiSelector().text("LOG IN")',
            );
            await logInBtn.waitForDisplayed({ timeout: 200000 });
              await logInBtn.waitForEnabled();
            await driver.pause(5000);
            await logInBtn.click();

            const usernameField = await driver.$(
                "accessibility id:login_username_field",
            );
            await expect(usernameField).toBeDisplayed();
            await usernameField.addValue(username);

            const passwordField = await driver.$(
                "accessibility id:login_password_field",
            );
            await expect(passwordField).toBeDisplayed();
            await passwordField.addValue(password);

            const loginButtonText = await driver.$(
                "accessibility id:login_button-text",
            );
            await expect(loginButtonText).toBeDisplayed();
            await loginButtonText.click();

            const loginButton = await driver.$("accessibility id:login_button");
            await expect(loginButton).toBeDisplayed();
            await loginButton.click();

            const permissionsPopup = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Allow")',
            );
            await permissionsPopup.isDisplayed();
            await expect(permissionsPopup).toBeDisplayed();
            await permissionsPopup.click();

            console.log("deviceInfo " + deviceCapabilities);
            // if (deviceCapabilities.includes("Local")) {
            //     const enableNotifications = await driver.$(
            //         "id:com.android.permissioncontroller:id/permission_allow_button",
            //     );
            //     await expect(enableNotifications).toBeDisplayed();
            //     await enableNotifications.click();
            // }

            await driver.pause(5000);
            // const permissionsPopup2 = await driver.$(
            //     '-android uiautomator:new UiSelector().textContains("hile using the app")',
            // );
                        const permissionsPopup2 = await driver.$(
                'id:com.android.permissioncontroller:id/permission_allow_button',
            );
            await permissionsPopup2.isDisplayed();
            await permissionsPopup2.click();

                        await driver.pause(5000);
             const permissionsPopup3 = await driver.$(
                 '-android uiautomator:new UiSelector().textContains("hile using the app")',
             );

            await permissionsPopup3.isDisplayed();
            await permissionsPopup3.click();

            await this.accountButton.waitForExist();
        } catch (e) {
            error = e;
            console.error("Login failed:", error);
            testStatus = "Fail";
            testDetails = e.message;

            screenshotPath = "./screenshots/login_" + testId + ".png";
            await driver.saveScreenshot(screenshotPath);

            try {
                await submitTestRun(
                    testId,
                    testStatus,
                    testDetails,
                    screenshotPath,
                );
                console.log("Login failure report submitted successfully");
            } catch (submitError) {
                console.error(
                    "Failed to submit login failure report:",
                    submitError,
                );
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
        await driver.pause(2000);
        await this.startTripButton.click();
    }

    async endTrip() {
        await this.endTripButton.waitForEnabled();
        await driver.pause(10000);
        await this.endTripButton.click();
    }

    /**
     * Clicks the account button for not-logged-in users and ensures the account screen loads
     * Checks for "Let's get started!" text instead of logged-in user elements
     * @param {number} maxRetries - Maximum number of retry attempts (default: 5)
     * @param {number} checkDelay - Delay before checking if account screen loaded (default: 3000ms)
     * @returns {Promise<void>}
     */
    async clickAccountButtonNotLoggedTest(
        maxRetries: number = 5,
        checkDelay: number = 3000,
    ): Promise<void> {
        // Element that should be visible on the account screen for not-logged-in users
        const notLoggedAccountScreenIndicator = "Let's get started!";

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(
                    `Attempt ${attempt}: Clicking account button (not logged test)`,
                );

                // Wait for account button to exist and click it
                await this.accountButton.waitForExist();
                await driver.pause(1000);
                await this.accountButton.click();

                // Wait to see if the account screen actually loads
                await driver.pause(checkDelay);

                // Check if the not-logged-in account screen indicator is visible
                try {
                    const indicator = await driver.$(
                        `-android uiautomator:new UiSelector().text("${notLoggedAccountScreenIndicator}")`,
                    );
                    if (
                        (await indicator.isExisting()) &&
                        (await indicator.isDisplayed())
                    ) {
                        console.log(
                            `Success: Not-logged account screen loaded on attempt ${attempt}`,
                        );
                        return; // Success - exit the retry loop
                    }
                } catch (error) {
                    // Continue to retry logic
                }

                console.log(
                    `Attempt ${attempt}: Not-logged account screen not loaded, will retry...`,
                );
                if (attempt === maxRetries) {
                    throw new Error(
                        `Failed to load not-logged account screen after ${maxRetries} attempts`,
                    );
                }
            } catch (error) {
                console.log(
                    `Attempt ${attempt}: Error clicking account button:`,
                    error.message,
                );
                if (attempt === maxRetries) {
                    throw new Error(
                        `Failed to click account button after ${maxRetries} attempts. Last error: ${error.message}`,
                    );
                }
            }
        }
    }

    /**
     * Clicks the account button and ensures the account screen actually loads
     * Retries if spinner overlay prevents the actual click
     * @param {number} maxRetries - Maximum number of retry attempts (default: 5)
     * @param {number} checkDelay - Delay before checking if account screen loaded (default: 3000ms)
     * @returns {Promise<void>}
     */
    async clickAccountButton(
        maxRetries: number = 5,
        checkDelay: number = 3000,
    ): Promise<void> {
        // Elements that should be visible on the account screen to confirm navigation worked
        const accountScreenIndicators = [
            "Personal info",
            "Payment methods",
            "Invite friends",
            "My rides",
        ];

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`Attempt ${attempt}: Clicking account button`);

                // Wait for account button to exist and click it
                await this.accountButton.waitForExist();
                await driver.pause(1000);
                await this.accountButton.click();

                // Wait to see if the account screen actually loads
                await driver.pause(checkDelay);

                // Check if any of the account screen indicators are visible
                let accountScreenLoaded = false;
                for (const indicatorText of accountScreenIndicators) {
                    try {
                        const indicator = await driver.$(
                            `-android uiautomator:new UiSelector().text("${indicatorText}")`,
                        );
                        if (
                            (await indicator.isExisting()) &&
                            (await indicator.isDisplayed())
                        ) {
                            console.log(
                                `Success: Account screen loaded on attempt ${attempt} (found: ${indicatorText})`,
                            );
                            accountScreenLoaded = true;
                            break;
                        }
                    } catch (error) {
                        // Continue checking other indicators
                    }
                }

                if (accountScreenLoaded) {
                    return; // Success - exit the retry loop
                } else {
                    console.log(
                        `Attempt ${attempt}: Account screen not loaded, will retry...`,
                    );
                    if (attempt === maxRetries) {
                        throw new Error(
                            `Failed to load account screen after ${maxRetries} attempts`,
                        );
                    }
                }
            } catch (error) {
                console.log(
                    `Attempt ${attempt}: Error clicking account button:`,
                    error.message,
                );
                if (attempt === maxRetries) {
                    throw new Error(
                        `Failed to click account button after ${maxRetries} attempts. Last error: ${error.message}`,
                    );
                }
            }
        }
    }

    async navigateToMyRides() {
        await this.clickAccountButton();
        await driver.pause(1000);
        await this.myRidesButton.click();
        await driver.pause(5000);
    }

    async handleTripCompletion() {
        await this.gotItButton.waitForEnabled();
        await this.gotItButton.click();

        await this.inviteFriendsButton.waitForEnabled();
        await this.inviteFriendsButton.click();

        await driver
            .$(
                '-android uiautomator:new UiSelector().text("Invite your friends")',
            )
            .waitForEnabled();

        await expect(this.backButton).toBeDisplayed();
        await this.backButton.click();

        await this.accountButton.waitForExist();
    }

    async waitForErrorMessage(errorText: string) {
        await driver
            .$(`-android uiautomator:new UiSelector().text("${errorText}")`)
            .waitForDisplayed();
    }

    async clickRetryButton() {
        await this.retryButton.waitForEnabled();
        await this.retryButton.click();
    }

    async open(): Promise<string> {
        return super.open("login");
    }
}

export default new PageObjects();
