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

const posthog = new PostHogHelper();

/////////////////////////////////////////////////////////////////////////////////

describe("Test for the Nearby Assets feature", () => {
    let scooters;

    before(async () => {
        scooters = await fetchScooterCoordinates();

        const credentials = getCredentials(ENV, USER);

        await PageObjects.login({
            username: credentials.username,
            password: credentials.password,
        });

        const targetScooter = scooters.find(
            (scooter) => scooter.id === "UmobMock:ROTTERDAM_MOPED_1",
        );

        await AppiumHelpers.setLocationAndRestartApp(
            targetScooter.coordinates.longitude,
            targetScooter.coordinates.latitude,
        );

        // Check Account is presented
    });

    beforeEach(async () => {
        await driver.activateApp("com.umob.umob");
        // Wait for screen to be loaded
    });

    it("Verify that nearby assets feature is shown", async () => {
        const testId = "ad2a8dc9-1b8b-44ab-b7c4-9f24066a360b";

        await executeTest(testId, async () => {
            // Check for map root element
            const mapRoot = await driver.$(
                '-android uiautomator:new UiSelector().resourceId("map_root")',
            );
            await expect(mapRoot).toBeDisplayed();

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

            //verify that nearby feature exists in general
            const instruction = await driver.$(
                '-android uiautomator:new UiSelector().text("Nearby assets")',
            );
            await expect(instruction).toBeDisplayed();

            //verify that refresh button for nearby assets feature exists
            const refresh = await driver.$(
                '-android uiautomator:new UiSelector().text("Refresh")',
            );
            await expect(instruction).toBeDisplayed();

            //verify that there is no sentence NO VEHICLES NEARBY RIGHT NOW

            const errorMessages = [
                "No vehicles nearby right now",
                "NO VEHICLES NEARBY",
                "No vehicles nearby",
            ];

            for (const message of errorMessages) {
                const errorElement = await driver.$(
                    `-android uiautomator:new UiSelector().textContains("${message}")`,
                );

                try {
                    const isDisplayed = await errorElement.isDisplayed();
                    if (isDisplayed) {
                        throw new Error(
                            `Feature is not working: Found error message "${message}"`,
                        );
                    }
                } catch (elementError) {
                    // if element is not found then it is good, we continue our checks
                    if (
                        elementError.message.includes("Feature is not working")
                    ) {
                        throw elementError; // this is our error - we are going further
                    }
                }
            }

            console.log(
                "✓ All checks passed - nearby assets feature is working correctly",
            );

            //verify that distance to the most close asset is displayed
            const distance = await driver.$(
                '-android uiautomator:new UiSelector().textContains("meter")',
            );
            await expect(distance).toBeDisplayed();

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
