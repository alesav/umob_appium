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

    // Element selectors - Core Authentication
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

    // Navigation Elements
    get accountButton() {
        return $("accessibility id:menu_account_button");
    }
    get planTripBtn() {
        return $('-android uiautomator:new UiSelector().text("Plan Trip")');
    }
    get promosBtn() {
        return $('-android uiautomator:new UiSelector().text("Promos")');
    }
    get myRidesButton() {
        return $('-android uiautomator:new UiSelector().text("My rides")');
    }
    get publicTransportButton() {
        return $(
            '-android uiautomator:new UiSelector().text("Public Transport")',
        );
    }
    get grabTaxiButton() {
        return $('-android uiautomator:new UiSelector().text("Book now")');
    }

    // Trip related elements
    get priceButton() {
        return $('-android uiautomator:new UiSelector().text("Price")');
    }
    get reserveButton() {
        return $('-android uiautomator:new UiSelector().text("Reserve")');
    }
    get cancelButton() {
        return $('-android uiautomator:new UiSelector().text("Cancel")');
    }
    get startTripButton() {
        return $('-android uiautomator:new UiSelector().text("Start Trip")');
    }
    get donkeyStartButton2() {
        return $('-android uiautomator:new UiSelector().text("Start Trip")'); //await driver.$("accessibility id:continue");
    }
    get donkeyLockText1() {
        return $(
            '-android uiautomator:new UiSelector().textContains("Use the handle to open the lock")',
        );
    }
    get donkeyLockText2() {
        return $(
            '-android uiautomator:new UiSelector().textContains("Pull the lock from")',
        );
    }
    get endTripButton() {
        return $('-android uiautomator:new UiSelector().text("End Trip")');
    }
    get markArrivalButton() {
        return $('-android uiautomator:new UiSelector().text("Mark Arrival")');
    }
    get gotItButton() {
        return $('-android uiautomator:new UiSelector().text("Got It!")');
    }
    get retryButton() {
        return $('-android uiautomator:new UiSelector().text("Retry")');
    }
    get continueButton() {
        return $('-android uiautomator:new UiSelector().text("Continue")');
    }
    get inviteFriendsButton() {
        return $(
            '-android uiautomator:new UiSelector().text("Invite Friends Now!")',
        );
    }
    get backButton() {
        return $(
            '-android uiautomator:new UiSelector().resourceId("back_button")',
        );
    }
    get backButtonAccessibility() {
        return $(
            '-android uiautomator:new UiSelector().description("back_button")',
        );
    }

    async felyxPriceInfo() {
        await this.priceButton.waitForDisplayed();
        await this.priceButton.click();
        await driver.pause(2000);
        const el1 = await driver.$(
            '-android uiautomator:new UiSelector().textContains("€")',
        );
        await expect(el1).toBeDisplayed();
        const el2 = await driver.$(
            '-android uiautomator:new UiSelector().textContains("Unlock")',
        );
        await expect(el2).toBeDisplayed();
        const el3 = await driver.$(
            '-android uiautomator:new UiSelector().textContains("Riding")',
        );
        await expect(el3).toBeDisplayed();
        const el4 = await driver.$(
            '-android uiautomator:new UiSelector().textContains("Pausing")',
        );
        await expect(el4).toBeDisplayed();
        const el5 = await driver.$(
            '-android uiautomator:new UiSelector().textContains("Got It")',
        );
        await expect(el5).toBeDisplayed();
        await el5.click();
    }

    // Donkey Republic Booking Elements
    get locationButton() {
        return $(
            '-android uiautomator:new UiSelector().resourceId("home_location_button")',
        );
    }
    get endTripText() {
        return $("accessibility id:endTrip-text");
    }
    get closeButton() {
        return $("accessibility id:Close");
    }
    get androidPermissionButton() {
        return $(
            "id:com.android.permissioncontroller:id/permission_allow_button",
        );
    }

    // Map and Location Elements
    get mapRoot() {
        return $(
            '-android uiautomator:new UiSelector().resourceId("map_root")',
        );
    }
    get exploreMapButton() {
        return $(
            '-android uiautomator:new UiSelector().textContains("Explore Map")',
        );
    }
    get sideControlButtons() {
        return $(
            '-android uiautomator:new UiSelector().resourceId("home-controls")',
        );
    }

    // Authentication Elements
    get startRegistrationButton() {
        return $(
            '-android uiautomator:new UiSelector().textContains("Start Registration")',
        );
    }
    get logInButton() {
        return $(
            '-android uiautomator:new UiSelector().textContains("Log In")',
        );
    }

    // QR Code and Vehicle Elements
    get qrCodeButton() {
        return $("accessibility id:scan-to-ride-button");
    }
    get scanVehicleButton() {
        return $('-android uiautomator:new UiSelector().text("Scan Vehicle")');
    }
    get vehicleIdInput() {
        return $("class name:android.widget.EditText");
    }
    get manualEntryInstruction() {
        return $(
            '-android uiautomator:new UiSelector().text("Enter the vehicle ID manually")',
        );
    }

    // Account Menu Elements
    get assetFilterToggle() {
        return $(
            '-android uiautomator:new UiSelector().resourceId("home_asset_filter_toggle")',
        );
    }

    get inviteFriendsMenuItem() {
        return $(
            '-android uiautomator:new UiSelector().text("Invite friends")',
        );
    }
    get personalInfoButton() {
        return $('-android uiautomator:new UiSelector().text("Personal info")');
    }
    get paymentMethodsButton() {
        return $(
            '-android uiautomator:new UiSelector().text("Payment methods")',
        );
    }
    get addPaymentMethodButton() {
        return $(
            '-android uiautomator:new UiSelector().text("Add Payment Method")',
        );
    }
    get removePaymentMethodButton() {
        return $(
            '-android uiautomator:new UiSelector().text("Remove Payment Method")',
        );
    }
    get idDocumentButton() {
        return $('-android uiautomator:new UiSelector().text("ID Document")');
    }
    get vouchersButton() {
        return $('-android uiautomator:new UiSelector().text("Vouchers")');
    }
    get myPaymentsButton() {
        return $('-android uiautomator:new UiSelector().text("My payments")');
    }
    get languageButton() {
        return $('-android uiautomator:new UiSelector().text("Language")');
    }
    get mapThemeSettingsButton() {
        return $(
            '-android uiautomator:new UiSelector().text("Map theme settings")',
        );
    }
    get supportButton() {
        return $('-android uiautomator:new UiSelector().text("Support")');
    }
    get deleteAccountButton() {
        return $(
            '-android uiautomator:new UiSelector().text("Delete account")',
        );
    }
    get logOutButton() {
        return $('-android uiautomator:new UiSelector().text("Log Out")');
    }
    get privacyLegalButton() {
        return $(
            '-android uiautomator:new UiSelector().text("Privacy & Legal")',
        );
    }

    // Authentication Screen Elements (for not logged in state)
    get loginButton() {
        return $('-android uiautomator:new UiSelector().text("Login")');
    }
    get registerButton() {
        return $('-android uiautomator:new UiSelector().text("Register")');
    }

    // Nearby Assets Elements
    get nearbyAssetsText() {
        return $('-android uiautomator:new UiSelector().text("Nearby assets")');
    }
    get refreshButton() {
        return $('-android uiautomator:new UiSelector().text("Refresh")');
    }

    // Payment elements
    get selectPayment() {
        return $(
            '-android uiautomator:new UiSelector().text("Select payment method")',
        );
    }
    get multiPaymentOption() {
        return $('-android uiautomator:new UiSelector().textContains("multi")');
    }
    get noRideCreditOption() {
        return $('-android uiautomator:new UiSelector().text("No voucher")');
    }
    get paymentHeader() {
        return $(
            '-android uiautomator:new UiSelector().text("PAYMENT METHODS")',
        );
    }

    // Voucher/Ride Credit Screen Elements
    get voucherCodeLabel() {
        return $('-android uiautomator:new UiSelector().textContains("Code")');
    }
    get voucherCodeInput() {
        return $(
            '-android uiautomator:new UiSelector().className("android.widget.EditText")',
        );
    }
    get submitPromotionalCodeButton() {
        return $(
            '-android uiautomator:new UiSelector().text("Submit Promotional Code")',
        );
    }

    // Permission Elements
    get allowPermissionButton() {
        return $('-android uiautomator:new UiSelector().textContains("Allow")');
    }
    get whileUsingAppPermission() {
        return $(
            '-android uiautomator:new UiSelector().textContains("hile using the app")',
        );
    }
    get androidPermissionAllowButton() {
        return $(
            "id:com.android.permissioncontroller:id/permission_allow_button",
        );
    }

    // Help/Support button on home screen (for not logged users)
    get homeHelpButton() {
        return $("accessibility id:home_help_button");
    }

    // Support Screen Elements
    get supportScreenHeader() {
        return $('-android uiautomator:new UiSelector().text("Support")');
    }
    get supportFaqTab() {
        return $('-android uiautomator:new UiSelector().text("FAQ")');
    }
    get supportChatTab() {
        return $('-android uiautomator:new UiSelector().text("Chat")');
    }
    get supportAboutTab() {
        return $('-android uiautomator:new UiSelector().text("About")');
    }

    // Chat Elements
    get openChatButton() {
        return $('-android uiautomator:new UiSelector().text("Open Chat")');
    }
    get chatInputField() {
        return $(
            '-android uiautomator:new UiSelector().text("Start typing here")',
        );
    }
    get chatSendButton() {
        return $('-android uiautomator:new UiSelector().description("Send")');
    }

    /**
     * Handle location permissions that appear after login
     */
    async handleLocationPermissions() {
        try {
            // First permission popup
            await this.allowPermissionButton.waitForDisplayed({
                timeout: 5000,
            });
            await this.allowPermissionButton.click();

            await driver.pause(2000);

            // Android system permission button
            await this.androidPermissionAllowButton.waitForDisplayed({
                timeout: 5000,
            });
            await this.androidPermissionAllowButton.click();

            await driver.pause(2000);

            // "While using the app" permission
            await this.whileUsingAppPermission.waitForDisplayed({
                timeout: 5000,
            });
            await this.whileUsingAppPermission.click();
        } catch (error) {
            console.log(
                "Permission handling completed or not required:",
                error.message,
            );
        }
    }

    /**
     * Wait for and verify map is loaded
     */
    async waitForMapToLoad() {
        await this.mapRoot.waitForDisplayed({ timeout: 20000 });
        await expect(this.mapRoot).toBeDisplayed();
        await this.planTripBtn.waitForExist({ timeout: 10000 });
    }

    /**
     * Enter vehicle ID manually
     * @param {string} vehicleId - The vehicle ID to enter
     */
    async enterVehicleIdManually(vehicleId: string) {
        await this.manualEntryInstruction.waitForDisplayed();
        await expect(this.manualEntryInstruction).toBeDisplayed();

        await this.vehicleIdInput.waitForDisplayed();
        await this.vehicleIdInput.click();
        await this.vehicleIdInput.addValue(vehicleId);

        await this.continueButton.waitForDisplayed();
        await this.continueButton.click();
    }

    /**
     * Check for error messages indicating feature not working
     * @param {string[]} errorMessages - Array of error messages to check for
     */
    async checkForErrorMessages(errorMessages: string[]) {
        for (const message of errorMessages) {
            const errorElement = await driver.$(
                `-android uiautomator:new UiSelector().textContains("${message}")`,
            );

            try {
                const isDisplayed = await errorElement.isDisplayed();
                if (isDisplayed) {
                    throw new Error(
                        `Feature is not working: Found error message "${message}"`,
                    );
                }
            } catch (elementError) {
                if (elementError.message.includes("Feature is not working")) {
                    throw elementError;
                }
                // Element not found is good - continue checking
            }
        }
    }

    /**
     * Verify multiple menu items are displayed
     * @param {string[]} menuItems - Array of menu item texts to verify
     */
    async verifyMenuItems(menuItems: string[]) {
        for (const menuItem of menuItems) {
            const menuElement = await driver.$(
                `-android uiautomator:new UiSelector().text("${menuItem}")`,
            );
            await expect(menuElement).toBeDisplayed();
        }
    }

    /**
     * Perform scroll down action
     */
    async scrollDown() {
        const { width, height } = await driver.getWindowSize();
        await driver.performActions([
            {
                type: "pointer",
                id: "finger1",
                parameters: { pointerType: "touch" },
                actions: [
                    {
                        type: "pointerMove",
                        duration: 0,
                        x: width / 2,
                        y: height * 0.8,
                    },
                    { type: "pointerDown", button: 0 },
                    { type: "pause", duration: 100 },
                    {
                        type: "pointerMove",
                        duration: 1000,
                        x: width / 2,
                        y: height * 0.2,
                    },
                    { type: "pointerUp", button: 0 },
                ],
            },
        ]);
        await driver.pause(1000);
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
                '-android uiautomator:new UiSelector().text("Log In")',
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

            // Handle location permissions
            await this.allowPermissionButton.click();
            await this.handleLocationPermissions();

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

    /**
     * Add payment method with card details
     */
    async addPaymentMethod() {
        // Click Add payment method
        await this.addPaymentMethodButton.waitForDisplayed();
        await driver.pause(6000);
        await this.addPaymentMethodButton.click();
        await driver.pause(6000);

        // Click Cards
        const cardsBtn = await driver.$(
            '-android uiautomator:new UiSelector().text("Cards")',
        );
        await cardsBtn.waitForDisplayed();
        await cardsBtn.click();

        const cardNumber = await driver.$(
            "id:com.umob.umob:id/editText_cardNumber",
        );
        await cardNumber.click();
        await cardNumber.addValue("5555341244441115");

        const expiryDate = await driver.$(
            "id:com.umob.umob:id/editText_expiryDate",
        );
        await expiryDate.click();
        await expiryDate.addValue("0330");

        const securityCode = await driver.$(
            "id:com.umob.umob:id/editText_securityCode",
        );
        await securityCode.click();
        await securityCode.addValue("737");

        const cardHolder = await driver.$(
            "id:com.umob.umob:id/editText_cardHolder",
        );
        await cardHolder.click();
        await cardHolder.addValue("Test Account");

        const payButton = await driver.$("id:com.umob.umob:id/payButton");
        await payButton.click();

        await driver.pause(2000);
    }

    /**
     * Navigate to Personal Info screen from account menu
     */
    async navigateToPersonalInfo() {
        await this.clickAccountButton();
        await driver.pause(2000);
        await this.personalInfoButton.waitForDisplayed();
        await this.personalInfoButton.click();
    }

    /**
     * Navigate to Payment Methods screen from account menu
     */
    async navigateToPaymentMethods() {
        await this.clickAccountButton();
        await driver.pause(3000);
        await this.paymentMethodsButton.waitForDisplayed();
        await driver.pause(2000);
        await this.paymentMethodsButton.click();
    }

    async open(): Promise<string> {
        return super.open("login");
    }
}

export default new PageObjects();
