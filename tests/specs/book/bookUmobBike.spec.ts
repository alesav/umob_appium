import { execSync } from "child_process";
import submitTestRun from "../../helpers/SendResults.js";
import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import AppiumHelpers from "../../helpers/AppiumHelpers.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
    getCredentials,
    getScreenCenter,
    fetchScooterCoordinates,
    ENV,
    isAccept,
    isTest,
} from "../../helpers/TestHelpers.js";

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEST_USER = "new62";

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
        .$('-android uiautomator:new UiSelector().text("E-moped")')
        .waitForEnabled();

    await driver
        .$('-android uiautomator:new UiSelector().text("E-moped")')
        .click();

    // Click Scooter to unselect it
    await driver
        .$('-android uiautomator:new UiSelector().text("Scooter")')
        .waitForEnabled();

    await driver
        .$('-android uiautomator:new UiSelector().text("Scooter")')
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

// fetchScooterCoordinates is now imported from TestHelpers.js
/////////////////////////////////////////////////////////////////////////////////
describe("Mocked Umob Bikes (with constant errors) trying Booking Tests", () => {
    let scooters;

    before(async () => {
        // Fetch scooter coordinates before running tests
        scooters = await fetchScooterCoordinates();

        const credentials = getCredentials(ENV, TEST_USER);

        // await PageObjects.login(credentials);
        await PageObjects.login({
            username: credentials.username,
            password: credentials.password,
        });

        const targetScooter = scooters.find(
            (scooter) =>
                scooter.id === "UmobMock:QZGKL2BP2CI25_ROTTERDAM_EBIKE",
        );

        if (!targetScooter) {
            throw new Error("Target scooter 'UmobMock:QZGKL2BP2CI25_ROTTERDAM_EBIKE' not found in API response");
        }

        await AppiumHelpers.setLocationAndRestartApp(
            targetScooter.coordinates.longitude,
            targetScooter.coordinates.latitude,
        );

        // Check Account button is present
    });

    beforeEach(async () => {
        await driver.activateApp("com.umob.umob");
        // Wait for screen to be loaded
    });

    ////////////////////////////////////////////////////////////////////////////////
    it("Positive Scenario: Book Mocked Umob Bike with ID UmobMock:QZGKL2BP2CI25_ROTTERDAM_EBIKE", async () => {
        const testId = "bcc7fe09-7a38-4ae4-a952-35020cd08cf7";
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            await driver.pause(5000);

            const { centerX, centerY } = await getScreenCenter();

            //Click on middle of the screen
            //await AppiumHelpers.clickCenterOfScreen();

            // get center of the map (not the center of the screen!)
            const { x, y } = await AppiumHelpers.getMapCenterCoordinates();
            await driver.pause(3000);

            // CLick on map center (operator located in the center of the map)
            await driver.execute("mobile: clickGesture", { x, y });

            //choose card payment
            // await driver
            //     .$(
            //         '-android uiautomator:new UiSelector().textContains("multi")',
            //     )
            //     .waitForEnabled();

            // await driver
            //     .$(
            //         '-android uiautomator:new UiSelector().textContains("multi")',
            //     )
            //     .click();

            // await driver
            //     .$('-android uiautomator:new UiSelector().text("No voucher")')
            //     .click();

            // Click Start - ONLY IN TEST ENVIRONMENT
            if (isTest) {
                await PageObjects.startTripButton.waitForDisplayed();
                await PageObjects.startTripButton.click();

                // Click End Trip
                await PageObjects.endTripButton.waitForDisplayed();
                await PageObjects.endTripButton.click();
            } else {
                console.log(">>> SKIPPING REAL BOOKING: Environment is NOT 'test'");
                return; // End test here for Accept/Prod
            }

            await driver.pause(10000);

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
                            y: 500,
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

            // Click GOT IT
            await PageObjects.gotItButton.waitForDisplayed();
            await PageObjects.gotItButton.click();

            // Click not now button
            // const notNowButton = await driver.$(
            //     '-android uiautomator:new UiSelector().text("NOT NOW")',
            // );
            // await expect(notNowButton).toBeDisplayed();
            // await notNowButton.click();

            //check main screen is displayed
            await driver.pause(2000);

            //click on account button
            await PageObjects.accountButton.waitForDisplayed();

            //navigate to my rides
            await PageObjects.navigateToMyRides();

            //verify ride details (address)
            const firstTicketItem = await driver.$(
                '//android.view.ViewGroup[@content-desc="undefined-AccountListItemButton"][1]',
            );
            await expect(firstTicketItem).toBeDisplayed();
            await firstTicketItem.click();

            const headerTitle = await driver.$(
                '//*[@resource-id="undefined-header-title"]',
            );
            await expect(headerTitle).toBeDisplayed();
            await expect(await headerTitle.getText()).toBe("Ride");

            const providerElement = await driver.$('//*[@text="UmobMock"]');
            await expect(providerElement).toBeDisplayed();

            const route = await driver.$(
                '-android uiautomator:new UiSelector().text("Route")',
            );
            await expect(route).toBeDisplayed();

            //verifying that there re starting and departure addresses
            // const addressCount = await driver.$$(
            //     '-android uiautomator:new UiSelector().textContains("Weena 10, 3012 CM Rotterdam, Netherlands")',
            // ).length;
            const addressCount = await driver.$$(
                '-android uiautomator:new UiSelector().textContains("Coolsingel 5, 3012 AA Rotterdam, Netherlands")',
            ).length;
            expect(addressCount).toBe(2);

            const travelCostElement = await driver.$(
                '//*[@text="Travel cost"]',
            );
            await expect(travelCostElement).toBeDisplayed();

            const totalAmountElement = await driver.$(
                '//*[@text="Total amount"]',
            );
            await expect(totalAmountElement).toBeDisplayed();

            const paymentsHeaderElement = await driver.$(
                '//*[@text="Payments"]',
            );
            await expect(paymentsHeaderElement).toBeDisplayed();

            await driver.executeScript("mobile: scrollGesture", [
                {
                    left: 100,
                    top: 1000,
                    width: 200,
                    height: 800,
                    direction: "down",
                    percent: 100.0,
                },
            ]);

            const statusElement = await driver.$('//*[@text="Completed"]');
            await expect(statusElement).toBeDisplayed();

            await driver
                .$('-android uiautomator:new UiSelector().text("Got It")')
                .waitForEnabled();

            await driver
                .$('-android uiautomator:new UiSelector().text("Got It")')
                .click();
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

    ////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////////////////////////////
    /*
        it("Negative Scenario: Trying to Book Bike with Geo OUTSIDE OF SERVICE AREA (UmobMock:QZGKL2BP2CI35_ROTTERDAM_EBIKE)", async () => {
            const testId = "bc02c0ce-4c5f-4649-8f7f-d0f16ee79e86";
            // Send results
            let testStatus = "Pass";
            let screenshotPath = "";
            let testDetails = "";
            let error = null;
    
            try {
                const targetScooter = scooters.find(
                    (scooter) =>
                        scooter.id === "UmobMock:QZGKL2BP2CI35_ROTTERDAM_EBIKE",
                );
    
                console.log("All scooter:", JSON.stringify(scooters));
    
                console.log("Target scooter:", JSON.stringify(targetScooter));
    
    
                // Set location to specific scooter coordinates
                await AppiumHelpers.setLocationAndRestartApp(
                    targetScooter.coordinates.longitude,
                    targetScooter.coordinates.latitude,
                );
                await driver.pause(5000);
    
                // Filter not needed results
                //await applyFilters();
    
                const { centerX, centerY } = await getScreenCenter();
    
    
                //Click on middle of the screen
                await AppiumHelpers.clickCenterOfScreen();
    
                // test notification about service area
                await driver
                    .$(
                        '-android uiautomator:new UiSelector().text("Outside of service area!")',
                    )
                    .waitForDisplayed();
    
                // Click Cancel
                await driver
                    .$('-android uiautomator:new UiSelector().text("CANCEL")')
                    .waitForEnabled();
    
                await driver
                    .$('-android uiautomator:new UiSelector().text("CANCEL")')
                    .click();
    
                // Check Account button is present
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
    */
    ////////////////////////////////////////////////////////////////////////////////

    afterEach(async () => {
        await driver.terminateApp("com.umob.umob");
    });
});
