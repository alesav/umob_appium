import { execSync } from "child_process";
import submitTestRun from '../../helpers/SendResults.js';
import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import AppiumHelpers from "../../helpers/AppiumHelpers.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to get fixed credentials for the new user from credentials file
function getCredentials() {
  try {
    const credentialsPath = path.resolve(__dirname, '../../../config/credentials.json');
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    
    // Always use the new user from test environment
    if (!credentials.test || !credentials.test.new) {
      throw new Error('new user not found in test environment');
    }
    
    // Return the new user credentials
    return {
      username: credentials.test.new.username,
      password: credentials.test.new.password
    };
  } catch (error) {
    console.error('Error loading credentials:', error);
    throw new Error('Failed to load credentials configuration');
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////

const API_URL = 'https://backend-test.umobapp.com/api/tomp/mapboxmarkers';
const AUTH_TOKEN = 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkFGNkFBNzZCMUFEOEI4QUJCQzgzRTAzNjBEQkQ4MkYzRjdGNDE1MDMiLCJ4NXQiOiJyMnFuYXhyWXVLdThnLUEyRGIyQzhfZjBGUU0iLCJ0eXAiOiJhdCtqd3QifQ.eyJpc3MiOiJodHRwczovL2JhY2tlbmQtdGVzdC51bW9iYXBwLmNvbS8iLCJleHAiOjE3NDY2MTAyMTgsImlhdCI6MTczODgzNDIxOCwiYXVkIjoidU1vYiIsInNjb3BlIjoib2ZmbGluZV9hY2Nlc3MgdU1vYiIsImp0aSI6IjE2ZWUzZjRjLTQzYzktNGE3Ni1iOTdhLTYxMGI0NmU0MGM3ZCIsInN1YiI6IjRhNGRkZmRhLTNmMWYtNDEyMS1iNzU1LWZmY2ZjYTQwYzg3MiIsInNlc3Npb25faWQiOiIzNGU4NDZmOC02MmI3LTRiMzgtODkxYS01NjE4NWM4ZDdhOGEiLCJ1bmlxdWVfbmFtZSI6Im5ld0BnbWFpbC5jb20iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJuZXdAZ21haWwuY29tIiwiZ2l2ZW5fbmFtZSI6Ik5ldyIsImZhbWlseV9uYW1lIjoiTmV3IiwiZW1haWwiOiJuZXdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOiJGYWxzZSIsInBob25lX251bWJlciI6IiszMTk3MDEwNTg2NTU2IiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjoiVHJ1ZSIsIm9pX3Byc3QiOiJ1TW9iX0FwcF9PcGVuSWRkaWN0Iiwib2lfYXVfaWQiOiI0ODZkYTI1OS05ZGViLTJmMDQtYmM2OS0zYTE3ZWNjNTY1YTEiLCJjbGllbnRfaWQiOiJ1TW9iX0FwcF9PcGVuSWRkaWN0Iiwib2lfdGtuX2lkIjoiMTQzZGNiNGUtZTFjYi01MmU0LWU5ZWUtM2ExN2VjYzU2NWI5In0.4slYA6XbzRDTNdPJSOmxGlsuetx1IywPojVVMooyyL8Whu4Go6I2V-wspetKGptQnG85X75lg6gWAOYwV5ES5mJQJ4unZuCUW82sDPMNZwEhw_Hzl6UyO5vd3pYJOzry07RcskSwonVKZqipiAEusiYRCvo0AjUx33g5NaRAhXUCE8p_9vdTgSMVjtQkFGpsXih-Hw8rcy7N_HH_LWz-C2ZIA9i2sV3tEHNpTgVhs9Z0WTISirTXdmSolv6JvlqkGETsq0CSFa-0xmhjWU036KB2C5nKBLpUP6AUwibcLDEc0_RoUka-Ia-a4QNVZuzME3pMxIaGOToYf1WLEHPeIQ';

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
          '-android uiautomator:new UiSelector().text("E-moped")'
        ).waitForEnabled();
    
        await driver.$(
          '-android uiautomator:new UiSelector().text("E-moped")'
        ).click();

          // Click Bike to unselect it
          await driver.$('-android uiautomator:new UiSelector().text("Bike")').waitForEnabled();
      
         await driver.$('-android uiautomator:new UiSelector().text("Bike")').click();

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
          'App-Version': '1.23776.3.23776',
          'App-Platform': 'android'
        },
        body: JSON.stringify({
          regionId: "",
          stationId: "",
          longitude: 4.477300196886063,
          latitude: 51.92350013464292,
          radius: 1166.6137310913994,
          zoomLevel: 15.25,
          subOperators: [],
          assetClasses: [24,17],
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
describe('Mocked Umob Scooters (with constant errors) trying Booking Tests', () => {
  let scooters;

  before(async () => {
  scooters = await fetchScooterCoordinates();

    const credentials = getCredentials();

    // await PageObjects.login(credentials);
    await PageObjects.login({ username: credentials.username, password: credentials.password });

    const targetScooter = scooters.find(
      scooter => scooter.id === 'UmobMock:QZGKL2BP2CI45_ROTTERDAM_EBIKE'
    );

    
    await AppiumHelpers.setLocationAndRestartApp(
      targetScooter.coordinates.longitude, 
      targetScooter.coordinates.latitude
    );

     await driver.pause(5000);
    /*
      // Find and click LOG IN button
      const logInBtn = await driver.$('-android uiautomator:new UiSelector().text("LOG IN")');
      await logInBtn.click();

      // Login form elements
      const usernameField = await driver.$("accessibility id:login_username_field");
      await expect(usernameField).toBeDisplayed();
      await usernameField.addValue("new@gmail.com");

      const passwordField = await driver.$("accessibility id:login_password_field");
      await expect(passwordField).toBeDisplayed();
      await passwordField.addValue("123Qwerty!");

      const loginButtonText = await driver.$("accessibility id:login_button-text");
      await expect(loginButtonText).toBeDisplayed();
      await loginButtonText.click();

      const loginButton = await driver.$("accessibility id:login_button");
      await expect(loginButton).toBeDisplayed();
      await loginButton.click();

      */

      // Handle permissions
      //const allowPermissionBtn = await driver.$("id:com.android.permissioncontroller:id/permission_allow_button");
      //await expect(allowPermissionBtn).toBeDisplayed();
      //await allowPermissionBtn.click();

      // Wait for welcome message
      //const welcomeMessage = await driver.$('-android uiautomator:new UiSelector().text("Welcome back!")');
      //await welcomeMessage.waitForEnabled({ timeout: 10000 });

      // Handle location permissions
      //const allowForegroundPermissionBtn = await driver.$("id:com.android.permissioncontroller:id/permission_allow_foreground_only_button");
      //await expect(allowForegroundPermissionBtn).toBeDisplayed();
      //await allowForegroundPermissionBtn.click();


        
        // Check Account is presented

         await driver.terminateApp("com.umob.umob");


  });

  beforeEach(async () => {
    await driver.activateApp("com.umob.umob");
        // Wait for screen to be loaded

        

  });

  /////////////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////////////
  it('Positive Scenario: Book Mocked Umob Scooter with ID UmobMock:QZGKL2BP2CI14_ROTTERDAM_SCOOTER', async () => {


    const testId = "d9a5953f-e2ab-42f4-9193-ed2fece1bd08"
   // Send results
let testStatus = "Pass";
let screenshotPath = "";
let testDetails = ""
let error = null;

try {
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


// Define zoom parameters
const startDistance = 50; // Initial distance between fingers
const endDistance = 200;  // Final distance (larger = more zoom)



async function performDoubleClick(driver, x, y) {
    try {
        // Try the mobile command first (works on real devices)
        await driver.execute('mobile: doubleClickGesture', { x, y });
    } catch (error) {
        console.log('Mobile double click failed, using fallback method');
        

        // Alternative fallback using performActions (W3C standard)
        
        await driver.performActions([{
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x, y },
                { type: 'pointerDown' },
                { type: 'pointerUp' },
                { type: 'pause', duration: 50 },
                { type: 'pointerDown' },
                { type: 'pointerUp' }
            ]
        }]);
        await driver.releaseActions();
        
      }
}

// Usage in your tests
await performDoubleClick(driver, centerX, centerY);






// await driver.execute('mobile: pinchOpenGesture', {
//     left: centerX - 100,
//     top: centerY - 100,
//     width: 200,
//     height: 200,
//     percent: 0.8,          // 0.8 = 80% zoom in (use values like 0.1 to 1.0)
//     speed: 1000
// });

    await driver.pause(4000);
  

await driver.execute('mobile: clickGesture', {
    x: centerX,
    y: centerY
});

    await driver.pause(4000);

    // Click exactly in the center
     await driver
      .action("pointer")
      .move({ x: centerX, y: centerY })
      .down()
      .up()
      .perform();

            execSync(
        `adb shell input tap ${centerX}  ${centerY}`
      );

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
      '-android uiautomator:new UiSelector().text("No ride credit")'
    ).click();


    // Click Start
    await driver.$(
      '-android uiautomator:new UiSelector().text("START TRIP")'
    ).waitForEnabled();

    await driver.$(
      '-android uiautomator:new UiSelector().text("START TRIP")'
    ).click();
    await driver.pause(10000);

                    // Click End Trip
                    await driver.$(
                      '-android uiautomator:new UiSelector().text("END TRIP")'
                    ).waitForEnabled();

                    await driver.pause(10000);
                
                    await driver.$(
                      '-android uiautomator:new UiSelector().text("END TRIP")'
                    ).click();


                    await driver.pause(10000);

              // Click Got it!
              await driver.$(
                '-android uiautomator:new UiSelector().text("GOT IT!")'
              ).waitForEnabled();
              
          
              await driver.$(
                '-android uiautomator:new UiSelector().text("GOT IT!")'
              ).click();

                            await driver.$(
                '-android uiautomator:new UiSelector().text("INVITE FRIENDS NOW!")'
              ).waitForEnabled();
              
          
              await driver.$(
                '-android uiautomator:new UiSelector().text("INVITE FRIENDS NOW!")'
              ).click();

              await driver.$(
                '-android uiautomator:new UiSelector().text("Invite your friends")'
              ).waitForEnabled();

                  // Verify back button is present
    const backButton = await driver.$("-android uiautomator:new UiSelector().resourceId(\"back_button\")");
    await expect(backButton).toBeDisplayed();

                  // Verify back button is present
  await backButton.click();

          // Wait for Home screen to be loaded
                    // Wait for Home screen to be loaded
          await PageObjects.clickAccountButton();


    // Navigate to My Rides & Tickets
    const myRidesAndTicketsButton = await driver.$("-android uiautomator:new UiSelector().text(\"My Rides & Tickets\")");
    await driver.pause(1000);
    await myRidesAndTicketsButton.click();

    await driver.pause(5000);

// Todo: Click on last booking
    
   // Verify Screen Header
   const headerTitle = await driver.$('//*[@resource-id="undefined-header-title"]');
   await expect(headerTitle).toBeDisplayed();
   await expect(await headerTitle.getText()).toBe('Ride');
 
   // Verify Basic Ride Information
   const dateElement = await driver.$(
     '//*[@text="UmobMock"]'
   );
   await expect(dateElement).toBeDisplayed();
 
   const priceElement = await driver.$(
     '//*[@text="€1.25"]'
   );
   await expect(priceElement).toBeDisplayed();
 
   // Verify Route Information
   const startLocationElement = await driver.$(
     '//*[@text="Weena 10, 3012 CM Rotterdam, Netherlands"]');
   await expect(startLocationElement).toBeDisplayed();
   await expect(await startLocationElement.getText()).toBe('Poortstraat, 3013 AL Rotterdam, Netherlands');

 
   // Verify Pricing Details
   const travelCostElement = await driver.$('//*[@text="Travel cost"]');
   await expect(travelCostElement).toBeDisplayed();
 
   const travelCostValueElement = await driver.$('//*[@text="€1.25"]');
   await expect(travelCostValueElement).toBeDisplayed();
 
   const totalAmountElement = await driver.$('//*[@text="Total amount"]');
   await expect(totalAmountElement).toBeDisplayed();
 
   const totalAmountValueElement = await driver.$('//*[@text="€1.25"]');
   await expect(totalAmountValueElement).toBeDisplayed();
 
   // Verify Payments Section
   const paymentsHeaderElement = await driver.$('//*[@text="Payments"]');
   await expect(paymentsHeaderElement).toBeDisplayed();

   await driver.executeScript('mobile: scrollGesture', [{
    left: 100, 
    top: 1000, 
    width: 200, 
    height: 800, 
    direction: 'down',
    percent: 100.0
  }]);
 
   // Verify Transaction Details
 
   const statusElement = await driver.$('//*[@text="Completed"]');
   await expect(statusElement).toBeDisplayed();
 
  

                    // Click GOT IT
                    await driver.$(
                      '-android uiautomator:new UiSelector().text("GOT IT")'
                    ).waitForEnabled();
                
                    await driver.$(
                      '-android uiautomator:new UiSelector().text("GOT IT")'
                    ).click();

          // Wait for Home screen to be loaded


  } catch (e) {
  error = e;
  console.error("Test failed:", error);
  testStatus = "Fail";
  testDetails = e.message;

  console.log("TEST 123")

  // Capture screenshot on failure
  screenshotPath = "./screenshots/"+ testId+".png";
try {
  await driver.saveScreenshot(screenshotPath);
} catch (error) {
  console.warn("Driver screenshot failed, using adb fallback");
  execSync(`adb exec-out screencap -p > ${screenshotPath}`);
}
  
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

  

  

  ////////////////////////////////////////////////////////////////////////////////////
  it('Negative Scenario:Trying to Book Scooter with Vehicle Not Operational Error', async () => {

    const testId = "ed09a7fa-5dd5-40df-b9d2-8624f46ba77b"
   // Send results
let testStatus = "Pass";
let screenshotPath = "";
let testDetails = ""
let error = null;

try {


    const targetScooter = scooters.find(
      scooter => scooter.id === 'UmobMock:SCOOTER_UNLOCK_ERROR_VEHICLE_NOT_OPERATIONAL'
    );

    // Set location to specific scooter coordinates
    await AppiumHelpers.setLocationAndRestartApp(
      targetScooter.coordinates.longitude, 
      targetScooter.coordinates.latitude
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

async function performDoubleClick(driver, x, y) {
    try {
        // Try the mobile command first (works on real devices)
        await driver.execute('mobile: doubleClickGesture', { x, y });
    } catch (error) {
        console.log('Mobile double click failed, using fallback method');
      
        
        // Alternative fallback using performActions (W3C standard)
        
        await driver.performActions([{
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x, y },
                { type: 'pointerDown' },
                { type: 'pointerUp' },
                { type: 'pause', duration: 50 },
                { type: 'pointerDown' },
                { type: 'pointerUp' }
            ]
        }]);
        await driver.releaseActions();
        
    }
}

// Usage in your tests
await performDoubleClick(driver, centerX, centerY);

// await driver.execute('mobile: pinchOpenGesture', {
//     left: centerX - 100,
//     top: centerY - 100,
//     width: 200,
//     height: 200,
//     percent: 0.8,          // 0.8 = 80% zoom in (use values like 0.1 to 1.0)
//     speed: 1000
// });

    // Click exactly in the center
    await driver
      .action("pointer")
      .move({ x: centerX, y: centerY })
      .down()
      .up()
      .perform();

      //choose card payment
      await driver.$(
      '-android uiautomator:new UiSelector().textContains("multi")'
    ).waitForEnabled();


      await driver.$(
      '-android uiautomator:new UiSelector().textContains("multi")'
    ).click();

    await driver.$(
      '-android uiautomator:new UiSelector().text("No ride credit")'
    ).click();

        // Click Start
        await driver.$(
          '-android uiautomator:new UiSelector().text("START TRIP")'
        ).waitForEnabled();
    
        await driver.$(
          '-android uiautomator:new UiSelector().text("START TRIP")'
        ).click();

    // Wait for Vehicle Not Operational error message
    await driver.$(
      '-android uiautomator:new UiSelector().text("VEHICLE_NOT_OPERATIONAL (60000)")'
    ).waitForDisplayed();

} catch (e) {
  error = e;
  console.error("Test failed:", error);
  testStatus = "Fail";
  testDetails = e.message;

  console.log("TEST 123")

  // Capture screenshot on failure
  screenshotPath = "./screenshots/"+ testId+".png";
try {
  await driver.saveScreenshot(screenshotPath);
} catch (error) {
  console.warn("Driver screenshot failed, using adb fallback");
  execSync(`adb exec-out screencap -p > ${screenshotPath}`);
}
  
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



  ////////////////////////////////////////////////////////////////////////////////
  it('Negative Scenario: Trying to Book Scooter with User Blocked Error', async () => {

    const testId = "6a795f12-ef0e-441b-8922-24b3cf1c35cb"
   // Send results
let testStatus = "Pass";
let screenshotPath = "";
let testDetails = ""
let error = null;

try {

    const targetScooter = scooters.find(
      scooter => scooter.id === 'UmobMock:SCOOTER_UNLOCK_ERROR_USER_BLOCKED'
    );

    // Set location to specific scooter coordinates
    await AppiumHelpers.setLocationAndRestartApp(
      targetScooter.coordinates.longitude, 
      targetScooter.coordinates.latitude
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


async function performDoubleClick(driver, x, y) {
    try {
        // Try the mobile command first (works on real devices)
        await driver.execute('mobile: doubleClickGesture', { x, y });
    } catch (error) {
        console.log('Mobile double click failed, using fallback method');
        
        
        // Alternative fallback using performActions (W3C standard)
        
        await driver.performActions([{
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x, y },
                { type: 'pointerDown' },
                { type: 'pointerUp' },
                { type: 'pause', duration: 50 },
                { type: 'pointerDown' },
                { type: 'pointerUp' }
            ]
        }]);
        await driver.releaseActions();
        
    }
}

// Usage in your tests
await performDoubleClick(driver, centerX, centerY);




// await driver.execute('mobile: pinchOpenGesture', {
//     left: centerX - 100,
//     top: centerY - 100,
//     width: 200,
//     height: 200,
//     percent: 0.8,          // 0.8 = 80% zoom in (use values like 0.1 to 1.0)
//     speed: 1000
// });


    // Click exactly in the center
    await driver
      .action("pointer")
      .move({ x: centerX, y: centerY })
      .down()
      .up()
      .perform();


      //choose card payment
      await driver.$(
      '-android uiautomator:new UiSelector().textContains("multi")'
    ).waitForEnabled();


      await driver.$(
      '-android uiautomator:new UiSelector().textContains("multi")'
    ).click();

    await driver.$(
      '-android uiautomator:new UiSelector().text("No ride credit")'
    ).click();


        // Click Start
        await driver.$(
          '-android uiautomator:new UiSelector().text("START TRIP")'
        ).waitForEnabled();
    
        await driver.$(
          '-android uiautomator:new UiSelector().text("START TRIP")'
        ).click();

    // Wait for User Blocked error message
    await driver.$(
      '-android uiautomator:new UiSelector().text("USER_BLOCKED (60000)")'
    ).waitForDisplayed();

  } catch (e) {
    error = e;
    console.error("Test failed:", error);
    testStatus = "Fail";
    testDetails = e.message;

    console.log("TEST 123")

    // Capture screenshot on failure
    screenshotPath = "./screenshots/"+ testId+".png";
try {
  await driver.saveScreenshot(screenshotPath);
} catch (error) {
  console.warn("Driver screenshot failed, using adb fallback");
  execSync(`adb exec-out screencap -p > ${screenshotPath}`);
}
    
  } finally {
    // Submit test run result
    try {

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


        ////////////////////////////////////////////////////////////////////////////////
    it('Negative Scenario: Trying to Book Scooter with Geo Error (UmobMock:SCOOTER_LOCK_ERROR_TRIP_GEO_ERROR)', async () => {

      const testId = "0936a98c-92e6-45da-a673-22d127c1a7d5"
   // Send results
let testStatus = "Pass";
let screenshotPath = "";
let testDetails = ""
let error = null;

try {

      const targetScooter = scooters.find(
        scooter => scooter.id === 'UmobMock:SCOOTER_LOCK_ERROR_TRIP_GEO_ERROR'
      );
  
      // Set location to specific scooter coordinates
      await AppiumHelpers.setLocationAndRestartApp(
        targetScooter.coordinates.longitude, 
        targetScooter.coordinates.latitude
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

async function performDoubleClick(driver, x, y) {
    try {
        // Try the mobile command first (works on real devices)
        await driver.execute('mobile: doubleClickGesture', { x, y });
    } catch (error) {
        console.log('Mobile double click failed, using fallback method');
        
        
        // Alternative fallback using performActions (W3C standard)
        
        await driver.performActions([{
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x, y },
                { type: 'pointerDown' },
                { type: 'pointerUp' },
                { type: 'pause', duration: 50 },
                { type: 'pointerDown' },
                { type: 'pointerUp' }
            ]
        }]);
        await driver.releaseActions();
        
    }
}

// Usage in your tests
await performDoubleClick(driver, centerX, centerY);
  
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

      //choose card payment
      await driver.$(
      '-android uiautomator:new UiSelector().textContains("multi")'
    ).waitForEnabled();


      await driver.$(
      '-android uiautomator:new UiSelector().textContains("multi")'
    ).click();

    await driver.$(
      '-android uiautomator:new UiSelector().text("No ride credit")'
    ).click();
  
          // Click Start
          await driver.$(
            '-android uiautomator:new UiSelector().text("START TRIP")'
          ).waitForEnabled();
      
          await driver.$(
            '-android uiautomator:new UiSelector().text("START TRIP")'
          ).click();
          await driver.pause(10000);

                // Click End Trip
                await driver.$(
                  '-android uiautomator:new UiSelector().text("END TRIP")'
                ).waitForEnabled();
            
                await driver.$(
                  '-android uiautomator:new UiSelector().text("END TRIP")'
                ).click();
  
      // Wait for error message (adjust text as per actual error message)
      await driver.$(
        '-android uiautomator:new UiSelector().textContains("TRIP_GEO_ERROR (60000)")'
      ).waitForDisplayed();

        // Click Retry
        await driver.$(
          '-android uiautomator:new UiSelector().text("RETRY")'
        ).waitForEnabled();
    
        await driver.$(
          '-android uiautomator:new UiSelector().text("RETRY")'
        ).click();

        await driver.pause(5000);
        // Click Retry
        await driver.$(
          '-android uiautomator:new UiSelector().text("RETRY")'
        ).waitForEnabled();
    
        await driver.$(
          '-android uiautomator:new UiSelector().text("RETRY")'
        ).click();
        await driver.pause(5000);

        // Click Retry
        await driver.$(
          '-android uiautomator:new UiSelector().text("RETRY")'
        ).waitForEnabled();
    
        await driver.$(
          '-android uiautomator:new UiSelector().text("RETRY")'
        ).click();
        // await driver.terminateApp("com.umob.umob");
        // await driver.activateApp("com.umob.umob");

        //                 // Click End Trip
        //                 await driver.$(
        //                   '-android uiautomator:new UiSelector().text("END TRIP")'
        //                 ).waitForEnabled();
                    
        //                 await driver.$(
        //                   '-android uiautomator:new UiSelector().text("END TRIP")'
        //                 ).click();
              // Click Retry
              // await driver.$(
              //   '-android uiautomator:new UiSelector().text("RETRY")'
              // ).waitForEnabled();
          
              // await driver.$(
              //   '-android uiautomator:new UiSelector().text("RETRY")'
              // ).click();

                     await driver.pause(10000);

              // Click Details
              await driver.$(
                '-android uiautomator:new UiSelector().text("GOT IT!")'
              ).waitForEnabled();
          
              await driver.$(
                '-android uiautomator:new UiSelector().text("GOT IT!")'
              ).click();
    
   // Verify Screen Header
   const headerTitle = await driver.$('//*[@resource-id="undefined-header-title"]');
   await expect(headerTitle).toBeDisplayed();
   await expect(await headerTitle.getText()).toBe('Ride');
 
   // Verify Basic Ride Information
   const dateElement = await driver.$(
     '//*[@text="UmobMock"]'
   );
   await expect(dateElement).toBeDisplayed();
 
   const priceElement = await driver.$(
     '//*[@text="€1.25"]'
   );
   await expect(priceElement).toBeDisplayed();
 
   // Verify Route Information
   const startLocationElement = await driver.$(
     '//*[@text="Weena 373, 3013 AL Rotterdam, Netherlands"]'
   );
   await expect(startLocationElement).toBeDisplayed();
   await expect(await startLocationElement.getText()).toBe('Weena 373, 3013 AL Rotterdam, Netherlands');

 
   // Verify Pricing Details
   const travelCostElement = await driver.$('//*[@text="Travel cost"]');
   await expect(travelCostElement).toBeDisplayed();
 
   const travelCostValueElement = await driver.$('//*[@text="€1.25"]');
   await expect(travelCostValueElement).toBeDisplayed();
 
   const totalAmountElement = await driver.$('//*[@text="Total amount"]');
   await expect(totalAmountElement).toBeDisplayed();
 
   const totalAmountValueElement = await driver.$('//*[@text="€1.25"]');
   await expect(totalAmountValueElement).toBeDisplayed();
 
   // Verify Payments Section
   const paymentsHeaderElement = await driver.$('//*[@text="Payments"]');
   await expect(paymentsHeaderElement).toBeDisplayed();
 
   // Verify Transaction Details
 
   const statusElement = await driver.$('//*[@text="Completed"]');
   await expect(statusElement).toBeDisplayed();
 
   await driver.executeScript('mobile: scrollGesture', [{
    left: 100, 
    top: 1000, 
    width: 200, 
    height: 800, 
    direction: 'down',
    percent: 10.0
  }]);

                    // Click GOT IT
                    await driver.$(
                      '-android uiautomator:new UiSelector().text("GOT IT")'
                    ).waitForEnabled();
                
                    await driver.$(
                      '-android uiautomator:new UiSelector().text("GOT IT")'
                    ).click();

          // Wait for Home screen to be loaded

    //           // Click CLose
    //           await driver.$(
    //             '-android uiautomator:new UiSelector().text("CLOSE")'
    //           ).waitForEnabled();
          
    //           await driver.$(
    //             '-android uiautomator:new UiSelector().text("CLOSE")'
    //           ).click();

} catch (e) {
  error = e;
  console.error("Test failed:", error);
  testStatus = "Fail";
  testDetails = e.message;

  console.log("TEST 123")

  // Capture screenshot on failure
  screenshotPath = "./screenshots/"+ testId+".png";
try {
  await driver.saveScreenshot(screenshotPath);
} catch (error) {
  console.warn("Driver screenshot failed, using adb fallback");
  execSync(`adb exec-out screencap -p > ${screenshotPath}`);
}
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