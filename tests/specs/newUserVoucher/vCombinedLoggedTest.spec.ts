import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import submitTestRun from "../../helpers/SendResults.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to load credentials based on environment and user
function getCredentials(
    environment: string = "test",
    userKey: string | null = null,
) {
    try {
        const credentialsPath = path.resolve(
            __dirname,
            "../../../config/credentials.json",
        );
        const credentials = JSON.parse(
            fs.readFileSync(credentialsPath, "utf8"),
        );

        // Check if environment exists
        if (!credentials[environment]) {
            console.warn(
                `Environment '${environment}' not found in credentials file. Using 'test' environment.`,
            );
            environment = "test";
        }

        const envUsers = credentials[environment];

        // If no specific user is requested, use the first user in the environment
        if (!userKey) {
            userKey = Object.keys(envUsers)[0];
        } else if (!envUsers[userKey]) {
            console.warn(
                `User '${userKey}' not found in '${environment}' environment. Using first available user.`,
            );
            userKey = Object.keys(envUsers)[0];
        }

        // Ensure we have a valid userKey at this point
        if (!userKey) {
            throw new Error("No users available in the environment");
        }

        // Return the user credentials
        return {
            username: envUsers[userKey].username,
            password: envUsers[userKey].password,
        };
    } catch (error) {
        console.error("Error loading credentials:", error);
        throw new Error("Failed to load credentials configuration");
    }
}

// Get environment and user from env variables or use defaults
const ENV = process.env.TEST_ENV || "test";
const USER = process.env.TEST_USER || "new60";

/////////////////////////////////////////////////////////////////////////////////

