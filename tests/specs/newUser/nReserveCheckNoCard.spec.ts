import { execSync } from "child_process";
import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import submitTestRun from "../../helpers/SendResults.js";
import AppiumHelpers from "../../helpers/AppiumHelpers.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to get fixed credentials for the User from credentials file
function getCredentials() {
    try {
        const credentialsPath = path.resolve(
            __dirname,
            "../../../config/credentials.json",
        );
        const credentials = JSON.parse(
            fs.readFileSync(credentialsPath, "utf8"),
        );

        // Always use the newUser from test environment
        if (!credentials.test || !credentials.test.newUser) {
            throw new Error("newUser not found in test environment");
        }

        // Return the User credentials
        return {
            username: credentials.test.newUser.username,
            password: credentials.test.newUser.password,
        };
    } catch (error) {
        console.error("Error loading credentials:", error);
        throw new Error("Failed to load credentials configuration");
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////

const API_URL = "https://backend-test.umobapp.com/api/tomp/mapboxmarkers";
const AUTH_TOKEN =
    "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkFGNkFBNzZCMUFEOEI4QUJCQzgzRTAzNjBEQkQ4MkYzRjdGNDE1MDMiLCJ4NXQiOiJyMnFuYXhyWXVLdThnLUEyRGIyQzhfZjBGUU0iLCJ0eXAiOiJhdCtqd3QifQ.eyJpc3MiOiJodHRwczovL2JhY2tlbmQtdGVzdC51bW9iYXBwLmNvbS8iLCJleHAiOjE3NDUxNTA0MjgsImlhdCI6MTczNzM3NDQyOCwiYXVkIjoidU1vYiIsInNjb3BlIjoib2ZmbGluZV9hY2Nlc3MgdU1vYiIsImp0aSI6ImQyM2Y2ZDY1LTQ2ZjEtNDcxZi1hMGRmLTUyOWU3ZmVlYTdiYSIsInN1YiI6IjY1NzAxOWU2LWFiMGItNGNkNS1hNTA0LTgwMjUwNmZiYzc0YyIsInVuaXF1ZV9uYW1lIjoibmV3NUBnbWFpbC5jb20iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJuZXc1QGdtYWlsLmNvbSIsImdpdmVuX25hbWUiOiJOZXc1IiwiZmFtaWx5X25hbWUiOiJOZXc1IiwiZW1haWwiOiJuZXc1QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoiRmFsc2UiLCJwaG9uZV9udW1iZXIiOiIrMzE5NzAxMDU4MDM0MSIsInBob25lX251bWJlcl92ZXJpZmllZCI6IlRydWUiLCJvaV9wcnN0IjoidU1vYl9BcHBfT3BlbklkZGljdCIsIm9pX2F1X2lkIjoiYTIyZWNjMjYtMWE4ZC01NDRkLThiN2ItM2ExNzk1YzJjMzRjIiwiY2xpZW50X2lkIjoidU1vYl9BcHBfT3BlbklkZGljdCIsIm9pX3Rrbl9pZCI6IjAwMjQ4OWYyLTAzODYtZTcxZC0xNjljLTNhMTc5NWMyYzQ2MSJ9.s9l5ytG-9PwwF3CVBMJKSG0pkZ5ZBKJrJ5AzNnbYzzuo88qfg1uqv0jE1B7qriZ4qnqoCVxCHkgRxouEGIvWpOezfvSeYlik-GoJAQa20Qf8KkEpa8JTXUXImDKkrmSa7b_4mlP3m1-D8mormBxHhRh4W0O9WreMh3TD3c2NAUNM7Ecq5-3Ax9DAM4lJf-KZYVH1uEb3kD3hFcx68wFNqU5EAjJHZjC0FcA3REJDIfMRoNilpZcNHz4Y8oejcpO2P9I19g3mr0ZDdIIs-HyzASiQr1Mfj6c6lV72HKMpfmlSMO1Iy9juxAPE_wjhXcpi7F9pn3zZmGNdDcukf_feWg";

const getScreenCenter = async () => {
    // Get screen dimensions
    const { width, height } = await driver.getWindowSize();

    return {
        centerX: Math.round(width / 2),
        centerY: Math.round(height / 2),
        screenWidth: width,
        screenHeight: height,
    };
};

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
                longitude: 4.47395,
                latitude: 51.921705,
                radius: 200,
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

describe("Trying to Reserve Check by a New User Without a Card", () => {
    let scooters;

    before(async () => {
        const credentials = getCredentials();

        // Fetch scooter coordinates before running tests
        scooters = await fetchScooterCoordinates();

        // await PageObjects.login(credentials);
        await PageObjects.login({
            username: credentials.username,
            password: credentials.password,
        });

        const targetScooter = scooters.find((scooter) =>
            scooter.id.includes("Check"),
        );

        console.log("All scooter:", JSON.stringify(scooters));

        console.log("Target scooter:", JSON.stringify(targetScooter));

        await AppiumHelpers.setLocationAndRestartApp(
            targetScooter.coordinates.longitude,
            targetScooter.coordinates.latitude,
        );
        await driver.pause(3000);

        //await driver.terminateApp("com.umob.umob");
    });

    beforeEach(async () => {
        await driver.activateApp("com.umob.umob");
        // Wait for screen to be loaded
    });

    ////////////////////////////////////////////////////////////////////////////////
    it("New user is trying to reserve Check moped without a card Check:b76ce2d0-7fe5-4914-9d1b-580928859efd", async () => {
        const testId = "0fe2a0b7-708f-4a27-98e2-f62dfbf77bed";
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            const { centerX, centerY } = await getScreenCenter();

            //Click on middle of the screen
            await AppiumHelpers.clickCenterOfScreen();

            await driver.pause(6000);

            //verify that new user vaucher is visible
            const vaucher = await driver.$(
                '-android uiautomator:new UiSelector().text("New User Check")',
            );
            await expect(vaucher).toBeDisplayed();

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
            await driver.pause(3000);

            // Click Reserve
            await driver
                .$('-android uiautomator:new UiSelector().text("RESERVE")')
                .waitForEnabled();

            await driver.pause(5000);

            const button = await driver.$(
                '-android uiautomator:new UiSelector().text("RESERVE")',
            );
            await button.click();
            await driver.pause(3000);

            //verify header and offer for choosing payment method
            const paymentHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("PAYMENT METHODS")',
            );
            await expect(paymentHeader).toBeDisplayed();

            const cards = await driver.$(
                '-android uiautomator:new UiSelector().text("Cards")',
            );
            await expect(cards).toBeDisplayed();

            const bancontactCard = await driver.$(
                '-android uiautomator:new UiSelector().text("Bancontact card")',
            );
            await expect(bancontactCard).toBeDisplayed();

            await driver.pause(2000);
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

            //there is no google pay in github actions emulated mobile device
            //const googlePay = await driver.$('-android uiautomator:new UiSelector().text("Google Pay")');
            //await expect(googlePay).toBeDisplayed();

            const payPal = await driver.$(
                '-android uiautomator:new UiSelector().text("PayPal")',
            );
            await expect(payPal).toBeDisplayed();

            const closeBtn = await driver.$("accessibility id:Close");
            await expect(closeBtn).toBeDisplayed();
            await closeBtn.click();
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
