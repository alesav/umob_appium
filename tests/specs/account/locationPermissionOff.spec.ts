import { execSync } from "child_process";
import submitTestRun from "../../helpers/SendResults.js";
import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import AppiumHelpers from "../../helpers/AppiumHelpers.js";
import {
    getCredentials,
    executeTest,
    fetchScooterCoordinates,
    ENV,
    USER,
} from "../../helpers/TestHelpers.js";
import PostHogHelper from "../../helpers/PosthogHelper.js";
import umobPageObjectsPage from "../../pageobjects/umobPageObjects.page.js";

console.log("=== DEBUG ENV ===");
console.log("POSTHOG_API_KEY exists:", !!process.env.POSTHOG_API_KEY);
console.log("POSTHOG_API_KEY length:", process.env.POSTHOG_API_KEY?.length);
console.log(
    "POSTHOG_API_KEY first 10 chars:",
    process.env.POSTHOG_API_KEY?.substring(0, 10),
);
console.log("=================");
const posthog = new PostHogHelper();

/////////////////////////////////////////////////////////////////////////////////

describe("Test for checking disability of aplication features when location permission is off", () => {
    let scooters;

    before(async () => {
        scooters = await fetchScooterCoordinates();

        const credentials = getCredentials(ENV, USER);

        await PageObjects.loginWithoutLocationPermission({
            username: credentials.username,
            password: credentials.password,
        });

        const targetScooter = scooters.find(
            (scooter) => scooter.id === "UmobMock:ROTTERDAM_MOPED_1",
        );

        await AppiumHelpers.setLocationAndRestartAppFotLocationPermissionOffTest(
            targetScooter.coordinates.longitude,
            targetScooter.coordinates.latitude,
        );

        // Check Account is presented
    });

    beforeEach(async () => {
        await driver.activateApp("com.umob.umob");
        // Wait for screen to be loaded
    });

    it("Verify that features are not working without location permission and shown when permission is given", async () => {
        const testId = "eac001f8-72ed-445d-ba76-8fd3f650c9e9";

        await executeTest(testId, async () => {
            //click Yes
            const noButton = await driver.$(
                '-android uiautomator:new UiSelector().text("NO")',
            );
            await expect(noButton).toBeDisplayed();
            await noButton.click();

            // Check for Enable location button
            const enableLocationButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Enable location")',
            );
            await expect(enableLocationButton).toBeDisplayed();

            // Verify navigation menu item
            await PageObjects.planTripBtn.waitForExist();

            //click PLAN TRIP button to verify nearby assets is on display
            await PageObjects.planTripBtn.click();

            await driver.pause(5000);

            //scroll to be everything on display

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
            await driver.pause(3000);

            //verify scan vehicle button
            await PageObjects.scanVehicleButton.waitForDisplayed();

            //verify enable location button to book taxi
            const buttonForTaxi = await driver.$(
                '-android uiautomator:new UiSelector().text("Enable location to book")',
            );
            await expect(buttonForTaxi).toBeDisplayed();

            //verify enable location button to book public transport
            const buttonForPubTrans = await driver.$(
                '-android uiautomator:new UiSelector().text("Enable location to buy a ticket")',
            );
            await expect(buttonForPubTrans).toBeDisplayed();

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
                            y: height / 3 + 100,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        { type: "pointerMove", duration: 1000, x: 160, y: 10 },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);
            await driver.pause(2000);

            //verify enable location button for nearby assets
            const buttonForNearbyAssets = await driver.$(
                '-android uiautomator:new UiSelector().text("Enable location to find")',
            );
            await expect(buttonForNearbyAssets).toBeDisplayed();
            await buttonForNearbyAssets.click();

            //verify popup with location permission
            // const locationPermission = await driver.$(
            //     '-android uiautomator:new UiSelector().text("Location permission")',
            // );
            // await expect(locationPermission).toBeDisplayed();

            //click Yes
            // const yesButton = await driver.$(
            //     '-android uiautomator:new UiSelector().text("YES")',
            // );
            // await expect(yesButton).toBeDisplayed();
            // await yesButton.click();

            //handle standard while using the app permission
            await umobPageObjectsPage.whileUsingAppPermission.waitForDisplayed();
            await umobPageObjectsPage.whileUsingAppPermission.click();

            //verify that refresh button for nearby assets feature exists
            const refresh = await driver.$(
                '-android uiautomator:new UiSelector().text("Refresh")',
            );
            await expect(refresh).toBeDisplayed();

            //verify buy a ticket button for public transport
            const buyTicket = await driver.$(
                '-android uiautomator:new UiSelector().text("Buy a ticket")',
            );
            await expect(buyTicket).toBeDisplayed();

            //verify book now button for taxi
            const bookButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Book now")',
            );
            await expect(bookButton).toBeDisplayed();
            await driver.pause(2000);

            // Verify PostHog event
            try {
                /*  // 1. get email and event name on $screen even
                const loggedinEvent = await posthog.waitForEvent(
                    {
                        eventName: "Logged In",
                        email: "new12@gmail.com",
                    },
                    {
                        maxRetries: 10,
                        retryDelayMs: 3000,
                        searchLimit: 20,
                        maxAgeMinutes: 5,
                    },
                );
*/
                const nearbyEvent = await posthog.waitForEvent(
                    {
                        eventName: "Nearby vehicles loaded",
                        personEmail: "new12@gmail.com",
                    },
                    {
                        maxRetries: 10,
                        retryDelayMs: 3000,
                        searchLimit: 20,
                        maxAgeMinutes: 5,
                    },
                );
                // If we got here, event was found with all criteria matching
                posthog.printEventSummary(nearbyEvent);

                // now assertions for each event

                // verify event name
                expect(nearbyEvent.event).toBe("Nearby vehicles loaded");
                //expect(loggedinEvent.event).toBe("Logged In");

                //verify email for each even
                expect(nearbyEvent.person?.is_identified).toBe(true);
                expect(nearbyEvent.person?.properties?.email).toBe(
                    "new12@gmail.com",
                );

                // expect(loggedinEvent.person?.is_identified).toBe(true);
                // expect(loggedinEvent.person?.properties?.email).toBe(
                //     "new12@gmail.com",
                // );

                // logs
                //console.log("✅ Event name:", loggedinEvent.id);
                console.log("✅ Event name:", nearbyEvent.id);
            } catch (e) {
                console.error("PostHog validation failed:", e);
                throw e;
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
