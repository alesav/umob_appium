import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import AppiumHelpers from "../../helpers/AppiumHelpers.js";
import { getCredentials, executeTest, ENV } from "../../helpers/TestHelpers.js";
import { execSync } from "child_process";
import PostHogHelper from "../../helpers/PosthogHelper.js";

const posthog = new PostHogHelper();

// Get environment and user from env variables or use defaults
const TEST_USER = "new56";

describe("Public Transport addresses logic", () => {
    before(async () => {
        const credentials = getCredentials(ENV, TEST_USER);

        await PageObjects.login({
            username: credentials.username,
            password: credentials.password,
        });

        execSync(
            "adb shell pm grant com.umob.umob android.permission.ACCESS_FINE_LOCATION",
        );
        execSync(
            "adb shell pm grant com.umob.umob android.permission.ACCESS_COARSE_LOCATION",
        );

        const latitude = 51.9155956;
        const longitude = 4.4744301;

        await AppiumHelpers.setLocationAndRestartApp(longitude, latitude);

        // Activate app once at the beginning
        await driver.activateApp("com.umob.umob");
        await driver.pause(7000);
    });

    it("should display all key elements on starting screen for Public Transport option", async () => {
        const testId = "aadda8c4-e616-43f8-9d31-a659f8c9ef78";

        await executeTest(testId, async () => {
            await PageObjects.planTripBtn.waitForExist();
            await PageObjects.planTripBtn.click();

            await driver.pause(2000);

            // INDIVIDUAL SCROLL (DO NOT MODIFY)
            const { width, height } = await driver.getWindowSize();
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
            await driver.pause(2000);

            // Click to choose public transport
            await PageObjects.publicTransportButton.waitForDisplayed();
            await PageObjects.publicTransportButton.click();

            // Verify screen header
            const screenHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Plan your trip")',
            );
            await expect(screenHeader).toBeDisplayed();

            // Verify departure and destination input section
            const departureDestinationLabel = await driver.$(
                '-android uiautomator:new UiSelector().text("Enter starting point & destination")',
            );
            await expect(departureDestinationLabel).toBeDisplayed();

            // Verify destination input
            const destinationInput = await driver.$(
                '-android uiautomator:new UiSelector().text("Destination")',
            );
            await expect(destinationInput).toBeDisplayed();

            // Verify time switch buttons
            const departAtButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Depart at")',
            );
            const arriveByButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Arrive by")',
            );
            await expect(departAtButton).toBeDisplayed();
            await expect(arriveByButton).toBeDisplayed();

            // Verify date input
            const dateInput = await driver.$(
                '-android uiautomator:new UiSelector().text("Today")',
            );
            await expect(dateInput).toBeDisplayed();

            // Verify time input
            const timeInput = await driver.$(
                '-android uiautomator:new UiSelector().text("Now")',
            );
            await expect(timeInput).toBeDisplayed();

            // Verify train class section
            const selectClassLabel = await driver.$(
                '-android uiautomator:new UiSelector().text("Select class (for trains)")',
            );
            await expect(selectClassLabel).toBeDisplayed();

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
                            x: 160,
                            y: height / 2 + 200,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        { type: "pointerMove", duration: 1000, x: 160, y: 10 },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

            // Verify train class switch buttons
            const secondClassButton = await driver.$(
                '-android uiautomator:new UiSelector().text("2nd class")',
            );
            const firstClassButton = await driver.$(
                '-android uiautomator:new UiSelector().text("1st class")',
            );
            await expect(secondClassButton).toBeDisplayed();
            await expect(firstClassButton).toBeDisplayed();

            // Verify Continue button
            const continueButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Continue")',
            );
            await expect(continueButton).toBeDisplayed();

            // Verify Help button
            const helpButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Help")',
            );
            await expect(helpButton).toBeDisplayed();
        });
    });

    it("should put in 1st destination point and click continue button", async () => {
        const testId = "f2bdda96-dcca-4159-b616-b20d62131571";

        await executeTest(testId, async () => {
            // INDIVIDUAL SCROLL (DO NOT MODIFY)
            const { width, height } = await driver.getWindowSize();
            await driver.performActions([
                {
                    type: "pointer",
                    id: "finger1",
                    parameters: { pointerType: "touch" },
                    actions: [
                        { type: "pointerMove", duration: 0, x: 400, y: 300 },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        { type: "pointerMove", duration: 1000, x: 100, y: 800 },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

            // Click on destination and text
            const el1 = await driver.$(
                '-android uiautomator:new UiSelector().className("android.widget.EditText").instance(1)',
            );
            await el1.addValue("Blaak 31");
            await driver.pause(4000);

            // First get the element's location and size
            const location = await el1.getLocation();
            const size = await el1.getSize();

            // Set location to specific scooter coordinates
            execSync(
                `adb shell input tap ${location.x + 100}  ${location.y + size.height + 70}`,
            );

            const chooseFromList = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Blaak 31")',
            );
            await expect(chooseFromList).toBeDisplayed();

            // Verify the continue button becomes enabled after adding destination
            const continuePress = await driver.$(
                '-android uiautomator:new UiSelector().text("Continue")',
            );
            await expect(continuePress).toBeDisplayed();
            await continuePress.click();
            await driver.pause(5000);
        });
    });

    it("should display at least one route with pricing in EURO", async () => {
        const testId = "f54a9323-0df1-4ef9-9974-05690f1e07c2";

        await executeTest(testId, async () => {
            // Check key elements on route selection screen
            const routeHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Travel Options")',
            );
            await expect(routeHeader).toBeDisplayed();

            // Check destination address is visible
            const address = await driver.$(
                '-android uiautomator:new UiSelector().text("Blaak 31 3011 GA Rotterdam")',
            );
            await expect(address).toBeDisplayed();

            // Select first route by clicking euro symbol
            const firstRoutePrice = await driver.$(
                "(//android.widget.TextView[contains(@text, '€')])[1]",
            );
            await expect(firstRoutePrice).toBeDisplayed();

            //// Check back button is displayed
            const backButton = await driver.$("accessibility id:back_button");
            await expect(backButton).toBeDisplayed();
            await backButton.click();

            await driver.pause(2000);
            await backButton.click();
        });
    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////

    it("should check previous address in the list but put in new address and check the new route on the next screen", async () => {
        const testId = "f8abe91c-9651-4c9a-8f67-73044135da0f";

        await executeTest(testId, async () => {
            await PageObjects.planTripBtn.waitForExist();
            await PageObjects.planTripBtn.click();

            await driver.pause(2000);

            // INDIVIDUAL SCROLL (DO NOT MODIFY)
            const { width, height } = await driver.getWindowSize();
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
            await driver.pause(2000);

            // Click to choose public transport
            await PageObjects.publicTransportButton.waitForDisplayed();
            await PageObjects.publicTransportButton.click();

            // Verify first address is "Blaak 2981 EC Ridderkerk"
            const firstAddress = await driver.$(
                '-android uiautomator:new UiSelector().resourceId("recent-destinations-text-0")',
            );
            await expect(firstAddress).toBeDisplayed();
            const firstAddressText = await firstAddress.getText();
            expect(firstAddressText).toBe("Blaak 31 3011 GA Rotterdam");

            // Click on destination and text
            const el1 = await driver.$(
                '-android uiautomator:new UiSelector().className("android.widget.EditText").instance(1)',
            );
            await el1.addValue("C 3199 KW Maasvlakte");
            await driver.pause(4000);

            // First get the element's location and size
            const location = await el1.getLocation();
            const size = await el1.getSize();

            // Set location to specific scooter coordinates
            execSync(
                `adb shell input tap ${location.x + 100}  ${location.y + size.height + 70}`,
            );

            const chooseFromList = await driver.$(
                '-android uiautomator:new UiSelector().textContains("C 3199 KW")',
            );
            await expect(chooseFromList).toBeDisplayed();

            // Verify the continue button becomes enabled after adding destination
            const continuePress = await driver.$(
                '-android uiautomator:new UiSelector().text("Continue")',
            );
            await expect(continuePress).toBeDisplayed();
            await continuePress.click();
            await driver.pause(5000);

            // Check destination address is visible
            const address = await driver.$(
                '-android uiautomator:new UiSelector().text("C 3199 KW Maasvlakte")',
            );
            await expect(address).toBeDisplayed();

            // Select first route by clicking euro symbol
            const firstRoutePrice = await driver.$(
                "(//android.widget.TextView[contains(@text, '€')])[1]",
            );
            await expect(firstRoutePrice).toBeDisplayed();

            //// Check back button is displayed
            const backButton = await driver.$("accessibility id:back_button");
            await expect(backButton).toBeDisplayed();
            await backButton.click();

            await driver.pause(2000);
            await backButton.click();
        });
    });

    it("verify that both previous addresses are in the correct order in the list and select the second one and check the route", async () => {
        const testId = "f14be604-96fa-4c19-882e-cdb7748412cb";

        await executeTest(testId, async () => {
            await PageObjects.planTripBtn.waitForExist();
            await PageObjects.planTripBtn.click();

            await driver.pause(2000);

            // INDIVIDUAL SCROLL (DO NOT MODIFY)
            const { width, height } = await driver.getWindowSize();
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
            await driver.pause(2000);

            // Click to choose public transport
            await PageObjects.publicTransportButton.waitForDisplayed();
            await PageObjects.publicTransportButton.click();

            // Verify first address is "C 3199 KW Maasvlakte"
            const firstAddress = await driver.$(
                '-android uiautomator:new UiSelector().resourceId("recent-destinations-text-0")',
            );
            await expect(firstAddress).toBeDisplayed();
            const firstAddressText = await firstAddress.getText();
            expect(firstAddressText).toBe("C 3199 KW Maasvlakte");

            // Verify second address is "Blaak 2981 EC Ridderkerk"
            const secondAddress = await driver.$(
                '-android uiautomator:new UiSelector().resourceId("recent-destinations-text-1")',
            );
            await expect(secondAddress).toBeDisplayed();
            const secondAddressText = await secondAddress.getText();
            expect(secondAddressText).toBe("Blaak 31 3011 GA Rotterdam");

            //click to check if list of lately mentioned addresses works
            await secondAddress.click();
            await driver.pause(2000);

            // Verify the continue button becomes enabled after adding destination
            const continuePress = await driver.$(
                '-android uiautomator:new UiSelector().text("Continue")',
            );
            await expect(continuePress).toBeDisplayed();
            await continuePress.click();
            await driver.pause(5000);

            // Check destination address is visible
            const address = await driver.$(
                '-android uiautomator:new UiSelector().text("Blaak 31 3011 GA Rotterdam")',
            );
            await expect(address).toBeDisplayed();

            // Select first route by clicking euro symbol
            const firstRoutePrice = await driver.$(
                "(//android.widget.TextView[contains(@text, '€')])[1]",
            );
            await expect(firstRoutePrice).toBeDisplayed();
        });
    });

    // terminate the app after all tests
    after(async () => {
        await driver.terminateApp("com.umob.umob");
    });
});
