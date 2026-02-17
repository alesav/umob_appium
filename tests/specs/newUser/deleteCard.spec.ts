import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import { getCredentials, executeTest, ENV } from "../../helpers/TestHelpers.js";

const TEST_USER = "newUser";

describe("Remove payment card for the new user", () => {
    before(async () => {
        const credentials = getCredentials(ENV, TEST_USER);

        await PageObjects.login({
            username: credentials.username,
            password: credentials.password,
        });
    });

    it("Remove payment card", async () => {
        const testId = "1be97f63-7dc1-4011-88cb-e8634b5de358";

        await executeTest(testId, async () => {
            await driver.pause(2000);
            await PageObjects.clickAccountButton();
            await driver.pause(2000);

            // Go to payment settings
            await expect(PageObjects.paymentMethodsButton).toBeDisplayed();
            await PageObjects.paymentMethodsButton.click();

            await driver.pause(2000);

            // Verify remove button is displayed and click it
            await expect(PageObjects.removePaymentMethodButton).toBeDisplayed();
            await driver.pause(1000);
            await PageObjects.removePaymentMethodButton.click();
            await driver.pause(1000);

            // Verify that it was removed by displaying Payment methods in account menu
            await expect(PageObjects.paymentMethodsButton).toBeDisplayed();
        });
    });

    afterEach(async () => {
        await driver.terminateApp("com.umob.umob");
    });
});
