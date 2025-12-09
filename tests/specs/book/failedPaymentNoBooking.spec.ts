import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import AppiumHelpers from "../../helpers/AppiumHelpers.js";
import {
    getCredentials,
    executeTest,
    fetchScooterCoordinates,
} from "../../helpers/TestHelpers.js";

/////////////////////////////////////////////////////////////////////////////////

let targetScooter;

describe("verify that it is not possible to book a bike if you didnt pay for the previous ride", () => {
    let scooters;

    before(async () => {
        // Always use the new16 user from test environment for this specific test
        const credentials = getCredentials("test", "new16");

        scooters = await fetchScooterCoordinates();

        await PageObjects.login({
            username: credentials.username,
            password: credentials.password,
        });

        targetScooter = scooters.find((scooter) =>
            scooter.id.includes("UmobMock"),
        );

        await AppiumHelpers.setLocationAndRestartApp(
            targetScooter.coordinates.longitude,
            targetScooter.coordinates.latitude,
        );
    });

    beforeEach(async () => {
        await driver.activateApp("com.umob.umob");
    });

    it("unsuccesful bike booking with unpaid previous ride. Booking attempt leads to payment screen", async () => {
        const testId = "5d1a3c41-80da-4423-8a01-d2437b068ad2";

        await executeTest(testId, async () => {
            await driver.pause(7000);

            await AppiumHelpers.setLocationAndRestartApp(
                targetScooter.coordinates.longitude,
                targetScooter.coordinates.latitude,
            );

            await driver.pause(5000);

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
