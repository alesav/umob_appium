import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import AppiumHelpers from "../../helpers/AppiumHelpers.js";
import {
    getCredentials,
    executeTest,
    fetchScooterCoordinates,
    getApiConfig,
} from "../../helpers/TestHelpers.js";

import {
    findFelyxScooter,
    type Scooter,
} from "../../helpers/ScooterCoordinates.js";
import PostHogHelper from "../../helpers/PosthogHelper.js";

const posthog = new PostHogHelper();

const TEST_USER = "new16";

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

/////////////////////////////////////////////////////////////////////////////////

let targetScooter;

describe("verify that it is not possible to book a bike if you didnt pay for the previous ride", () => {
    let scooters: Scooter[];

    before(async () => {
        // Fetch scooter coordinates before running tests
        scooters = await fetchScooterCoordinates();

        const credentials = getCredentials(ENV, TEST_USER);
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

    it("unsuccesful bike booking with unpaid previous ride. Booking attempt leads to payment screen", async () => {
        const testId = "5d1a3c41-80da-4423-8a01-d2437b068ad2";

        await executeTest(testId, async () => {
            await driver.pause(7000);

            // await AppiumHelpers.setLocationAndRestartApp(
            //     targetScooter.coordinates.longitude,
            //     targetScooter.coordinates.latitude,
            //  );

            // await driver.pause(5000);

            // Click on middle of the screen
            //await AppiumHelpers.clickCenterOfScreen();

            // get center of the map (not the center of the screen!)
            const { x, y } = await AppiumHelpers.getMapCenterCoordinates();
            await driver.pause(3000);

            // CLick on map center (operator located in the center of the map)
            await driver.execute("mobile: clickGesture", { x, y });

            await driver.pause(4000);

            // get window size
            const windowSize = await driver.getWindowSize();
            const screenWidth = windowSize.width;
            const screenHeight = windowSize.height;

            // calculate points for scroll - INDIVIDUAL SCROLL (DO NOT MODIFY)
            // starting point: a little bit more down from the screen center
            const startX = Math.round(screenWidth / 3);
            const startY = Math.round(screenHeight * 0.85);

            // end point: upper side of the screen
            const endX = startX; // save the same position for X for vertical scroll
            const endY = Math.round(screenHeight * 0.2); // about 20% from upper side of the screen

            // scroll - INDIVIDUAL SCROLL (DO NOT MODIFY)
            await driver.performActions([
                {
                    type: "pointer",
                    id: "finger1",
                    parameters: { pointerType: "touch" },
                    actions: [
                        {
                            type: "pointerMove",
                            duration: 0,
                            x: startX,
                            y: startY,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        {
                            type: "pointerMove",
                            duration: 1000,
                            x: endX,
                            y: endY,
                        },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);
            await driver.pause(5000);

            //verify that there is notification about unpaid ride
            const failNotification = await driver.$(
                'android=new UiSelector().textContains("You have a failed ride payment.")',
            );
            await expect(failNotification).toBeDisplayed();

            // Click start trip button
            await driver.pause(5000);
            await PageObjects.startTripButton.waitForDisplayed();
            await driver.pause(2000);

            await PageObjects.startTripButton.click();
            await driver.pause(3000);

            // scroll - INDIVIDUAL SCROLL (DO NOT MODIFY)
            await driver.performActions([
                {
                    type: "pointer",
                    id: "finger1",
                    parameters: { pointerType: "touch" },
                    actions: [
                        {
                            type: "pointerMove",
                            duration: 0,
                            x: startX,
                            y: startY * 0.7,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        {
                            type: "pointerMove",
                            duration: 1000,
                            x: endX,
                            y: endY,
                        },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

            //verify that we are on payment detail screen for the previous unpaid ride
            const paymentDetail = await driver.$(
                'android=new UiSelector().text("Payment detail")',
            );
            await expect(paymentDetail).toBeDisplayed();

            //verify that payment status failed
            const status = await driver.$(
                'android=new UiSelector().textContains("Failed")',
            );
            await expect(status).toBeDisplayed();

            // scroll - INDIVIDUAL SCROLL (DO NOT MODIFY)
            await driver.performActions([
                {
                    type: "pointer",
                    id: "finger1",
                    parameters: { pointerType: "touch" },
                    actions: [
                        {
                            type: "pointerMove",
                            duration: 0,
                            x: startX,
                            y: startY * 0.7,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        {
                            type: "pointerMove",
                            duration: 1000,
                            x: endX,
                            y: endY,
                        },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);

            //verify pay now button
            const payNow = await driver.$(
                'android=new UiSelector().textContains("Pay Now")',
            );
            await expect(payNow).toBeDisplayed();
        });
    });

    afterEach(async () => {
        await driver.terminateApp("com.umob.umob");
    });
});
