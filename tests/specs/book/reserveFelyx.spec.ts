import { execSync } from "child_process";
import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import submitTestRun from '../../helpers/SendResults.js';

const API_URL = 'https://backend-test.umobapp.com/api/tomp/mapboxmarkers';
const AUTH_TOKEN = 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkFGNkFBNzZCMUFEOEI4QUJCQzgzRTAzNjBEQkQ4MkYzRjdGNDE1MDMiLCJ4NXQiOiJyMnFuYXhyWXVLdThnLUEyRGIyQzhfZjBGUU0iLCJ0eXAiOiJhdCtqd3QifQ.eyJzdWIiOiJiMzI0ZDRlNy01OGNmLTRkZTMtOWE2Yi04N2YxYzcyYzM0ZjUiLCJ1bmlxdWVfbmFtZSI6IjRiaWdmb290KzE4QGdtYWlsLmNvbSIsInByZWZlcnJlZF91c2VybmFtZSI6IjRiaWdmb290KzE4QGdtYWlsLmNvbSIsImdpdmVuX25hbWUiOiJBbGVrcyIsImZhbWlseV9uYW1lIjoiU2F2IiwiZW1haWwiOiI0YmlnZm9vdCsxOEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6IkZhbHNlIiwicGhvbmVfbnVtYmVyIjoiKzMxOTcwMTA1ODc3MjQiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOiJUcnVlIiwib2lfcHJzdCI6InVNb2JfQXBwX09wZW5JZGRpY3QiLCJvaV9hdV9pZCI6IjRkYTQ1MTk2LTA2OTEtYjg4MC04MTM2LTNhMTZlNTk4OWY2NSIsImNsaWVudF9pZCI6InVNb2JfQXBwX09wZW5JZGRpY3QiLCJvaV90a25faWQiOiIyYTlhNjMwNS1hMjYxLTgwMjQtOTQ5Yy0zYTE2ZTU5ODlmN2EiLCJhdWQiOiJ1TW9iIiwic2NvcGUiOiJvZmZsaW5lX2FjY2VzcyB1TW9iIiwianRpIjoiY2QyM2VlMzktMTE2Mi00ZDhmLTkyMDgtZDgxMDdiZTc2MGYxIiwiaXNzIjoiaHR0cHM6Ly9iYWNrZW5kLXRlc3QudW1vYmFwcC5jb20vIiwiZXhwIjoxNzQyMTk0ODc2LCJpYXQiOjE3MzQ0MTg4NzZ9.u6ndZq46MDie48o9UNmzjTzAmSpyEJcHEmgKWkKB_UT0EC6vQXSIifrrD3KtFy9gD_Y0DFa3k043uRvEp7Cp1Gnu1OEWl6BKjIi0FOZ4yHTHPgTLhSQWSFfxJx_0yjtanvmC5aFg-t6kGvA76S8QMlbNYOKJf9R3mv3fPmnC1jIRMlZeIuikzHBJ1D3czlx1Pk3lFjsWoQcdZbWEpsRY4PEv28uLfh46COq2myEHDA_mk9WG-V7ocPuNRYiHamHcjttHem5Y_yNNUfoXDPwsQSlehtAuZnB6dyIL1C5OrNl5ZfyFiD1p6XWuBAFUmh5wOSWE23Fmm8fruD2UXSPPWg';

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

  const fetchScooterCoordinates = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': AUTH_TOKEN,
          'Accept-Language': 'en',
          'X-Requested-With': 'XMLHttpRequest',
          'App-Version': '1.23316.3.23316',
          'App-Platform': 'android'
        },
        body: JSON.stringify({
          regionId: "",
          stationId: "",
          longitude: 4.47586407,
          latitude: 51.92502035,
          radius: 1166.6137310913994,
          zoomLevel: 15.25,
          subOperators: [],
          assetClasses: [23],
          operatorAvailabilities: [2, 1, 3],
          showEmptyStations: false,
          skipCount: 0,
          sorting: "",
          defaultMaxResultCount: 10,
          maxMaxResultCount: 1000,
          maxResultCount: 10
        })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Fetched scooter coordinates:', JSON.stringify(data));
      return data.assets;
    } catch (error) {
      console.error('Error fetching scooter coordinates:', error);
      throw error;
    }
  };
