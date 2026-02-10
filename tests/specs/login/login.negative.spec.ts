import submitTestRun from "../../helpers/SendResults.js";
import PostHogHelper from "../../helpers/PosthogHelper.js";

const posthog = new PostHogHelper();

describe("Login Negative Scenarios", () => {
    beforeEach(async () => {
        // Ensure app is launched and initial screen is loaded
        await driver.activateApp("com.umob.umob");
    });

    it("should fail login with invalid username", async () => {
        const testId = "621e2f59-d256-4389-98ed-9ec0843db169";
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            const deviceCapabilities = await JSON.stringify(
                driver.capabilities,
            ).toString();

            // Find and click LOG IN button
            const logInBtn = await driver.$(
                '-android uiautomator:new UiSelector().text("Log in")',
            );
            await logInBtn.isClickable();
            await driver.pause(2000);
            await logInBtn.click();

            // Enter invalid username
            const usernameField = await driver.$(
                "accessibility id:login_username_field",
            );
            await expect(usernameField).toBeDisplayed();
            await usernameField.addValue("invalid.email@example.com");

            const passwordField = await driver.$(
                "accessibility id:login_password_field",
            );
            await passwordField.addValue("123Qwerty!");

            const loginButtonText = await driver.$(
                "accessibility id:login_button-text",
            );
            await driver.pause(2000);
            await loginButtonText.click();

            const loginButton = await driver.$("accessibility id:login_button");
            await expect(loginButton).toBeDisplayed();
            await loginButton.click();

            // // Wait for permissions popup
            const permissionsPopup = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Allow")',
            );
            await permissionsPopup.isDisplayed();
            await expect(permissionsPopup).toBeDisplayed();
            await permissionsPopup.click();

            // console.log("deviceInfo " + deviceCapabilities);
            // if (deviceCapabilities.includes("Local")) {
            //     const enableNotifications = await driver.$(
            //         "id:com.android.permissioncontroller:id/permission_allow_button",
            //     );
            //     await expect(enableNotifications).toBeDisplayed();
            //     await enableNotifications.click();
            // }

            // Check for enable notifications popup on all devices
            const enableNotifications = await driver.$(
                "id:com.android.permissioncontroller:id/permission_allow_button",
            );
            await expect(enableNotifications).toBeDisplayed();
            await enableNotifications.click();

            // Verify error message
            const errorMessage = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Invalid username or password")',
            );
            await expect(errorMessage).toBeDisplayed();
        } catch (e) {
            error = e;
            console.error("Test failed:", error);
            testStatus = "Fail";
            testDetails = e.message;

            // Capture screenshot on failure
            screenshotPath = "./screenshots/" + testId + ".png";
            await driver.saveScreenshot(screenshotPath);
        } finally {
            // Submit test run result
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

            // If there was an error in the main try block, throw it here to fail the test
            if (error) {
                throw error;
            }
        }
    });

    it("should fail login with invalid password", async () => {
        const testId = "49269e14-fa4e-43a7-a83c-ad1cb803a5c3";
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            const enableNotifications = await driver.$(
                "id:com.android.permissioncontroller:id/permission_allow_button",
            );

            const deviceCapabilities = await JSON.stringify(
                driver.capabilities,
            ).toString();

            // Find and click LOG IN button
            const logInBtn = await driver.$(
                '-android uiautomator:new UiSelector().text("Log in")',
            );
            await logInBtn.click();

            // Enter valid username with incorrect password
            const usernameField = await driver.$(
                "accessibility id:login_username_field",
            );
            await expect(usernameField).toBeDisplayed();
            await usernameField.addValue("4bigfoot+10@gmail.com");

            const passwordField = await driver.$(
                "accessibility id:login_password_field",
            );
            await passwordField.addValue("WrongPassword123!");

            const loginButtonText = await driver.$(
                "accessibility id:login_button-text",
            );
            await driver.pause(2000);
            await loginButtonText.click();

            const loginButton = await driver.$("accessibility id:login_button");
            await expect(loginButton).toBeDisplayed();
            await loginButton.click();

            if (await enableNotifications.isDisplayed()) {
                await enableNotifications.click();
            }

            /*
            if (deviceCapabilities.includes("Local")) {
                const enableNotifications = await driver.$(
                    "id:com.android.permissioncontroller:id/permission_allow_button",
                );
                await expect(enableNotifications).toBeDisplayed();
                await enableNotifications.click();
            }
            */

            // Verify error message
            const errorMessage = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Invalid username or password")',
            );

            await expect(errorMessage).toBeDisplayed();

            // Verify PostHog event
            try {
                // 1. get Welcome screen
                const welcomeEvent = await posthog.waitForEvent(
                    {
                        eventName: "$screen",
                        screenName: "Welcome",
                    },
                    {
                        maxRetries: 10,
                        retryDelayMs: 2000,
                        searchLimit: 20,
                        maxAgeMinutes: 5,
                    },
                );

                // 2. get Login screen
                const loginEvent = await posthog.waitForEvent(
                    {
                        eventName: "$screen",
                        screenName: "Login",
                    },
                    {
                        maxRetries: 10,
                        retryDelayMs: 2000,
                        searchLimit: 20,
                        maxAgeMinutes: 5,
                    },
                );

                // 3. get menu screen
                const menuEvent = await posthog.waitForEvent(
                    {
                        eventName: "$screen",
                        screenName: "Menu",
                    },
                    {
                        maxRetries: 10,
                        retryDelayMs: 2000,
                        searchLimit: 20,
                        maxAgeMinutes: 5,
                    },
                );

                // now assertions for each event

                // verify Welcome event
                expect(welcomeEvent.event).toBe("$screen");
                expect(welcomeEvent.properties?.$screen_name).toBe("Welcome");
                expect(welcomeEvent.person?.is_identified).toBe(false);

                // verify login event
                expect(loginEvent.event).toBe("$screen");
                expect(loginEvent.properties?.$screen_name).toBe("Login");
                expect(loginEvent.person?.is_identified).toBe(false);

                // verify menu event
                expect(menuEvent.event).toBe("$screen");
                expect(menuEvent.properties?.$screen_name).toBe("Menu");
                expect(menuEvent.person?.is_identified).toBe(false);

                // logs
                console.log("✅ Welcome event found:", welcomeEvent.id);
                console.log("✅ Login event found:", loginEvent.id);
                console.log("✅ Menu event found:", menuEvent.id);
            } catch (e) {
                console.error("PostHog validation failed:", e);
                throw e;
            }
        } catch (e) {
            error = e;
            console.error("Test failed:", error);
            testStatus = "Fail";
            testDetails = e.message;

            // Capture screenshot on failure
            screenshotPath = "./screenshots/" + testId + ".png";
            await driver.saveScreenshot(screenshotPath);
        } finally {
            // Submit test run result
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

            // If there was an error in the main try block, throw it here to fail the test
            if (error) {
                throw error;
            }
        }
    });

    it("should fail login with empty credentials", async () => {
        const testId = "df15ff51-8155-41ef-860b-79823f4cd324";
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            // Find and click LOG IN button
            const logInBtn = await driver.$(
                '-android uiautomator:new UiSelector().text("Log in")',
            );
            await logInBtn.click();

            const loginButtonText = await driver
                .$("accessibility id:login_button")
                .isEnabled();

            //await expect(loginButtonText).toBeFalsy();
            console.log(loginButtonText);
            await expect(loginButtonText).toBeFalsy();
            /*
            // Verify PostHog event

            const event = await posthog.waitForEvent(
                {
                    eventName: "$screen",
                    Identified: "false",
                    screenName: "Welcome",
                },
                {
                    maxRetries: 10,
                    retryDelayMs: 2000,
                    searchLimit: 20,
                },
            );
            await posthog.waitForEvent(
                {
                    eventName: "$screen",
                    Identified: "false",
                    screenName: "Login",

                    maxAgeMinutes: 5,
                },
                {
                    maxRetries: 10,
                    retryDelayMs: 2000,
                    searchLimit: 20,
                },
            );
            await posthog.waitForEvent(
                {
                    eventName: "$screen",
                    Identified: "false",
                    screenName: "Menu",

                    maxAgeMinutes: 5,
                },
                {
                    maxRetries: 10,
                    retryDelayMs: 2000,
                    searchLimit: 20,
                },
            );

            // If we got here, event was found with all criteria matching
            posthog.printEventSummary(event);

            // Assert key properties for clarity
            expect(event.event).toBe("$screen");
            // expect(event.properties.$set?.email).toBe("4bigfoot+10@gmail.com");
            // expect(event.person?.properties?.email).toBe(
            //     "4bigfoot+10@gmail.com",
            // );
            expect(event.person?.is_identified).toBe(false);
            // expect(event.event).toBe("$screen");
            // expect(event.properties?.$screen_name).toBe("Welcome");
            expect(event.event).toBe("$screen");
            expect(event.properties?.$screen_name).toBe("Login");
            // expect(event.event).toBe("$screen");
            // expect(event.properties?.$screen_name).toBe("Menu");
            */
        } catch (e) {
            error = e;
            console.error("Test failed:", error);
            testStatus = "Fail";
            testDetails = e.message;

            // Capture screenshot on failure
            screenshotPath = "./screenshots/" + testId + ".png";
            await driver.saveScreenshot(screenshotPath);
        } finally {
            // Submit test run result
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

            // If there was an error in the main try block, throw it here to fail the test
            if (error) {
                throw error;
            }
        }
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