describe("Combined tests for logged in user with unlimited multi voucher", () => {
    beforeEach(async () => {
        await driver.activateApp("com.umob.umob");
        await driver.pause(7000);
    });

    before(async () => {
        const credentials = getCredentials(ENV, USER);

        await PageObjects.login({
            username: credentials.username,
            password: credentials.password,
        });
    });

    it("should display key navigation elements on the main screen", async () => {
        const testId = "f66e0031-f31a-4694-b769-3aa9772b80fe";
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            await PageObjects.planTripBtn.waitForExist();

            await PageObjects.promosBtn.waitForExist();

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

    it("should display multi voucher on Promos screen", async () => {
        const testId = "c9995301-adec-485e-b64d-c6261b81d31b";
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            await PageObjects.promosBtn.waitForExist();
            await PageObjects.promosBtn.click();

            await driver.pause(1000);

            //verify multi voucher is present
            const multiVoucher = await driver.$(
                '-android uiautomator:new UiSelector().textContains("multi")',
            );
            await expect(multiVoucher).toBeDisplayed();

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
                            y: height * 0.8,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        {
                            type: "pointerMove",
                            duration: 1000,
                            x: width / 2,
                            y: height * 0.2,
                        },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

            //verify marketing info
            const advertisment = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Earn €10")',
            );
            await expect(advertisment).toBeDisplayed();
            await driver.pause(4000);

            //verify "invite friends" button
            const friends = await driver.$(
                '-android uiautomator:new UiSelector().textContains("INVITE FRIENDS")',
            );
            await expect(friends).toBeDisplayed();
            await friends.click();
            await driver.pause(2000);

            //verify second marketing info
            const advertisment2 = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Give €10, Get €10")',
            );
            await expect(advertisment2).toBeDisplayed();

            //verify 3rd marketing info
            const advertisment3 = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Invite a friend to join umob")',
            );
            await expect(advertisment3).toBeDisplayed();

            //verify 4rd marketing info
            const advertisment4 = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Here is how it works")',
            );
            await expect(advertisment4).toBeDisplayed();

            //click invite friends button
            const friends2 = await driver.$(
                '-android uiautomator:new UiSelector().textContains("INVITE FRIENDS")',
            );
            await expect(friends2).toBeDisplayed();
            await friends2.click();

            //verify share code button
            const shareCodeBtn = await driver.$(
                '-android uiautomator:new UiSelector().textContains("SEND YOUR CODE")',
            );
            await expect(shareCodeBtn).toBeDisplayed();
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
        const testId = "18fb8bc3-a1db-44af-81a4-53df167418cd";
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
                            y: 900,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        {
                            type: "pointerMove",
                            duration: 1000,
                            x: width / 2,
                            y: 10,
                        },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

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

            await driver.performActions([
                {
                    type: "pointer",
                    id: "finger2",
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
                            y: 10,
                        },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

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
                '-android uiautomator:new UiSelector().text("LOG OUT")',
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
        const testId = "cbbfbc83-2d4c-484f-88c6-9ac7da5fdbef";
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            // Click on Account button
            await PageObjects.clickAccountButton();
            await driver.pause(4000);

            // Navigate to My Rides & Tickets ("My rides" is a new version)
            const myRidesAndTicketsButton = await driver.$(
                '-android uiautomator:new UiSelector().text("My rides")',
            );
            await expect(myRidesAndTicketsButton).toBeDisplayed();
            await driver.pause(1000);
            await myRidesAndTicketsButton.click();
            await driver.pause(3000);

            // Verify screen header
            const screenHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("My rides")',
            );
            await expect(screenHeader).toBeDisplayed();
            await driver.pause(3000);

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
        const testId = "da75bc89-8bb5-4db1-9e42-524161e964a5";
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
                            y: height * 0.8,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        {
                            type: "pointerMove",
                            duration: 1000,
                            x: width / 2,
                            y: height * 0.4,
                        },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

            // Navigate to My Payments
            const myPaymentsButton = await driver.$(
                '-android uiautomator:new UiSelector().text("My payments")',
            );
            await expect(myPaymentsButton).toBeDisplayed();
            await myPaymentsButton.click();
            await driver.pause(4000);

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
        const testId = "6a7a6836-8165-4e41-acca-16665c6539dc";
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            // Click on Account button
            await PageObjects.clickAccountButton();
            await driver.pause(3000);

            //navigate to personal info

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
                            y: 5,
                        },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

            // Verify Save button
            const saveButton = await driver.$(
                '-android uiautomator:new UiSelector().text("SAVE")',
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
        const testId = "3f9c12b7-8c3f-4a3e-bc2c-fdb09536c0a2";
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            // Click on Account button
            await driver.pause(3000);
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
                            x: width / 4,
                            y: height * 0.7,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        {
                            type: "pointerMove",
                            duration: 1000,
                            x: width / 4,
                            y: height * 0.4,
                        },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

            // Navigate to Ride Credit / Vouchers (new version of ride credit)
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
                            y: height * 0.2,
                        },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

            // Verify promotional code input field
            const promotionalCodeInput = await driver.$(
                '-android uiautomator:new UiSelector().className("android.widget.EditText")',
            );
            await expect(promotionalCodeInput).toBeDisplayed();

            // Verify "SUBMIT PROMOTIONAL CODE" button
            const submitPromotionalCodeButton = await driver.$(
                '-android uiautomator:new UiSelector().text("SUBMIT PROMOTIONAL CODE")',
            );
            await expect(submitPromotionalCodeButton).toBeDisplayed();

            //verify that limitless user's voucher is visible
            const limitlessVoucher = await driver.$(
                '-android uiautomator:new UiSelector().textContains("multi")',
            );
            await expect(limitlessVoucher).toBeDisplayed();

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

    it("should display all key Invite Friends screen elements", async () => {
        const testId = "9c072b4f-6df0-41f8-a64e-42b410edb3e0";
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            // Click on Account button
            await PageObjects.clickAccountButton();
            await driver.pause(2000);

            // Navigate to Invite Friends
            const inviteFriendsButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Invite friends")',
            );
            await expect(inviteFriendsButton).toBeDisplayed();
            await inviteFriendsButton.click();
            await driver.pause(2000);

            // Verify back button is present
            const backButton = await driver.$(
                '-android uiautomator:new UiSelector().description("back_button")',
            );
            await expect(backButton).toBeDisplayed();

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
                            y: 500,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        {
                            type: "pointerMove",
                            duration: 1000,
                            x: width / 2,
                            y: 10,
                        },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

            const shareCodeButton = await driver.$(
                '-android uiautomator:new UiSelector().text("INVITE FRIENDS")',
            );
            await expect(shareCodeButton).toBeDisplayed();

            const viewStats = await driver.$(
                '-android uiautomator:new UiSelector().text("VIEW YOUR STATS")',
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
        const testId = "40a243d5-466e-4a01-8de2-7e40b713f260";
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            // Click on Account button
            await PageObjects.clickAccountButton();
            await driver.pause(2000);

            // Navigate to Payment methods screen
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

            // Verify card information
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
                '-android uiautomator:new UiSelector().text("REMOVE PAYMENT METHOD")',
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
        const testId = "a4ff4276-103e-439b-9e0a-f13ff1900ec4";
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            // Navigate to Account screen first
            await PageObjects.clickAccountButton();
            await driver.pause(2000);

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
                            y: 500,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        {
                            type: "pointerMove",
                            duration: 1000,
                            x: width / 2,
                            y: 10,
                        },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

            // Verify bottom buttons
            const changeDocumentButton = await driver.$(
                '-android uiautomator:new UiSelector().text("CHANGE DOCUMENT")',
            );
            await expect(changeDocumentButton).toBeDisplayed();

            await driver.performActions([
                {
                    type: "pointer",
                    id: "finger2",
                    parameters: { pointerType: "touch" },
                    actions: [
                        {
                            type: "pointerMove",
                            duration: 0,
                            x: width / 2,
                            y: 500,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        {
                            type: "pointerMove",
                            duration: 1000,
                            x: width / 2,
                            y: 10,
                        },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

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
        const testId = "a3b733a8-a9ba-42cf-b0d9-5b5dff6af6f6";
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            // Click on Account button
            await driver.pause(3000);
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
                            x: width / 4,
                            y: height * 0.95,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        {
                            type: "pointerMove",
                            duration: 1000,
                            x: width / 4,
                            y: 10,
                        },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

            /*
    // Scroll down to make Delete account button visible
    await driver.executeScript('mobile: scrollGesture', [{
      left: 100,
      top: 1000,
      width: 200,
      height: 800,
      direction: 'down',
      percent: 50.0
    }]);
    await driver.pause(1000);
    */

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
            await expect(await cancelButtonText.getText()).toBe("CANCEL");
            // Verify CANCEL button is enabled
            await expect(await cancelButton.isEnabled()).toBe(true);

            // Verify Help button
            const helpButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Help")',
            );
            await expect(helpButton).toBeDisplayed();

            //click cancel button
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
        const testId = "3b2fecf4-01af-4c36-9a14-819cbbe70f1b";
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            //go to account
            await driver.pause(3000);
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
                            y: height * 0.95,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        {
                            type: "pointerMove",
                            duration: 1000,
                            x: width / 2,
                            y: 10,
                        },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

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
            const themeOptions = [
                { name: "Dark" },
                { name: "Light" },
                { name: "Terrain" },
            ];

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
        const testId = "73556f25-f1ad-4985-abc5-4d9459a2509c";
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            await PageObjects.clickAccountButton();
            await driver.pause(4000);

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
                            y: height * 0.8,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        {
                            type: "pointerMove",
                            duration: 1000,
                            x: width / 2,
                            y: height * 0.3,
                        },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);
            await driver.pause(3000);

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

            //click the back button
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

    it("it should test support screen", async () => {
        const testId = "369b8d66-99f2-426d-9b5e-23e6c52800f3";
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            //go to account
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
                            x: width / 4,
                            y: height * 0.9,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        {
                            type: "pointerMove",
                            duration: 1000,
                            x: width / 4,
                            y: height * 0.15,
                        },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

            // click on support button
            const supportButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Support")',
            );
            await expect(supportButton).toBeDisplayed();
            await supportButton.click();

            // Verify screen header
            const screenHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Support")',
            );
            await expect(screenHeader).toBeDisplayed();
            await screenHeader.waitForDisplayed({ timeout: 4000 });

            // Verify tabs
            const faq = await driver.$(
                '-android uiautomator:new UiSelector().text("FAQ")',
            );
            await expect(faq).toBeDisplayed();

            const chat = await driver.$(
                '-android uiautomator:new UiSelector().text("Chat")',
            );
            await expect(chat).toBeDisplayed();

            const about = await driver.$(
                '-android uiautomator:new UiSelector().text("About")',
            );
            await expect(about).toBeDisplayed();
            /*

            const where = await driver.$(
                '-android uiautomator:new UiSelector().text("Where")',
            );
            await expect(where).toBeDisplayed();
            */

            // Click on "FAQ" to be sure you are in the right place
            await faq.click();

            // Verify main content headers and text
            const contentElements = [
                "How does it work (e-bike)",
                "Looking for your e-bike",
                "Open the umob app to see all available e-bikes.",
                "Start race",
                "Find your e-bike and press 'Start' in the app to begin your ride.",
                "Pause",
                "Do you want to take a break while on the go? Switch the e-bike to 'parking mode' at a small fee per minute. The e-bike will be turned off, but remains reserved for you.",
                "Flexible travel",
                "Enjoy the freedom to stop wherever you want, while your e-bike waits for you safely.",
            ];

            for (const text of contentElements) {
                const element = await driver.$(
                    `-android uiautomator:new UiSelector().text("${text}")`,
                );
                await expect(element).toBeDisplayed();
            }

            await driver.performActions([
                {
                    type: "pointer",
                    id: "finger2",
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
                            y: 10,
                        },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

            const contentElements2 = [
                "End ride",
                "End your ride only within the service area, indicated by green in the app.",
                "Park neatly",
                "Make sure the e-bike is parked correctly before you end the ride in the app.",
                "Driving in the city",
                "With e-bikes, you can ride and park almost anywhere in the city within designated zones to keep the public roads accessible.",
                "Follow the rules",
                "Always respect local traffic rules and ensure a safe and responsible ride.",
            ];

            for (const text of contentElements2) {
                const element2 = await driver.$(
                    `-android uiautomator:new UiSelector().text("${text}")`,
                );
                await expect(element2).toBeDisplayed();
            }
            // go to chat tab
            await chat.click();
            await driver.pause(2000);

            const openChat = await driver.$(
                `-android uiautomator:new UiSelector().text("OPEN CHAT")`,
            );
            await expect(openChat).toBeDisplayed();
            await openChat.click();

            //send test message to chat

            const welcomeMessage = await driver.$(
                `-android uiautomator:new UiSelector().text("Start typing here")`,
            );
            await expect(welcomeMessage).toBeDisplayed();

            await welcomeMessage.addValue("test");
            await driver.pause(2000);

            //click on send button

            const sendButton = await driver.$(
                '-android uiautomator:new UiSelector().description("Send")',
            );
            await expect(sendButton).toBeDisplayed();
            await sendButton.click();

            //check if message was sent
            const messageCheck = await driver.$(
                `-android uiautomator:new UiSelector().text("test")`,
            );
            await expect(messageCheck).toBeDisplayed();

            //if the message is sent then after seeing "test" you should see welcome message again: "Start typing here")`);
            await expect(welcomeMessage).toBeDisplayed();

            // Press the device back button (this method works on mobile)
            await driver.back();
            await driver.pause(5000);

            //go to about tab
            await expect(about).toBeDisplayed();
            await driver.pause(2000);
            await about.click();
            await driver.pause(1000);

            //check for text on about tab

            const contentElements3 = [
                "On a mission",
                "We're here to evolutionize mobility into seamless, accessible, and sustainable journeys.",
                "Making movement a breeze, not a burden.",
                "The problem we solve",
                "Urban mobility is complex. Too many apps & accounts cause frustration. But less congestion and more green travel is imperative for a sustainable future.",
            ];

            for (const text of contentElements3) {
                const element3 = await driver.$(
                    `-android uiautomator:new UiSelector().text("${text}")`,
                );
                await expect(element3).toBeDisplayed();
            }

            await driver.performActions([
                {
                    type: "pointer",
                    id: "finger3",
                    parameters: { pointerType: "touch" },
                    actions: [
                        {
                            type: "pointerMove",
                            duration: 0,
                            x: width / 2,
                            y: 500,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        {
                            type: "pointerMove",
                            duration: 1000,
                            x: width / 2,
                            y: 10,
                        },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

            //test the text after scrolling
            const text1 = await driver.$(
                '-android uiautomator:new UiSelector().text("The solution")',
            );
            await expect(text1).toBeDisplayed();

            const text2 = await driver.$(
                '-android uiautomator:new UiSelector().text("One app for all rides simplifies travel and cuts the clutter. Shift from owning to sharing.")',
            );
            await expect(text2).toBeDisplayed();
            /*


            //go to where tab
            await where.click();
            await driver.pause(2000);

            //check key elements for "where" tab
            const availability = await driver.$(
                '-android uiautomator:new UiSelector().text("Availability")',
            );
            await expect(availability).toBeDisplayed();

            //languages check


            const netherlands = await driver.$(
                '-android uiautomator:new UiSelector().text("Netherlands")',
            );
            await expect(netherlands).toBeDisplayed();
            await netherlands.click();
            await driver.pause(2000);


            //checking amount of providers
            const bicycle = await driver.$(
                '-android uiautomator:new UiSelector().text("Bicycle")',
            );
            await expect(bicycle).toBeDisplayed();

            const bicycleProviders = await driver.$(
                '-android uiautomator:new UiSelector().text("8 providers")',
            );
            await expect(bicycleProviders).toBeDisplayed();

            const moped = await driver.$(
                '-android uiautomator:new UiSelector().text("Moped")',
            );
            await expect(moped).toBeDisplayed();

            const mopedProviders = await driver.$(
                '-android uiautomator:new UiSelector().text("5 providers")',
            );
            await expect(mopedProviders).toBeDisplayed();

            const step = await driver.$(
                '-android uiautomator:new UiSelector().text("Step")',
            );
            await expect(moped).toBeDisplayed();

            const stepProviders = await driver.$(
                '-android uiautomator:new UiSelector().text("3 providers")',
            );
            await expect(stepProviders).toBeDisplayed();


            await driver.pause(2000);
            await driver.performActions([
                {
                    type: "pointer",
                    id: "finger4",
                    parameters: { pointerType: "touch" },
                    actions: [
                        {
                            type: "pointerMove",
                            duration: 0,
                            x: width / 3,
                            y: 850,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        {
                            type: "pointerMove",
                            duration: 1000,
                            x: width / 3,
                            y: 50,
                        },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

            const taxi = await driver.$(
                '-android uiautomator:new UiSelector().text("Taxi")',
            );
            await expect(taxi).toBeDisplayed();

            const taxiProviders = await driver.$(
                '-android uiautomator:new UiSelector().text("5 providers")',
            );
            await expect(taxiProviders).toBeDisplayed();

            const any = await driver.$(
                '-android uiautomator:new UiSelector().text("Unknown")',
            );
            await expect(any).toBeDisplayed();

            const anyProviders = await driver.$(
                '-android uiautomator:new UiSelector().text("1 provider")',
            );
            await expect(anyProviders).toBeDisplayed();

            const publicTransport = await driver.$(
                '-android uiautomator:new UiSelector().text("Public transport")',
            );
            await expect(publicTransport).toBeDisplayed();

            const publicProviders = await driver.$(
                '-android uiautomator:new UiSelector().text("1 provider")',
            );
            await expect(publicProviders).toBeDisplayed();

            //quit support screen
            const quit = await driver.$("class name:com.horcrux.svg.RectView");
            await quit.click();
            */
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
        const testId = "fc651985-1b70-4dbe-96a9-87e00a3f96b1";
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            //go to account
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
            await driver.pause(1000);

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
            await driver.pause(1000);

            // Click on LogOut option
            const logoutButton = await driver.$(
                '-android uiautomator:new UiSelector().text("LOG OUT")',
            );
            await expect(logoutButton).toBeDisplayed();
            await logoutButton.click();

            // verify Login button appeared
            const signUpButton = await driver.$(
                '-android uiautomator:new UiSelector().text("LOGIN")',
            );
            await expect(signUpButton).toBeDisplayed();

            // verify Register button appeared
            const register = await driver.$(
                '-android uiautomator:new UiSelector().text("REGISTER")',
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
