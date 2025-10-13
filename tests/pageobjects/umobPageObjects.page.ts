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
    get reserveButton() {
        return $('-android uiautomator:new UiSelector().text("Reserve")');
    }
    get cancelButton() {
        return $('-android uiautomator:new UiSelector().text("Cancel")');
    }
    get startTripButton() {
        return $('-android uiautomator:new UiSelector().text("Start Trip")');
    }
    get endTripButton() {
        return $('-android uiautomator:new UiSelector().text("End Trip")');
    }
    get gotItButton() {
        return $('-android uiautomator:new UiSelector().text("Got It!")');
    }
    // get notNowButton() {
    //     return $('-android uiautomator:new UiSelector().text("NOT NOW")');
    // }
    get retryButton() {
        return $('-android uiautomator:new UiSelector().text("Retry")');
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

    // Personal Info / Address elements
    get personalInfoButton() {
        return $('-android uiautomator:new UiSelector().textContains("Personal info")');
    }
    get zipCodeLabel() {
        return $('-android uiautomator:new UiSelector().textContains("Zip Code")');
    }
    get zipCodeField() {
        return $('-android uiautomator:new UiSelector().className("android.widget.EditText").instance(2)');
    }
    get countryDropdown() {
        return $("accessibility id:Country");
    }
    get argentinaNCountry() {
        return $('-android uiautomator:new UiSelector().textContains("Argentina")');
    }
    get cityLabel() {
        return $('-android uiautomator:new UiSelector().textContains("City")');
    }
    get cityField() {
        return $('-android uiautomator:new UiSelector().className("android.widget.EditText").instance(3)');
    }
    get streetLabel() {
        return $('-android uiautomator:new UiSelector().textContains("Street")');
    }
    get streetField() {
        return $('-android uiautomator:new UiSelector().className("android.widget.EditText").instance(0)');
    }
    get numberLabel() {
        return $('-android uiautomator:new UiSelector().textContains("Number")');
    }
    get numberField() {
        return $('-android uiautomator:new UiSelector().className("android.widget.EditText").instance(1)');
    }
    get saveButton() {
        return $('-android uiautomator:new UiSelector().text("Save")');
    }
    get idDocumentLabel() {
        return $('-android uiautomator:new UiSelector().textContains("ID Document")');
    }

    //map related buttons when first time open app
    get exploreMapButton() {
        return $(
            '-android uiautomator:new UiSelector().textContains("Explore Map")',
        );
    }
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

    // Payment elements
    get multiPaymentOption() {
        return $('-android uiautomator:new UiSelector().textContains("multi")');
    }
    get noRideCreditOption() {
        return $('-android uiautomator:new UiSelector().text("No voucher")');
    }

    // Payment Methods Page elements
    get paymentMethodsButton() {
        return $('-android uiautomator:new UiSelector().text("Payment methods")');
    }
    get addPaymentMethodButton() {
        return $('-android uiautomator:new UiSelector().text("Add Payment Method")');
    }
    get removePaymentMethodButton() {
        return $('-android uiautomator:new UiSelector().text("Remove Payment Method")');
    }
    get cardsButton() {
        return $('-android uiautomator:new UiSelector().text("Cards")');
    }

    // Card Form elements
    get cardNumberField() {
        return $("id:com.umob.umob:id/editText_cardNumber");
    }
    get expiryDateField() {
        return $("id:com.umob.umob:id/editText_expiryDate");
    }
    get securityCodeField() {
        return $("id:com.umob.umob:id/editText_securityCode");
    }
    get cardHolderField() {
        return $("id:com.umob.umob:id/editText_cardHolder");
    }
    get payButton() {
        return $("id:com.umob.umob:id/payButton");
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
                "id:com.android.permissioncontroller:id/permission_allow_button",
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

    /**
     * Navigates to Payment Methods section from account menu
     */
    async navigateToPaymentMethods() {
        await this.clickAccountButton();
        await driver.pause(3000);
        
        await this.paymentMethodsButton.waitForDisplayed();
        await driver.pause(2000);
        await this.paymentMethodsButton.click();
        await driver.pause(2000);
    }

    /**
     * Removes existing payment method if present
     * This method doesn't throw if the button is not found
     */
    async removeExistingPaymentMethodIfPresent() {
        try {
            await this.removePaymentMethodButton.waitForDisplayed({ timeout: 5000 });
            await this.removePaymentMethodButton.click();
            await driver.pause(4000);
            console.log("Existing payment method removed");
        } catch (error) {
            console.log("No existing payment method to remove");
        }
    }

    /**
     * Clicks the Add Payment Method button
     */
    async clickAddPaymentMethod() {
        await this.addPaymentMethodButton.waitForDisplayed();
        await driver.pause(2000);
        await this.addPaymentMethodButton.click();
        await driver.pause(2000);
    }

    /**
     * Selects Cards as payment method type
     */
    async selectCardsPaymentType() {
        await this.cardsButton.waitForDisplayed();
        await this.cardsButton.click();
        await driver.pause(2000);
    }

    /**
     * Fills credit card information
     * @param {object} cardData - Object containing card information
     * @param {string} cardData.cardNumber - Card number
     * @param {string} cardData.expiryDate - Expiry date (MMYY format)
     * @param {string} cardData.securityCode - CVV/CVC code
     * @param {string} cardData.cardHolder - Cardholder name
     */
    async fillCreditCardInformation({
        cardNumber = "5555341244441115",
        expiryDate = "0330",
        securityCode = "737",
        cardHolder = "Test Account"
    }: {
        cardNumber?: string;
        expiryDate?: string;
        securityCode?: string;
        cardHolder?: string;
    } = {}) {
        // Fill card number
        await this.cardNumberField.click();
        await this.cardNumberField.addValue(cardNumber);

        // Fill expiry date
        await this.expiryDateField.click();
        await this.expiryDateField.addValue(expiryDate);

        // Fill security code
        await this.securityCodeField.click();
        await this.securityCodeField.addValue(securityCode);

        // Fill card holder name
        await this.cardHolderField.click();
        await this.cardHolderField.addValue(cardHolder);
    }

    /**
     * Submits the credit card form
     */
    async submitCreditCard() {
        await this.payButton.click();
        await driver.pause(5000);
    }

    /**
     * Verifies that payment method was added successfully by checking for Remove Payment Method button
     */
    async verifyPaymentMethodAdded() {
        await this.removePaymentMethodButton.waitForDisplayed();
        await driver.pause(2000);
    }

    /**
     * Removes the payment method (assumes Remove Payment Method button is visible)
     */
    async removePaymentMethod() {
        await this.removePaymentMethodButton.waitForDisplayed();
        await this.removePaymentMethodButton.click();
        await driver.pause(2000);
    }

    /**
     * Verifies that payment method was removed by checking for Add Payment Method button
     */
    async verifyPaymentMethodRemoved() {
        // Navigate back to payment methods
        await this.paymentMethodsButton.waitForDisplayed();
        await this.paymentMethodsButton.click();
        await driver.pause(2000);

        // Verify Add Payment Method button is displayed
        await this.addPaymentMethodButton.waitForDisplayed();
    }

    /**
     * Complete workflow to add a credit card payment method
     * @param {object} cardData - Optional card data object
     */
    async addCreditCardPaymentMethod(cardData?: {
        cardNumber?: string;
        expiryDate?: string;
        securityCode?: string;
        cardHolder?: string;
    }) {
        await this.navigateToPaymentMethods();
        await this.removeExistingPaymentMethodIfPresent();
        await this.clickAddPaymentMethod();
        await this.selectCardsPaymentType();
        await this.fillCreditCardInformation(cardData);
        await this.submitCreditCard();
        await this.verifyPaymentMethodAdded();
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

    /**
     * Navigates to Personal Info section from account menu
     */
    async navigateToPersonalInfo() {
        await this.clickAccountButton();
        await driver.pause(2000);
        
        await expect(this.personalInfoButton).toBeDisplayed();
        await this.personalInfoButton.click();
        await driver.pause(5000);
    }

    /**
     * Scrolls down on the page
     * @param {number} scrollPercent - Percentage to scroll (default: 1)
     */
    async scrollDown(scrollPercent: number = 1) {
        const { width, height } = await driver.getWindowSize();
        
        await driver.executeScript("mobile: scrollGesture", [
            {
                left: 100,
                top: 0,
                width: 0,
                height: height / 2,
                direction: "down",
                percent: scrollPercent,
            },
        ]);
        await driver.pause(2000);
    }

    /**
     * Fills address information in the personal info form
     * @param {object} addressData - Object containing address information
     * @param {string} addressData.zipCode - ZIP code
     * @param {string} addressData.country - Country name
     * @param {string} addressData.city - City name
     * @param {string} addressData.street - Street name
     * @param {string} addressData.number - Building number
     */
    async fillAddressInformation({
        zipCode = "3014",
        country = "Argentina",
        city = "Rotterdam",
        street = "Bloemstraat",
        number = "80"
    }: {
        zipCode?: string;
        country?: string;
        city?: string;
        street?: string;
        number?: string;
    } = {}) {
        // Scroll to zip code section
        await this.scrollDown();

        // Fill ZIP code
        await expect(this.zipCodeLabel).toBeDisplayed();
        await driver.pause(1000);
        
        await this.zipCodeField.clearValue();
        await this.zipCodeField.addValue(zipCode);

        // Select country
        await expect(this.countryDropdown).toBeDisplayed();
        await this.countryDropdown.click();
        await driver.pause(2000);

        const countryElement = await driver.$(
            `-android uiautomator:new UiSelector().textContains("${country}")`
        );
        await expect(countryElement).toBeDisplayed();
        await driver.pause(2000);
        await countryElement.click();
        await driver.pause(2000);

        // Scroll down to access city field
        await this.scrollDown();

        // Fill city
        await expect(this.cityLabel).toBeDisplayed();
        await this.cityField.clearValue();
        await this.cityField.addValue(city);

        // Fill street
        await expect(this.streetLabel).toBeDisplayed();
        await this.streetField.clearValue();
        await this.streetField.addValue(street);

        // Fill building number
        await expect(this.numberLabel).toBeDisplayed();
        await this.numberField.clearValue();
        await this.numberField.addValue(number);

        // Scroll to save button
        await this.scrollDown();

        // Click save button
        await expect(this.saveButton).toBeDisplayed();
        await this.saveButton.click();

        // Verify save was successful by checking for ID Document section
        await expect(this.idDocumentLabel).toBeDisplayed();
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
