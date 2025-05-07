import { execSync } from "child_process";
import submitTestRun from '../../helpers/SendResults.js';
import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to load credentials based on environment and user
function getCredentials(environment = 'test', userKey = null) {
  try {
    const credentialsPath = path.resolve(__dirname, '../../../config/credentials.json');
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    
    // Check if environment exists
    if (!credentials[environment]) {
      console.warn(`Environment '${environment}' not found in credentials file. Using 'test' environment.`);
      environment = 'test';
    }
    
    const envUsers = credentials[environment];
    
    // If no specific user is requested, use the first user in the environment
    if (!userKey) {
      userKey = Object.keys(envUsers)[0];
    } else if (!envUsers[userKey]) {
      console.warn(`User '${userKey}' not found in '${environment}' environment. Using first available user.`);
      userKey = Object.keys(envUsers)[0];
    }
    
    // Return the user credentials
    return {
      username: envUsers[userKey].username,
      password: envUsers[userKey].password
    };
  } catch (error) {
    console.error('Error loading credentials:', error);
    throw new Error('Failed to load credentials configuration');
  }
}

// Get environment and user from env variables or use defaults
const ENV = process.env.TEST_ENV || 'test';
const USER = process.env.TEST_USER || 'new';

/////////////////////////////////////////////////////////////////////////////////

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
        await driver.$('-android uiautomator:new UiSelector().text("E-moped")').waitForEnabled();
    
        await driver.$('-android uiautomator:new UiSelector().text("E-moped")').click();

        // Click Scooter to unselect it
        await driver.$('-android uiautomator:new UiSelector().text("Scooter")').waitForEnabled();
    
        await driver.$('-android uiautomator:new UiSelector().text("Scooter")').click();


          // Click Bike to unselect it
          //await driver.$(
          //  '-android uiautomator:new UiSelector().text("Bike")'
          //).waitForEnabled();
      
         // await driver.$(
         //   '-android uiautomator:new UiSelector().text("Bike")'
         // ).click();

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
          'App-Version': '1.23684.3.23684',
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
describe('Mocked Umob Bikes (with constant errors) trying Booking Tests', () => {
  let scooters;


  before(async () => {
    // Fetch scooter coordinates before running tests
    scooters = await fetchScooterCoordinates();

    const credentials = getCredentials(ENV, USER);

    // await PageObjects.login(credentials);
    await PageObjects.login({ username: credentials.username, password: credentials.password });

    const targetScooter = scooters.find(
      scooter => scooter.id === 'UmobMock:QZGKL2BP2CI45_ROTTERDAM_EBIKE'
    );

    
    execSync(
      `adb shell am startservice -e longitude ${targetScooter.coordinates.longitude} -e latitude ${targetScooter.coordinates.latitude} io.appium.settings/.LocationService`
    );

    try {
      execSync("adb emu geo fix "+ targetScooter.coordinates.longitude+" "+ targetScooter.coordinates.latitude);
    } catch (error) {
      console.error("Failed to set location:", error);
    }


    /*
      // Find and click LOG IN button
      const logInBtn = await driver.$('-android uiautomator:new UiSelector().text("LOG IN")');
      await driver.pause(2000);
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

      

      // Handle permissions
      const allowPermissionBtn = await driver.$("id:com.android.permissioncontroller:id/permission_allow_button");
      await expect(allowPermissionBtn).toBeDisplayed();
      await allowPermissionBtn.click();

      

      // Wait for welcome message
      //const welcomeMessage = await driver.$('-android uiautomator:new UiSelector().text("Welcome back!")');
      //await welcomeMessage.waitForEnabled({ timeout: 10000 });

      // Handle location permissions
      const allowForegroundPermissionBtn = await driver.$("id:com.android.permissioncontroller:id/permission_allow_foreground_only_button");
      await expect(allowForegroundPermissionBtn).toBeDisplayed();
      await allowForegroundPermissionBtn.click();


      */
        
        // Check Account button is present
    await PageObjects.accountButton.waitForExist();
    


  });

  beforeEach(async () => {
    await driver.activateApp("com.umob.umob");
        // Wait for screen to be loaded
       
    await PageObjects.accountButton.waitForExist();
    
  });


  ////////////////////////////////////////////////////////////////////////////////
  it('Positive Scenario: Book Mocked Umob Bike with ID UmobMock:QZGKL2BP2CI45_ROTTERDAM_EBIKE', async () => {


    const testId = "bcc7fe09-7a38-4ae4-a952-35020cd08cf7"
   // Send results
let testStatus = "Pass";
let screenshotPath = "";
let testDetails = ""
let error = null;

try {
 
    await driver.pause(4000);

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

              // Click Details
              await driver.$(
                '-android uiautomator:new UiSelector().text("DETAILS")'
              ).waitForEnabled();
          
              await driver.$(
                '-android uiautomator:new UiSelector().text("DETAILS")'
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
     '//*[@text="Weena 10, 3012 CM Rotterdam, Netherlands"]'
   );
   await expect(startLocationElement).toBeDisplayed();
   await expect(await startLocationElement.getText()).toBe('Weena 10, 3012 CM Rotterdam, Netherlands');

 
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

           //check main screen is displayed

            await PageObjects.accountButton.waitForExist();

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

  ////////////////////////////////////////////////////////////////////////////////////
  
//////////////////////////////////////////////////////////////////////////////////////////////////
    
    it('Negative Scenario: Trying to Book Bike with Geo OUTSIDE OF SERVICE AREA (UmobMock:QZGKL2BP2CI35_ROTTERDAM_EBIKE)', async () => {

      const testId = "bc02c0ce-4c5f-4649-8f7f-d0f16ee79e86"
   // Send results
let testStatus = "Pass";
let screenshotPath = "";
let testDetails = ""
let error = null;

try {

      const targetScooter = scooters.find(
        scooter => scooter.id === 'UmobMock:QZGKL2BP2CI35_ROTTERDAM_EBIKE'
      );

    // Set location to specific scooter coordinates
      execSync(
        `adb shell am startservice -e longitude ${targetScooter.coordinates.longitude} -e latitude ${targetScooter.coordinates.latitude} io.appium.settings/.LocationService`
      );
      await driver.pause(5000);
  
          // Filter not needed results
          //await applyFilters();
  
  
      const { centerX, centerY } = await getScreenCenter();
  
      // Click exactly in the center
      await driver
        .action("pointer")
        .move({ x: centerX, y: centerY })
        .down()
        .up()
        .perform();

        // test notification about service area
      await driver.$(
        '-android uiautomator:new UiSelector().text("Outside of service area!")'
      ).waitForDisplayed();

          // Click Cancel
      await driver.$(
        '-android uiautomator:new UiSelector().text("CANCEL")'
      ).waitForEnabled();

  
      await driver.$(
        '-android uiautomator:new UiSelector().text("CANCEL")'
      ).click();

     // Check Account button is present
    await PageObjects.accountButton.waitForExist();
    

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

        ////////////////////////////////////////////////////////////////////////////////
   

  afterEach(async () => {
    await driver.terminateApp("com.umob.umob");
  });

  

});