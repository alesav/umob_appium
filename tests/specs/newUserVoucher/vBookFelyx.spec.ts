import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import AppiumHelpers from "../../helpers/AppiumHelpers.js";
import {
    getCredentials,
    executeTest,
    getApiConfig,
} from "../../helpers/TestHelpers.js";
import {
    findFelyxScooter,
    type Scooter,
} from "../../helpers/ScooterCoordinates.js";
import PostHogHelper from "../../helpers/PosthogHelper.js";

const posthog = new PostHogHelper();

const ENV = process.env.TEST_ENV || "test";
const USER = process.env.TEST_USER || "new67";

// Fetch scooter coordinates from API (uses default coordinates from ScooterCoordinates.ts)
const fetchScooterCoordinates = async (): Promise<Scooter[]> => {
    const apiConfig = getApiConfig(ENV);

    try {
        const response = await fetch(apiConfig.apiUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: apiConfig.authToken,
                "Accept-Language": "en",
                "X-Requested-With": "XMLHttpRequest",
                "App-Version": "1.23316.3.23316",
                "App-Platform": "android",
            },
            body: JSON.stringify({
                regionId: "",
                stationId: "",
                longitude: 4.4743720514863075,
                latitude: 51.91731373726902,
                radius: 101.6137310913994,
                zoomLevel: 15.25,
                subOperators: [],
                assetClasses: [23],
                operatorAvailabilities: [2, 1, 3],
                showEmptyStations: false,
                skipCount: 0,
                sorting: "",
                defaultMaxResultCount: 10,
                maxMaxResultCount: 1000,
                maxResultCount: 10,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched scooter coordinates:", JSON.stringify(data));
        return data.assets;
    } catch (error) {
        console.error("Error fetching scooter coordinates:", error);
        throw error;
    }
};

describe("Felyx Booking Test with unlimited multi voucher", () => {
    let scooters: Scooter[];

    before(async () => {
        // Fetch scooter coordinates before running tests
        scooters = await fetchScooterCoordinates();

        const credentials = getCredentials(ENV, USER);
        await PageObjects.login({
            username: credentials.username,
            password: credentials.password,
        });

        const targetScooter = findFelyxScooter(scooters);

        // Set location to specific scooter coordinates
        await AppiumHelpers.setLocationAndRestartApp(
            targetScooter.coordinates.longitude,
            targetScooter.coordinates.latitude,
        );
        await driver.pause(3000);
    });

    beforeEach(async () => {
        await driver.activateApp("com.umob.umob");
    });

    it("Book Felyx moped with multi voucher", async () => {
        const testId = "9a8a6f87-2ccd-42c9-9676-b1bd0b8b27a3";

        await executeTest(testId, async () => {
            await driver.pause(2000);

            // Click on middle of the screen
            await AppiumHelpers.clickCenterOfScreen();
            await driver.pause(3000);

            // Verify that Euro symbol is displayed
            const euroSymbol = await driver.$(
                '-android uiautomator:new UiSelector().textContains("€")',
            );
            await expect(euroSymbol).toBeDisplayed();

            //verify pricing
            await PageObjects.felyxPriceInfo();

            // Verify that limitless multi user's voucher is visible
            const voucher = await driver.$(
                '-android uiautomator:new UiSelector().textContains("multi")',
            );
            await expect(voucher).toBeDisplayed();

            // Verify that payment card is displayed
            const selectPayment = await driver.$(
                '-android uiautomator:new UiSelector().text("**** **** 1115")',
            );
            await expect(selectPayment).toBeDisplayed();

            // Verify start trip button is enabled AND CLICK
            await PageObjects.startTripButton.waitForEnabled();
            await driver.pause(3000);
            await PageObjects.startTripButton.click();
            await driver.pause(8000);

            // Verify grab helmet header
            const grabHelmet = await driver.$(
                '-android uiautomator:new UiSelector().text("Grab the helmet")',
            );
            await expect(grabHelmet).toBeDisplayed();

            // Verify announcement
            const announcement = await driver.$(
                '-android uiautomator:new UiSelector().textContains("A helmet is mandatory for this scooter.")',
            );
            await expect(announcement).toBeDisplayed();

            // Verify instruction
            const instruction = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Open the top case by pressing the red button")',
            );
            await expect(instruction).toBeDisplayed();

            // Verify open helmet case button
            // const openCase = await driver.$(
            //     '-android uiautomator:new UiSelector().text("Open Helmet Case")',
            // );
            // await expect(openCase).toBeDisplayed();

            // Verify continue button
            await driver.pause(2000);
            await expect(PageObjects.continueButton).toBeDisplayed();
            await PageObjects.continueButton.click();

            // Verify warning message
            const helmetWarning = await driver.$(
                '-android uiautomator:new UiSelector().text("Helmet on, safety first!")',
            );
            await expect(helmetWarning).toBeDisplayed();

            // Verify continue2 button
            await driver.pause(2000);
            await expect(PageObjects.continue2Button).toBeDisplayed();
            await PageObjects.continue2Button.click();

            // Verify pause button
            await PageObjects.pauseButton.waitForDisplayed();
            await driver.pause(10000);

            // Verify report issue button
            await PageObjects.reportButton.waitForDisplayed();

            //mark arrival button
            await PageObjects.markArrivalButton.waitForDisplayed();
            await PageObjects.markArrivalButton.click();

            // end trip should be tapped in some UI when switching between UI
            // await PageObjects.endTripButton.waitForDisplayed();
            // await PageObjects.endTripButton.click();

            // continue instead of end trip button should be tapped in some UI when switching between UI
            await PageObjects.continueInsteadEndBtn.waitForDisplayed();
            await PageObjects.continueInsteadEndBtn.click();

            // Verify announcement for return helmet
            const helmetBack = await driver.$(
                '-android uiautomator:new UiSelector().text("Return the helmet")',
            );
            await expect(helmetBack).toBeDisplayed();

            // Verify helmet putting back instruction
            const instruction2 = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Open the top case by pressing the red button")',
            );
            await expect(instruction2).toBeDisplayed();

            // Click 3rd continue button
            await PageObjects.continue3Button.waitForDisplayed();
            await PageObjects.continue3Button.click();

            // Verify helmet return message
            const helmetBackmsg = await driver.$(
                '-android uiautomator:new UiSelector().text("Return helmet before you end ride")',
            );
            await expect(helmetBackmsg).toBeDisplayed();

            // Click 4th continue button
            await PageObjects.continue4Button.waitForDisplayed();
            await PageObjects.continue4Button.click();

            // Click End Trip
            // await PageObjects.endTripButton.waitForDisplayed();
            // await PageObjects.endTripButton.click();
            // await driver.pause(3000);

            /*
            // Verify announcement for return helmet
            const helmetBack = await driver.$(
                '-android uiautomator:new UiSelector().text("Return the helmet")',
            );
            await expect(helmetBack).toBeDisplayed();

            // Verify helmet putting back instruction
            const instruction2 = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Open the top case by pressing the red button")',
            );
            await expect(instruction2).toBeDisplayed();

            // Verify open case button for the helmet
            const helmetButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Open Helmet Case")',
            );
            await expect(helmetButton).toBeDisplayed();
            await driver.pause(3000);

            // Verify and click continue button
            const continueB2 = await driver.$(
                '-android uiautomator:new UiSelector().text("Continue")',
            );
            await expect(continueB2).toBeDisplayed();
            await continueB2.click();
            await driver.pause(5000);
            */

            // Allow permissions for take a photo
            await expect(PageObjects.whileUsingAppPermission).toBeDisplayed();
            await PageObjects.whileUsingAppPermission.click();
            await driver.pause(5000);

            // Verify parking photo header
            const parkingHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Parking photo required")',
            );
            await expect(parkingHeader).toBeDisplayed();

            // Verify photo instruction
            const photoInstruction = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Take a photo of your vehicle to end your ride")',
            );
            await expect(photoInstruction).toBeDisplayed();
            /*
            // Take a picture in old UI
            const photoButton = await driver.$(
                '-android uiautomator:new UiSelector().resourceId("buttonContainer")',
            );
            await expect(photoButton).toBeDisplayed();
            await driver.pause(2000);
            await photoButton.click();
            await driver.pause(4000);
            */

            //take a picture in new UI
            const photoButton = await driver.$(
                '-android uiautomator:new UiSelector().className("com.horcrux.svg.CircleView").instance(2)',
            );
            await photoButton.click();

            // Verify confirmation for using a picture
            const pictureHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Use this picture?")',
            );
            await expect(pictureHeader).toBeDisplayed();

            // Verify parking rules
            const parkingRules = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Please check if the vehicle is parked")',
            );
            await expect(parkingRules).toBeDisplayed();

            // Verify retake picture button
            const retakeButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Retake")',
            );
            await expect(retakeButton).toBeDisplayed();

            // Verify use picture button
            const useButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Use Picture")',
            );
            await expect(useButton).toBeDisplayed();
            await driver.pause(2000);
            await useButton.click();
            await driver.pause(2000);

            // Click got it button
            await PageObjects.gotItButton.waitForDisplayed();
            await PageObjects.gotItButton.click();

            // Verify that main map screen is displayed
            await PageObjects.clickAccountButton();

            // Verify that my account screen is displayed
            await expect(PageObjects.myRidesButton).toBeDisplayed();

            // Click on my rides and tickets
            await driver.pause(2000);
            await PageObjects.myRidesButton.click();

            // Verify that payment is visible in my rides and tickets screen and it is 0 Euro
            const lastRide1 = await driver.$(
                '-android uiautomator:new UiSelector().textContains("€0")',
            );
            await expect(lastRide1).toBeDisplayed();

            /*
            // Verify PostHog events
            try {
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
                posthog.printEventSummary(loggedInEvent);
                posthog.printEventSummary(loggedOutEvent);

                // Verify Logged In event
                expect(loggedInEvent.event).toBe("Logged In");
                expect(loggedInEvent.person?.is_identified).toBe(true);

                // Verify Logged Out event
                expect(loggedOutEvent.event).toBe("Logged Out");
                expect(loggedOutEvent.person?.is_identified).toBe(true);
            } catch (posthogError) {
                console.error("PostHog verification failed:", posthogError);
                throw posthogError;
            }
                */
        });
    });

    afterEach(async () => {
        await driver.terminateApp("com.umob.umob");
    });
});
