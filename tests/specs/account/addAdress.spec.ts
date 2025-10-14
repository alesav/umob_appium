import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import { getCredentials, executeTest, ENV, USER } from "../../helpers/TestHelpers.js";

describe("Add address for any user", () => {
    before(async () => {
        const credentials = getCredentials(ENV, USER);
        await PageObjects.login({
            username: credentials.username,
            password: credentials.password,
        });
    });

    it("Add address for any user", async () => {
        const testId = "ffddb0c7-90db-485d-a2d7-9857c6108e3d";

        await executeTest(testId, async () => {
            await driver.pause(2000);

            // Navigate to Personal Info screen
            await PageObjects.navigateToPersonalInfo();

            // Scroll down to zip code section - INDIVIDUAL SCROLL (DO NOT MODIFY)
            await driver.pause(5000);
            const { width, height } = await driver.getWindowSize();

            await driver.executeScript("mobile: scrollGesture", [
                {
                    left: 100,
                    top: 0,
                    width: 0,
                    height: height / 2,
                    direction: "down",
                    percent: 1,
                },
            ]);

            await driver.pause(2000);

            // Verify zip code field is visible
            const zipCode = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Zip Code")',
            );
            await expect(zipCode).toBeDisplayed();
            await driver.pause(1000);

            // Fill in zip code
            const codeSection = await driver.$(
                '-android uiautomator:new UiSelector().className("android.widget.EditText").instance(2)',
            );
            await codeSection.clearValue();
            await codeSection.addValue("3014");

            // Select country
            const countryDropdown = await driver.$("accessibility id:Country");
            await expect(countryDropdown).toBeDisplayed();
            await countryDropdown.click();
            await driver.pause(2000);

            const country = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Argentina")',
            );
            await expect(country).toBeDisplayed();
            await driver.pause(2000);
            await country.click();
            await driver.pause(2000);

            // Scroll to city section - INDIVIDUAL SCROLL (DO NOT MODIFY)
            await driver.executeScript("mobile: scrollGesture", [
                {
                    left: 100,
                    top: 0,
                    width: 0,
                    height: height / 2,
                    direction: "down",
                    percent: 1,
                },
            ]);
            await driver.pause(1000);

            // Fill in city
            const city = await driver.$(
                '-android uiautomator:new UiSelector().textContains("City")',
            );
            await expect(city).toBeDisplayed();

            const citySection = await driver.$(
                '-android uiautomator:new UiSelector().className("android.widget.EditText").instance(3)',
            );
            await citySection.clearValue();
            await citySection.addValue("Rotterdam");

            // Fill in street
            const street = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Street")',
            );
            await expect(street).toBeDisplayed();

            const streetSection = await driver.$(
                '-android uiautomator:new UiSelector().className("android.widget.EditText").instance(0)',
            );
            await streetSection.clearValue();
            await streetSection.addValue("Bloemstraat");

            // Fill in building number
            const number = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Number")',
            );
            await expect(number).toBeDisplayed();

            const numberSection = await driver.$(
                '-android uiautomator:new UiSelector().className("android.widget.EditText").instance(1)',
            );
            await numberSection.clearValue();
            await numberSection.addValue("80");

            // Scroll to Save button - INDIVIDUAL SCROLL (DO NOT MODIFY)
            await driver.executeScript("mobile: scrollGesture", [
                {
                    left: 100,
                    top: 0,
                    width: 0,
                    height: height / 2,
                    direction: "down",
                    percent: 1,
                },
            ]);
            await driver.pause(1000);

            // Save address
            const saveButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Save")',
            );
            await expect(saveButton).toBeDisplayed();
            await saveButton.click();

            // Verify save was successful - back at account menu
            const idDocument = await driver.$(
                '-android uiautomator:new UiSelector().textContains("ID Document")',
            );
            await expect(idDocument).toBeDisplayed();
        });
    });

    afterEach(async () => {
        await driver.terminateApp("com.umob.umob");
    });
});
