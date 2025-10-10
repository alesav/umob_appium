import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import { getCredentials, executeTest } from "../../helpers/TestHelpers.js";

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

        await executeTest(testId, async () => {
            await PageObjects.planTripBtn.waitForExist();
            await PageObjects.promosBtn.waitForExist();

            // Verify filter button is displayed
            await expect(PageObjects.assetFilterToggle).toBeDisplayed();

            // Check for map root element
            await expect(PageObjects.mapRoot).toBeDisplayed();
        });
    });

    it("should display multi voucher on Promos screen", async () => {
        const testId = "c9995301-adec-485e-b64d-c6261b81d31b";

        await executeTest(testId, async () => {
            await PageObjects.promosBtn.waitForExist();
            await PageObjects.promosBtn.click();

            await driver.pause(1000);

            //verify multi voucher is present
            const multiVoucher = await driver.$(
                '-android uiautomator:new UiSelector().textContains("multi")',
            );
            await expect(multiVoucher).toBeDisplayed();

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
                '-android uiautomator:new UiSelector().textContains("Invite Friends")',
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
                '-android uiautomator:new UiSelector().textContains("Invite Friends")',
            );
            await expect(friends2).toBeDisplayed();
            await friends2.click();

            //verify share code button
            const shareCodeBtn = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Send Your Code")',
            );
            await expect(shareCodeBtn).toBeDisplayed();
        });
    });

    it("should display all key account screen elements", async () => {
        const testId = "18fb8bc3-a1db-44af-81a4-53df167418cd";

        await executeTest(testId, async () => {
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

            // INDIVIDUAL SCROLL (DO NOT MODIFY)
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
                '-android uiautomator:new UiSelector().text("Log Out")',
            );
            await expect(screenHeader).toBeDisplayed();

            // Verify back button is present
            await expect(PageObjects.backButton).toBeDisplayed();
        });
    });

    it("should display all key My Rides & Tickets screen elements", async () => {
        const testId = "cbbfbc83-2d4c-484f-88c6-9ac7da5fdbef";

        await executeTest(testId, async () => {
            // Click on Account button
            await PageObjects.clickAccountButton();
            await driver.pause(4000);

            // Navigate to My Rides & Tickets ("My rides" is a new version)
            await expect(PageObjects.myRidesButton).toBeDisplayed();
            await driver.pause(1000);
            await PageObjects.myRidesButton.click();
            await driver.pause(3000);

            // Verify screen header
            const screenHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("My rides")',
            );
            await expect(screenHeader).toBeDisplayed();
            await driver.pause(3000);

            // Verify back button is present
            await expect(PageObjects.backButton).toBeDisplayed();

            // Check previous payments list
            const previousPaymentsList = await driver.$$(
                '-android uiautomator:new UiSelector().textContains("€")',
            );
            console.log("previousPaymentsList" + previousPaymentsList.length);

            // Verify at least one previous payment exists
            await expect(previousPaymentsList.length).toBeGreaterThan(1);

            // back to common list of account menu
            await PageObjects.backButton.click();
            await driver.pause(2000);
        });
    });

    it("should display all key My Payments screen elements", async () => {
        const testId = "da75bc89-8bb5-4db1-9e42-524161e964a5";

        await executeTest(testId, async () => {
            // Click on Account button
            await PageObjects.clickAccountButton();
            await driver.pause(3000);

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
            await expect(PageObjects.myPaymentsButton).toBeDisplayed();
            await PageObjects.myPaymentsButton.click();
            await driver.pause(4000);

            // Verify screen header
            const screenHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("My payments")',
            );
            await expect(screenHeader).toBeDisplayed();

            // Verify back button is present
            await expect(PageObjects.backButtonAccessibility).toBeDisplayed();

            // Check previous payments list
            const previousPaymentsList = await driver.$$(
                '-android uiautomator:new UiSelector().textContains("€")',
            );
            console.log("previousPaymentsList" + previousPaymentsList.length);

            // Verify at least one previous payment exists
            await expect(previousPaymentsList.length).toBeGreaterThan(1);

            // back to common list of account menu
            await PageObjects.backButton.click();
            await driver.pause(2000);
        });
    });

    it("should display all key Personal Info screen elements", async () => {
        const testId = "6a7a6836-8165-4e41-acca-16665c6539dc";

        await executeTest(testId, async () => {
            // Click on Account button
            await PageObjects.clickAccountButton();
            await driver.pause(3000);

            //navigate to personal info
            await expect(PageObjects.personalInfoButton).toBeDisplayed();
            await PageObjects.personalInfoButton.click();

            // Verify screen header
            const screenHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Personal Info")',
            );
            await expect(screenHeader).toBeDisplayed();

            // Verify back button is present
            await expect(PageObjects.backButtonAccessibility).toBeDisplayed();

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
                            y: 5,
                        },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

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

            // click back button to main account menu
            await PageObjects.backButtonAccessibility.click();
            await driver.pause(2000);
        });
    });

    it("should display all key Ride Credit screen elements", async () => {
        const testId = "3f9c12b7-8c3f-4a3e-bc2c-fdb09536c0a2";

        await executeTest(testId, async () => {
            // Click on Account button
            await driver.pause(3000);
            await PageObjects.clickAccountButton();
            await driver.pause(3000);

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
            await expect(PageObjects.vouchersButton).toBeDisplayed();
            await PageObjects.vouchersButton.click();
            await driver.pause(3000);

            // Verify screen header
            const screenHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Vouchers")',
            );
            await expect(screenHeader).toBeDisplayed();

            // Verify back button is present
            await expect(PageObjects.backButtonAccessibility).toBeDisplayed();

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
                '-android uiautomator:new UiSelector().text("Submit Promotional Code")',
            );
            await expect(submitPromotionalCodeButton).toBeDisplayed();

            //verify that limitless user's voucher is visible
            const limitlessVoucher = await driver.$(
                '-android uiautomator:new UiSelector().textContains("multi")',
            );
            await expect(limitlessVoucher).toBeDisplayed();

            // click back button to main account menu
            await PageObjects.backButtonAccessibility.click();
            await driver.pause(2000);
        });
    });

    it("should display all key Invite Friends screen elements", async () => {
        const testId = "9c072b4f-6df0-41f8-a64e-42b410edb3e0";

        await executeTest(testId, async () => {
            // Click on Account button
            await PageObjects.clickAccountButton();
            await driver.pause(2000);

            // Navigate to Invite Friends
            await expect(PageObjects.inviteFriendsMenuItem).toBeDisplayed();
            await PageObjects.inviteFriendsMenuItem.click();
            await driver.pause(2000);

            // Verify back button is present
            await expect(PageObjects.backButtonAccessibility).toBeDisplayed();

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
                '-android uiautomator:new UiSelector().text("Invite Friends")',
            );
            await expect(shareCodeButton).toBeDisplayed();

            const viewStats = await driver.$(
                '-android uiautomator:new UiSelector().text("View Your Stats")',
            );
            await expect(viewStats).toBeDisplayed();

            // click back button to main account menu
            await PageObjects.backButtonAccessibility.click();
            await driver.pause(2000);
        });
    });

    it("should display all key Payment Settings screen elements", async () => {
        const testId = "40a243d5-466e-4a01-8de2-7e40b713f260";

        await executeTest(testId, async () => {
            // Click on Account button
            await PageObjects.clickAccountButton();
            await driver.pause(2000);

            // Navigate to Payment methods screen
            await expect(PageObjects.paymentMethodsButton).toBeDisplayed();
            await PageObjects.paymentMethodsButton.click();

            // Verify screen header
            const screenHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Payment method")',
            );
            await expect(screenHeader).toBeDisplayed();

            // Verify back button is present
            await expect(PageObjects.backButtonAccessibility).toBeDisplayed();

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

            // click back button to main account menu
            await PageObjects.backButtonAccessibility.click();
            await driver.pause(2000);
        });
    });

    it("should display all key ID Document screen elements", async () => {
        const testId = "a4ff4276-103e-439b-9e0a-f13ff1900ec4";

        await executeTest(testId, async () => {
            // Navigate to Account screen first
            await PageObjects.clickAccountButton();
            await driver.pause(2000);

            // Navigate to ID Document screen
            await expect(PageObjects.idDocumentButton).toBeDisplayed();
            await PageObjects.idDocumentButton.click();

            // Verify screen header
            const screenHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("ID document")',
            );
            await expect(screenHeader).toBeDisplayed();

            // Verify back button is present
            await expect(PageObjects.backButtonAccessibility).toBeDisplayed();

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
                '-android uiautomator:new UiSelector().text("Change Document")',
            );
            await expect(changeDocumentButton).toBeDisplayed();

            // INDIVIDUAL SCROLL (DO NOT MODIFY)
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
        });
    });

    it("should display all key delete account screen elements", async () => {
        const testId = "a3b733a8-a9ba-42cf-b0d9-5b5dff6af6f6";

        await executeTest(testId, async () => {
            // Click on Account button
            await driver.pause(3000);
            await PageObjects.clickAccountButton();
            await driver.pause(3000);

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

            // Click on Delete account button
            await expect(PageObjects.deleteAccountButton).toBeDisplayed();
            await PageObjects.deleteAccountButton.click();
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

            //click cancel button
            await cancelButton.click();
            await driver.pause(1000);
        });
    });

    it("should display all key map theme settings screen elements", async () => {
        const testId = "3b2fecf4-01af-4c36-9a14-819cbbe70f1b";

        await executeTest(testId, async () => {
            //go to account
            await driver.pause(3000);
            await PageObjects.clickAccountButton();
            await driver.pause(3000);

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
                            y: 10,
                        },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

            // Click on Map theme settings option
            await expect(PageObjects.mapThemeSettingsButton).toBeDisplayed();
            await PageObjects.mapThemeSettingsButton.click();
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

                // If it's the Light theme (which appears selected), verify the selection indicator
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
        });
    });

    it("should display all key language screen elements", async () => {
        const testId = "73556f25-f1ad-4985-abc5-4d9459a2509c";

        await executeTest(testId, async () => {
            await PageObjects.clickAccountButton();
            await driver.pause(4000);

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
            await expect(PageObjects.languageButton).toBeDisplayed();
            await PageObjects.languageButton.click();
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
        });
    });

    it("it should test support screen", async () => {
        const testId = "369b8d66-99f2-426d-9b5e-23e6c52800f3";

        await executeTest(testId, async () => {
            //go to account
            await PageObjects.clickAccountButton();
            await driver.pause(3000);

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
            await expect(PageObjects.supportButton).toBeDisplayed();
            await PageObjects.supportButton.click();

            // Verify screen header
            await expect(PageObjects.supportScreenHeader).toBeDisplayed();
            await PageObjects.supportScreenHeader.waitForDisplayed({ timeout: 4000 });

            // Verify tabs
            await expect(PageObjects.supportFaqTab).toBeDisplayed();
            await expect(PageObjects.supportChatTab).toBeDisplayed();
            await expect(PageObjects.supportAboutTab).toBeDisplayed();

            // Click on "FAQ" to be sure you are in the right place
            await PageObjects.supportFaqTab.click();

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

            // INDIVIDUAL SCROLL (DO NOT MODIFY)
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
            await PageObjects.supportChatTab.click();
            await driver.pause(2000);

            await expect(PageObjects.openChatButton).toBeDisplayed();
            await PageObjects.openChatButton.click();

            //send test message to chat
            await expect(PageObjects.chatInputField).toBeDisplayed();

            await PageObjects.chatInputField.addValue("test");
            await driver.pause(2000);

            //click on send button
            await expect(PageObjects.chatSendButton).toBeDisplayed();
            await PageObjects.chatSendButton.click();

            //check if message was sent
            const messageCheck = await driver.$(
                `-android uiautomator:new UiSelector().text("test")`,
            );
            await expect(messageCheck).toBeDisplayed();

            //if the message is sent then after seeing "test" you should see welcome message again: "Start typing here"
            await expect(PageObjects.chatInputField).toBeDisplayed();

            // Press the device back button (this method works on mobile)
            await driver.back();
            await driver.pause(5000);

            //go to about tab
            await expect(PageObjects.supportAboutTab).toBeDisplayed();
            await driver.pause(2000);
            await PageObjects.supportAboutTab.click();
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

            // INDIVIDUAL SCROLL (DO NOT MODIFY)
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
        });
    });

    it("should successfully logout from the app", async () => {
        const testId = "fc651985-1b70-4dbe-96a9-87e00a3f96b1";

        await executeTest(testId, async () => {
            //go to account
            await PageObjects.clickAccountButton();
            await driver.pause(3000);

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
            await driver.pause(1000);

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
            await expect(PageObjects.logOutButton).toBeDisplayed();
            await PageObjects.logOutButton.click();

            // verify Login button appeared
            await expect(PageObjects.loginButton).toBeDisplayed();

            // verify Register button appeared
            await expect(PageObjects.registerButton).toBeDisplayed();
        });
    });

    afterEach(async () => {
        try {
            await driver.terminateApp("com.umob.umob");
        } catch (error) {
            console.log("Error terminating app:", error);
        }
    });
});
