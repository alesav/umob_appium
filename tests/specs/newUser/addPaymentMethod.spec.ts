import PageObjects from "../../pageobjects/umobPageObjects.page.js";
//import { getCredentials, executeTest, ENV, USER } from "../../helpers/TestHelpers.js";
import { getCredentials, executeTest, ENV } from "../../helpers/TestHelpers.js";

const TEST_USER = "newUser";

describe("Add Payment Method", () => {
    before(async () => {
        const credentials = getCredentials(ENV, TEST_USER);
        console.log(
            `Using credentials for environment: ${ENV}, user: ${TEST_USER}`,
        );
        console.log(`Username: ${credentials.username}`);
        await PageObjects.login({
            username: credentials.username,
            password: credentials.password,
        });
    });

    beforeEach(async () => {
        await driver.activateApp("com.umob.umob");
    });

    it("Positive Scenario: Add credit card", async () => {
        const testId = "19f3aab0-8cd8-4770-9093-d329714dc817";

        await executeTest(testId, async () => {
            await driver.pause(2000);

            // Navigate to Payment Methods screen
            await PageObjects.navigateToPaymentMethods();

            // Check if payment method already exists and remove it
            try {
                // Short timeout to check existence
                await PageObjects.removePaymentMethodButton.waitForDisplayed({
                    timeout: 5000,
                });

                // If button exists, click it to remove existing payment method
                await PageObjects.removePaymentMethodButton.click();
                await driver.pause(4000);
            } catch (error) {
                // If button not found, continue - no payment method to remove
                console.log("No existing payment method to remove");
            }

            // Add new payment method
            await PageObjects.addPaymentMethod();

            // Verify payment method was added successfully
            await driver.pause(2000);
            await PageObjects.removePaymentMethodButton.waitForDisplayed();

            // Clean up: remove the payment method
            // await PageObjects.removePaymentMethodButton.click();
            //await driver.pause(2000);

            // Verify we're back at Payment Methods screen
            //await PageObjects.paymentMethodsButton.waitForDisplayed();
            //await PageObjects.paymentMethodsButton.click();

            // Verify payment method is removed - Add Payment Method button should be visible
            //await PageObjects.addPaymentMethodButton.waitForDisplayed();
        });
    });

    afterEach(async () => {
        await driver.terminateApp("com.umob.umob");
    });
});
