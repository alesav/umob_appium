import submitTestRun from "../../helpers/SendResults.js";

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
                '-android uiautomator:new UiSelector().text("LOG IN")',
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
                '-android uiautomator:new UiSelector().text("LOG IN")',
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
                '-android uiautomator:new UiSelector().text("LOG IN")',
            );
            await logInBtn.click();

            const loginButtonText = await driver
                .$("accessibility id:login_button")
                .isEnabled();

            //await expect(loginButtonText).toBeFalsy();
            console.log(loginButtonText);
            await expect(loginButtonText).toBeFalsy();
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
