import { execSync } from "child_process";
import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import AppiumHelpers from "../../helpers/AppiumHelpers.js";
import { 
    getCredentials, 
    fetchScooterCoordinates, 
    executeTest,
    ENV, 
    USER, 
    TARGET_SCOOTER_ID,
    TEST_VEHICLE_ID
} from "../../helpers/TestHelpers.js";

describe("Test for the QR feature", () => {
    let scooters;

    before(async () => {
        scooters = await fetchScooterCoordinates();
        const credentials = getCredentials(ENV, USER);
        
        await PageObjects.login({
            username: credentials.username,
            password: credentials.password,
        });

        const targetScooter = scooters.find(
            (scooter) => scooter.id === TARGET_SCOOTER_ID,
        );

        await AppiumHelpers.setLocationAndRestartApp(
            targetScooter.coordinates.longitude,
            targetScooter.coordinates.latitude,
        );
    });

    beforeEach(async () => {
        await driver.activateApp("com.umob.umob");
    });

    it("Round QR code button should exist on the main screen and admit text code", async () => {
        const testId = "704e2a56-6252-4334-bf3f-f31ead93a501";

        await executeTest(testId, async () => {
            // Wait for map to load
            await PageObjects.waitForMapToLoad();

            // Verify that side control buttons container is loaded
            await expect(PageObjects.sideControlButtons).toBeDisplayed();

            // Verify QR code button is displayed and click it
            await PageObjects.qrCodeButton.click();

            // Handle location permissions if they appear
            await PageObjects.handleLocationPermissions();

            // Enter vehicle ID manually and verify flow
            await PageObjects.enterVehicleIdManually(TEST_VEHICLE_ID);
            
            await driver.pause(2000);

            // Verify start trip button is available
            await expect(PageObjects.startTripButton).toBeDisplayed();

            // Verify back button is present
            await expect(PageObjects.backButton).toBeDisplayed();
        });
    });

    it("should display QR/Scan Vehicle button in the bottom slide window and test for the back buttons", async () => {
        const testId = "ddce8758-2bb3-40ac-8d0e-2a759ccd40ee";

        await executeTest(testId, async () => {
            const targetScooter = scooters.find(
                (scooter) => scooter.id === TARGET_SCOOTER_ID,
            );

            // Set location to specific scooter coordinates
            await AppiumHelpers.setLocationAndRestartApp(
                targetScooter.coordinates.longitude,
                targetScooter.coordinates.latitude,
            );
            await driver.pause(5000);

            // Wait for map and navigation elements to load
            await PageObjects.waitForMapToLoad();
            await PageObjects.promosBtn.waitForExist();

            // Click PLAN TRIP button to verify scan vehicle option
            await PageObjects.planTripBtn.click();
            await driver.pause(1000);

            // Verify Scan Vehicle button and click it
            await expect(PageObjects.scanVehicleButton).toBeDisplayed();
            await PageObjects.scanVehicleButton.click();

            // Verify manual instruction is visible after pressing scan vehicle button
            await expect(PageObjects.manualEntryInstruction).toBeDisplayed();

            // Verify back button is present
            await expect(PageObjects.backButton).toBeDisplayed();

            // Verify vehicle ID container for manual input
            await expect(PageObjects.vehicleIdInput).toBeDisplayed();
            await PageObjects.vehicleIdInput.click();
            await driver.pause(1500);

            // Insert vehicle id to disappear Vehicle ID text
            await PageObjects.vehicleIdInput.addValue(TEST_VEHICLE_ID);

            // Test back button navigation flow
            await PageObjects.backButton.click();
            await driver.pause(1500);
            await PageObjects.backButton.click();
            await driver.pause(1500);

            // Verify that screen changed - look for Vehicle ID text
            const vehicleIdText = await driver.$(
                '-android uiautomator:new UiSelector().text("Vehicle ID")',
            );
            await expect(vehicleIdText).toBeDisplayed();

            // Click back button to go to previous screen
            await PageObjects.backButton.click();
            await driver.pause(1500);

            // Verify that we're back to the scan vehicle screen
            await expect(PageObjects.scanVehicleButton).toBeDisplayed();
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