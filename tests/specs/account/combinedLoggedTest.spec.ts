import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import { getCredentials, executeTest } from "../../helpers/TestHelpers.js";

// Fixed function to get new12 user credentials
function getNew12Credentials() {
    try {
        const credentials = getCredentials("test", "new12");
        return credentials;
    } catch (error) {
        console.error("Error loading new12 credentials:", error);
        throw new Error("Failed to load new12 user credentials");
    }
}

describe("Combined test for the logged in old user with rides history", () => {
    beforeEach(async () => {
        await driver.activateApp("com.umob.umob");
        await driver.pause(7000);
    });

    before(async () => {
        const credentials = getNew12Credentials();
        await PageObjects.login({
            username: credentials.username,
            password: credentials.password,
        });
    });

    it("should display key navigation elements on the main screen", async () => {
        const testId = "31a93ea8-49f3-4081-8f57-db2a10623f4f";

        await executeTest(testId, async () => {
            // Verify filter button is displayed
            await expect(PageObjects.assetFilterToggle).toBeDisplayed();

            // Check for map root element
            await expect(PageObjects.mapRoot).toBeDisplayed();

            // Verify bottom navigation menu items
            await PageObjects.planTripBtn.waitForExist();
            await PageObjects.promosBtn.waitForExist();
            // Click PLAN TRIP button to verify taxi and public transport options
            await PageObjects.planTripBtn.click();

            // Scroll to bottom 
            await driver.pause(2000);
            const { width, height } = await driver.getWindowSize();
            await driver.executeScript("mobile: scrollGesture", [
                {
                    left: width / 2,
                    top: 0,
                    width: 0,
                    height: height * 0.8,
                    direction: "down",
                    percent: 2,
                },
            ]);
            await driver.pause(1000);

            await expect(PageObjects.grabTaxiButton).toBeDisplayed();
            await PageObjects.publicTransportButton.waitForExist();
        });
    });

    it("should display all key account screen elements", async () => {
        const testId = "17271a71-6625-448f-bb11-0faa97fd7ef9";

        await executeTest(testId, async () => {
            // Click on Account button
            await PageObjects.clickAccountButton();
            await driver.pause(2000);

            // Verify account menu items - first group
            await PageObjects.verifyMenuItems([
                "Invite friends",
                "Personal info",
                "Payment methods",
                "ID Document",
                "My rides",
            ]);

            // Get window size
            const { width, height } = await driver.getWindowSize();

            // First scroll 
            for (let i = 0; i < 2; i++) {
                await driver.pause(2000);
                await driver.executeScript("mobile: scrollGesture", [
                    {
                        left: width / 2,
                        top: height * 0.3,
                        width: width * 0.8,
                        height: height * 0.4,
                        direction: "down",
                        percent: 0.9,
                    },
                ]);
                await driver.pause(2000);
            }

            // Verify account menu items - 2nd group after scroll
            await PageObjects.verifyMenuItems([
                "Vouchers",
                "My payments",
                "Language",
                "Map theme settings",
            ]);

            // Second scroll 
            await driver.pause(2000);
            await driver.executeScript("mobile: scrollGesture", [
                {
                    left: width / 2,
                    top: height * 0.1,
                    width: width * 0.85,
                    height: height * 0.99,
                    direction: "down",
                    percent: 100,
                },
            ]);
            await driver.pause(1000);

            // Scroll fully down 
            await driver.pause(3000);
            await driver.executeScript("mobile: scrollGesture", [
                {
                    left: width / 2,
                    top: 0,
                    width: 0,
                    height: height * 0.8,
                    direction: "down",
                    percent: 2,
                },
            ]);
            await driver.pause(1000);

            // Verify account menu items - 3rd group after scroll
            await PageObjects.verifyMenuItems([
                "Support",
                "Delete account",
            ]);

            // Verify Log Out button
            await expect(PageObjects.logOutButton).toBeDisplayed();

            // Verify back button is present
            await expect(PageObjects.backButton).toBeDisplayed();
        });
    });

    it("should display all key My Rides & Tickets screen elements", async () => {
        const testId = "cd0053ae-be33-4cf1-856b-50f573c880c8";

        await executeTest(testId, async () => {
            // Click on Account button
            await PageObjects.clickAccountButton();

            // scroll
            await driver.pause(2000);
            const { width, height } = await driver.getWindowSize();
            await driver.executeScript("mobile: scrollGesture", [
                {
                    left: width / 2,
                    top: 0,
                    width: 0,
                    height: height * 0.5,
                    direction: "down",
                    percent: 0.25,
                },
            ]);
            await driver.pause(2000);

            // Navigate to My Rides & Tickets
            await driver.pause(1000);
            await expect(PageObjects.myRidesButton).toBeDisplayed();
            await PageObjects.myRidesButton.click();
            await driver.pause(1000);

            // Verify back button is present
            await expect(PageObjects.backButton).toBeDisplayed();

            // Check previous payments list
            const previousPaymentsList = await driver.$$(
                '-android uiautomator:new UiSelector().textContains("€")',
            );
            console.log("previousPaymentsList" + previousPaymentsList.length);

            // Verify at least one previous payment exists
            await expect(previousPaymentsList.length).toBeGreaterThan(1);

            await driver.pause(3000);

            // Back to common list of account menu
            await PageObjects.backButton.click();
            await driver.pause(2000);
        });
    });

    it("should display all key My Payments screen elements", async () => {
        const testId = "854b2200-5a0d-4516-a8fd-b6094e19fbd9";

        await executeTest(testId, async () => {
            // Click on Account button
            await PageObjects.clickAccountButton();

            // scroll
            await driver.pause(3000);
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
                            y: 600,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        {
                            type: "pointerMove",
                            duration: 1000,
                            x: width / 2,
                            y: 20,
                        },
                        { type: "pointerUp", button: 0 },
                    ]},
                
            ]);
            await driver.pause(1000);

            // Navigate to My Payments
            await driver.pause(1000);
            await expect(PageObjects.myPaymentsButton).toBeDisplayed();
            await PageObjects.myPaymentsButton.click();
            await driver.pause(3000);

            // Verify screen header
            const screenHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("My payments")',
            );
            await expect(screenHeader).toBeDisplayed();

            // Verify back button is present
            const backButton = await driver.$(
                '-android uiautomator:new UiSelector().description("back_button")',
            );
            await expect(backButton).toBeDisplayed();

            // Check previous payments list
            const previousPaymentsList = await driver.$$(
                '-android uiautomator:new UiSelector().textContains("€")',
            );
            console.log("previousPaymentsList" + previousPaymentsList.length);

            // Verify at least one previous payment exists
            await expect(previousPaymentsList.length).toBeGreaterThan(1);

            // Back to common list of account menu
            await backButton.click();
            await driver.pause(2000);
        });
    });

    it("should display all key Personal Info screen elements", async () => {
        const testId = "8553a675-1b49-4cf4-b838-6bee6574d8a1";

        await executeTest(testId, async () => {
            // Click on Account button with robust retry mechanism
            await PageObjects.clickAccountButton(5, 3000);

            // Navigate to personal info
            await expect(PageObjects.personalInfoButton).toBeDisplayed();
            await PageObjects.personalInfoButton.click();

            // Verify screen header
            const screenHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Personal Info")',
            );
            await expect(screenHeader).toBeDisplayed();

            // Verify back button is present
            const backButton = await driver.$(
                '-android uiautomator:new UiSelector().description("back_button")',
            );
            await expect(backButton).toBeDisplayed();

            // Verify form sections
            const formQuestions = [
                "What is your email?",
                "What is your phone number?",
                "What is your name?",
                "What is your last name?",
                "What is your address?",
            ];
            await PageObjects.verifyMenuItems(formQuestions);

            // Verify Edit button for email
            const emailEditButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Edit")',
            );
            await expect(emailEditButton).toBeDisplayed();

            // Verify Street field
            const streetLabel = await driver.$(
                '-android uiautomator:new UiSelector().text("Bloemstraat")',
            );
            await expect(streetLabel).toBeDisplayed();

            // Индивидуальный скролл для этого теста
            await driver.pause(2000);
            const { width, height } = await driver.getWindowSize();
            await driver.executeScript("mobile: scrollGesture", [
                {
                    left: width / 2,
                    top: 0,
                    width: 0,
                    height: height * 0.8,
                    direction: "down",
                    percent: 2,
                },
            ]);
            await driver.pause(1000);

            // Verify address fields
            const addressFields = [
                "80",
                "Argentina",
                "3014",
                "Rotterdam",
            ];
            await PageObjects.verifyMenuItems(addressFields);

            // Verify Save and Help buttons
            await PageObjects.verifyMenuItems(["Save", "Help"]);

            // Click back button to main account menu
            await backButton.click();
            await driver.pause(2000);
        });
    });

    it("should display all key Ride Credit screen elements", async () => {
        const testId = "f2f940e9-2844-4cbe-9e44-05d010f962be";

        await executeTest(testId, async () => {
            // Click on Account button
            await PageObjects.clickAccountButton();
            await driver.pause(3000);

            // Get window size
            const { width, height } = await driver.getWindowSize();

            // Индивидуальный скролл для этого теста
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
                            y: height * 0.8,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        {
                            type: "pointerMove",
                            duration: 1000,
                            x: width / 2,
                            y: height * 0.6,
                        },
                        { type: "pointerUp", button: 0 },
                    },
                },
            ]);
            await driver.pause(2000);

            // Navigate to Ride Credit/Vouchers
            await expect(PageObjects.vouchersButton).toBeDisplayed();
            await PageObjects.vouchersButton.click();
            await driver.pause(3000);

            // Verify screen header
            const screenHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Vouchers")',
            );
            await expect(screenHeader).toBeDisplayed();

            // Verify back button is present
            const backButton = await driver.$(
                '-android uiautomator:new UiSelector().description("back_button")',
            );
            await expect(backButton).toBeDisplayed();

            // Verify "Your promotional code" section header
            const promotionalCodeHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Your promotional code")',
            );
            await expect(promotionalCodeHeader).toBeDisplayed();

            // Verify promotional code description
            const promotionalCodeDescription = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Received a promotional code?")',
            );
            await expect(promotionalCodeDescription).toBeDisplayed();

            // Индивидуальный скролл для этого теста
            await driver.pause(1000);
            await driver.executeScript("mobile: scrollGesture", [
                {
                    left: width / 2,
                    top: 0,
                    width: 0,
                    height: height * 0.4,
                    direction: "down",
                    percent: 0.9,
                },
            ]);
            await driver.pause(1000);

            // Verify promotional code input field
            const promotionalCodeInput = await driver.$(
                '-android uiautomator:new UiSelector().className("android.widget.EditText")',
            );
            await expect(promotionalCodeInput).toBeDisplayed();

            // Verify "SUBMIT PROMOTIONAL CODE" button
            const submitPromotionalCodeButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Submit Promotional Code")',
            );
            await expect(submitPromotionalCodeButton).toBeDisplayed();

            // Click back button to main account menu
            await backButton.click();
            await driver.pause(2000);
        });
    });

    it("should display all key Invite Friends screen elements", async () => {
        const testId = "42115ac8-017c-48a6-9484-b4ffb776cca3";

        await executeTest(testId, async () => {
            // Click on Account button
            await PageObjects.clickAccountButton();

            // Navigate to Invite Friends
            await expect(PageObjects.inviteFriendsButton).toBeDisplayed();
            await PageObjects.inviteFriendsButton.click();
            await driver.pause(3000);

            // Verify back button is present
            const backButton = await driver.$(
                '-android uiautomator:new UiSelector().description("back_button")',
            );
            await expect(backButton).toBeDisplayed();

            // Verify screen elements
            await PageObjects.verifyMenuItems([
                "Invite your friends",
                "Give €10, Get €10",
                "Your code",
            ]);

            // Verify screen description
            const screenDescription = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Invite a friend to join umob, and")',
            );
            await expect(screenDescription).toBeDisplayed();

            // Индивидуальный скролл для этого теста
            await driver.pause(3000);
            const { width, height } = await driver.getWindowSize();
            await driver.executeScript("mobile: scrollGesture", [
                {
                    left: width / 2,
                    top: 0,
                    width: 0,
                    height: height * 0.8,
                    direction: "down",
                    percent: 2,
                },
            ]);
            await driver.pause(2000);

            // Verify Share Code button and View Stats
            await PageObjects.verifyMenuItems([
                "Invite Friends",
                "View Your Stats",
            ]);

            // Click back button to main account menu
            await backButton.click();
            await driver.pause(2000);
        });
    });
