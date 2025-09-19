import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import submitTestRun from "../../helpers/SendResults.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to get fixed credentials for the new12 user from credentials file
function getCredentials() {
    try {
        const credentialsPath = path.resolve(
            __dirname,
            "../../../config/credentials.json",
        );
        const credentials = JSON.parse(
            fs.readFileSync(credentialsPath, "utf8"),
        );

        // Always use the new12 user from test environment
        if (!credentials.test || !credentials.test.new12) {
            throw new Error("new12 user not found in test environment");
        }

        // Return the new12 user credentials
        return {
            username: credentials.test.new12.username,
            password: credentials.test.new12.password,
        };
    } catch (error) {
        console.error("Error loading credentials:", error);
        throw new Error("Failed to load credentials configuration");
    }
}

/////////////////////////////////////////////////////////////////////////////////

describe("Combined test for the logged in old user with rides history", () => {
    beforeEach(async () => {
        await driver.activateApp("com.umob.umob");
        await driver.pause(7000);
    });

    before(async () => {
        const credentials = getCredentials();

        // await PageObjects.login(credentials);
        await PageObjects.login({
            username: credentials.username,
            password: credentials.password,
        });
    });

    it("should display key navigation elements on the main screen", async () => {
        const testId = "31a93ea8-49f3-4081-8f57-db2a10623f4f";

        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            // Verify filter button is displayed
            const assetFilterToggle = await driver.$(
                '-android uiautomator:new UiSelector().resourceId("home_asset_filter_toggle")',
            );
            await expect(assetFilterToggle).toBeDisplayed();

            // Check for map root element
            const mapRoot = await driver.$(
                '-android uiautomator:new UiSelector().resourceId("map_root")',
            );
            await expect(mapRoot).toBeDisplayed();

            // Verify bottom navigation menu items
            await PageObjects.planTripBtn.waitForExist();
            await PageObjects.promosBtn.waitForExist();

            //click PLAN TRIP button to verify taxi and public transport options
            //await planTrip.click();
            await PageObjects.planTripBtn.click();

            //scroll to bottom
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

            const taxiButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Grab Taxi")',
            );
            await expect(taxiButton).toBeDisplayed();

            await PageObjects.publicTransportButton.waitForExist();
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

    it("should display all key account screen elements", async () => {
        const testId = "17271a71-6625-448f-bb11-0faa97fd7ef9";

        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            // Click on Account button
            await PageObjects.clickAccountButton();
            await driver.pause(2000);

            // Verify account menu items
            const accountMenuItems = [
                "Invite friends",
                "Personal info",
                "Payment methods",
                "ID Document",
                "My rides",
            ];

            for (const menuItem of accountMenuItems) {
                const menuElement = await driver.$(
                    `-android uiautomator:new UiSelector().text("${menuItem}")`,
                );
                await expect(menuElement).toBeDisplayed();
            }

            // Get window size
            const { width, height } = await driver.getWindowSize();

            // First scroll
            for (let i = 0; i < 2; i++) {
                await driver.pause(2000);
                await driver.executeScript("mobile: scrollGesture", [
                    {
                        left: width / 2,
                        top: height * 0.3, // 0.5 to begin with the middle of the screen or 0.3 to begin from the upper side of the screen. Than More close to 0 more scroll you get
                        width: width * 0.8,
                        height: height * 0.4, //width of the scrolling area
                        direction: "down",
                        percent: 0.9,
                    },
                ]);
                await driver.pause(2000);
            }

            // Verify account menu items after first scrolling
            const accountMenuItems2 = [
                "Vouchers",
                "My payments",
                "Language",
                "Map theme settings",
            ];

            for (const menuItem of accountMenuItems2) {
                const menuElement = await driver.$(
                    `-android uiautomator:new UiSelector().text("${menuItem}")`,
                );
                await expect(menuElement).toBeDisplayed();
            }

            // Second scroll using same width/height variables
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

            // Scroll fully down to make visible Log Out option

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

            // Verify account menu items after second scrolling
            const accountMenuItems3 = ["Support", "Delete account"];

            for (const menuItem of accountMenuItems3) {
                const menuElement = await driver.$(
                    `-android uiautomator:new UiSelector().text("${menuItem}")`,
                );
                await expect(menuElement).toBeDisplayed();
            }

            // Verify Log Out button
            const screenHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Log Out")',
            );
            await expect(screenHeader).toBeDisplayed();

            // Verify back button is present
            const backButton = await driver.$(
                '-android uiautomator:new UiSelector().resourceId("back_button")',
            );
            await expect(backButton).toBeDisplayed();
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

    it("should display all key My Rides & Tickets screen elements", async () => {
        const testId = "cd0053ae-be33-4cf1-856b-50f573c880c8";

        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            // Click on Account button
            await PageObjects.clickAccountButton();

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
            const myRidesAndTicketsButton = await driver.$(
                '-android uiautomator:new UiSelector().text("My rides")',
            );
            await driver.pause(1000);
            await expect(myRidesAndTicketsButton).toBeDisplayed();
            await myRidesAndTicketsButton.click();
            await driver.pause(1000);

            // Verify back button is present
            const backButton = await driver.$(
                '-android uiautomator:new UiSelector().resourceId("back_button")',
            );
            await expect(backButton).toBeDisplayed();

            // Check previous payments list
            const previousPaymentsList = await driver.$$(
                '-android uiautomator:new UiSelector().textContains("€")',
            );
            console.log("previousPaymentsList" + previousPaymentsList.length);

            // Verify at least one previous payment exists
            await expect(previousPaymentsList.length).toBeGreaterThan(1);

            await driver.pause(3000);

            // back to common list of account menu
            await backButton.click();
            await driver.pause(2000);
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

    it("should display all key My Payments screen elements", async () => {
        const testId = "854b2200-5a0d-4516-a8fd-b6094e19fbd9";

        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            // Click on Account button
            await PageObjects.clickAccountButton();

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
                    ],
                },
            ]);
            await driver.pause(1000);

            // Navigate to My Payments
            const myPaymentsButton = await driver.$(
                '-android uiautomator:new UiSelector().text("My payments")',
            );
            await driver.pause(1000);
            await expect(myPaymentsButton).toBeDisplayed();
            await myPaymentsButton.click();
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

            // back to common list of account menu
            await backButton.click();
            await driver.pause(2000);
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

    it("should display all key Personal Info screen elements", async () => {
        const testId = "8553a675-1b49-4cf4-b838-6bee6574d8a1";

        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            // Click on Account button with robust retry mechanism
            await PageObjects.clickAccountButton(5, 3000);

            // Navigate to personal info
            const personalInfo = await driver.$(
                '-android uiautomator:new UiSelector().text("Personal info")',
            );
            await expect(personalInfo).toBeDisplayed();
            await personalInfo.click();

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

            // Verify Email Section
            const emailQuestion = await driver.$(
                '-android uiautomator:new UiSelector().text("What is your email?")',
            );
            await expect(emailQuestion).toBeDisplayed();

            // Verify Edit button for email
            const emailEditButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Edit")',
            );
            await expect(emailEditButton).toBeDisplayed();

            // Verify Phone Number Section
            const phoneQuestion = await driver.$(
                '-android uiautomator:new UiSelector().text("What is your phone number?")',
            );
            await expect(phoneQuestion).toBeDisplayed();

            // Verify Name Section
            const nameQuestion = await driver.$(
                '-android uiautomator:new UiSelector().text("What is your name?")',
            );
            await expect(nameQuestion).toBeDisplayed();

            // Verify Last Name Section
            const lastNameQuestion = await driver.$(
                '-android uiautomator:new UiSelector().text("What is your last name?")',
            );
            await expect(lastNameQuestion).toBeDisplayed();

            // Verify Address Section
            const addressQuestion = await driver.$(
                '-android uiautomator:new UiSelector().text("What is your address?")',
            );
            await expect(addressQuestion).toBeDisplayed();

            // Verify Street field
            const streetLabel = await driver.$(
                '-android uiautomator:new UiSelector().text("Bloemstraat")',
            );
            await expect(streetLabel).toBeDisplayed();

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

            // Verify Number field
            const numberLabel = await driver.$(
                '-android uiautomator:new UiSelector().text("80")',
            );
            await expect(numberLabel).toBeDisplayed();

            // Verify Country field
            const countryLabel = await driver.$(
                '-android uiautomator:new UiSelector().text("Argentina")',
            );
            await expect(countryLabel).toBeDisplayed();

            // Verify Zip Code field
            const zipCode = await driver.$(
                '-android uiautomator:new UiSelector().text("3014")',
            );
            await expect(zipCode).toBeDisplayed();

            // Verify City field
            const city = await driver.$(
                '-android uiautomator:new UiSelector().text("Rotterdam")',
            );
            await expect(city).toBeDisplayed();

            // Verify Save button
            const saveButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Save")',
            );
            await expect(saveButton).toBeDisplayed();

            // Verify Help button
            const helpButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Help")',
            );
            await expect(helpButton).toBeDisplayed();

            // click back button to main acount menu
            await backButton.click();
            await driver.pause(2000);
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

    it("should display all key Ride Credit screen elements", async () => {
        const testId = "f2f940e9-2844-4cbe-9e44-05d010f962be";

        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            // Click on Account button
            await PageObjects.clickAccountButton();
            await driver.pause(3000);

            // Get window size
            const { width, height } = await driver.getWindowSize();

            // scroll

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
                    ],
                },
            ]);
            await driver.pause(2000);

            // Navigate to Ride Credit/Vouchers (new version of text)
            const rideCreditButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Vouchers")',
            );
            await expect(rideCreditButton).toBeDisplayed();
            await rideCreditButton.click();
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

            // click back button to main acount menu
            await backButton.click();
            await driver.pause(2000);
        } catch (e) {
            error = e;
            console.error("Test failed:", error);
            testStatus = "Fail";
            testDetails = e.message;

            // Capture screenshot on failure
            screenshotPath = "./screenshots/" + testId + ".png";
            await driver.saveScreenshot(screenshotPath);
            // execSync(
            //   `adb exec-out screencap -p > ${screenshotPath}`
            // );
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

    it("should display all key Invite Friends screen elements", async () => {
        const testId = "42115ac8-017c-48a6-9484-b4ffb776cca3";

        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            // Click on Account button
            await PageObjects.clickAccountButton();

            // Navigate to Invite Friends
            const inviteFriendsButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Invite friends")',
            );
            await expect(inviteFriendsButton).toBeDisplayed();
            await inviteFriendsButton.click();
            await driver.pause(3000);

            // Verify back button is present
            const backButton = await driver.$(
                '-android uiautomator:new UiSelector().description("back_button")',
            );
            await expect(backButton).toBeDisplayed();

            // Verify screen title

            const screenTitle = await driver.$(
                '-android uiautomator:new UiSelector().text("Invite your friends")',
            );
            await expect(screenTitle).toBeDisplayed();

            const descriptionHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Give €10, Get €10")',
            );
            await expect(descriptionHeader).toBeDisplayed();

            // Verify screen description

            const screenDescription = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Invite a friend to join umob, and")',
            );
            await expect(screenDescription).toBeDisplayed();

            // Verify Your Code section
            const yourCodeLabel = await driver.$(
                '-android uiautomator:new UiSelector().text("Your code")',
            );
            await expect(yourCodeLabel).toBeDisplayed();

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

            // Verify Share Code button

            const shareCodeButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Invite Friends")',
            );
            await expect(shareCodeButton).toBeDisplayed();

            const viewStats = await driver.$(
                '-android uiautomator:new UiSelector().text("View Your Stats")',
            );
            await expect(viewStats).toBeDisplayed();

            // click back button to main acount menu
            await backButton.click();
            await driver.pause(2000);
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

    it("should display all key Payment Settings screen elements", async () => {
        const testId = "9f816dbf-35ef-4828-9a85-1fd9a0fafc07";

        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            // Click on Account button
            await PageObjects.clickAccountButton();
            await driver.pause(2000);

            // Navigate to Payment Settings screen
            const paymentSettingsButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Payment methods")',
            );
            await expect(paymentSettingsButton).toBeDisplayed();
            await paymentSettingsButton.click();

            // Verify screen header
            const screenHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Payment method")',
            );
            await expect(screenHeader).toBeDisplayed();

            // Verify back button is present
            const backButton = await driver.$(
                '-android uiautomator:new UiSelector().description("back_button")',
            );
            await expect(backButton).toBeDisplayed();

            const cardType = await driver.$(
                '-android uiautomator:new UiSelector().text("MasterCard")',
            );
            await expect(cardType).toBeDisplayed();

            const cardNumber = await driver.$(
                '-android uiautomator:new UiSelector().text("**** **** **** 1115")',
            );
            await expect(cardNumber).toBeDisplayed();

            const expiryDate = await driver.$(
                '-android uiautomator:new UiSelector().text("03/2030")',
            );
            await expect(expiryDate).toBeDisplayed();

            // Verify action buttons
            const removeButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Remove Payment Method")',
            );
            await expect(removeButton).toBeDisplayed();

            const helpButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Help")',
            );
            await expect(helpButton).toBeDisplayed();

            // Optional: Verify container element
            const paymentDetailsContainer = await driver.$(
                '-android uiautomator:new UiSelector().description("PaymentDetailsContainer")',
            );
            await expect(paymentDetailsContainer).toBeDisplayed();

            // click back button to main acount menu
            await backButton.click();
            await driver.pause(2000);
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

    it("should display all key ID Document screen elements", async () => {
        const testId = "27935f3e-8bd9-43c1-a070-05d786254932";

        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            // Click on Account button
            await PageObjects.clickAccountButton();

            // Navigate to ID Document screen
            const idDocumentButton = await driver.$(
                '-android uiautomator:new UiSelector().text("ID Document")',
            );
            await expect(idDocumentButton).toBeDisplayed();
            await idDocumentButton.click();

            // Verify screen header
            const screenHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("ID document")',
            );
            await expect(screenHeader).toBeDisplayed();

            // Verify back button is present
            const backButton = await driver.$(
                '-android uiautomator:new UiSelector().description("back_button")',
            );
            await expect(backButton).toBeDisplayed();

            // Verify "Verified" status text
            const verifiedStatus = await driver.$(
                '-android uiautomator:new UiSelector().text("Verified")',
            );
            await expect(verifiedStatus).toBeDisplayed();

            // Verify Document Type section
            const documentTypeTitle = await driver.$(
                '-android uiautomator:new UiSelector().text("Document type")',
            );
            await expect(documentTypeTitle).toBeDisplayed();

            const driverLicenseText = await driver.$(
                '-android uiautomator:new UiSelector().text("Driver license")',
            );
            await expect(driverLicenseText).toBeDisplayed();

            // Verify Status section
            const statusTitle = await driver.$(
                '-android uiautomator:new UiSelector().text("Status")',
            );
            await expect(statusTitle).toBeDisplayed();

            const statusVerifiedText = await driver.$(
                '-android uiautomator:new UiSelector().description("IdDocumentStatusIdDocumentItemContent")',
            );
            await expect(statusVerifiedText).toBeDisplayed();

            // Verify Expiration Date section
            const expirationTitle = await driver.$(
                '-android uiautomator:new UiSelector().text("Expiration date")',
            );
            await expect(expirationTitle).toBeDisplayed();

            const expirationDate = await driver.$(
                '-android uiautomator:new UiSelector().text("28 May 2031")',
            );
            await expect(expirationDate).toBeDisplayed();

            // Verify Categories section
            const categoriesTitle = await driver.$(
                '-android uiautomator:new UiSelector().text("Categories")',
            );
            await expect(categoriesTitle).toBeDisplayed();

            // Verify all license categories
            const categoryB = await driver.$(
                '-android uiautomator:new UiSelector().description("undefinedIdDocumentItemContentB")',
            );
            await expect(categoryB).toBeDisplayed();

            const categoryA = await driver.$(
                '-android uiautomator:new UiSelector().description("undefinedIdDocumentItemContentA")',
            );
            await expect(categoryA).toBeDisplayed();

            const categoryB1 = await driver.$(
                '-android uiautomator:new UiSelector().description("undefinedIdDocumentItemContentB1")',
            );
            await expect(categoryB1).toBeDisplayed();

            const categoryAM = await driver.$(
                '-android uiautomator:new UiSelector().description("undefinedIdDocumentItemContentAM")',
            );
            await expect(categoryAM).toBeDisplayed();

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
            await driver.pause(2000);

            // Verify Home Address section
            const homeAddressStreet = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Bloemstraat 80")',
            );
            await expect(homeAddressStreet).toBeDisplayed();

            const homeAddressZip = await driver.$(
                '-android uiautomator:new UiSelector().textContains("3014")',
            );
            await expect(homeAddressZip).toBeDisplayed();

            const homeAddressCity = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Rotterdam")',
            );
            await expect(homeAddressCity).toBeDisplayed();

            // Verify bottom buttons
            const changeDocumentButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Change Document")',
            );
            await expect(changeDocumentButton).toBeDisplayed();

            //Scroll to bottom
            await driver.pause(2000);
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

            const helpButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Help")',
            );
            await expect(helpButton).toBeDisplayed();

            // Optional: Verify main container
            const idDocumentContainer = await driver.$(
                '-android uiautomator:new UiSelector().description("IdDocumentContainer")',
            );
            await expect(idDocumentContainer).toBeDisplayed();
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

    it("should display all key delete account screen elements", async () => {
        const testId = "03a01117-d3e5-413b-8fc1-bbd1e4048f0e";

        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            // Click on Account button
            await PageObjects.clickAccountButton();

            // Scroll down to make Delete account button visible
            await driver.pause(3000);
            const { width, height } = await driver.getWindowSize();

            // Looks like this methood is working on Emulator
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

            // Click on Delete account button
            const deleteAccountButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Delete account")',
            );
            await expect(deleteAccountButton).toBeDisplayed();
            await deleteAccountButton.click();
            await driver.pause(2000);

            // Verify delete account screen title
            const screenTitle = await driver.$(
                '-android uiautomator:new UiSelector().resourceId("DeleteAccountDetailsTitle")',
            );
            await expect(screenTitle).toBeDisplayed();
            await expect(await screenTitle.getText()).toBe(
                "Are you sure you want to delete your account?",
            );

            // Verify warning message
            const warningMessage = await driver.$(
                '-android uiautomator:new UiSelector().resourceId("DeleteAccountDetailsMessage")',
            );
            await expect(warningMessage).toBeDisplayed();
            const messageText = await warningMessage.getText();
            await expect(messageText).toContain(
                "Please note that by confirming deletion",
            );
            await expect(messageText).toContain("Delete Policy");

            // Verify checkbox and its text
            const checkbox = await driver.$(
                '-android uiautomator:new UiSelector().resourceId("DeleteAccountDetailsCheckBox")',
            );
            await expect(checkbox).toBeDisplayed();
            const checkboxText = await checkbox.getText();
            await expect(checkboxText).toBe(
                "I understand that all my data will be deleted and I can no longer use the umob service",
            );

            // Verify DELETE button
            const deleteButton = await driver.$(
                '-android uiautomator:new UiSelector().resourceId("DeleteAccountDetailsDelete")',
            );
            await expect(deleteButton).toBeDisplayed();
            const deleteButtonText = await driver.$(
                '-android uiautomator:new UiSelector().resourceId("DeleteAccountDetailsDelete-text")',
            );
            await expect(await deleteButtonText.getText()).toBe("DELETE");
            // Verify DELETE button is initially disabled
            await expect(await deleteButton.isEnabled()).toBe(false);

            // Verify CANCEL button
            const cancelButton = await driver.$(
                '-android uiautomator:new UiSelector().resourceId("DeleteAccountDetailsCancel")',
            );
            await expect(cancelButton).toBeDisplayed();
            const cancelButtonText = await driver.$(
                '-android uiautomator:new UiSelector().resourceId("DeleteAccountDetailsCancel-text")',
            );
            await expect(await cancelButtonText.getText()).toBe("Cancel");
            // Verify CANCEL button is enabled
            await expect(await cancelButton.isEnabled()).toBe(true);

            // Verify Help button
            const helpButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Help")',
            );
            await expect(helpButton).toBeDisplayed();
            await cancelButton.click();
            await driver.pause(1000);
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

    it("should display all key map theme settings screen elements", async () => {
        const testId = "ce67b5e4-8e1c-4b2c-95c0-0d73a71a7449";

        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            // Click on Account button
            await PageObjects.clickAccountButton();
            await driver.pause(2000);

            // Scroll down to make Delete account button visible
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

            // Click on Map theme settings option
            const mapThemeOption = await driver.$(
                '-android uiautomator:new UiSelector().text("Map theme settings")',
            );
            await expect(mapThemeOption).toBeDisplayed();
            await mapThemeOption.click();
            await driver.pause(2000);

            // Verify header elements
            const backButton = await driver.$("~back_button");
            await expect(backButton).toBeDisplayed();

            const headerTitle = await driver.$(
                "~settings_menu_map_theme_comp-header-title",
            );
            await expect(headerTitle).toBeDisplayed();
            await expect(await headerTitle.getText()).toBe(
                "Map theme settings",
            );

            // Verify map preview image is displayed
            const mapPreviewImage = await driver.$("android.widget.ImageView");
            await expect(mapPreviewImage).toBeDisplayed();

            // Verify all theme options are displayed and check their properties
            const themeOptions = [{ name: "Dark" }, { name: "Light" }];

            for (const theme of themeOptions) {
                // Verify the theme text using UiSelector
                const themeText = await driver.$(
                    `-android uiautomator:new UiSelector().text("${theme.name}")`,
                );
                await expect(themeText).toBeDisplayed();

                // Verify the theme container using content-desc
                const themeContainer = await driver.$(`~${theme.name}`);
                await expect(themeContainer).toBeDisplayed();

                // If it's the Light theme (which appears selected in the XML), verify the selection indicator
                if (theme.name === "Light") {
                    const container = await driver.$(
                        `-android uiautomator:new UiSelector().text("${theme.name}").fromParent(new UiSelector().className("com.horcrux.svg.SvgView"))`,
                    );
                    await expect(container).toBeDisplayed();
                }
            }
            // click back button to go to the app settings
            await backButton.click();
            await driver.pause(2000);
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

    it("should display all key language screen elements", async () => {
        const testId = "af01144c-675b-43d7-8b35-019d9a52ead1";

        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            // Click on Account button
            await PageObjects.clickAccountButton();
            await driver.pause(2000);

            // Scroll down to make Delete account button visible
            await driver.pause(1000);
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

            // Click on Language option to navigate to language screen
            const languageOption = await driver.$(
                '-android uiautomator:new UiSelector().text("Language")',
            );
            await expect(languageOption).toBeDisplayed();
            await languageOption.click();
            await driver.pause(2000);

            // Verify header elements
            const backButton = await driver.$("~back_button");
            await expect(backButton).toBeDisplayed();

            const headerTitle = await driver.$("~undefined-header-title");
            await expect(headerTitle).toBeDisplayed();
            await expect(await headerTitle.getText()).toBe("Language");

            // Verify all language options are displayed
            const languageOptions = [
                { name: "English", selected: true },
                { name: "Français", selected: false },
                { name: "Dutch", selected: false },
                { name: "Deutsche", selected: false },
                { name: "Español", selected: false },
            ];

            for (const language of languageOptions) {
                const languageElement = await driver.$(`~${language.name}`);
                await expect(languageElement).toBeDisplayed();

                // Verify the language text
                const languageText = await driver.$(
                    `-android uiautomator:new UiSelector().text("${language.name}")`,
                );
                await expect(languageText).toBeDisplayed();

                // If it's the selected language (English by default), verify the selection indicator
                if (language.selected) {
                    // The SVG checkmark is present only for the selected language
                    const checkmark = await languageElement.$(
                        "com.horcrux.svg.SvgView",
                    );
                    await expect(checkmark).toBeDisplayed();
                }
            }

            //click the back button to the app settings screen
            await backButton.click();
            await driver.pause(2000);

            // Verify Privacy & Legal section
            const privacyLegalButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Privacy & Legal")',
            );
            await expect(privacyLegalButton).toBeDisplayed();

            // Verify LogOut button
            const logoutButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Log Out")',
            );
            await expect(logoutButton).toBeDisplayed();
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

    it("should successfully logout from the app", async () => {
        const testId = "a9238177-4f15-4730-8b59-6c07b4e5d155";

        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            // Click on Account button
            await PageObjects.clickAccountButton();
            await driver.pause(2000);

            // Scroll down to make Delete account button visible
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
            await driver.pause(2000);

            // Click on LogOut option
            const logoutButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Log Out")',
            );
            await expect(logoutButton).toBeDisplayed();
            await logoutButton.click();

            // verify Login button appeared
            const signUpButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Login")',
            );
            await expect(signUpButton).toBeDisplayed();

            // verify Register button appeared
            const register = await driver.$(
                '-android uiautomator:new UiSelector().text("Register")',
            );
            await expect(register).toBeDisplayed();
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
        try {
            await driver.terminateApp("com.umob.umob");
        } catch (error) {
            console.log("Error terminating app:", error);
        }
    });
});
