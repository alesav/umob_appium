import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import { getCredentials, executeTest } from "../../helpers/TestHelpers.js";

const ENV = process.env.TEST_ENV || "test";
const USER = process.env.TEST_USER || "newUser";

describe("Combined Tests For Logged in New User Without Rides", () => {
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

    it("should verify main screen elements and welcome vouchers on PROMOS screen", async () => {
        const testId = "3ce0c6b4-2ed7-40c4-adf7-a8838233f18c";

        await executeTest(testId, async () => {
            // Verify filter button is displayed
            await expect(PageObjects.assetFilterToggle).toBeDisplayed();

            // Check for map root element
            await expect(PageObjects.mapRoot).toBeDisplayed();

            // Verify bottom navigation menu items and click Promos button
            await PageObjects.planTripBtn.waitForExist();

            await PageObjects.promosBtn.waitForExist();
            await PageObjects.promosBtn.click();
            await driver.pause(1000);

            // Verify welcome vouchers
            const checkVoucher = await driver.$(
                '-android uiautomator:new UiSelector().text("New User Check")',
            );
            await expect(checkVoucher).toBeDisplayed();

            const donkeyVoucher = await driver.$(
                '-android uiautomator:new UiSelector().text("New User Donkey Republic")',
            );
            await expect(donkeyVoucher).toBeDisplayed();
        });
    });

    it("should display all key account screen elements", async () => {
        const testId = "4a6deca6-6d69-42fe-bef5-e2d9adf47398";

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

            const { width, height } = await driver.getWindowSize();

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
                            y: height * 0.3,
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
            await PageObjects.verifyMenuItems(accountMenuItems2);

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
                            y: height * 0.9,
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
            await driver.pause(2000);

            // Verify account menu items after second scrolling
            const accountMenuItems3 = ["Support", "Delete account"];
            await PageObjects.verifyMenuItems(accountMenuItems3);

            // Verify Log Out button
            await expect(PageObjects.logOutButton).toBeDisplayed();

            // Verify back button is present
            await expect(PageObjects.backButton).toBeDisplayed();
        });
    });

    it("should display all key Invite Friends screen elements", async () => {
        const testId = "bb19b9f3-22b4-4577-9227-29b183649e94";

        await executeTest(testId, async () => {
            await PageObjects.clickAccountButton();
            await driver.pause(3000);

            // Navigate to Invite Friends
            await expect(PageObjects.inviteFriendsMenuItem).toBeDisplayed();
            await PageObjects.inviteFriendsMenuItem.click();
            await driver.pause(3000);

            // Verify back button is present
            await expect(PageObjects.backButtonAccessibility).toBeDisplayed();

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

            const { width, height } = await driver.getWindowSize();

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

            // Verify Share Code button
            const shareCodeButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Invite Friends")',
            );
            await expect(shareCodeButton).toBeDisplayed();

            const viewStats = await driver.$(
                '-android uiautomator:new UiSelector().text("View Your Stats")',
            );
            await expect(viewStats).toBeDisplayed();

            // Click back button to main account menu
            await PageObjects.backButtonAccessibility.click();
            await driver.pause(2000);
        });
    });

    it("should display all key Personal Info screen elements", async () => {
        const testId = "d224e3c1-e296-4c4c-b8ad-fc19cfe35c4f";

        await executeTest(testId, async () => {
            await PageObjects.clickAccountButton();
            await driver.pause(3000);

            // Navigate to personal info
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

            const { width, height } = await driver.getWindowSize();

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
                            y: height * 0.6,
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

            // Verify Street field
            const streetLabel = await driver.$(
                '-android uiautomator:new UiSelector().text("Street")',
            );
            await expect(streetLabel).toBeDisplayed();

            // Verify Number field
            const numberLabel = await driver.$(
                '-android uiautomator:new UiSelector().text("Number")',
            );
            await expect(numberLabel).toBeDisplayed();

            // Verify Country field
            const countryLabel = await driver.$(
                '-android uiautomator:new UiSelector().text("Country")',
            );
            await expect(countryLabel).toBeDisplayed();

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
                            y: 950,
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
            await driver.pause(1000);

            // Verify Zip Code field
            const zipCode = await driver.$(
                '-android uiautomator:new UiSelector().text("Zip Code")',
            );
            await expect(zipCode).toBeDisplayed();

            // Verify City field
            const city = await driver.$(
                '-android uiautomator:new UiSelector().text("City")',
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

            // Click back button to main account menu
            await PageObjects.backButtonAccessibility.click();
            await driver.pause(2000);
        });
    });

    it("should display all key ID Document screen elements and verify Onfido screen of document verification", async () => {
        const testId = "46893f57-5045-4d7e-8483-6c1e24ad4aed";

        await executeTest(testId, async () => {
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

            // Verify status text
            const verifiedStatus = await driver.$(
                '-android uiautomator:new UiSelector().text("No Submitted")',
            );
            await expect(verifiedStatus).toBeDisplayed();

            // Verify Home address section
            const homeAddress = await driver.$(
                '-android uiautomator:new UiSelector().text("Home address")',
            );
            await expect(homeAddress).toBeDisplayed();

            // Verify Add address button
            const addButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Add")',
            );
            await expect(addButton).toBeDisplayed();

            const { width, height } = await driver.getWindowSize();

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
                '-android uiautomator:new UiSelector().text("Add Id Document")',
            );
            await expect(changeDocumentButton).toBeDisplayed();

            const helpButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Help")',
            );
            await expect(helpButton).toBeDisplayed();

            // Optional: Verify main container
            const idDocumentContainer = await driver.$(
                '-android uiautomator:new UiSelector().description("IdDocumentContainer")',
            );
            await expect(idDocumentContainer).toBeDisplayed();

            // Verify that app is connecting with Onfido service
            await changeDocumentButton.click();

            const idHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Add your identification document")',
            );
            await expect(idHeader).toBeDisplayed();

            const question = await driver.$(
                '-android uiautomator:new UiSelector().text("Which document to use?")',
            );
            await expect(question).toBeDisplayed();

            const text = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Make sure you enabled your camera and microphone")',
            );
            await expect(text).toBeDisplayed();

            const text1 = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Verify")',
            );
            await expect(text1).toBeDisplayed();

            const text2 = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Verify your ID")',
            );
            await expect(text2).toBeDisplayed();

            const startVerification = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Start Id Verification")',
            );
            await expect(startVerification).toBeDisplayed();
            await startVerification.click();

            // Allow permission for mobile
            const permission = await driver.$(
                "id:com.android.permissioncontroller:id/permission_allow_foreground_only_button",
            );
            await expect(permission).toBeDisplayed();
            await permission.click();
            await driver.pause(2000);

            const allowBut = await driver.$(
                '-android uiautomator:new UiSelector().textContains("While using")',
            );
            await expect(allowBut).toBeDisplayed();
            await allowBut.click();
            await driver.pause(2000);

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
                            y: 1000,
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
                            y: 1000,
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
            await driver.pause(1000);

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
                            y: 1000,
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
            await driver.pause(1000);

            // Notification for onfido web page
            const acceptBut = await driver.$(
                '-android uiautomator:new UiSelector().text("Accept")',
            );
            await expect(acceptBut).toBeDisplayed();
            await acceptBut.click();
            await driver.pause(2000);

            // Verify onfido screen
            const el2 = await driver.$(
                '-android uiautomator:new UiSelector().text("Select issuing country to see which documents we accept")',
            );
            await expect(el2).toBeDisplayed();

            const el3 = await driver.$(
                '-android uiautomator:new UiSelector().text("ISSUING COUNTRY")',
            );
            await expect(el3).toBeDisplayed();

            const el4 = await driver.$(
                '-android uiautomator:new UiSelector().text("ACCEPTED DOCUMENTS")',
            );
            await expect(el4).toBeDisplayed();

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

            const el6 = await driver.$(
                '-android uiautomator:new UiSelector().textContains("National identity card")',
            );
            await expect(el6).toBeDisplayed();

            const el7 = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Passport")',
            );
            await expect(el7).toBeDisplayed();

            const el5 = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Driver\'s license")',
            );
            await expect(el5).toBeDisplayed();
        });
    });

    it("should display all key My Rides & Tickets screen elements", async () => {
        const testId = "f9801780-f8a4-48f4-8620-c99ce3c80667";

        await executeTest(testId, async () => {
            await PageObjects.clickAccountButton();
            await driver.pause(3000);

            // Navigate to My Rides & Tickets
            await expect(PageObjects.myRidesButton).toBeDisplayed();
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

            // Verify last ride section
            const lastRideSection = await driver.$(
                '-android uiautomator:new UiSelector().text("You have not made any rides yet. If you have finished a ride you will find all details here. Enjoy!")',
            );
            await expect(lastRideSection).toBeDisplayed();

            // Back to common list of account menu
            await PageObjects.backButton.click();
            await driver.pause(2000);
        });
    });

    it("should display all key Ride Credit screen elements", async () => {
        const testId = "309008c8-d517-418c-b2b2-f2bff94af78f";

        await executeTest(testId, async () => {
            await driver.pause(3000);
            await PageObjects.clickAccountButton();
            await driver.pause(3000);

            const { width, height } = await driver.getWindowSize();

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
                            y: height * 0.7,
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
                            y: height * 0.81,
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

            // Verify that new user voucher is visible
            const checkVoucher = await driver.$(
                '-android uiautomator:new UiSelector().text("New User Check")',
            );
            await expect(checkVoucher).toBeDisplayed();

            // Verify that new user voucher is visible
            const donkeyVoucher = await driver.$(
                '-android uiautomator:new UiSelector().text("New User Donkey Republic")',
            );
            await expect(donkeyVoucher).toBeDisplayed();

            // Click back button to main account menu
            await PageObjects.backButtonAccessibility.click();
            await driver.pause(2000);
        });
    });

    it("should display all key My Payments screen elements", async () => {
        const testId = "e079b628-09f9-4125-9602-3bdf41f428de";

        await executeTest(testId, async () => {
            await driver.pause(3000);
            await PageObjects.clickAccountButton();
            await driver.pause(3000);

            const { width, height } = await driver.getWindowSize();

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
                            x: width / 4,
                            y: height * 0.7,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        {
                            type: "pointerMove",
                            duration: 1000,
                            x: width / 4,
                            y: height * 0.3,
                        },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

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
            await expect(PageObjects.backButtonAccessibility).toBeDisplayed();

            // Verify last payment section
            const lastPaymentSection = await driver.$(
                '-android uiautomator:new UiSelector().text("You have not yet made any payments yet. In this list you will find an overview of all your payments and the status.")',
            );
            await expect(lastPaymentSection).toBeDisplayed();

            // Back to common list of account menu
            await PageObjects.backButtonAccessibility.click();
            await driver.pause(2000);
        });
    });

    it("should display all key language screen elements", async () => {
        const testId = "0001c001-def2-4180-928e-16f59a412e54";

        await executeTest(testId, async () => {
            await driver.pause(3000);
            await PageObjects.clickAccountButton();
            await driver.pause(3000);

            const { width, height } = await driver.getWindowSize();

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
                            x: width / 4,
                            y: height * 0.85,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        {
                            type: "pointerMove",
                            duration: 1000,
                            x: width / 4,
                            y: height * 0.35,
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

            // Click the back button to the account screen
            await backButton.click();
            await driver.pause(2000);
        });
    });

    it("should display all key map theme settings screen elements", async () => {
        const testId = "e0c819eb-052d-4163-b7d2-276069b6964d";

        await executeTest(testId, async () => {
            // Go to account
            await driver.pause(3000);
            await PageObjects.clickAccountButton();
            await driver.pause(3000);

            const { width, height } = await driver.getWindowSize();

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
                            x: width / 4,
                            y: height * 0.8,
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

                // If it's the Light theme (which appears selected in the XML), verify the selection indicator
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

    it("it should test support screen", async () => {
        const testId = "789d3b57-8cc7-43f8-ae4c-436f141d5261";

        await executeTest(testId, async () => {
            // Go to account
            await driver.pause(3000);
            await PageObjects.clickAccountButton();
            await driver.pause(2000);

            const { width, height } = await driver.getWindowSize();

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
                            x: width / 4,
                            y: height * 0.85,
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

            // Click on support button
            await expect(PageObjects.supportButton).toBeDisplayed();
            await PageObjects.supportButton.click();

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

            // Click on "FAQ" to be sure you are in the right place
            await driver.pause(2000);
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

            // Go to chat tab
            await chat.click();
            await driver.pause(2000);

            const openChat = await driver.$(
                `-android uiautomator:new UiSelector().text("Open Chat")`,
            );
            await expect(openChat).toBeDisplayed();
            await openChat.click();

            // Send test message to chat
            const welcomeMessage = await driver.$(
                `-android uiautomator:new UiSelector().text("Start typing here")`,
            );
            await expect(welcomeMessage).toBeDisplayed();
            await welcomeMessage.addValue("test");
            await driver.pause(2000);

            // Click on send button
            const sendButton = await driver.$(
                '-android uiautomator:new UiSelector().description("Send")',
            );
            await expect(sendButton).toBeDisplayed();
            await sendButton.click();

            // Check if message was sent
            const messageCheck = await driver.$(
                `-android uiautomator:new UiSelector().text("test")`,
            );
            await expect(messageCheck).toBeDisplayed();

            // If the message is sent then after seeing "test" you should see welcome message again: "Start typing here"
            await expect(welcomeMessage).toBeDisplayed();

            // Press the device back button
            await driver.back();

            // Go to about tab
            await driver.pause(5000);
            await expect(about).toBeDisplayed();
            await about.click();
            await driver.pause(2000);

            // Check for text on about tab
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

            // Test the text after scrolling
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

    it("should display all key delete account screen elements", async () => {
        const testId = "9dbc289a-319f-47ee-b30e-4773e297c67a";

        await executeTest(testId, async () => {
            // Go to account
            await driver.pause(2000);
            await PageObjects.clickAccountButton();
            await driver.pause(3000);

            const { width, height } = await driver.getWindowSize();

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
                            x: width / 4,
                            y: height * 0.7,
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

            // Quit this delete account popup
            await cancelButton.click();
            await driver.pause(1000);
        });
    });

    it("should successfully logout from the app", async () => {
        const testId = "87874cb4-321f-4a63-8fde-0b1d6e90ff5e";

        await executeTest(testId, async () => {
            // Go to account
            await PageObjects.clickAccountButton();
            await driver.pause(2000);

            const { width, height } = await driver.getWindowSize();

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

            // Verify Login button appeared
            const signUpButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Login")',
            );
            await expect(signUpButton).toBeDisplayed();

            // Verify Register button appeared
            const register = await driver.$(
                '-android uiautomator:new UiSelector().text("Register")',
            );
            await expect(register).toBeDisplayed();
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