/////////////////////////////////////////////////////////////////////////////////
describe('Reserve Felyx Test', () => {
  let scooters;

  before(async () => {
    // Fetch scooter coordinates before running tests
    scooters = await fetchScooterCoordinates();

      // Find and click LOG IN button
      const logInBtn = await driver.$('-android uiautomator:new UiSelector().text("LOG IN")');
      await logInBtn.isClickable();
      await logInBtn.click();

      await PageObjects.login({ username:'4bigfoot+10@gmail.com', password: '123Qwerty!' });


  });

  beforeEach(async () => {
    await driver.activateApp("com.umob.umob");
        // Wait for screen to be loaded

        await PageObjects.accountButton.waitForExist();

  });

  ////////////////////////////////////////////////////////////////////////////////
  it('Positive Scenario: Reserve Felyx moped with ID Check:b76ce2d0-7fe5-4914-9d1b-580928859efd', async () => {

    const testId = "296e871b-b22b-46ec-bf33-567bab7ef35f"
    // Send results
 let testStatus = "Pass";
 let screenshotPath = "";
 let testDetails = ""
 let error = null;
 
 try {


    // const targetScooter = scooters.find(
    //   scooter => scooter.id === 'Check:b76ce2d0-7fe5-4914-9d1b-580928859efd'
    // );
    const targetScooter = scooters.find(
      scooter => scooter.id.includes('Felyx')
    );

    // Set location to specific scooter coordinates
    execSync(
      `adb shell am startservice -e longitude ${targetScooter.coordinates.longitude} -e latitude ${targetScooter.coordinates.latitude} io.appium.settings/.LocationService`
    );
    //await driver.pause(5000);

        // Filter not needed results
        await applyFilters();

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

    // Click Understood
    // await driver.$(
    //   '-android uiautomator:new UiSelector().text("UNDERSTOOD")'
    // ).waitForEnabled();

    // await driver.$(
    //   '-android uiautomator:new UiSelector().text("UNDERSTOOD")'
    // ).click();
    await driver.pause(2000);

    // Click Reserve
    await driver.$(
      '-android uiautomator:new UiSelector().text("RESERVE")'
    ).waitForEnabled();
    await driver.pause(7000);

    await driver.$(
      '-android uiautomator:new UiSelector().text("RESERVE")'
    ).click();

                    // Click End Trip
                    await driver.$(
                      '-android uiautomator:new UiSelector().text("CANCEL")'
                    ).waitForEnabled();

                    await driver.pause(7000);
                
                    await driver.$(
                      '-android uiautomator:new UiSelector().text("CANCEL")'
                    ).click();

                    await driver.pause(4000);

          // Wait for Home screen to be loaded
          await PageObjects.accountButton.waitForExist();
          await PageObjects.accountButton.click();

          await driver.$(
            '-android uiautomator:new UiSelector().text("My Account")'
          ).isDisplayed();
          await driver.pause(2000);

        } catch (e) {
          error = e;
          console.error("Test failed:", error);
          testStatus = "Fail";
          testDetails = e.message;
      
          console.log("TEST 123")
      
          // Capture screenshot on failure
          screenshotPath = "./screenshots/"+ testId+".png";
          await driver.saveScreenshot(screenshotPath);
          // execSync(
          //   `adb exec-out screencap -p > ${screenshotPath}`
          // );
          
        } finally {
          // Submit test run result
          try {
              console.log("TEST 456")
      
            await submitTestRun(testId, testStatus, testDetails, screenshotPath);
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