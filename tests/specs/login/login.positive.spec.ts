import submitTestRun from "../../helpers/SendResults.js";
import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import PostHogHelper from "../../helpers/PosthogHelper.js";

const posthog = new PostHogHelper();

const handleTestResult = async (
    testId: string,
    testAction: () => Promise<void>,
) => {
    let testStatus = "Pass";
    let screenshotPath = "";
    let testDetails = "";
    let error = null;

    try {
        await testAction();
    } catch (e) {
        error = e;
        console.error("Test failed:", error);
        testStatus = "Fail";
        testDetails = e.message;

        screenshotPath = `./screenshots/${testId}.png`;
        await driver.saveScreenshot(screenshotPath);
    } finally {
        try {
            await submitTestRun(
                testId,
                testStatus,
                testDetails,
                screenshotPath,
            );
            console.log("Test run submitted successfully");
        } catch (submitError) {
            console.error("Failed to submit test run:", submitError);
        }

        if (error) {
            throw error;
        }
    }
};

describe("Login positive scenarios", () => {
    beforeEach(async () => {
        await driver.pause(7000);
    });

    it("should display all key elements on the initial screen", async () => {
        const testId = "97ad3bd3-1c89-4fbf-8f25-28c32e138a7f";

        await handleTestResult(testId, async () => {
            const signUpTitle = await driver.$(
                '-android uiautomator:new UiSelector().text("Sign up & get €10,-")',
            );
            await expect(signUpTitle).toBeDisplayed();

            const signUpDescription = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Sign up to explore or get started right away")',
            );
            await expect(signUpDescription).toBeDisplayed();

            await PageObjects.startRegistrationButton.waitForDisplayed;
            await PageObjects.exploreMapButton.waitForDisplayed();
            await PageObjects.logInButton.waitForDisplayed();
        });
    });

    it("should be able to login successfully", async () => {
        const testId = "0dcfc86c-c4da-41ca-93ec-2836b814721a";

        await handleTestResult(testId, async () => {
            await PageObjects.logInButton.waitForDisplayed();
            await PageObjects.logInButton.click();

            const usernameField = await driver.$(
                "accessibility id:login_username_field",
            );
            await expect(usernameField).toBeDisplayed();
            await usernameField.addValue("4bigfoot+10@gmail.com");

            const passwordField = await driver.$(
                "accessibility id:login_password_field",
            );
            await expect(passwordField).toBeDisplayed();
            await passwordField.addValue("123Qwerty!");

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

            await PageObjects.clickAccountButton();

            const infoButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Personal info")',
            );
            await expect(infoButton).toBeDisplayed();

            // Verify PostHog event
            // const event = await posthog.waitForEvent(
            //     {
            //         eventName: "$identify",
            //         email: "4bigfoot+10@gmail.com",
            //         personEmail: "4bigfoot+10@gmail.com",
            //         maxAgeMinutes: 5,
            //     },
            //     {
            //         maxRetries: 10,
            //         retryDelayMs: 2000,
            //         searchLimit: 20,
            //     },
            // );

            await posthog.waitForEvent(
                {
                    eventName: "$screen",
                    personEmail: "4bigfoot+10@gmail.com",
                    screenName: "Welcome",

                    maxAgeMinutes: 5,
                },
                {
                    maxRetries: 10,
                    retryDelayMs: 2000,
                    searchLimit: 20,
                },
            );

            // If we got here, event was found with all criteria matching
            //posthog.printEventSummary(event); //

            // Assert key properties for clarity
            // expect(event.event).toBe("$identify");
            // expect(event.properties.$set?.email).toBe("4bigfoot+10@gmail.com");
            // expect(event.person?.properties?.email).toBe(
            //     "4bigfoot+10@gmail.com",
            // );
            // expect(event.person?.is_identified).toBe(true);
        });
    });

    it("should be able to terminate the app", async () => {
        await driver.terminateApp("com.umob.umob");
    });
});
