import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import AppiumHelpers from "../../helpers/AppiumHelpers.js";
import {
    getCredentials,
    executeTest,
    getApiConfig,
} from "../../helpers/TestHelpers.js";
import type { Scooter } from "../../helpers/ScooterCoordinates.js";

const ENV = process.env.TEST_ENV || "test";
const USER = process.env.TEST_USER || "newUser";

// Fetch scooter coordinates from API (specific to this test location)
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
                longitude: 4.474984046128891,
                latitude: 51.91638293318269,
                radius: 50.6137310913994,
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

describe("Trying to Reserve Felyx by a New User Without a drivers licence", () => {
    let scooters: Scooter[];

    before(async () => {
        // Fetch scooter coordinates before running tests
        scooters = await fetchScooterCoordinates();

        const credentials = getCredentials(ENV, USER);

        await PageObjects.login({
            username: credentials.username,
            password: credentials.password,
        });

        const longitude = 4.474984046128891;
        const latitude = 51.91638293318269;

        await AppiumHelpers.setLocationAndRestartApp(longitude, latitude);
        await driver.pause(3000);
    });

    beforeEach(async () => {
        await driver.activateApp("com.umob.umob");
    });

    it("Trying to Reserve Felyx Moped Without a Driving licence", async () => {
        const testId = "bbc84817-0539-4b40-adf9-d7a9ffcebc24";

        await executeTest(testId, async () => {
            const targetScooter = scooters.find((scooter) =>
                scooter.id.includes("Felyx"),
            );

            // Set location to specific scooter coordinates
            console.log(
                "Long: " +
                    targetScooter.coordinates.longitude +
                    " Lat: " +
                    targetScooter.coordinates.latitude,
            );
            await AppiumHelpers.setLocationAndRestartApp(
                targetScooter.coordinates.longitude,
                targetScooter.coordinates.latitude,
            );
            await driver.pause(3000);

            // Click on middle of the screen
            await AppiumHelpers.clickCenterOfScreen();
            await driver.pause(3000);

            // Verify that driver's licence is not added
            await driver
                .$(
                    '-android uiautomator:new UiSelector().textContains("Add a driver license for mopeds, or")',
                )
                .waitForDisplayed();

            // Click Reserve
            await PageObjects.reserveButton.waitForDisplayed();
            await driver.pause(5000);
            await PageObjects.reserveButton.click();
            await driver.pause(2000);

            // Verify id add screen header
            const idAdd = await driver.$(
                '-android uiautomator:new UiSelector().text("ID document")',
            );
            await expect(idAdd).toBeDisplayed();

            // Verify id document status
            const idStatus = await driver.$(
                '-android uiautomator:new UiSelector().text("Status")',
            );
            await expect(idStatus).toBeDisplayed();

            const Status = await driver.$(
                '-android uiautomator:new UiSelector().text("No Submitted")',
            );
            await expect(Status).toBeDisplayed();

            // Verify home address section and "add" button
            const homeAddress = await driver.$(
                '-android uiautomator:new UiSelector().text("Home address")',
            );
            await expect(homeAddress).toBeDisplayed();

            const addressAdd = await driver.$(
                '-android uiautomator:new UiSelector().text("Add")',
            );
            await expect(addressAdd).toBeDisplayed();

            // Verify that there is add button for driver's licence
            const docAdd = await driver.$(
                '-android uiautomator:new UiSelector().text("Add Id Document")',
            );
            await expect(docAdd).toBeDisplayed();
        });
    });

    afterEach(async () => {
        await driver.terminateApp("com.umob.umob");
    });
});
