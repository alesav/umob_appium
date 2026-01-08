import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import { executeTest } from "../../helpers/TestHelpers.js";
import {
    generateRandomEmail,
    generateRandomPhone,
    saveRegistrationData,
    logRegistrationInfo,
} from "../../helpers/RegistrationHelper.js";
//required for second test
import { getLastRegisteredUser } from "../../helpers/RegistrationHelper.js";

describe("Registration procedure for a new user in test environment", () => {
    let generatedEmail: string;
    let generatedPhone: string;
    const password = "123Qwerty!";

    before(async () => {
        // Generate random credentials before test
        generatedEmail = generateRandomEmail();
        generatedPhone = generateRandomPhone();

        console.log("\n" + "=".repeat(60));
        console.log("🚀 STARTING REGISTRATION TEST");
        console.log("=".repeat(60));
        console.log(`Email:    ${generatedEmail}`);
        console.log(`Phone:    +31${generatedPhone}`);
        console.log(`Password: ${password}`);
        console.log("=".repeat(60) + "\n");
    });

    // start application before each test
    beforeEach(async () => {
        await driver.terminateApp("com.umob.umob");
        await driver.activateApp("com.umob.umob");
        await driver.pause(5000);
    });

    it("Registration procedure for a new user in test environment", async function () {
        this.timeout(300000);
        const testId = "906516c7-f5f3-4d01-9b31-2c8d31310f46";

        await executeTest(testId, async () => {
            await driver.pause(2000);

            // Click Start Registration button
            const startRegButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Start Registration")',
            );
            await expect(startRegButton).toBeDisplayed();
            await startRegButton.click();

            // Verify screen header
            const screenTitle = await driver.$(
                "accessibility id:screenSubTitle",
            );
            await expect(screenTitle).toBeDisplayed();

            // Verify top headers
            const accountHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("ACCOUNT")',
            );
            await expect(accountHeader).toBeDisplayed();

            const paymentHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("PAYMENT")',
            );
            await expect(paymentHeader).toBeDisplayed();

            // Fill in name
            const nameField = await driver.$("accessibility id:account-name");
            await expect(nameField).toBeDisplayed();
            await nameField.addValue("TestN");

            // Fill in surname
            const surname = await driver.$("accessibility id:account-surname");
            await expect(surname).toBeDisplayed();
            await surname.addValue("TestS");

            // Fill in phone number (random 9 digits)
            const phoneField = await driver.$("accessibility id:phone-number");

            await expect(phoneField).toBeDisplayed();
            await phoneField.addValue(generatedPhone);
            console.log(`✓ Phone number entered: +31${generatedPhone}`);

            // Fill in email (random email in format new{5digits}@gmail.com)
            const emailField = await driver.$("accessibility id:email-address");
            await expect(emailField).toBeDisplayed();
            await emailField.addValue(generatedEmail);
            console.log(`✓ Email entered: ${generatedEmail}`);

            //scroll
            const { width, height } = await driver.getWindowSize();
            await driver.pause(2000);
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
                            y: height * 0.65,
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

            await driver.pause(2000);

            // Click Continue button
            const continueButton = await driver.$(
                "accessibility id:continue-text",
            );
            await expect(continueButton).toBeDisplayed();
            await continueButton.click();

            // Wait to ensure registration is processed
            await driver.pause(2000);

            //commented because of time-out issues
            //second screen - verification code
            // const screenHeader2 = await driver.$(
            //     '-android uiautomator:new UiSelector().text("What is your verification code?")',
            // );

            // await expect(screenHeader2).toBeDisplayed();

            // const notification = await driver.$(
            //     `-android uiautomator:new UiSelector().textContains("sent a verification code to")`,
            // );
            // await expect(notification).toBeDisplayed();

            // const editButton = await driver.$(
            //     '-android uiautomator:new UiSelector().text("Edit phone number")',
            // );
            // await expect(editButton).toBeDisplayed();

            // const screenTitle2 = await driver.$(
            //     "accessibility id:screenSubTitle",
            // );
            // await expect(screenTitle2).toBeDisplayed();

            // const resendCodeButton = await driver.$(
            //     "accessibility id:Resend code",
            // );
            // await expect(resendCodeButton).toBeDisplayed();

            //continue button exists but for now there is no need to click it. Test goes further after filling te code
            // const contButton = await driver.$("accessibility id:next");
            // await expect(contButton).toBeDisplayed();

            // Enter verification code - используйте EditText с resource-id="code"
            const codeInput = await driver.$(
                '-android uiautomator:new UiSelector().resourceId("code")',
            );
            await expect(codeInput).toBeDisplayed();
            // click for field activation
            await codeInput.click();
            await codeInput.addValue("1234");
            await driver.pause(4000);

            // Password screen
            const passHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Choose a password")',
            );
            await expect(passHeader).toBeDisplayed();

            const passNotification = await driver.$(
                '-android uiautomator:new UiSelector().text("Your password must contain at least 8 characters.")',
            );
            await expect(passNotification).toBeDisplayed();

            const passBox = await driver.$("accessibility id:password");
            await expect(passBox).toBeDisplayed();
            await passBox.addValue(password);

            const continueButton2 = await driver.$("accessibility id:continue");
            await expect(continueButton2).toBeDisplayed();
            await continueButton2.click();

            // Promo code screen
            const promoNotification = await driver.$(
                '-android uiautomator:new UiSelector().text("Got a promo or referral code? Unlock free rides now!")',
            );
            await expect(promoNotification).toBeDisplayed();

            const promoDescription = await driver.$(
                '-android uiautomator:new UiSelector().text("Enter your referral or promo code below to get free rides for both you and your friends.")',
            );
            await expect(promoDescription).toBeDisplayed();

            const promoCodeBox = await driver.$(
                "class name:android.widget.EditText",
            );
            await expect(promoCodeBox).toBeDisplayed();

            const skipButton = await driver.$("accessibility id:skip");
            await expect(skipButton).toBeDisplayed();
            await skipButton.click();

            // Privacy and Terms screen
            const almostReadyHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Yes! Almost ready to go!")',
            );
            await expect(almostReadyHeader).toBeDisplayed();

            // privacy description and terms
            const privacyDescription = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Read and confirm the privacy statement")',
            );
            await expect(privacyDescription).toBeDisplayed();

            const privacyStatement = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Privacy Statement")',
            );
            await expect(privacyStatement).toBeDisplayed();

            const termsConditions = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Terms and Conditions")',
            );
            await expect(termsConditions).toBeDisplayed();

            // Click checkboxes
            const privacyTick = await driver.$(
                "accessibility id:privacy-toggle",
            );
            await expect(privacyTick).toBeDisplayed();
            await privacyTick.click();
            const termsTick = await driver.$("accessibility id:terms-toggle");
            await expect(termsTick).toBeDisplayed();
            await termsTick.click();

            const continueButton3 = await driver.$(
                "accessibility id:continueX",
            );
            await expect(continueButton3).toBeDisplayed();
            await continueButton3.click();
            await driver.pause(4000);

            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            // NOW save registration data after successful registration
            saveRegistrationData(generatedEmail, generatedPhone, password);
            //////////////////////////////////////////////////////////////////////////////////////////////////////////

            // Location permission
            // const allowLocationButton = await driver.$(
            //     "id:com.android.permissioncontroller:id/permission_allow_foreground_only_button",
            // );
            await PageObjects.whileUsingAppPermission.waitForDisplayed;
            await PageObjects.whileUsingAppPermission.click();

            // Verify account button is present - registration successful
            await PageObjects.accountButton.waitForDisplayed();
            console.log("✅ Registration completed successfully!");

            // Go to account
            await PageObjects.clickAccountButton();
            await driver.pause(2000);

            // INDIVIDUAL SCROLL (DO NOT MODIFY)
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
                            y: height * 0.95,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        {
                            type: "pointerMove",
                            duration: 1000,
                            x: width / 2,
                            y: height * 0.1,
                        },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);
            await driver.pause(1000);

            // INDIVIDUAL SCROLL (DO NOT MODIFY)
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
                            y: height * 0.95,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        {
                            type: "pointerMove",
                            duration: 1000,
                            x: width / 2,
                            y: height * 0.1,
                        },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);
            await driver.pause(1000);

            // Click on LogOut option
            await expect(PageObjects.logOutButton).toBeDisplayed();
            await PageObjects.logOutButton.click();

            // Verify Login button appeared
            const signUpButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Login")',
            );
            await expect(signUpButton).toBeDisplayed();
        });
    });
    it("Confirmation that it is possible to enter to just registered new account and welcome vouchers exist", async () => {
        const testId = "e0cfc7bb-faca-4423-8235-9c9c33cb09a6";

        await executeTest(testId, async () => {
            await driver.pause(2000);
            let lastUser: any;
            // Get the last registered user from credentials.json
            lastUser = getLastRegisteredUser("test");
            if (!lastUser) {
                throw new Error(
                    "No registered user found. Please run registration test first.",
                );
            }
            // Login with the last registered user
            await PageObjects.login({
                username: lastUser.username,
                password: lastUser.password,
            });
            await driver.pause(5000);
            // Check for map root element
            await expect(PageObjects.mapRoot).toBeDisplayed();
            await PageObjects.promosBtn.waitForExist();
            await PageObjects.promosBtn.click();
            await driver.pause(1000);

            // Verify welcome vouchers
            const checkVoucher = await driver.$(
                '-android uiautomator:new UiSelector().text("New User Check")',
            );
            await expect(checkVoucher).toBeDisplayed();

            const donkeyVoucher = await driver.$(
                '-android uiautomator:new UiSelector().text("New User Donkey Republic")',
            );
            await expect(donkeyVoucher).toBeDisplayed();

            console.log(`✓ Logged in with user: ${lastUser.username}`);
        });
    });

    after(async () => {
        // Display formatted registration info
        logRegistrationInfo(generatedEmail, generatedPhone, password);
    });

    afterEach(async () => {
        // Optional: Reset the app state after each test
        try {
            await driver.terminateApp("com.umob.umob");
        } catch (error) {
            console.log("Error terminating app:", error);
        }
    });
});
