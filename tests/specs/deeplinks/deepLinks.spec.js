import { execSync } from "child_process";
import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import submitTestRun from "../../helpers/SendResults.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Deep Link Test Helper Class
class DeepLinkTestHelper {
    static async openDeepLink(deepLinkUrl, packageName = "com.umob.umob") {
        try {
            // Method 1: Using mobile: deepLink command (iOS/Android)
            await driver.execute("mobile: deepLink", {
                url: deepLinkUrl,
                package: packageName,
            });

            await driver.pause(3000); // Wait for app to process deep link
            return true;
        } catch (error) {
            console.log("mobile: deepLink failed, trying alternative method");
            return await this.openDeepLinkViaADB(deepLinkUrl, packageName);
        }
    }

    static async openDeepLinkViaADB(deepLinkUrl, packageName) {
        try {
            // Method 2: Using ADB command
            const adbCommand = `adb shell am start -W -a android.intent.action.VIEW -d "${deepLinkUrl}" ${packageName}`;
            execSync(adbCommand);
            await driver.pause(3000);
            return true;
        } catch (error) {
            console.error("Failed to open deep link via ADB:", error);
            return false;
        }
    }

    static async verifyScreen(expectedScreenIdentifier, timeout = 10000) {
        try {
            const element = await driver.$(expectedScreenIdentifier);
            await element.waitForDisplayed({ timeout });
            return true;
        } catch (error) {
            console.error(
                `Screen verification failed for: ${expectedScreenIdentifier}`,
            );
            return false;
        }
    }

    static async resetAppState() {
        await driver.terminateApp("com.umob.umob");
        await driver.pause(1000);
        await driver.activateApp("com.umob.umob");
        await driver.pause(2000);
    }
}

// Deep Link Test Configuration

// To Do: Add new deep links
// https://app.umobapp.com/applink/?url=/my-account/vouchers/ABc1234-yes
// https://app.umobapp.com/my-account/vouchers/ABc1234-yes
// umob://my-account/vouchers/ABc1234-yes
// Removed payment deeplink
const deepLinkNotLoggedIn = [
    {
        name: "ID Document screen Deep Link",
        url: "umob://my-account/IdDocument",
        expectedScreen:
            '-android uiautomator:new UiSelector().textContains("ID Document")',
        testId: "deeplink-home-001",
    },
    {
        name: "Home Deep Link",
        url: "umob://home",
        expectedScreen: "accessibility id:menu_account_button",
        testId: "deeplink-profile-002",
    },
    {
        name: "Rides List Deep Link",
        url: "umob://my-account/RidesList",
        expectedScreen:
            '-android uiautomator:new UiSelector().text("My rides")',
        testId: "deeplink-map-003",
    },
    {
        name: "FAQ Deep Link",
        url: "umob://home/support/faq",
        expectedScreen:
            '-android uiautomator:new UiSelector().textContains("How does it work (e-bike)")',
        testId: "deeplink-rides-004",
    },
    {
        name: "Support Chat Deep Link",
        url: "umob://home/support/chat",
        expectedScreen:
            '-android uiautomator:new UiSelector().text("OPEN CHAT")',
        testId: "deeplink-rides-004",
    },
    {
        name: "Chat Deep Link",
        url: "umob://chat",
        expectedScreen:
            '-android uiautomator:new UiSelector().text("OPEN CHAT")',
        testId: "deeplink-rides-004",
    },
    {
        name: "About Deep Link",
        url: "umob://home/support/about",
        expectedScreen:
            '-android uiautomator:new UiSelector().textContains("On a mission")',
        testId: "deeplink-rides-004",
    },
];

const deepLinkLoggedIn = [
    {
        name: "ID Document screen Deep Link",
        url: "umob://my-account/IdDocument",
        expectedScreen:
            '-android uiautomator:new UiSelector().textContains("ID Document")',
        testId: "deeplink-home-001",
    },
    {
        name: "Home Deep Link",
        url: "umob://home",
        expectedScreen: "accessibility id:menu_account_button",
        testId: "deeplink-profile-002",
    },
    {
        name: "Rides List Deep Link",
        url: "umob://my-account/RidesList",
        expectedScreen:
            '-android uiautomator:new UiSelector().text("My rides")',
        testId: "deeplink-map-003",
    },
    {
        name: "FAQ Deep Link",
        url: "umob://home/support/faq",
        expectedScreen:
            '-android uiautomator:new UiSelector().textContains("How does it work (e-bike)")',
        testId: "deeplink-rides-004",
    },
    {
        name: "Support Chat Deep Link",
        url: "umob://home/support/chat",
        expectedScreen:
            '-android uiautomator:new UiSelector().text("OPEN CHAT")',
        testId: "deeplink-rides-004",
    },
    {
        name: "Chat Deep Link",
        url: "umob://chat",
        expectedScreen:
            '-android uiautomator:new UiSelector().text("OPEN CHAT")',
        testId: "deeplink-rides-004",
    },
    {
        name: "About Deep Link",
        url: "umob://home/support/about",
        expectedScreen:
            '-android uiautomator:new UiSelector().textContains("On a mission")',
        testId: "deeplink-rides-004",
    },
];

