import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import AppiumHelpers from "../../helpers/AppiumHelpers.js";
import {
    getCredentials,
    executeTest,
    getScreenCenter,
} from "../../helpers/TestHelpers.js";
import {
    fetchScooterCoordinates,
    findFelyxScooter,
    type Scooter,
} from "../../helpers/ScooterCoordinates.js";
import PostHogHelper from "../../helpers/PosthogHelper.js";

const posthog = new PostHogHelper();

// Get environment and user from env variables or use defaults
const ENV = process.env.TEST_ENV || "test";
const USER = process.env.TEST_USER || "new18";

// Filter mopeds and stations
const applyFilters = async () => {
    // Click ? icon
    await driver
        .$(
            '-android uiautomator:new UiSelector().resourceId("home_asset_filter_toggle")',
        )
        .waitForEnabled();

    await driver
        .$(
            '-android uiautomator:new UiSelector().resourceId("home_asset_filter_toggle")',
        )
        .click();

    // Click Moped to unselect it
    await driver
        .$('-android uiautomator:new UiSelector().text("Scooter")')
        .waitForEnabled();

    await driver
        .$('-android uiautomator:new UiSelector().text("Scooter")')
        .click();

    // Click Bike to unselect it
    await driver
        .$('-android uiautomator:new UiSelector().text("Bike")')
        .waitForEnabled();

    await driver
        .$('-android uiautomator:new UiSelector().text("Bike")')
        .click();

    // Click Openbaar vervoer to unselect it
    await driver
        .$('-android uiautomator:new UiSelector().text("Openbaar vervoer")')
        .waitForEnabled();

    await driver
        .$('-android uiautomator:new UiSelector().text("Openbaar vervoer")')
        .click();

    // Minimize drawer
    await driver
        .$(
            '-android uiautomator:new UiSelector().className("com.horcrux.svg.PathView").instance(10)',
        )
        .click();
};

