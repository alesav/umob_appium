import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import {
    getCredentials,
    executeTest,
    ENV,
    USER,
} from "../../helpers/TestHelpers.js";
import PostHogHelper from "../../helpers/PosthogHelper.js";

const posthog = new PostHogHelper();

/////////////////////////////////////////////////////////////////////////////////

describe("Combined test for the logged in old user with rides history", () => {
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

            // Scroll to bottom - ИНДИВИДУАЛЬНЫЙ СКРОЛЛ (НЕ ТРОГАТЬ)
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

            // Verify account menu items
            const accountMenuItems = [
                "Invite friends",
                "Personal info",
                "Payment methods",
                "ID Document",
                "My rides",
            ];
            await PageObjects.verifyMenuItems(accountMenuItems);

            // Get window size
            const { width, height } = await driver.getWindowSize();

            // First scroll - individual scroll(do not modify)
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

            // Verify account menu items after first scrolling
            const accountMenuItems2 = [
                "Vouchers",
                "My payments",
                "Language",
                "Map theme settings",
            ];
            await PageObjects.verifyMenuItems(accountMenuItems2);

            // Second scroll - individual scroll(do not modify)
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

            // Scroll fully down to make visible Log Out option - individual scroll(do not modify)
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
            await PageObjects.verifyMenuItems(accountMenuItems3);

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

            // Scroll to My Rides - ИНДИВИДУАЛЬНЫЙ СКРОЛЛ (НЕ ТРОГАТЬ)
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

            // Scroll to My Payments - ИНДИВИДУАЛЬНЫЙ СКРОЛЛ (НЕ ТРОГАТЬ)
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
            const formSections = [
                "What is your email?",
                "What is your phone number?",
                "What is your name?",
                "What is your last name?",
                "What is your address?",
            ];

            for (const section of formSections) {
                const sectionElement = await driver.$(
                    `-android uiautomator:new UiSelector().text("${section}")`,
                );
                await expect(sectionElement).toBeDisplayed();
            }

            // Verify Edit button for email
            const emailEditButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Edit")',
            );
            await expect(emailEditButton).toBeDisplayed();

            // Verify address fields
            const addressFields = ["Bloemstraat", "80"];
            for (const field of addressFields) {
                const fieldElement = await driver.$(
                    `-android uiautomator:new UiSelector().text("${field}")`,
                );
                await expect(fieldElement).toBeDisplayed();
            }

            // Scroll down - ИНДИВИДУАЛЬНЫЙ СКРОЛЛ (НЕ ТРОГАТЬ)
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

            // Verify remaining address fields
            const moreAddressFields = ["Argentina", "3014", "Rotterdam"];
            for (const field of moreAddressFields) {
                const fieldElement = await driver.$(
                    `-android uiautomator:new UiSelector().text("${field}")`,
                );
                await expect(fieldElement).toBeDisplayed();
            }

            // Verify action buttons
            const saveButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Save")',
            );
            await expect(saveButton).toBeDisplayed();

            const helpButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Help")',
            );
            await expect(helpButton).toBeDisplayed();

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

            // Scroll - ИНДИВИДУАЛЬНЫЙ СКРОЛЛ (НЕ ТРОГАТЬ)
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

            // Scroll - ИНДИВИДУАЛЬНЫЙ СКРОЛЛ (НЕ ТРОГАТЬ)
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

            // Verify screen elements
            const screenElements = [
                "Invite your friends",
                "Give €10, Get €10",
                "Your code",
            ];

            for (const element of screenElements) {
                const elementSelector = await driver.$(
                    `-android uiautomator:new UiSelector().text("${element}")`,
                );
                await expect(elementSelector).toBeDisplayed();
            }

            // Verify screen description
            const screenDescription = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Invite a friend to join umob, and")',
            );
            await expect(screenDescription).toBeDisplayed();

            // Scroll down - ИНДИВИДУАЛЬНЫЙ СКРОЛЛ (НЕ ТРОГАТЬ)
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

            // Verify action buttons
            const shareCodeButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Invite Friends")',
            );
            await expect(shareCodeButton).toBeDisplayed();

            const viewStats = await driver.$(
                '-android uiautomator:new UiSelector().text("View Your Stats")',
            );
            await expect(viewStats).toBeDisplayed();

            // Click back button to main account menu
            await backButton.click();
            await driver.pause(2000);
        });
    });

    it("should display all key Payment Settings screen elements", async () => {
        const testId = "9f816dbf-35ef-4828-9a85-1fd9a0fafc07";

        await executeTest(testId, async () => {
            // Click on Account button
            await PageObjects.clickAccountButton();
            await driver.pause(2000);

            // Navigate to Payment Settings screen
            await expect(PageObjects.paymentMethodsButton).toBeDisplayed();
            await PageObjects.paymentMethodsButton.click();

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

            // Verify payment card details
            const cardDetails = [
                "MasterCard",
                "**** **** **** 1115",
                "03/2030",
            ];

            for (const detail of cardDetails) {
                const detailElement = await driver.$(
                    `-android uiautomator:new UiSelector().text("${detail}")`,
                );
                await expect(detailElement).toBeDisplayed();
            }

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

            // Click back button to main account menu
            await backButton.click();
            await driver.pause(2000);
        });
    });

    it("should display all key ID Document screen elements", async () => {
        const testId = "27935f3e-8bd9-43c1-a070-05d786254932";

        await executeTest(testId, async () => {
            // Click on Account button
            await PageObjects.clickAccountButton();

            // Navigate to ID Document screen
            await expect(PageObjects.idDocumentButton).toBeDisplayed();
            await PageObjects.idDocumentButton.click();

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

            // Verify document sections
            const documentSections = [
                "Document type",
                "Driver license",
                "Status",
                "Expiration date",
                "28 May 2031",
                "Categories",
            ];

            for (const section of documentSections) {
                const sectionElement = await driver.$(
                    `-android uiautomator:new UiSelector().text("${section}")`,
                );
                await expect(sectionElement).toBeDisplayed();
            }

            // Verify Status section
            const statusVerifiedText = await driver.$(
                '-android uiautomator:new UiSelector().description("IdDocumentStatusIdDocumentItemContent")',
            );
            await expect(statusVerifiedText).toBeDisplayed();

            // Verify all license categories
            const categories = ["B", "A", "B1", "AM"];
            for (const category of categories) {
                const categoryElement = await driver.$(
                    `-android uiautomator:new UiSelector().description("undefinedIdDocumentItemContent${category}")`,
                );
                await expect(categoryElement).toBeDisplayed();
            }

            // Scroll down - ИНДИВИДУАЛЬНЫЙ СКРОЛЛ (НЕ ТРОГАТЬ)
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
            const homeAddressFields = ["Bloemstraat 80", "3014", "Rotterdam"];

            for (const field of homeAddressFields) {
                const fieldElement = await driver.$(
                    `-android uiautomator:new UiSelector().textContains("${field}")`,
                );
                await expect(fieldElement).toBeDisplayed();
            }

            // Verify bottom buttons
            const changeDocumentButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Change Document")',
            );
            await expect(changeDocumentButton).toBeDisplayed();

            // Scroll to bottom - ИНДИВИДУАЛЬНЫЙ СКРОЛЛ (НЕ ТРОГАТЬ)
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
        });
    });

    it("should display all key delete account screen elements", async () => {
        const testId = "03a01117-d3e5-413b-8fc1-bbd1e4048f0e";

        await executeTest(testId, async () => {
            // Click on Account button
            await PageObjects.clickAccountButton();

            // Scroll down to make Delete account button visible - ИНДИВИДУАЛЬНЫЙ СКРОЛЛ (НЕ ТРОГАТЬ)
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
            await driver.pause(1000);

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
            await cancelButton.click();
            await driver.pause(1000);
        });
    });

    it("should display all key map theme settings screen elements", async () => {
        const testId = "ce67b5e4-8e1c-4b2c-95c0-0d73a71a7449";

        await executeTest(testId, async () => {
            // Click on Account button
            await PageObjects.clickAccountButton();
            await driver.pause(2000);

            // Scroll down to make Map theme settings visible - ИНДИВИДУАЛЬНЫЙ СКРОЛЛ (НЕ ТРОГАТЬ)
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

            // Click back button to go to the app settings
            await backButton.click();
            await driver.pause(2000);
        });
    });

    it("should display all key language screen elements", async () => {
        const testId = "af01144c-675b-43d7-8b35-019d9a52ead1";

        await executeTest(testId, async () => {
            // Click on Account button
            await PageObjects.clickAccountButton();
            await driver.pause(2000);

            // Scroll down to make Language visible - ИНДИВИДУАЛЬНЫЙ СКРОЛЛ (НЕ ТРОГАТЬ)
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

            // Click the back button to the app settings screen
            await backButton.click();
            await driver.pause(2000);

            // Verify Privacy & Legal section
            await expect(PageObjects.privacyLegalButton).toBeDisplayed();

            // Verify LogOut button
            await expect(PageObjects.logOutButton).toBeDisplayed();
        });
    });

    it("should successfully logout from the app", async () => {
        const testId = "a9238177-4f15-4730-8b59-6c07b4e5d155";

        await executeTest(testId, async () => {
            // Click on Account button
            await PageObjects.clickAccountButton();
            await driver.pause(2000);

            // Scroll down to make LogOut visible
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
            await expect(PageObjects.logOutButton).toBeDisplayed();
            await PageObjects.logOutButton.click();

            // Verify Login button appeared
            await expect(PageObjects.loginButton).toBeDisplayed();

            // Verify Register button appeared
            await expect(PageObjects.registerButton).toBeDisplayed();

            // Verify PostHog events
            try {
                /*
                // Get Logged In event
                const loggedInEvent = await posthog.waitForEvent(
                    {
                        eventName: "Logged In",
                    },
                    {
                        maxRetries: 10,
                        retryDelayMs: 3000,
                        searchLimit: 20,
                        maxAgeMinutes: 5,
                    },
                );
                */

                const loggedOutEvent = await posthog.waitForEvent(
                    {
                        eventName: "Logged Out",
                    },
                    {
                        maxRetries: 10,
                        retryDelayMs: 3000,
                        searchLimit: 20,
                        maxAgeMinutes: 5,
                    },
                );

                // If we got here, event was found with all criteria matching
                //posthog.printEventSummary(loggedInEvent);
                posthog.printEventSummary(loggedOutEvent);

                // Verify Logged In event
                // expect(loggedInEvent.event).toBe("Logged In");
                // expect(loggedInEvent.person?.is_identified).toBe(true);

                // Verify Logged Out event
                expect(loggedOutEvent.event).toBe("Logged Out");
                expect(loggedOutEvent.person?.is_identified).toBe(true);
            } catch (posthogError) {
                console.error("PostHog verification failed:", posthogError);
                throw posthogError;
            }
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
