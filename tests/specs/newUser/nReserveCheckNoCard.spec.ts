import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import AppiumHelpers from "../../helpers/AppiumHelpers.js";
import {
    getCredentials,
    executeTest,
    getApiConfig,
    ENV,
} from "../../helpers/TestHelpers.js";

const TEST_USER = "newUser";

// Fetch scooter coordinates from API (specific to this test location)
const fetchScooterCoordinates = async () => {
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
                "App-Version": "1.22959.3.22959",
                "App-Platform": "android",
            },
            body: JSON.stringify({
                regionId: "",
                stationId: "",
                longitude: 4.468478941582217,
                latitude: 51.91702868001766,
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

// Filter mopeds and stations (specific to this test)
const applyFilters = async () => {
    // Click filter icon
    await PageObjects.assetFilterToggle.waitForEnabled();
    await PageObjects.assetFilterToggle.click();

    // Click Scooter to unselect it
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

describe("Trying to Reserve Check by a New User Without a Card", () => {
    let scooters;

    before(async () => {
        const credentials = getCredentials(ENV, TEST_USER);

        // Fetch scooter coordinates before running tests
        scooters = await fetchScooterCoordinates();

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
    });

    beforeEach(async () => {
        await driver.activateApp("com.umob.umob");
    });

    it("New user is trying to reserve Check moped without a card Check:b76ce2d0-7fe5-4914-9d1b-580928859efd", async () => {
        const testId = "0fe2a0b7-708f-4a27-98e2-f62dfbf77bed";

        await executeTest(testId, async () => {
            // Click on middle of the screen
            //await AppiumHelpers.clickCenterOfScreen();

            // get center of the map (not the center of the screen!)
            const { x, y } = await AppiumHelpers.getMapCenterCoordinates();
            await driver.pause(3000);

            // CLick on map center (operator located in the center of the map)
            await driver.execute("mobile: clickGesture", { x, y });
            await driver.pause(6000);

            // Verify that new user voucher is visible
            const voucher = await driver.$(
                '-android uiautomator:new UiSelector().text("New User Check")',
            );
            await expect(voucher).toBeDisplayed();

            const { width, height } = await driver.getWindowSize();

            // INDIVIDUAL SCROLL (DO NOT MODIFY)
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
            await PageObjects.reserveButton.waitForDisplayed();
            await driver.pause(5000);
            await PageObjects.reserveButton.click();
            await driver.pause(3000);

            // Verify header and offer for choosing payment method
            await PageObjects.paymentHeader.waitForDisplayed();

            const cards = await driver.$(
                '-android uiautomator:new UiSelector().text("Cards")',
            );
            await expect(cards).toBeDisplayed();

            const bancontactCard = await driver.$(
                '-android uiautomator:new UiSelector().text("Bancontact card")',
            );
            await expect(bancontactCard).toBeDisplayed();

            // INDIVIDUAL SCROLL (DO NOT MODIFY)
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

            const payPal = await driver.$(
                '-android uiautomator:new UiSelector().text("PayPal")',
            );
            await expect(payPal).toBeDisplayed();

            const closeBtn = await driver.$("accessibility id:Close");
            await expect(closeBtn).toBeDisplayed();
            await closeBtn.click();
        });
    });

    afterEach(async () => {
        await driver.terminateApp("com.umob.umob");
    });
});