/////////////////////////////////////////////////////////////////////////////////
describe("Reserve Felyx Test", () => {
    let scooters: Scooter[];

    before(async () => {
        scooters = await fetchScooterCoordinates();

        const credentials = getCredentials(ENV, USER);

        await PageObjects.login({
            username: credentials.username,
            password: credentials.password,
        });

        const targetScooter = findFelyxScooter(scooters);

        await AppiumHelpers.setLocationAndRestartApp(
            targetScooter.coordinates.longitude,
            targetScooter.coordinates.latitude,
        );
        await driver.pause(3000);
    });

    beforeEach(async () => {
        await driver.activateApp("com.umob.umob");
        // Wait for main screen to be loaded
    });

    it("Positive Scenario: Reserve Felyx moped", async () => {
        const testId = "4820ba79-0e15-4d1e-88f7-61e204392233";

        await executeTest(testId, async () => {
            await driver.pause(5000);

            const { centerX, centerY } = await getScreenCenter();
            await driver.pause(4000);

            // get center of the map (not the center of the screen!)
            const { x, y } = await AppiumHelpers.getMapCenterCoordinates();
            await driver.pause(3000);

            // CLick on map center (operator located in the center of the map)
            await driver.execute("mobile: clickGesture", { x, y });

            //Click on middle of the map (working solution with -180 on coordinates)
            //await AppiumHelpers.clickCenterOfScreen();
            /*
            //tap on center screen
            await driver.performActions([
                {
                    type: "pointer",
                    id: "finger1",
                    parameters: { pointerType: "touch" },
                    actions: [
                        {
                            type: "pointerMove",
                            duration: 0,
                            x: centerX,
                            y: centerY - 200,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

            await driver.pause(2000);
            // clearing the state of action
            await driver.releaseActions();

            await driver.pause(4000);
            */

            // INDIVIDUAL SCROLL (DO NOT MODIFY)
            const { width, height } = await driver.getWindowSize();
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
                            y: height * 0.7,
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
            await driver.pause(2000);

            //verify name of Check operator
            const felyxOperatorName = await driver.$(
                '-android uiautomator:new UiSelector().text("FELYX")',
            );
            await expect(felyxOperatorName).toBeDisplayed();

            const felyxPlateNumber = await driver.$(
                '-android uiautomator:new UiSelector().text("FAKE-E856MN")',
            );
            await expect(felyxPlateNumber).toBeDisplayed();

            //verify Pricing
            await PageObjects.felyxPriceInfo();

            // Click Reserve button
            await PageObjects.reserveButton.waitForDisplayed();
            await driver.pause(7000);

            await PageObjects.reserveButton.click();

            // Click cancel button
            await PageObjects.cancelButton.waitForDisplayed();

            await driver.pause(7000);

            await PageObjects.cancelButton.click();

            await driver.pause(4000);

            // Wait for Home screen to be loaded
            await PageObjects.clickAccountButton();
            await driver.pause(2000);

            await PageObjects.personalInfoButton.waitForDisplayed();
            await driver.pause(2000);

            // Verify PostHog events
            try {
                // Get Transporter Ride Started event
                const trsEvent = await posthog.waitForEvent(
                    {
                        eventName: "Transporter Ride Started",
                    },
                    {
                        maxRetries: 10,
                        retryDelayMs: 3000,
                        searchLimit: 20,
                        maxAgeMinutes: 5,
                    },
                );

                // Get Transporter Clicked event
                const tcEvent = await posthog.waitForEvent(
                    {
                        eventName: "Transporter Clicked",
                    },
                    {
                        maxRetries: 10,
                        retryDelayMs: 3000,
                        searchLimit: 20,
                        maxAgeMinutes: 5,
                    },
                );

                // Get Transporter Reservation Created event
                const trcEvent = await posthog.waitForEvent(
                    {
                        eventName: "Transporter Reservation Created",
                    },
                    {
                        maxRetries: 10,
                        retryDelayMs: 3000,
                        searchLimit: 20,
                        maxAgeMinutes: 5,
                    },
                );

                // Get Transporter Ride Verified event
                const trvEvent = await posthog.waitForEvent(
                    {
                        eventName: "Transporter Ride Verified",
                    },
                    {
                        maxRetries: 10,
                        retryDelayMs: 3000,
                        searchLimit: 20,
                        maxAgeMinutes: 5,
                    },
                );

                // If we got here, event was found with all criteria matching
                posthog.printEventSummary(trsEvent);
                posthog.printEventSummary(tcEvent);
                posthog.printEventSummary(trcEvent);
                posthog.printEventSummary(trvEvent);

                // Verify Transporter Ride Started event
                expect(trsEvent.event).toBe("Transporter Ride Started");
                expect(trsEvent.person?.is_identified).toBe(true);
                expect(trsEvent.person?.properties?.email).toBe(
                    "new18@gmail.com",
                );

                // Verify Transporter Clicked event
                expect(tcEvent.event).toBe("Transporter Clicked");
                expect(tcEvent.person?.is_identified).toBe(true);
                expect(tcEvent.person?.properties?.email).toBe(
                    "new18@gmail.com",
                );

                // Verify Transporter Reservation Created event
                expect(trcEvent.event).toBe("Transporter Reservation Created");
                expect(trcEvent.person?.is_identified).toBe(true);
                expect(trcEvent.person?.properties?.email).toBe(
                    "new18@gmail.com",
                );

                // Verify Transporter Ride Verified event
                expect(trvEvent.event).toBe("Transporter Ride Verified");
                expect(trvEvent.person?.is_identified).toBe(true);
                expect(trvEvent.person?.properties?.email).toBe(
                    "new18@gmail.com",
                );
            } catch (posthogError) {
                console.error("PostHog verification failed:", posthogError);
                throw posthogError;
            }
        });
    });

    afterEach(async () => {
        await driver.terminateApp("com.umob.umob");
    });
});
