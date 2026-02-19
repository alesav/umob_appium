import submitTestRun from "../../helpers/SendResults.js";
import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import AppiumHelpers from "../../helpers/AppiumHelpers.js";
import {
    //getCredentials,
    //executeTest,
    getScreenCenter,
} from "../../helpers/TestHelpers.js";
import {
    fetchScooterCoordinates,
    findFelyxScooter,
    type Scooter,
} from "../../helpers/ScooterCoordinates.js";

describe("Combined Not Logged User Tests", () => {
    let scooters: Scooter[];

    beforeEach(async () => {
        await driver.activateApp("com.umob.umob");
        await driver.pause(7000);

        //should start the app without logging in and check key elements
        // Wait for and handle the initial popup
        try {
            // Wait for the popup text to be visible
            // const popupText = await driver.$(
            //     'android=new UiSelector().text("Sign up & get €10,-")',
            // );
            const popupText = await driver.$(
                'android=new UiSelector().textContains("Ready to ride?")',
            );
            await popupText.waitForDisplayed({ timeout: 15000 });

            // Verify popup elements
            // const popupDescription = await driver.$(
            //     'android=new UiSelector().text("Sign up to explore or get started right away, no registration needed! Just planning a trip? For taxis and public transport, all we need is your phone number and payment method.")',
            // );
            const popupDescription = await driver.$(
                'android=new UiSelector().textContains("Join over 5.000 people who use umob")',
            );
            await expect(popupDescription).toBeDisplayed();

            // Click the "EXPLORE MAP" button
            await PageObjects.exploreMapButton.waitForEnabled();

            await driver.pause(5000);
            await PageObjects.exploreMapButton.click();
            await driver.pause(3000);

            scooters = await fetchScooterCoordinates();

            // const credentials = getCredentials(ENV, USER);

            // await PageObjects.login({
            //     username: credentials.username,
            //     password: credentials.password,
            // });

            const targetScooter = findFelyxScooter(scooters);

            await AppiumHelpers.setLocationAndRestartAppFotLocationPermissionOffTest(
                targetScooter.coordinates.longitude,
                targetScooter.coordinates.latitude,
            );
            await driver.pause(5000);

            //await PageObjects.clickAccountButton();
            await PageObjects.accountButton.waitForDisplayed({
                timeout: 3000,
            });
        } catch (error) {
            console.log("Popup not found or already handled:", error);
        }
    });

    it("should display key navigation elements on the main screen", async () => {
        const testId = "357faf65-b266-417b-bd0d-cc3596cffebc";
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            // Handle location permissions
            const allowForegroundPermissionBtn = await driver.$(
                "id:com.android.permissioncontroller:id/permission_allow_foreground_only_button",
            );
            await expect(allowForegroundPermissionBtn).toBeDisplayed();
            await allowForegroundPermissionBtn.click();

            // Verify filter button is displayed
            await expect(PageObjects.assetFilterToggle).toBeDisplayed();

            // Check for map root element
            await expect(PageObjects.mapRoot).toBeDisplayed();

            // Verify bottom navigation menu items
            await PageObjects.planTripBtn.waitForExist();

            await PageObjects.promosBtn.waitForExist();

            //click PLAN TRIP button to verify taxi and public transport options

            await PageObjects.planTripBtn.click();

            //scroll to bottom
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
                            y: 1300,
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

            await PageObjects.grabTaxiButton.waitForEnabled();
            await PageObjects.publicTransportButton.waitForEnabled();
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

    it("verify Log in to claim button on Promos screen that leads to login page", async () => {
        const testId = "f0beea49-25aa-45a3-8e02-8042d94d98a3";
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            await PageObjects.promosBtn.waitForExist();

            //click PLAN TRIP button to verify taxi and public transport options

            await PageObjects.promosBtn.click();

            await driver.pause(1000);

            //get a promo notification
            const gotPromo = await driver.$(
                '-android uiautomator:new UiSelector().text("Got a promo code?")',
            );
            await expect(gotPromo).toBeDisplayed();

            //tap Log in to claim button to go to login page
            const logInToClaimBtn = await driver.$(
                '-android uiautomator:new UiSelector().text("Log in to claim")',
            );
            await expect(logInToClaimBtn).toBeDisplayed();
            await logInToClaimBtn.click();

            //verify Sign up button to check that we are on login page
            const signUpBtn = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Sign up")',
            );
            await expect(signUpBtn).toBeDisplayed();
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
        const testId = "785c3575-e331-4b27-933c-54f78fcbceb3";
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            await expect(PageObjects.homeHelpButton).toBeDisplayed();
            await driver.pause(2000);
            await PageObjects.homeHelpButton.click();

            // Verify screen header
            await expect(PageObjects.supportScreenHeader).toBeDisplayed();
            await PageObjects.supportScreenHeader.waitForDisplayed({
                timeout: 4000,
            });

            // Verify tabs
            await expect(PageObjects.supportFaqTab).toBeDisplayed();
            await expect(PageObjects.supportChatTab).toBeDisplayed();
            await expect(PageObjects.supportAboutTab).toBeDisplayed();
            /*

            const where = await driver.$(
                '-android uiautomator:new UiSelector().text("Where")',
            );
            await expect(where).toBeDisplayed();
            */

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
                // "Do you want to take a break while on the go? Switch the e-bike to 'parking mode' at a small fee per minute. The e-bike will be turned off, but remains reserved for you.",
                // "Flexible travel",
                // "Enjoy the freedom to stop wherever you want, while your e-bike waits for you safely."
            ];

            for (const text of contentElements) {
                const element = await driver.$(
                    `-android uiautomator:new UiSelector().text("${text}")`,
                );
                await expect(element).toBeDisplayed();
            }

            // Get window size
            const { width, height } = await driver.getWindowSize();

            for (let i = 0; i < 2; i++) {
                await driver.pause(2000);
                await driver.executeScript("mobile: scrollGesture", [
                    {
                        left: width / 2,
                        top: height * 0.2,
                        width: width * 0.85,
                        height: height * 0.4,
                        direction: "down",
                        percent: 0.9,
                    },
                ]);
                await driver.pause(3000);
            }

            const contentElements2 = [
                "Enjoy the freedom to stop wherever you want, while your e-bike waits for you safely.",
                "End ride",
                "End your ride only within the service area, indicated by green in the app.",
                "Park neatly",
                "Make sure the e-bike is parked correctly before you end the ride in the app.",
                "Driving in the city",
                "With e-bikes, you can ride and park almost anywhere in the city within designated zones to keep the public roads accessible.",
            ];

            for (const text of contentElements2) {
                const element2 = await driver.$(
                    `-android uiautomator:new UiSelector().text("${text}")`,
                );
                await expect(element2).toBeDisplayed();
            }

            for (let i = 0; i < 2; i++) {
                await driver.pause(2000);
                await driver.executeScript("mobile: scrollGesture", [
                    {
                        left: width / 2,
                        top: height * 0.1,
                        width: width * 0.8,
                        height: height * 0.7,
                        direction: "down",
                        percent: 0.9,
                    },
                ]);
                await driver.pause(3000);
            }

            await driver.pause(2000);
            await driver.executeScript("mobile: scrollGesture", [
                {
                    left: width / 2,
                    top: 0,
                    width: 0,
                    height: height * 0.9, //height of scrolling area
                    direction: "down",
                    percent: 2,
                },
            ]);
            await driver.pause(1000);

            const contentElements4 = [
                "Follow the rules",
                "Always respect local traffic rules and ensure a safe and responsible ride.",
            ];

            for (const text of contentElements4) {
                const element4 = await driver.$(
                    `-android uiautomator:new UiSelector().text("${text}")`,
                );
                await expect(element4).toBeDisplayed();
            }

            // go to chat tab
            await PageObjects.supportChatTab.click();
            await driver.pause(2000);

            await expect(PageObjects.openChatButton).toBeDisplayed();
            await PageObjects.openChatButton.click();

            //send test message to chat
            await expect(PageObjects.chatInputField).toBeDisplayed();
            //await expect(textField).toBeDisplayed();
            await PageObjects.chatInputField.addValue("test");
            await driver.pause(2000);

            //click on send button
            await expect(PageObjects.chatSendButton).toBeDisplayed();
            await PageObjects.chatSendButton.click();
            await driver.pause(1000);

            //check if message was sent
            const messageCheck = await driver.$(
                `-android uiautomator:new UiSelector().text("test")`,
            );
            await expect(messageCheck).toBeDisplayed();

            //if the message is sent then after seeing "test" you should see welcome message again: "Start typing here")`);
            await expect(PageObjects.chatInputField).toBeDisplayed();

            //back from chat

            await driver.back();

            //go to about tab
            await PageObjects.supportAboutTab.click();
            await driver.pause(2000);

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

            //Scroll to bottom
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

            await driver.pause(6000);

            //test the text after scrolling
            const text1 = await driver.$(
                '-android uiautomator:new UiSelector().text("The solution")',
            );
            await expect(text1).toBeDisplayed();

            const text2 = await driver.$(
                '-android uiautomator:new UiSelector().text("One app for all rides simplifies travel and cuts the clutter. Shift from owning to sharing.")',
            );
            await expect(text2).toBeDisplayed();

            const text3 = await driver.$(
                '-android uiautomator:new UiSelector().text("We\'re shaping a better world.")',
            );
            await expect(text3).toBeDisplayed();

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

            //Scroll to bottom
            await driver.pause(3000);


            await driver.performActions([
                {
                    type: "pointer",
                    id: "finger4",
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
                            y: 100,
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

            await driver.performActions([
                {
                    type: "pointer",
                    id: "finger4",
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
                            y: 10,
                        },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

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

    it("should display all key account screen elements", async () => {
        const testId = "fc11c3a5-b6d4-484d-ba45-5cd9ad7716d0";
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            await PageObjects.accountButton.waitForDisplayed({ timeout: 3000 });
            await PageObjects.accountButton.click();
            await driver.pause(2000);

            // Verify LOGIN and REGISTER button
            await expect(PageObjects.loginButton).toBeDisplayed();
            await expect(PageObjects.registerButton).toBeDisplayed();

            // Verify listed menu options
            await expect(PageObjects.languageButton).toBeDisplayed();
            await expect(PageObjects.mapThemeSettingsButton).toBeDisplayed();
            await expect(PageObjects.supportButton).toBeDisplayed();
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
        const testId = "8fddd25c-4166-48c3-bbb5-b53008a6c36b";
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            await PageObjects.accountButton.waitForDisplayed({ timeout: 3000 });
            await PageObjects.accountButton.click();
            await driver.pause(2000);

            // Click on Map theme settings option
            await PageObjects.mapThemeSettingsButton.click();
            await driver.pause(2000);

            // Verify header elements
            const backButton = await driver.$("~back_button");
            await expect(backButton).toBeDisplayed();

            const headerTitle = await driver.$(
                '-android uiautomator:new UiSelector().text("Map theme settings")',
            );
            await expect(headerTitle).toBeDisplayed();

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
        const testId = "e5c72f00-fb50-45e9-a197-12c1c2c771ce";
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            //await PageObjects.clickAccountButton();
            await PageObjects.accountButton.waitForDisplayed({ timeout: 3000 });
            await PageObjects.accountButton.click();
            await driver.pause(2000);

            // Click on Language option to navigate to language screen
            await PageObjects.languageButton.click();
            await driver.pause(2000);

            // Verify header elements
            const backButton = await driver.$("~back_button");
            await expect(backButton).toBeDisplayed();

            const headerTitle = await driver.$(
                '-android uiautomator:new UiSelector().text("Language")',
            );
            await expect(headerTitle).toBeDisplayed();

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

            // Verify Support section header
            await expect(PageObjects.supportButton).toBeDisplayed();

            // Verify Privacy & Legal section
            await expect(PageObjects.privacyLegalButton).toBeDisplayed();

            // Verify Login button
            await expect(PageObjects.loginButton).toBeDisplayed();

            // Verify sign up button
            await expect(PageObjects.registerButton).toBeDisplayed();
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

    it("should go to login page after choosing asset and click bottom button", async () => {
        const testId = "7404b64e-33bb-4dfc-8524-0aadeb575f6a";
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            // scooters = await fetchScooterCoordinates();

            // // const credentials = getCredentials(ENV, USER);

            // // await PageObjects.login({
            // //     username: credentials.username,
            // //     password: credentials.password,
            // // });

            // const targetScooter = findFelyxScooter(scooters);

            // await AppiumHelpers.setLocationAndRestartApp(
            //     targetScooter.coordinates.longitude,
            //     targetScooter.coordinates.latitude,
            // );
            // await driver.pause(5000);

            // //await PageObjects.clickAccountButton();
            // await PageObjects.accountButton.waitForDisplayed({
            //     timeout: 3000,
            // });

            await driver.pause(5000);
            const { centerX, centerY } = await getScreenCenter();
            await driver.pause(4000);

            // get center of the map (not the center of the screen!)
            const { x, y } = await AppiumHelpers.getMapCenterCoordinates();
            await driver.pause(3000);

            // CLick on map center (operator located in the center of the map)
            await driver.execute("mobile: clickGesture", { x, y });
            await driver.pause(2000);

            //verify Pricing
            await PageObjects.felyxPriceInfo();

            //tap "Log In To Start Ride" button
            // const gotoLoginScreenButton = await driver.$(
            //     '-android uiautomator:new UiSelector().text("Register To Unlock Discount")',
            // );
            const gotoLoginScreenButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Log In To Start Ride")',
            );
            await expect(gotoLoginScreenButton).toBeDisplayed();
            await gotoLoginScreenButton.click();

            // verify that we are on login page
            const forgotPasswordButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Forgot password?")',
            );
            await expect(forgotPasswordButton).toBeDisplayed();
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
