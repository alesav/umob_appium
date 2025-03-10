import { execSync } from "child_process";
import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import submitTestRun from '../../helpers/SendResults.js';

const API_URL = 'https://backend-test.umobapp.com/api/tomp/mapboxmarkers';
const AUTH_TOKEN = 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkFGNkFBNzZCMUFEOEI4QUJCQzgzRTAzNjBEQkQ4MkYzRjdGNDE1MDMiLCJ4NXQiOiJyMnFuYXhyWXVLdThnLUEyRGIyQzhfZjBGUU0iLCJ0eXAiOiJhdCtqd3QifQ.eyJpc3MiOiJodHRwczovL2JhY2tlbmQtdGVzdC51bW9iYXBwLmNvbS8iLCJleHAiOjE3NDU5MTE1MDksImlhdCI6MTczODEzNTUwOSwiYXVkIjoidU1vYiIsInNjb3BlIjoib2ZmbGluZV9hY2Nlc3MgdU1vYiIsImp0aSI6IjgwODcyNmQ4LWRhNzEtNDI5Zi1iYTE2LWU4MjA4Y2IwMzkwNiIsInN1YiI6IjA1Nzg4NjE2LTc3NDUtNDJiZC05MjgyLTI2ZGM3MmU2OWJhNiIsInVuaXF1ZV9uYW1lIjoibmV3NkBnbWFpbC5jb20iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJuZXc2QGdtYWlsLmNvbSIsImdpdmVuX25hbWUiOiJMaW1pdGxlc3MgIiwiZmFtaWx5X25hbWUiOiJOZXc2IiwiZW1haWwiOiJuZXc2QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoiRmFsc2UiLCJwaG9uZV9udW1iZXIiOiIrMzE2MTY1NjE5MDkiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOiJUcnVlIiwib2lfcHJzdCI6InVNb2JfQXBwX09wZW5JZGRpY3QiLCJvaV9hdV9pZCI6ImFiNWRhNTYwLWQ4YWQtMjdjNy00YzMxLTNhMTdjMzFmZjI2MSIsImNsaWVudF9pZCI6InVNb2JfQXBwX09wZW5JZGRpY3QiLCJvaV90a25faWQiOiJiOTE1YzQ5OS0yNmY3LTliOTktYzM3Zi0zYTE3YzMxZmYyYTUifQ.ByPVz_kFwrxDY57_zqqJQZ7VLz76aZcEvSqLpNlIx2xzyjF3Azdnut6oq1P95Ij2E4Wjhsv1N5efciATjzEcOIGyRdGNxsfCV_F1Ci5DRrQaDOK362hVhpiVbdbGQWeR8S4qFYUHum-wFWgYBZB5bBiz91Vr_odMtVAzyk277W1gXF0DsbPHXVX7gC8zzN-sRvCad5ixbQHGOQ0uOEgHZXX15vAJZOA6PmqgLlP_d_8_2YbYn2kT8ha1brRv00T5MFplyVOjAV8eoKkZ32KYiQ456VAGxYBt9wdD-BC1vz1d2GOnUbyHJdZMEDRzT0Ylt5_TcF3bqf-wnpAhGJeu6A';

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
          'App-Version': '1.23429.3.23429',
          'App-Platform': 'android'
        },
        body: JSON.stringify({
          regionId: "",
          stationId: "",
          longitude: 4.470424,
          latitude: 51.922954,
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
describe('Felyx Booking Test with unlimited multi voucher', () => {
  let scooters;

  before(async () => {
    // Fetch scooter coordinates before running tests
    scooters = await fetchScooterCoordinates();

      // Find and click LOG IN button
      const logInBtn = await driver.$('-android uiautomator:new UiSelector().text("LOG IN")');
      await logInBtn.isClickable();
      await logInBtn.click();

      await PageObjects.login({ username:'new6@gmail.com', password: '123Qwerty!' });


  });

  beforeEach(async () => {
    await driver.activateApp("com.umob.umob");
        // Wait for screen to be loaded

        await PageObjects.accountButton.waitForExist();

  });

  ////////////////////////////////////////////////////////////////////////////////
  it('Book Felyx moped with multi voucher', async () => {
    
    const testId = "9a8a6f87-2ccd-42c9-9676-b1bd0b8b27a3"
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

    // Click Understood
    // await driver.$(
    //   '-android uiautomator:new UiSelector().text("UNDERSTOOD")'
    // ).waitForEnabled();

    // await driver.$(
    //   '-android uiautomator:new UiSelector().text("UNDERSTOOD")'
    // ).click();
    await driver.pause(5000);

  

//verify that limitless multi user's vaucher is visible
const vaucher = await driver.$('-android uiautomator:new UiSelector().textContains("multi")');
await expect (vaucher).toBeDisplayed();

//verify that payment card is displayed
const selectPayment = await driver.$('-android uiautomator:new UiSelector().text("**** **** 1115")');
await expect (selectPayment).toBeDisplayed();



//verify start trip button is enabled AND CLICK
const startTrip = await driver.$('-android uiautomator:new UiSelector().text("START TRIP")');
await startTrip.waitForDisplayed();
await startTrip.waitForEnabled();
await driver.pause(5000);
await startTrip.click();

await driver.pause(30000);

//verify that ride unlocked
const unlockHeader = await driver.$('-android uiautomator:new UiSelector().text("Ride unlocked")');
await expect (unlockHeader).toBeDisplayed();

//verify ride status
const rideStatus = await driver.$('-android uiautomator:new UiSelector().text("Ride successfully unlocked.")');
await expect (rideStatus).toBeDisplayed();


//verify operator Felyx
const operator = await driver.$('-android uiautomator:new UiSelector().text("Felyx")');
await expect (operator).toBeDisplayed();

//click start riding button
await driver.pause(15000);
const startButton = await driver.$('-android uiautomator:new UiSelector().text("START RIDING!")');
await expect (startButton).toBeDisplayed();
await startButton.click();
await driver.pause(10000);

//verify grab helmet header
const grabHelmet = await driver.$('-android uiautomator:new UiSelector().text("Grab the helmet")');
await expect (grabHelmet).toBeDisplayed();

//verify anouncement
const anouncement = await driver.$('-android uiautomator:new UiSelector().textContains("A helmet is mandatory for this scooter.")');
await expect (anouncement).toBeDisplayed();

//verify instruction
const instruction = await driver.$('-android uiautomator:new UiSelector().textContains("Open the top case by pressing the red button")');
await expect (instruction).toBeDisplayed();

//verify open helmet case button
const openCase = await driver.$('-android uiautomator:new UiSelector().text("OPEN HELMET CASE")');
await expect (openCase).toBeDisplayed();

//verify continue button
await driver.pause(10000);
const continueB = await driver.$('-android uiautomator:new UiSelector().text("CONTINUE")');
await expect (continueB).toBeDisplayed();
await continueB.click();

//verify pause button
const pauseButton = await driver.$('-android uiautomator:new UiSelector().text("PAUSE")');
await expect (pauseButton).toBeDisplayed();
await driver.pause(15000);

// Click End Trip
await driver.$(
  '-android uiautomator:new UiSelector().text("END TRIP")'
).waitForEnabled();

await driver.$(
  '-android uiautomator:new UiSelector().text("END TRIP")'
).click();

await driver.pause(15000);


//verify anouncement for return helmet
const helmetBack = await driver.$('-android uiautomator:new UiSelector().text("Return helmet")');
await expect (helmetBack).toBeDisplayed();


//verify helmet putting back instruction
const instruction2 = await driver.$('-android uiautomator:new UiSelector().textContains("Open the top case by pressing the red button")');
await expect (instruction2).toBeDisplayed();


//verify open case button for the helmet
const helmetButton = await driver.$('-android uiautomator:new UiSelector().text("OPEN HELMET CASE")');
await expect (helmetButton).toBeDisplayed();
await driver.pause(10000);

//verify and click continue button
const continueB2 = await driver.$('-android uiautomator:new UiSelector().text("CONTINUE")');
await expect (continueB2).toBeDisplayed();
await continueB2.click();

await driver.pause(10000);

//allow permissions for take a photo

const permission = await driver.$("id:com.android.permissioncontroller:id/permission_allow_foreground_only_button");
await expect(permission).toBeDisplayed();
await permission.click();
await driver.pause(20000);

//verify parking photo header
const parkingHeader = await driver.$('-android uiautomator:new UiSelector().text("Parking photo required")');
await expect (parkingHeader).toBeDisplayed();


//verify photo instruction
const photoInstruction = await driver.$('-android uiautomator:new UiSelector().textContains("Take a photo of your vehicle to end your ride")');
await expect (photoInstruction).toBeDisplayed();

//take a picture
const photoButton = await driver.$('~endTrip');
await photoButton.click();




await driver.pause(17000);
//verify confirmation for using a picture
const pictureHeader = await driver.$('-android uiautomator:new UiSelector().text("Use this picture?")');
await expect (pictureHeader).toBeDisplayed();

//verify parking rules
const parkingRules = await driver.$('-android uiautomator:new UiSelector().textContains("Please check if the vehicle is parked")');
await expect (parkingRules).toBeDisplayed();

//verify retake picture button
const retakeButton = await driver.$('-android uiautomator:new UiSelector().text("RETAKE")');
await expect (retakeButton).toBeDisplayed();


//verify use picture button
const useButton = await driver.$('-android uiautomator:new UiSelector().text("USE PICTURE")');
await expect (useButton).toBeDisplayed();
await driver.pause(15000);
await useButton.click();

await driver.pause(20000);
//verify end screen for the ride
const thanks = await driver.$('-android uiautomator:new UiSelector().textContains("Thanks")');
await expect (thanks).toBeDisplayed();

const felyxName = await driver.$('-android uiautomator:new UiSelector().text("Felyx")');
await expect (felyxName).toBeDisplayed();

const euro = await driver.$('-android uiautomator:new UiSelector().textContains("€")');
await expect (euro).toBeDisplayed();

const closeB = await driver.$('-android uiautomator:new UiSelector().text("CLOSE")');
await expect (closeB).toBeDisplayed();


const details = await driver.$('-android uiautomator:new UiSelector().text("DETAILS")');
await expect (details).toBeDisplayed();
await details.click();
await driver.pause(5000);

//verify details ride screen
//verify header Ride
const header = await driver.$('-android uiautomator:new UiSelector().text("Ride")');
await expect(header).toBeDisplayed();

//verify that there is 0euro price
const zeroEuro = await driver.$('-android uiautomator:new UiSelector().textContains("€0.")');
await expect(zeroEuro).toBeDisplayed();

//verify used voucher is dispayed
const usedVoucher = await driver.$('-android uiautomator:new UiSelector().text("Used voucher")');
await expect(usedVoucher).toBeDisplayed();

//verify used voucher is dispayed
const multiVoucher1 = await driver.$('-android uiautomator:new UiSelector().textContains("multi")');
await expect(multiVoucher1).toBeDisplayed();

//Scroll to bottom
await driver.executeScript('mobile: scrollGesture', [{
  left: 100,
  top: 1500,
  width: 200,
  height: 100,
  direction: 'down',
  percent: 100
}]); 

//click got it button
const gotIt = await driver.$('-android uiautomator:new UiSelector().text("GOT IT")');
await expect(gotIt).toBeDisplayed();
await gotIt.click();

//verify that main map screen is displayed
await PageObjects.accountButton.waitForExist();
    await PageObjects.accountButton.click();

//verify that my account screen is displayed
const myRides = await driver.$('-android uiautomator:new UiSelector().text("My Rides & Tickets")');
await expect(myRides).toBeDisplayed();

//verify that payment is visible in my account and it is 0 Euro
// const lastRide = await driver.$('-android uiautomator:new UiSelector().textContains("€0")');
// await expect(lastRide).toBeDisplayed();

//click on my rides and tickets
await myRides.click();

//verify that payment is visible in my rides and tickets screen and it is 0 Euro
const lastRide1 = await driver.$('-android uiautomator:new UiSelector().textContains("€0")');
await expect(lastRide1).toBeDisplayed();




/*
                    // Click End Trip
                    await driver.$(
                      '-android uiautomator:new UiSelector().text("CANCEL")'
                    ).waitForEnabled();
                
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

*/

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