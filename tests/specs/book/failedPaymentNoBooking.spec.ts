import { execSync } from "child_process";
import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import submitTestRun from "../../helpers/SendResults.js";
import AppiumHelpers from "../../helpers/AppiumHelpers.js";
import {
    fetchScooterCoordinates,
    findFelyxScooter,
    type Scooter,
} from "../../helpers/ScooterCoordinates.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to get fixed credentials for the new16 user from credentials file
function getCredentials() {
    try {
        const credentialsPath = path.resolve(
            __dirname,
            "../../../config/credentials.json",
        );
        const credentials = JSON.parse(
            fs.readFileSync(credentialsPath, "utf8"),
        );

        // Always use the new16 user from test environment
        if (!credentials.test || !credentials.test.new16) {
            throw new Error("new16 user not found in test environment");
        }

        // Return the new16 user credentials
        return {
            username: credentials.test.new16.username,
            password: credentials.test.new16.password,
        };
    } catch (error) {
        console.error("Error loading credentials:", error);
        throw new Error("Failed to load credentials configuration");
    }
}

const API_URL = "https://backend-test.umobapp.com/api/tomp/mapboxmarkers";
const AUTH_TOKEN =
    "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkFGNkFBNzZCMUFEOEI4QUJCQzgzRTAzNjBEQkQ4MkYzRjdGNDE1MDMiLCJ4NXQiOiJyMnFuYXhyWXVLdThnLUEyRGIyQzhfZjBGUU0iLCJ0eXAiOiJhdCtqd3QifQ.eyJpc3MiOiJodHRwczovL2JhY2tlbmQtdGVzdC51bW9iYXBwLmNvbS8iLCJleHAiOjE3NDUxNTA0MjgsImlhdCI6MTczNzM3NDQyOCwiYXVkIjoidU1vYiIsInNjb3BlIjoib2ZmbGluZV9hY2Nlc3MgdU1vYiIsImp0aSI6ImQyM2Y2ZDY1LTQ2ZjEtNDcxZi1hMGRmLTUyOWU3ZmVlYTdiYSIsInN1YiI6IjY1NzAxOWU2LWFiMGItNGNkNS1hNTA0LTgwMjUwNmZiYzc0YyIsInVuaXF1ZV9uYW1lIjoibmV3NUBnbWFpbC5jb20iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJuZXc1QGdtYWlsLmNvbSIsImdpdmVuX25hbWUiOiJOZXc1IiwiZmFtaWx5X25hbWUiOiJOZXc1IiwiZW1haWwiOiJuZXc1QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoiRmFsc2UiLCJwaG9uZV9udW1iZXIiOiIrMzE5NzAxMDU4MDM0MSIsInBob25lX251bWJlcl92ZXJpZmllZCI6IlRydWUiLCJvaV9wcnN0IjoidU1vYl9BcHBfT3BlbklkZGljdCIsIm9pX2F1X2lkIjoiYTIyZWNjMjYtMWE4ZC01NDRkLThiN2ItM2ExNzk1YzJjMzRjIiwiY2xpZW50X2lkIjoidU1vYl9BcHBfT3BlbklkZGljdCIsIm9pX3Rrbl9pZCI6IjAwMjQ4OWYyLTAzODYtZTcxZC0xNjljLTNhMTc5NWMyYzQ2MSJ9.s9l5ytG-9PwwF3CVBMJKSG0pkZ5ZBKJrJ5AzNnbYzzuo88qfg1uqv0jE1B7qriZ4qnqoCVxCHkgRxouEGIvWpOezfvSeYlik-GoJAQa20Qf8KkEpa8JTXUXImDKkrmSa7b_4mlP3m1-D8mormBxHhRh4W0O9WreMh3TD3c2NAUNM7Ecq5-3Ax9DAM4lJf-KZYVH1uEb3kD3hFcx68wFNqU5EAjJHZjC0FcA3REJDIfMRoNilpZcNHz4Y8oejcpO2P9I19g3mr0ZDdIIs-HyzASiQr1Mfj6c6lV72HKMpfmlSMO1Iy9juxAPE_wjhXcpi7F9pn3zZmGNdDcukf_feWg";

const fetchScooterCoordinates = async () => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: AUTH_TOKEN,
                "Accept-Language": "en",
                "X-Requested-With": "XMLHttpRequest",
                "App-Version": "1.22959.3.22959",
                "App-Platform": "android",
            },
            body: JSON.stringify({
                regionId: "",
                stationId: "",
                longitude: 4.4744301,
                latitude: 51.9155956,
                radius: 2000,
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
    let scooters;
    before(async () => {
        const credentials = getCredentials();

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
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            await driver.pause(7000);

            await AppiumHelpers.setLocationAndRestartApp(
                targetScooter.coordinates.longitude,
                targetScooter.coordinates.latitude,
            );

            await driver.pause(5000);

            // Get screen dimensions for click positioning
            const { width, height } = await driver.getWindowSize();
            const centerX = Math.round(width / 2);

            //Click on middle of the screen
            await AppiumHelpers.clickCenterOfScreen();

            await driver.pause(7000);

            // get window size
            const windowSize = await driver.getWindowSize();
            const screenWidth = windowSize.width;
            const screenHeight = windowSize.height;

            // calculate points for scroll
            // starting point: a little bit more down from the screen center
            const startX = Math.round(screenWidth / 3);
            const startY = Math.round(screenHeight * 0.85);

            // end point: upper side of the screen
            const endX = startX; // save the same position for X for vertical scroll
            const endY = Math.round(screenHeight * 0.2); // about 20% from upper side of the screen

            // scroll
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

            // scroll
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

            // scroll
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
        await driver.terminateApp("com.umob.umob");
    });
});
