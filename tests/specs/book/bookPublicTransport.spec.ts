import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import AppiumHelpers from "../../helpers/AppiumHelpers.js";
import { execSync } from "child_process";
import PostHogHelper from "../../helpers/PosthogHelper.js";
import { getCredentials, executeTest, ENV } from "../../helpers/TestHelpers.js";

const posthog = new PostHogHelper();
const TEST_USER = "new56";

describe("Book Public Transport", () => {
    before(async () => {
        const credentials = getCredentials(ENV, TEST_USER);

        await PageObjects.login({
            username: credentials.username,
            password: credentials.password,
        });

        execSync(
            "adb shell pm grant com.umob.umob android.permission.ACCESS_FINE_LOCATION",
        );
        execSync(
            "adb shell pm grant com.umob.umob android.permission.ACCESS_COARSE_LOCATION",
        );

        const latitude = 51.9155956;
        const longitude = 4.4744301;

        await AppiumHelpers.setLocationAndRestartApp(longitude, latitude);

        // Activate app once at the beginning
        await driver.activateApp("com.umob.umob");
        await driver.pause(7000);
    });

    it("should display all key elements on Plan Your Trip screen for Public Transport", async () => {
        const testId = "ef526412-4497-470b-bcf8-1854b13613c4";

        await executeTest(testId, async () => {
            await PageObjects.planTripBtn.waitForExist();
            await PageObjects.planTripBtn.click();

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
            await driver.pause(2000);

            // Click to choose public transport
            await PageObjects.publicTransportButton.waitForDisplayed();
            await PageObjects.publicTransportButton.click();

            // Verify screen header
            const screenHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Plan your trip")',
            );
            await expect(screenHeader).toBeDisplayed();

            // Verify departure and destination input section
            const departureDestinationLabel = await driver.$(
                '-android uiautomator:new UiSelector().text("Enter starting point & destination")',
            );
            await expect(departureDestinationLabel).toBeDisplayed();

            // Verify destination input
            const destinationInput = await driver.$(
                '-android uiautomator:new UiSelector().text("Destination")',
            );
            await expect(destinationInput).toBeDisplayed();

            // Verify time switch buttons
            const departAtButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Depart at")',
            );
            const arriveByButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Arrive by")',
            );
            await expect(departAtButton).toBeDisplayed();
            await expect(arriveByButton).toBeDisplayed();

            // Verify date input
            const dateInput = await driver.$(
                '-android uiautomator:new UiSelector().text("Today")',
            );
            await expect(dateInput).toBeDisplayed();

            // Verify time input
            const timeInput = await driver.$(
                '-android uiautomator:new UiSelector().text("Now")',
            );
            await expect(timeInput).toBeDisplayed();

            // Verify train class section
            const selectClassLabel = await driver.$(
                '-android uiautomator:new UiSelector().text("Select class (for trains)")',
            );
            await expect(selectClassLabel).toBeDisplayed();

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
                            x: 160,
                            y: height / 2 + 200,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        { type: "pointerMove", duration: 1000, x: 160, y: 10 },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

            // Verify train class switch buttons
            const secondClassButton = await driver.$(
                '-android uiautomator:new UiSelector().text("2nd class")',
            );
            const firstClassButton = await driver.$(
                '-android uiautomator:new UiSelector().text("1st class")',
            );
            await expect(secondClassButton).toBeDisplayed();
            await expect(firstClassButton).toBeDisplayed();

            // Verify Continue button
            const continueButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Continue")',
            );
            await expect(continueButton).toBeDisplayed();

            // Verify Help button
            const helpButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Help")',
            );
            await expect(helpButton).toBeDisplayed();
        });
    });

    it("should put in destination and book a ticket for Public Transport", async () => {
        const testId = "25c6b504-c751-443e-9092-cc33a650d19c";

        await executeTest(testId, async () => {
            // INDIVIDUAL SCROLL (DO NOT MODIFY)
            const { width, height } = await driver.getWindowSize();
            await driver.performActions([
                {
                    type: "pointer",
                    id: "finger1",
                    parameters: { pointerType: "touch" },
                    actions: [
                        { type: "pointerMove", duration: 0, x: 400, y: 300 },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        { type: "pointerMove", duration: 1000, x: 100, y: 800 },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

            // Click on destination and text
            const el1 = await driver.$(
                '-android uiautomator:new UiSelector().className("android.widget.EditText").instance(1)',
            );
            await el1.addValue("MA AIRPORT HOTEL");
            await driver.pause(4000);

            // First get the element's location and size
            const location = await el1.getLocation();
            const size = await el1.getSize();

            // Set location to specific scooter coordinates
            execSync(
                `adb shell input tap ${location.x + 100}  ${location.y + size.height + 70}`,
            );

            const chooseFromList = await driver.$(
                '-android uiautomator:new UiSelector().textContains("MA AIRPORT HOTEL")',
            );
            await expect(chooseFromList).toBeDisplayed();

            // Verify the continue button becomes enabled after adding destination
            const continuePress = await driver.$(
                '-android uiautomator:new UiSelector().text("Continue")',
            );
            await expect(continuePress).toBeDisplayed();
            await continuePress.click();
            await driver.pause(10000);
        });
    });

    it("should display all key elements and pick up the route", async () => {
        const testId = "a9cd327a-1c6c-450e-b299-48656dac1663";

        await executeTest(testId, async () => {
            // Check key elements on route selection screen
            const routeHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Travel Options")',
            );
            await expect(routeHeader).toBeDisplayed();

            // Check destination address is visible
            const address = await driver.$(
                '-android uiautomator:new UiSelector().text("MA AIRPORT HOTEL Adrianahoeve 10 2131 MN Hoofddorp")',
            );
            await expect(address).toBeDisplayed();

            // Select first route by clicking euro symbol
            const firstRoutePrice = await driver.$(
                "(//android.widget.TextView[contains(@text, '€')])[1]",
            );
            await expect(firstRoutePrice).toBeDisplayed();
            await firstRoutePrice.click();
            await driver.pause(2000);
        });
    });

    it("should check screen and buy e-ticket", async () => {
        const testId = "b7149cf2-3c8f-40d2-ac3b-3f4c4362fa89";

        await executeTest(testId, async () => {
            // Check header is displayed
            const travelDetails = await driver.$(
                '-android uiautomator:new UiSelector().text("Travel details")',
            );
            await expect(travelDetails).toBeDisplayed();

            // Check data for payment card is displayed
            const card = await driver.$(
                '-android uiautomator:new UiSelector().text("**** **** 1115")',
            );
            await expect(card).toBeDisplayed();

            await driver.pause(2000);

            // Scroll to bottom - INDIVIDUAL SCROLL (DO NOT MODIFY)
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
                            x: 160,
                            y: height / 2 + 100,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        { type: "pointerMove", duration: 1000, x: 160, y: 10 },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);
            await driver.pause(6000);

            // Check back button is displayed
            const backButton = await driver.$("accessibility id:back_button");
            await expect(backButton).toBeDisplayed();
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

            // Check destination address is visible
            const address = await driver.$(
                '-android uiautomator:new UiSelector().text("MA AIRPORT HOTEL Adrianahoeve 10 2131 MN Hoofddorp")',
            );
            await expect(address).toBeDisplayed();

            // Check "buy e-tickets" button is enabled and click it
            const buyButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Buy E-Tickets")',
            );
            await buyButton.click();
            await driver.pause(7000);
        });
    });

    it("final step of confirmation for buying a ticket", async () => {
        const testId = "2923bdca-4d57-4962-94d7-09907c0068d3";

        await executeTest(testId, async () => {
            // Check key elements are displayed (header)
            const header = await driver.$(
                '-android uiautomator:new UiSelector().text("Buy e-tickets")',
            );
            await expect(header).toBeDisplayed();

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
                            x: 160,
                            y: height / 3 + 110,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        {
                            type: "pointerMove",
                            duration: 1000,
                            x: 160,
                            y: height / 3,
                        },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);
            await driver.pause(2000);

            // Verify that exactly 3 tickets are displayed
            const fromLabels = await driver.$$(
                '-android uiautomator:new UiSelector().text("From")',
            );
            expect(fromLabels.length).toBe(3);

            // Alternative approach: count ticket containers by their partial resource-id pattern
            // const ticketContainers = await driver.$$(
            //     '-android uiautomator:new UiSelector().resourceIdMatches("ticket-TranzerUmob:.*-container")',
            // );
            // expect(ticketContainers.length).toBe(3);

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
                            y: height * 0.85,
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

            // Check key elements are displayed (conditions,travel costs)
            const travelCosts = await driver.$(
                '-android uiautomator:new UiSelector().text("Travel costs")',
            );
            await expect(travelCosts).toBeDisplayed();

            // Check key elements are displayed (total amount and service fee)
            const serviceFee = await driver.$(
                '-android uiautomator:new UiSelector().text("Service fee")',
            );
            const totalAmount = await driver.$(
                '-android uiautomator:new UiSelector().text("Total amount")',
            );
            await expect(serviceFee).toBeDisplayed();
            await expect(totalAmount).toBeDisplayed();

            // Check key elements are displayed (back button)
            const backButton = await driver.$("accessibility id:back_button");
            await expect(backButton).toBeDisplayed();

            // Check key elements are displayed (agreement text: "i agree to the sharing...")
            const agreementText = await driver.$(
                "~I agree to the sharing of personal data required for purchasing e-tickets with carriers and Tranzer, and the ticketing conditions of umob and carriers.",
            );
            await expect(agreementText).toBeDisplayed();

            // Click to the checking box
            const checkbox = await driver.$(
                "accessibility id:terms-and-conditions-checkbox",
            );
            await expect(checkbox).toBeDisplayed();
            await checkbox.click();

            // Click on enabled confirm button and wait 10seconds
            const confirmButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Confirm")',
            );
            await expect(confirmButton).toBeDisplayed();
            await confirmButton.click();
            await driver.pause(15000);
        });
    });

    it("check key elements, scroll and click show e-tickets", async () => {
        const testId = "bf5c25a6-a863-4635-820f-5459703ccbe2";

        await executeTest(testId, async () => {
            // Checking header is displayed
            const headerBooking = await driver.$(
                '-android uiautomator:new UiSelector().text("Booking complete")',
            );
            await headerBooking.waitForDisplayed({ timeout: 15000 });
            await expect(headerBooking).toBeDisplayed();

            // Scroll to bottom - INDIVIDUAL SCROLL (DO NOT MODIFY)
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
                            x: 160,
                            y: height / 2 + 200,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        { type: "pointerMove", duration: 1000, x: 160, y: 10 },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);
            await driver.pause(7000);

            // Check text "make sure you download your..."
            const assureText = await driver.$(
                '-android uiautomator:new UiSelector().text("Make sure you download your tickets at least 15 mins before the trip. You can always find your tickets in My Rides & Tickets.")',
            );
            await expect(assureText).toBeDisplayed();

            // Check destination address is visible
            const address = await driver.$(
                '-android uiautomator:new UiSelector().text("MA AIRPORT HOTEL Adrianahoeve 10 2131 MN Hoofddorp")',
            );
            await expect(address).toBeDisplayed();

            // Button "show e-tickets" is enabled and click the button
            const showButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Show E-Tickets")',
            );
            await expect(showButton).toBeDisplayed();
            await showButton.click();
            await driver.pause(10000);
        });
    });

    it("check ticket information and click got_it button", async () => {
        const testId = "f8b9d103-0549-434c-ba15-a133b7e806b6";

        await executeTest(testId, async () => {
            // Check header is displayed
            const ticketHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Ticket")',
            );
            await expect(ticketHeader).toBeDisplayed();

            // Check destination address is visible
            const address = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Adrianahoeve 10, 2131 MN Hoofddorp")',
            );
            await expect(address).toBeDisplayed();

            // Check route information using direct text selector
            const fromSection = await driver.$(
                'android=new UiSelector().text("From")',
            );
            await expect(fromSection).toBeDisplayed();

            const toSection = await driver.$(
                'android=new UiSelector().text("To")',
            );
            await expect(toSection).toBeDisplayed();

            // Check valid between section using compound selector
            const validBetweenSection = await driver.$(
                'android=new UiSelector().className("android.widget.TextView").text("Valid between")',
            );
            await expect(validBetweenSection).toBeDisplayed();

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
                            x: 160,
                            y: height / 2 + 200,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        { type: "pointerMove", duration: 1000, x: 160, y: 10 },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);
            await driver.pause(1500);

            // Check vehicle section is displayed
            const vehicleHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Vehicle")',
            );
            await expect(vehicleHeader).toBeDisplayed();

            // Check vehicle type is displayed
            const vehicleType = await driver.$(
                '-android uiautomator:new UiSelector().text("Vehicle type")',
            );
            await expect(vehicleType).toBeDisplayed();

            // Check vehicle index type is displayed
            const vehicleIndexType = await driver.$(
                '-android uiautomator:new UiSelector().text("Public transport")',
            );
            await expect(vehicleIndexType).toBeDisplayed();

            // Check booking number is displayed
            const bookingNo = await driver.$(
                '-android uiautomator:new UiSelector().text("Booking no")',
            );
            await expect(bookingNo).toBeDisplayed();

            // Scroll to bottom - INDIVIDUAL SCROLL (DO NOT MODIFY)
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
                            y: height / 2 + 100,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        { type: "pointerMove", duration: 1000, x: 160, y: 10 },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

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
                            x: 160,
                            y: height / 2 + 100,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        { type: "pointerMove", duration: 1000, x: 160, y: 10 },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

            // Check payment details are displayed
            const travelCost = await driver.$(
                '-android uiautomator:new UiSelector().text("Travel cost")',
            );
            await expect(travelCost).toBeDisplayed();

            const serviceFee = await driver.$(
                '-android uiautomator:new UiSelector().text("Service fee")',
            );
            await expect(serviceFee).toBeDisplayed();

            const totalAmount = await driver.$(
                '-android uiautomator:new UiSelector().text("Total amount")',
            );
            await expect(totalAmount).toBeDisplayed();

            // Click GOT IT button using multiple fallback strategies
            try {
                const gotItButton = await driver.$(
                    'android=new UiSelector().text("Got It").resourceId("ride-details-primary-button-text")',
                );
                await gotItButton.waitForDisplayed({ timeout: 5000 });
                await gotItButton.click();
            } catch (error) {
                // Fallback to content-desc
                const gotItButtonAlt = await driver.$(
                    '[content-desc="ride-details-primary-button"]',
                );
                await gotItButtonAlt.click();
            }

            // Verify PostHog events
            try {
                // Get Public transit button clciked event
                const ptbcEvent = await posthog.waitForEvent(
                    {
                        eventName: "Public transit button clciked",
                    },
                    {
                        maxRetries: 10,
                        retryDelayMs: 3000,
                        searchLimit: 20,
                        maxAgeMinutes: 5,
                    },
                );

                // Get PT Flow Started event
                const ptfsEvent = await posthog.waitForEvent(
                    {
                        eventName: "PT Flow Started",
                    },
                    {
                        maxRetries: 10,
                        retryDelayMs: 3000,
                        searchLimit: 20,
                        maxAgeMinutes: 5,
                    },
                );

                // Get PT Destination Added event
                const ptdaEvent = await posthog.waitForEvent(
                    {
                        eventName: "PT Destination Added",
                    },
                    {
                        maxRetries: 10,
                        retryDelayMs: 3000,
                        searchLimit: 20,
                        maxAgeMinutes: 5,
                    },
                );

                // Get PT Option Chosen event
                const ptdcEvent = await posthog.waitForEvent(
                    {
                        eventName: "PT Option Chosen",
                    },
                    {
                        maxRetries: 10,
                        retryDelayMs: 3000,
                        searchLimit: 20,
                        maxAgeMinutes: 5,
                    },
                );

                // Get PT Checkout Started event
                const ptcsEvent = await posthog.waitForEvent(
                    {
                        eventName: "PT Checkout Started",
                    },
                    {
                        maxRetries: 10,
                        retryDelayMs: 3000,
                        searchLimit: 20,
                        maxAgeMinutes: 5,
                    },
                );

                const pttpEvent = await posthog.waitForEvent(
                    {
                        eventName: "PT Ticket Purchased",
                    },
                    {
                        maxRetries: 10,
                        retryDelayMs: 3000,
                        searchLimit: 20,
                        maxAgeMinutes: 5,
                    },
                );

                // If we got here, event was found with all criteria matching
                posthog.printEventSummary(ptbcEvent);
                posthog.printEventSummary(ptfsEvent);
                posthog.printEventSummary(ptdaEvent);
                posthog.printEventSummary(ptdcEvent);
                posthog.printEventSummary(ptcsEvent);
                posthog.printEventSummary(pttpEvent);

                // Verify Public transit button clciked event
                expect(ptbcEvent.event).toBe("Public transit button clciked");
                expect(ptbcEvent.person?.is_identified).toBe(true);
                expect(ptbcEvent.person?.properties?.email).toBe(
                    "new56@gmail.com",
                );

                // Verify PT Flow Started event
                expect(ptfsEvent.event).toBe("PT Flow Started");
                expect(ptfsEvent.person?.is_identified).toBe(true);
                expect(ptfsEvent.person?.properties?.email).toBe(
                    "new56@gmail.com",
                );

                // Verify PT Destination Added event
                expect(ptdaEvent.event).toBe("PT Destination Added");
                expect(ptdaEvent.person?.is_identified).toBe(true);
                expect(ptdaEvent.person?.properties?.email).toBe(
                    "new56@gmail.com",
                );

                // Verify PT Option Chosen event
                expect(ptdcEvent.event).toBe("PT Option Chosen");
                expect(ptdcEvent.person?.is_identified).toBe(true);
                expect(ptdcEvent.person?.properties?.email).toBe(
                    "new56@gmail.com",
                );

                // Verify PT Checkout Started event
                expect(ptcsEvent.event).toBe("PT Checkout Started");
                expect(ptcsEvent.person?.is_identified).toBe(true);
                expect(ptcsEvent.person?.properties?.email).toBe(
                    "new56@gmail.com",
                );

                // Verify PT Ticket Purchased event
                expect(pttpEvent.event).toBe("PT Ticket Purchased");
                expect(pttpEvent.person?.is_identified).toBe(true);
                expect(pttpEvent.person?.properties?.email).toBe(
                    "new56@gmail.com",
                );
            } catch (posthogError) {
                console.error("PostHog verification failed:", posthogError);
                throw posthogError;
            }
        });
    });

    // terminate the app after all tests
    after(async () => {
        await driver.terminateApp("com.umob.umob");
    });
});
