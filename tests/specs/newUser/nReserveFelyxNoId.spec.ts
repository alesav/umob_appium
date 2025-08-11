import { execSync } from "child_process";
import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import submitTestRun from "../../helpers/SendResults.js";
import AppiumHelpers from "../../helpers/AppiumHelpers.js";
import { fetchScooterCoordinates, findFelyxScooter, type Scooter } from "../../helpers/ScooterCoordinates.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to load credentials based on environment and user
function getCredentials(
    environment: string = "test",
    userKey: string | null = null,
) {
    try {
        const credentialsPath = path.resolve(
            __dirname,
            "../../../config/credentials.json",
        );
        const credentials = JSON.parse(
            fs.readFileSync(credentialsPath, "utf8"),
        );

        // Check if environment exists
        if (!credentials[environment]) {
            console.warn(
                `Environment '${environment}' not found in credentials file. Using 'test' environment.`,
            );
            environment = "test";
        }

        const envUsers = credentials[environment];

        // If no specific user is requested, use the first user in the environment
        if (!userKey) {
            userKey = Object.keys(envUsers)[0];
        } else if (!envUsers[userKey]) {
            console.warn(
                `User '${userKey}' not found in '${environment}' environment. Using first available user.`,
            );
            userKey = Object.keys(envUsers)[0];
        }

        // Return the user credentials
        return {
            username: envUsers[userKey].username,
            password: envUsers[userKey].password,
        };
    } catch (error) {
        console.error("Error loading credentials:", error);
        throw new Error("Failed to load credentials configuration");
    }
}

// Get environment and user from env variables or use defaults
const ENV = process.env.TEST_ENV || "test";
const USER = process.env.TEST_USER || "newUser";

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

/*
  // Filter mopeds and stations 
  const applyFilters = async () => {
    // Click ? icon
    await driver.$(
      '-android uiautomator:new UiSelector().resourceId("home_asset_filter_toggle")'
    ).waitForEnabled();

    await driver.$(
      '-android uiautomator:new UiSelector().resourceId("home_asset_filter_toggle")'
    ).click();

        // Click Moped to unselect it
        await driver.$(
          '-android uiautomator:new UiSelector().text("Scooter")'
        ).waitForEnabled();
    
        await driver.$(
          '-android uiautomator:new UiSelector().text("Scooter")'
        ).click();

          // Click Bike to unselect it
          await driver.$(
            '-android uiautomator:new UiSelector().text("Bike")'
          ).waitForEnabled();
      
          await driver.$(
            '-android uiautomator:new UiSelector().text("Bike")'
          ).click();

          // Click Openbaar vervoer to unselect it
  await driver.$(
    '-android uiautomator:new UiSelector().text("Openbaar vervoer")'
  ).waitForEnabled();

  await driver.$(
    '-android uiautomator:new UiSelector().text("Openbaar vervoer")'
  ).click();

            // Minimize drawer
            await driver.$(
              '-android uiautomator:new UiSelector().className("com.horcrux.svg.PathView").instance(10)'
            ).click();

  };

*/

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
/////////////////////////////////////////////////////////////////////////////////
describe("Trying to Reserve Felyx by a New User Without a drivers licence", () => {
    let scooters: Scooter[];

    before(async () => {
        // Fetch scooter coordinates before running tests
        scooters = await fetchScooterCoordinates();

        const credentials = getCredentials(ENV, USER);

        // await PageObjects.login(credentials);
        await PageObjects.login({
            username: credentials.username,
            password: credentials.password,
        });

        //await PageObjects.login({ username:'new20@gmail.com', password: '123Qwerty!' });

        const longitude = 4.474984046128891;
        const latitude = 51.91638293318269;

        await AppiumHelpers.setLocationAndRestartApp(longitude, latitude);
        await driver.pause(3000);
    });

    beforeEach(async () => {
        await driver.activateApp("com.umob.umob");
        // Wait for screen to be loaded
    });

    ////////////////////////////////////////////////////////////////////////////////
    it("Trying to Reserve Felyx Moped Without a Driving licence", async () => {
        const testId = "bbc84817-0539-4b40-adf9-d7a9ffcebc24";
        // Send results
        let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = "";
        let error = null;

        try {
            // const targetScooter = scooters.find(
            //   scooter => scooter.id === 'Check:b76ce2d0-7fe5-4914-9d1b-580928859efd'
            // );
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
            // await driver
            //   .action("pointer")
            //   .move({ x: centerX, y: centerY })
            //   .down()
            //   .up()
            //   .perform();

            //Click on middle of the screen
            await AppiumHelpers.clickCenterOfScreen();

            // Click Understood
            // await driver.$(
            //   '-android uiautomator:new UiSelector().text("UNDERSTOOD")'
            // ).waitForEnabled();

            // await driver.$(
            //   '-android uiautomator:new UiSelector().text("UNDERSTOOD")'
            // ).click();
            await driver.pause(3000);

            //verify that driver's licence is not added
            await driver
                .$(
                    '-android uiautomator:new UiSelector().textContains("Add a driver license for mopeds, or")',
                )
                .waitForDisplayed();

            // Click Reserve
            await driver
                .$('-android uiautomator:new UiSelector().text("RESERVE")')
                .waitForEnabled();

            await driver.pause(5000);

            const button = await driver.$(
                '-android uiautomator:new UiSelector().text("RESERVE")',
            );
            await button.click();
            await driver.pause(2000);

            //verify id add screen header
            const idAdd = await driver.$(
                '-android uiautomator:new UiSelector().text("ID document")',
            );
            await expect(idAdd).toBeDisplayed;

            //verify id document status
            const idStatus = await driver.$(
                '-android uiautomator:new UiSelector().text("Status")',
            );
            await expect(idStatus).toBeDisplayed;

            const Status = await driver.$(
                '-android uiautomator:new UiSelector().text("No Submitted")',
            );
            await expect(Status).toBeDisplayed;

            //verify home adress section and "add" button
            const homeAddress = await driver.$(
                '-android uiautomator:new UiSelector().text("Home address")',
            );
            await expect(homeAddress).toBeDisplayed;

            const addressAdd = await driver.$(
                '-android uiautomator:new UiSelector().text("ADD")',
            );
            await expect(addressAdd).toBeDisplayed;

            //verify that there is add button for driver's licence
            const docAdd = await driver.$(
                '-android uiautomator:new UiSelector().text("ADD ID DOCUMENT")',
            );
            await expect(docAdd).toBeDisplayed;
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

    afterEach(async () => {
        await driver.terminateApp("com.umob.umob");
    });
});
