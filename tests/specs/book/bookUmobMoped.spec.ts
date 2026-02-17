import { execSync } from "child_process";
import submitTestRun from "../../helpers/SendResults.js";
import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import AppiumHelpers from "../../helpers/AppiumHelpers.js";
import { getCredentials, ENV } from "../../helpers/TestHelpers.js";

const TEST_USER = "new35";

///////////////////////////////////////////////////////////////////////////////////////////////////

const API_URL = "https://backend-test.umobapp.com/api/tomp/mapboxmarkers";
const AUTH_TOKEN =
    "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkFGNkFBNzZCMUFEOEI4QUJCQzgzRTAzNjBEQkQ4MkYzRjdGNDE1MDMiLCJ4NXQiOiJyMnFuYXhyWXVLdThnLUEyRGIyQzhfZjBGUU0iLCJ0eXAiOiJhdCtqd3QifQ.eyJpc3MiOiJodHRwczovL2JhY2tlbmQtdGVzdC51bW9iYXBwLmNvbS8iLCJleHAiOjE3NDY2MTAyMTgsImlhdCI6MTczODgzNDIxOCwiYXVkIjoidU1vYiIsInNjb3BlIjoib2ZmbGluZV9hY2Nlc3MgdU1vYiIsImp0aSI6IjE2ZWUzZjRjLTQzYzktNGE3Ni1iOTdhLTYxMGI0NmU0MGM3ZCIsInN1YiI6IjRhNGRkZmRhLTNmMWYtNDEyMS1iNzU1LWZmY2ZjYTQwYzg3MiIsInNlc3Npb25faWQiOiIzNGU4NDZmOC02MmI3LTRiMzgtODkxYS01NjE4NWM4ZDdhOGEiLCJ1bmlxdWVfbmFtZSI6Im5ld0BnbWFpbC5jb20iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJuZXdAZ21haWwuY29tIiwiZ2l2ZW5fbmFtZSI6Ik5ldyIsImZhbWlseV9uYW1lIjoiTmV3IiwiZW1haWwiOiJuZXdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOiJGYWxzZSIsInBob25lX251bWJlciI6IiszMTk3MDEwNTg2NTU2IiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjoiVHJ1ZSIsIm9pX3Byc3QiOiJ1TW9iX0FwcF9PcGVuSWRkaWN0Iiwib2lfYXVfaWQiOiI0ODZkYTI1OS05ZGViLTJmMDQtYmM2OS0zYTE3ZWNjNTY1YTEiLCJjbGllbnRfaWQiOiJ1TW9iX0FwcF9PcGVuSWRkaWN0Iiwib2lfdGtuX2lkIjoiMTQzZGNiNGUtZTFjYi01MmU0LWU5ZWUtM2ExN2VjYzU2NWI5In0.4slYA6XbzRDTNdPJSOmxGlsuetx1IywPojVVMooyyL8Whu4Go6I2V-wspetKGptQnG85X75lg6gWAOYwV5ES5mJQJ4unZuCUW82sDPMNZwEhw_Hzl6UyO5vd3pYJOzry07RcskSwonVKZqipiAEusiYRCvo0AjUx33g5NaRAhXUCE8p_9vdTgSMVjtQkFGpsXih-Hw8rcy7N_HH_LWz-C2ZIA9i2sV3tEHNpTgVhs9Z0WTISirTXdmSolv6JvlqkGETsq0CSFa-0xmhjWU036KB2C5nKBLpUP6AUwibcLDEc0_RoUka-Ia-a4QNVZuzME3pMxIaGOToYf1WLEHPeIQ";

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

    // Click Bike to unselect it
    await driver
        .$('-android uiautomator:new UiSelector().text("Bike")')
        .waitForEnabled();

    await driver
        .$('-android uiautomator:new UiSelector().text("Bike")')
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
                "App-Version": "1.23776.3.23776",
                "App-Platform": "android",
            },
            body: JSON.stringify({
                regionId: "",
                stationId: "",
                longitude: 4.481574296951294,
                latitude: 51.92120617890777,
                radius: 1166.6137310913994,
                zoomLevel: 15.25,
                subOperators: [],
                assetClasses: [23, 24, 17],
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

///////////////////////////////////////////////////////////////////////////////////////////////

describe("Mocked Umob Mopeds (with constant errors) trying Booking Tests", () => {
    //bf35643b-800d-465d-9364-39fbee5d1ad2

    let scooters;

    before(async () => {
        scooters = await fetchScooterCoordinates();

        const credentials = getCredentials(ENV, TEST_USER);

        // await PageObjects.login(credentials);
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

    /////////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////////
    it("1st Positive Scenario (Euro Currency): Book Mocked Umob Moped with ID UmobMock:ROTTERDAM_MOPED_1", async () => {
        const testId = "caf518e1-c534-4729-92cd-0cc0bbbd0417";
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

            // Verify Euro currancy is displayed per minute driving
            await driver
                .$('-android uiautomator:new UiSelector().textContains("€")')
                .waitForDisplayed();

            //choose card payment
            await driver
                .$(
                    '-android uiautomator:new UiSelector().textContains("multi")',
                )
                .waitForEnabled();

            await driver
                .$(
                    '-android uiautomator:new UiSelector().textContains("multi")',
                )
                .click();

            await driver
                .$('-android uiautomator:new UiSelector().text("No voucher")')
                .click();

            // Click Start
            await PageObjects.startTripButton.waitForDisplayed();
            await PageObjects.startTripButton.click();

            await driver.pause(10000);

            // Click End Trip
            await PageObjects.endTripButton.waitForDisplayed();
            await driver.pause(10000);

            await PageObjects.endTripButton.click();

            await driver.pause(5000);

            //allow permissions for take a photo

            const permission = await driver.$(
                "id:com.android.permissioncontroller:id/permission_allow_foreground_only_button",
            );
            await expect(permission).toBeDisplayed();
            await permission.click();
            await driver.pause(5000);

            //verify parking photo header
            const parkingHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Parking photo required")',
            );
            await expect(parkingHeader).toBeDisplayed();

            //verify photo instruction
            const photoInstruction = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Take a photo of your vehicle to end your ride")',
            );
            await expect(photoInstruction).toBeDisplayed();
            await driver.pause(3000);

            // Tap a button for taking photo
            const photoButton = await driver.$(
                '-android uiautomator:new UiSelector().resourceId("buttonContainer")',
            );
            await expect(photoButton).toBeDisplayed();
            await driver.pause(2000);
            await photoButton.click();

            await driver.pause(8000);
            //verify confirmation for using a picture
            const pictureHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Use this picture?")',
            );
            await expect(pictureHeader).toBeDisplayed();

            //verify parking rules
            const parkingRules = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Please check if the vehicle is parked")',
            );
            await expect(parkingRules).toBeDisplayed();

            //verify retake picture button
            const retakeButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Retake")',
            );
            await expect(retakeButton).toBeDisplayed();

            //verify use picture button
            const useButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Use Picture")',
            );
            await expect(useButton).toBeDisplayed();
            await driver.pause(7000);
            await useButton.click();

            await driver.pause(8000);

            // Click GOT IT
            await PageObjects.gotItButton.waitForDisplayed();
            await PageObjects.gotItButton.click();

            // Click not now button
            // const notNowButton = await driver.$(
            //     '-android uiautomator:new UiSelector().text("NOT NOW")',
            // );
            // await expect(notNowButton).toBeDisplayed();
            // await notNowButton.click();
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
            const addressCount = await driver.$$(
                '-android uiautomator:new UiSelector().text("Rodezand 46, 3011 AN Rotterdam, Netherlands")',
            ).length;
            expect(addressCount).toBe(2);

            const travelCostElement = await driver.$(
                '//*[@text="Travel cost"]',
            );
            await expect(travelCostElement).toBeDisplayed();

            await driver
                .$('-android uiautomator:new UiSelector().textContains("€")')
                .waitForDisplayed();

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

    ////////////////////////////////////////////////////////////////////////////////

    it("2nd Positive Scenario (GBP Currancy): Book Mocked Umob Moped with ID UmobMock:ROTTERDAM_MOPED_GBP", async () => {
        const testId = "9e8c46c8-7b3f-4c94-a3e3-4e1201de7959";
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            const targetScooter = scooters.find(
                (scooter) => scooter.id === "UmobMock:ROTTERDAM_MOPED_GBP",
            );

            // Set location to specific scooter coordinates
            await AppiumHelpers.setLocationAndRestartApp(
                targetScooter.coordinates.longitude,
                targetScooter.coordinates.latitude,
            );
            await driver.pause(5000);

            // Filter not needed results
            //await applyFilters();

            // Click on scooter marker
            // await driver
            //   .$(
            //     '-android uiautomator:new UiSelector().className("android.view.ViewGroup").instance(15)'
            //   )
            //   .click();

            const { centerX, centerY } = await getScreenCenter();

            // Click exactly in the center
            await driver
                .action("pointer")
                .move({ x: centerX, y: centerY })
                .down()
                .up()
                .perform();
            /*
      
           // Click Understood
           //  await driver.$(
           //  '-android uiautomator:new UiSelector().text("UNDERSTOOD")'
            // ).waitForEnabled();
      
            //await driver.$(
            //'-android uiautomator:new UiSelector().text("UNDERSTOOD")'
            //).click();
      
            //choose card payment
            await driver.$(
            '-android uiautomator:new UiSelector().textContains("multi")'
          ).waitForEnabled();
      
      
            await driver.$(
            '-android uiautomator:new UiSelector().textContains("multi")'
          ).click();
      
          await driver.$(
            '-android uiautomator:new UiSelector().text("No Voucher")'
          ).click();
          */

            // Verify Pounds (GBP) currancy is displayed
            await driver
                .$('-android uiautomator:new UiSelector().textContains("£")')
                .waitForDisplayed();

            // Click Start
            await PageObjects.startTripButton.waitForDisplayed();
            await PageObjects.startTripButton.click();

            await driver.pause(10000);

            // Click End Trip
            await PageObjects.endTripButton.waitForDisplayed();

            await driver.pause(10000);

            await PageObjects.endTripButton.click();

            await driver.pause(5000);

            //allow permissions for take a photo

            // const permission = await driver.$("id:com.android.permissioncontroller:id/permission_allow_foreground_only_button");
            // await expect(permission).toBeDisplayed();
            // await permission.click();
            // await driver.pause(5000);

            //verify parking photo header
            const parkingHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Parking photo required")',
            );
            await expect(parkingHeader).toBeDisplayed();

            //verify photo instruction
            const photoInstruction = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Take a photo of your vehicle to end your ride")',
            );
            await expect(photoInstruction).toBeDisplayed();

            // Tap a button for taking photo
            const photoButton = await driver.$(
                '-android uiautomator:new UiSelector().resourceId("buttonContainer")',
            );
            await photoButton.click();

            await driver.pause(8000);
            //verify confirmation for using a picture
            const pictureHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Use this picture?")',
            );
            await expect(pictureHeader).toBeDisplayed();

            //verify parking rules
            const parkingRules = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Please check if the vehicle is parked")',
            );
            await expect(parkingRules).toBeDisplayed();

            //verify retake picture button
            const retakeButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Retake")',
            );
            await expect(retakeButton).toBeDisplayed();

            //verify use picture button
            const useButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Use Picture")',
            );
            await expect(useButton).toBeDisplayed();
            await driver.pause(7000);
            await useButton.click();

            await driver.pause(8000);
            // Click GOT IT
            await PageObjects.gotItButton.waitForDisplayed();

            await PageObjects.gotItButton.click();

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
            const addressCount = await driver.$$(
                '-android uiautomator:new UiSelector().text("Rodezand 44, 3011 AN Rotterdam, Netherlands")',
            ).length;
            expect(addressCount).toBe(2);

            // Verify Pricing Details
            const travelCostElement = await driver.$(
                '//*[@text="Travel cost"]',
            );
            await expect(travelCostElement).toBeDisplayed();

            await driver
                .$('-android uiautomator:new UiSelector().textContains("£")')
                .waitForDisplayed();

            //  const travelCostValueElement = await driver.$('//*[@text="€1.25"]');
            //  await expect(travelCostValueElement).toBeDisplayed();

            const totalAmountElement = await driver.$(
                '//*[@text="Total amount"]',
            );
            await expect(totalAmountElement).toBeDisplayed();

            //  const totalAmountValueElement = await driver.$('//*[@text="€1.25"]');
            //  await expect(totalAmountValueElement).toBeDisplayed();

            // Verify Payments Section
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
                    percent: 10.0,
                },
            ]);

            // Verify Transaction Details

            const statusElement = await driver.$('//*[@text="Completed"]');
            await expect(statusElement).toBeDisplayed();

            // Click GOT IT
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
            // execSync(
            //   `adb exec-out screencap -p > ${screenshotPath}`
            // );
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

    ///////////////////////////////////////////////////////////////////////////////////////
    /*
    it("3rd Positive Scenario (CHF Currency): Book Mocked Umob Moped with ID UmobMock:ROTTERDAM_MOPED_CHF", async () => {
        const testId = "76220f0b-d502-4c3e-853f-1890a679e818";
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            const targetScooter = scooters.find(
                (scooter) => scooter.id === "UmobMock:ROTTERDAM_MOPED_CHF",
            );

            // Set location to specific scooter coordinates
            await AppiumHelpers.setLocationAndRestartApp(
                targetScooter.coordinates.longitude,
                targetScooter.coordinates.latitude,
            );
            await driver.pause(5000);

            const { centerX, centerY } = await getScreenCenter();

            //Click on middle of the screen
            await AppiumHelpers.clickCenterOfScreen();

            // Verify CHF currancy is displayed
            const CHF = await driver.$(
                '-android uiautomator:new UiSelector().textContains("CHF")',
            );
            await expect(CHF).toBeDisplayed();

            
            // //choose card payment
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
                

            // Click Start
           await PageObjects.startTripButton.waitForDisplayed();
            await PageObjects.startTripButton.click();

            await driver.pause(10000);

            // Click End Trip
           await PageObjects.endTripButton.waitForDisplayed();

            await driver.pause(10000);

            await PageObjects.endTripButton.click();

            await driver.pause(5000);

            //allow permissions for take a photo

            // const permission = await driver.$(
            //     "id:com.android.permissioncontroller:id/permission_allow_foreground_only_button",
            // );
            // await expect(permission).toBeDisplayed();
            // await permission.click();
            // await driver.pause(5000);

            //verify parking photo header
            const parkingHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Parking photo required")',
            );
            await expect(parkingHeader).toBeDisplayed();

            //verify photo instruction
            const photoInstruction = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Take a photo of your vehicle to end your ride")',
            );
            await expect(photoInstruction).toBeDisplayed();
            await driver.pause(3000);

            // Tap a button for taking photo
            const photoButton = await driver.$(
                '-android uiautomator:new UiSelector().resourceId("buttonContainer")',
            );
            await expect(photoButton).toBeDisplayed();
            await driver.pause(2000);
            await photoButton.click();

            await driver.pause(8000);
            //verify confirmation for using a picture
            const pictureHeader = await driver.$(
                '-android uiautomator:new UiSelector().text("Use this picture?")',
            );
            await expect(pictureHeader).toBeDisplayed();

            //verify parking rules
            const parkingRules = await driver.$(
                '-android uiautomator:new UiSelector().textContains("Please check if the vehicle is parked")',
            );
            await expect(parkingRules).toBeDisplayed();

            //verify retake picture button
            const retakeButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Retake")',
            );
            await expect(retakeButton).toBeDisplayed();

            //verify use picture button
            const useButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Use Picture")',
            );
            await expect(useButton).toBeDisplayed();
            await driver.pause(7000);
            await useButton.click();

            await driver.pause(8000);

            // Click GOT IT
            await PageObjects.gotItButton.waitForDisplayed();
            await PageObjects.gotItButton.click();

            // Click not now button
            // const notNowButton = await driver.$(
            //     '-android uiautomator:new UiSelector().text("NOT NOW")',
            // );
            // await expect(notNowButton).toBeDisplayed();
            // await notNowButton.click();
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
            const addressCount = await driver.$$(
                '-android uiautomator:new UiSelector().textContains(" 3011 AN Rotterdam, Netherlands")',
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
                .$('-android uiautomator:new UiSelector().text("GOT IT")')
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
    */

    ////////////////////////////////////////////////////////////////////////////////////
    /*
     //NOT Operational Vehicle is paused because of blocking user
     it("Negative Scenario:Trying to Book Moped with Vehicle Not Operational Error", async () => {
         const testId = "87428fa7-fcb9-4bc8-932d-54f4849ee3aa";
         // Send results
         let testStatus = "Pass";
         let screenshotPath = "";
         let testDetails = "";
         let error = null;
 
         try {
             const targetScooter = scooters.find(
                 (scooter) =>
                     scooter.id ===
                     "UmobMock:MOPED_UNLOCK_ERROR_VEHICLE_NOT_OPERATIONAL",
             );
 
             // Set location to specific scooter coordinates
             await AppiumHelpers.setLocationAndRestartApp(
                 targetScooter.coordinates.longitude,
                 targetScooter.coordinates.latitude,
             );
             await driver.pause(5000);
 
 
             const { centerX, centerY } = await getScreenCenter();
 
 
             //Click on middle of the screen
             await AppiumHelpers.clickCenterOfScreen();
             
 
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
                 
 
             // Click Start
             await PageObjects.startTripButton.waitForDisplayed();
            await PageObjects.startTripButton.click();

 
             // Wait for Vehicle Not Operational error message
             await driver
                 .$(
                     '-android uiautomator:new UiSelector().text("VEHICLE_NOT_OPERATIONAL (60000)")',
                 )
                 .waitForDisplayed();
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
