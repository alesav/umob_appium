import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import { executeTest } from "../../helpers/TestHelpers.js";
import { getLastRegisteredUser } from "../../helpers/RegistrationHelper.js";

describe("Test with last registered user", () => {
    let lastUser: any;

    before(async () => {
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
    });

    it("Should perform actions with last registered user", async () => {
        const testId = "example-test-id";

        await executeTest(testId, async () => {
            await driver.pause(2000);

            console.log(`✓ Logged in with user: ${lastUser.username}`);

            // Navigate to account
            await PageObjects.clickAccountButton();
            await driver.pause(2000);

            // Verify personal info button is displayed
            await expect(PageObjects.personalInfoButton).toBeDisplayed();

            console.log("✓ Successfully verified account screen");
        });
    });

    afterEach(async () => {
        await driver.terminateApp("com.umob.umob");
    });
});