describe("Deep Link Testing Suite", () => {
    let credentials;

    deepLinkNotLoggedIn.forEach((testCase) => {
        it(`Should open ${testCase.name} via deep link`, async () => {
            let testStatus = "Pass";
            let screenshotPath = "";
            let testDetails = "";
            let error = null;

            try {
                console.log(`Testing deep link: ${testCase.url}`);

                // Reset app to known state
                await DeepLinkTestHelper.resetAppState();

                // Open deep link
                const deepLinkOpened = await DeepLinkTestHelper.openDeepLink(
                    testCase.url,
                );

                if (!deepLinkOpened) {
                    throw new Error(
                        `Failed to open deep link: ${testCase.url}`,
                    );
                }

                // Verify correct screen is displayed
                const screenVerified = await DeepLinkTestHelper.verifyScreen(
                    testCase.expectedScreen,
                );

                if (!screenVerified) {
                    throw new Error(
                        `Expected screen not found after opening deep link: ${testCase.url}`,
                    );
                }

                console.log(
                    `✓ Deep link ${testCase.url} opened correct screen`,
                );
                testDetails = `Successfully opened ${testCase.url} and verified correct screen`;
            } catch (e) {
                error = e;
                console.error(
                    `Deep link test failed for ${testCase.url}:`,
                    error,
                );
                testStatus = "Fail";
                testDetails = `Failed to open ${testCase.url}: ${e.message}`;

                // Capture screenshot on failure
                screenshotPath = `${testCase.testId}-failure.png`;
                await driver.saveScreenshot(screenshotPath);
                console.log("Screenshot saved to", screenshotPath);
            } finally {
                // Submit test results
                try {
                    await submitTestRun(
                        testCase.testId,
                        testStatus,
                        testDetails,
                        screenshotPath,
                    );
                    console.log(`Test run submitted for ${testCase.testId}`);
                } catch (submitError) {
                    console.error("Failed to submit test run:", submitError);
                }

                if (error) {
                    throw error;
                }
            }
        });
    });

    it(`Login`, async () => {
        // Get credentials (using your existing method)
        const ENV = process.env.TEST_ENV || "test";
        const USER = process.env.TEST_USER || "new12";
        credentials = getCredentials(ENV, USER);

        // Login to app
        await PageObjects.login(credentials);
        await driver.pause(2000);
    });

    deepLinkLoggedIn.forEach((testCase) => {
        it(`Should open ${testCase.name} via deep link`, async () => {
            let testStatus = "Pass";
            let screenshotPath = "";
            let testDetails = "";
            let error = null;

            try {
                console.log(`Testing deep link: ${testCase.url}`);

                // Reset app to known state
                await DeepLinkTestHelper.resetAppState();

                // Open deep link
                const deepLinkOpened = await DeepLinkTestHelper.openDeepLink(
                    testCase.url,
                );

                if (!deepLinkOpened) {
                    throw new Error(
                        `Failed to open deep link: ${testCase.url}`,
                    );
                }

                // Verify correct screen is displayed
                const screenVerified = await DeepLinkTestHelper.verifyScreen(
                    testCase.expectedScreen,
                );

                if (!screenVerified) {
                    throw new Error(
                        `Expected screen not found after opening deep link: ${testCase.url}`,
                    );
                }

                console.log(
                    `✓ Deep link ${testCase.url} opened correct screen`,
                );
                testDetails = `Successfully opened ${testCase.url} and verified correct screen`;
            } catch (e) {
                error = e;
                console.error(
                    `Deep link test failed for ${testCase.url}:`,
                    error,
                );
                testStatus = "Fail";
                testDetails = `Failed to open ${testCase.url}: ${e.message}`;

                // Capture screenshot on failure
                screenshotPath = `${testCase.testId}-failure.png`;
                await driver.saveScreenshot(screenshotPath);
                console.log("Screenshot saved to", screenshotPath);
            } finally {
                // Submit test results
                try {
                    await submitTestRun(
                        testCase.testId,
                        testStatus,
                        testDetails,
                        screenshotPath,
                    );
                    console.log(`Test run submitted for ${testCase.testId}`);
                } catch (submitError) {
                    console.error("Failed to submit test run:", submitError);
                }

                if (error) {
                    throw error;
                }
            }
        });
    });

    after(async () => {
        await driver.terminateApp("com.umob.umob");
    });
});

// Additional test for deep links with parameters
/*
describe("Parametrized Deep Link Testing", () => {
    it("Should handle deep links with parameters", async () => {
        const testId = "deeplink-params-001";
        let testStatus = "Pass";
        let error = null;

        try {
            // Test deep link with parameters
            const deepLinkWithParams = "umob://ride?id=12345&action=start";

            await DeepLinkTestHelper.openDeepLink(deepLinkWithParams);

            // Verify app handled parameters correctly
            // You would need to check for specific elements that confirm
            // the parameters were processed
            const rideElement = await driver.$(
                '-android uiautomator:new UiSelector().textContains("12345")',
            );
            await expect(rideElement).toBeDisplayed({ timeout: 10000 });
        } catch (e) {
            error = e;
            testStatus = "Fail";
            console.error("Parametrized deep link test failed:", error);
        } finally {
            await submitTestRun(testId, testStatus, error?.message || "", "");
            if (error) throw error;
        }
    });
});
*/
// Helper function from your existing code
function getCredentials(environment = "test", userKey = null) {
    // Your existing implementation
    try {
        const credentialsPath = path.resolve(
            __dirname,
            "../../../config/credentials.json",
        );
        const credentials = JSON.parse(
            fs.readFileSync(credentialsPath, "utf8"),
        );

        if (!credentials[environment]) {
            console.warn(
                `Environment '${environment}' not found. Using 'test' environment.`,
            );
            environment = "test";
        }

        const envUsers = credentials[environment];
        if (!userKey) {
            userKey = Object.keys(envUsers)[0];
        } else if (!envUsers[userKey]) {
            console.warn(
                `User '${userKey}' not found. Using first available user.`,
            );
            userKey = Object.keys(envUsers)[0];
        }

        return {
            username: envUsers[userKey].username,
            password: envUsers[userKey].password,
        };
    } catch (error) {
        console.error("Error loading credentials:", error);
        throw new Error("Failed to load credentials configuration");
    }
}
