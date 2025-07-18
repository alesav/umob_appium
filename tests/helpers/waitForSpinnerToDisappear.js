/**
 * Helper function to wait for spinner/loading overlay to disappear
 * @param {object} driver - WebdriverIO driver instance
 * @param {number} timeout - Maximum wait time in milliseconds (default: 10000)
 * @returns {Promise<boolean>} True if spinner disappeared or was never present
 */
export async function waitForSpinnerToDisappear(driver, timeout = 10000) {
    const startTime = Date.now();

    // Common spinner selectors - adjust these based on your app's actual spinner elements
    const spinnerSelectors = [
        "android.widget.ProgressBar",
        '-android uiautomator:new UiSelector().className("android.widget.ProgressBar")',
        '-android uiautomator:new UiSelector().resourceId("loading")',
        '-android uiautomator:new UiSelector().resourceId("spinner")',
        '-android uiautomator:new UiSelector().resourceId("loadingIndicator")',
        '-android uiautomator:new UiSelector().textContains("Loading")',
        '-android uiautomator:new UiSelector().descriptionContains("loading")',
    ];

    console.log("Checking for spinner/loading overlays...");

    while (Date.now() - startTime < timeout) {
        let spinnerFound = false;

        for (const selector of spinnerSelectors) {
            try {
                const spinner = await driver.$(selector);
                if (
                    (await spinner.isExisting()) &&
                    (await spinner.isDisplayed())
                ) {
                    console.log(
                        `Spinner found with selector: ${selector}, waiting for it to disappear...`,
                    );
                    spinnerFound = true;
                    break;
                }
            } catch (error) {
                // Ignore errors when checking for spinner elements
            }
        }

        if (!spinnerFound) {
            console.log("No spinner found or spinner has disappeared");
            return true;
        }

        await driver.pause(500); // Check every 500ms
    }

    console.log(`Timeout waiting for spinner to disappear after ${timeout}ms`);
    return false;
}

export default waitForSpinnerToDisappear;
