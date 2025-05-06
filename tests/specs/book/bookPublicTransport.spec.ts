import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import submitTestRun from '../../helpers/SendResults.js';
import { exec, execSync } from "child_process";
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
const USER = process.env.TEST_USER || '4bigfoot+10';

describe('Book Public Transport', () => {


    before(async () => {

      const credentials = getCredentials(ENV, USER);

    // await PageObjects.login(credentials);

    await PageObjects.login({ username: credentials.username, password: credentials.password });
    execSync("adb shell pm grant com.umob.umob android.permission.ACCESS_FINE_LOCATION")
    execSync("adb shell pm grant com.umob.umob android.permission.ACCESS_COARSE_LOCATION")
    
    execSync("adb shell pm list packages | grep io.appium.settings")
    execSync("adb shell geo fix 4.467446 51.9242868")

      /*
  
        // Find and click LOG IN button
        const logInBtn = await driver.$('-android uiautomator:new UiSelector().text("LOG IN")');
        await logInBtn.isClickable();
        await logInBtn.click();
  
        await PageObjects.login({ username:'4bigfoot+10@gmail.com', password: '123Qwerty!' });

        */

            // Set location to specific scooter coordinates
            execSync(
              `adb shell am startservice -e longitude 4.467446 -e latitude 51.9242868 io.appium.settings/.LocationService`
            );
  
  
    });

  it('should display all key elements on Plan Your Trip screen for Public Transport', async () => {

     const testId = "ef526412-4497-470b-bcf8-1854b13613c4"

// Send results
let testStatus = "Pass";
    let screenshotPath = "";
    let testDetails = ""
    let error = null;

    try {

    await driver.activateApp("com.umob.umob");
    await driver.pause(7000);    
    // const planTripButton = await driver.$("-android uiautomator:new UiSelector().text(\"PLAN TRIP\")");
    // await planTripButton.click();
    await PageObjects.planTripBtn.waitForExist();
	  await PageObjects.planTripBtn.click();

    await driver.pause(2000);

  //scroll to bottom
 await driver.executeScript('mobile: scrollGesture', [{
  left: 100,
  top: 1000,
  width: 200,
  height: 800,
  direction: 'down',
  percent: 100.0
}]);
await driver.pause(1000);

  //click to choose public transport
    const ptButton = await driver.$("-android uiautomator:new UiSelector().text(\"PUBLIC TRANSPORT\")");
    await expect(ptButton).toBeDisplayed();
    await ptButton.click();

    // Verify screen header
    const screenHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Plan your trip\")");
    await expect(screenHeader).toBeDisplayed();

    // Verify departure and destination input section
    const departureDestinationLabel = await driver.$("-android uiautomator:new UiSelector().text(\"Enter departure & destination points\")");
    await expect(departureDestinationLabel).toBeDisplayed();
    //await expect(departureDestinationLabel.getText()).toBe("Enter departure & destination points"); 

    

    // Verify destination input
    const destinationInput = await driver.$("-android uiautomator:new UiSelector().text(\"Destination\")");
    await expect(destinationInput).toBeDisplayed();


//Scroll to bottom
await driver.executeScript('mobile: scrollGesture', [{
  left: 100,
  top: 1500,
  width: 200,
  height: 100,
  direction: 'down',
  percent: 100
}]); 


    // Verify time switch buttons
    const departAtButton = await driver.$("-android uiautomator:new UiSelector().text(\"Depart at\")");
    const arriveByButton = await driver.$("-android uiautomator:new UiSelector().text(\"Arrive by\")");
    await expect(departAtButton).toBeDisplayed();
    await expect(arriveByButton).toBeDisplayed();

    // Verify date input
    const dateInput = await driver.$("-android uiautomator:new UiSelector().text(\"Today\")");
    await expect(dateInput).toBeDisplayed();

    // Verify time input
    const timeInput = await driver.$("-android uiautomator:new UiSelector().text(\"Now\")");
    await expect(timeInput).toBeDisplayed();

    // Verify train class section
    const selectClassLabel = await driver.$("-android uiautomator:new UiSelector().text(\"Select class (for trains)\")");
    await expect(selectClassLabel).toBeDisplayed();
    //await expect(selectClassLabel.getText()).toBe("Select class (for trains)");

    // Verify train class switch buttons
    const secondClassButton = await driver.$("-android uiautomator:new UiSelector().text(\"2nd class\")");
    const firstClassButton = await driver.$("-android uiautomator:new UiSelector().text(\"1st class\")");
    await expect(secondClassButton).toBeDisplayed();
    await expect(firstClassButton).toBeDisplayed();

    // Verify Continue button
    const continueButton = await driver.$("-android uiautomator:new UiSelector().text(\"CONTINUE\")");
    await expect(continueButton).toBeDisplayed();
    //await expect(continueButton.isEnabled()).toBe(false);

    // Verify Help button
    const helpButton = await driver.$("-android uiautomator:new UiSelector().text(\"Help\")");
    await expect(helpButton).toBeDisplayed();

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


  it('should put in destination and book a ticket for Public Transport', async () => {

    const testId = "25c6b504-c751-443e-9092-cc33a650d19c"

// Send results
let testStatus = "Pass";
    let screenshotPath = "";
    let testDetails = ""
    let error = null;

    try {


  // click on destination and text
  const el1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(1)");
  await el1.addValue("Blaak 31");
  await driver.pause(4000); 

// First get the element's location and size
const location = await el1.getLocation();
const size = await el1.getSize();


// Create a touch action to tap 50 pixels below the element
await browser.action('pointer', { parameters: { pointerType: 'touch' }})
    .move({ 
        x: location.x +100,
        y: location.y + size.height + 160
    })
    .down()
    .up()
    .perform();

    await driver.hideKeyboard();

    // Set location to specific scooter coordinates
    // execSync(
    //   `adb shell input tap ${location.x + 100}  ${location.y + size.height + 160}`
    // );

  const chooseFromList = await driver.$("-android uiautomator:new UiSelector().textContains(\"Blaak 31\")");
  await expect (chooseFromList).toBeDisplayed();
  //await chooseFromList.click();
  //await destinationAdd.click();
  //await destinationAdd.addValue("Rotterdam Zoo Rotterdam");



  // Verify the continue button becomes enabled after adding destination
  const continuePress = await driver.$("-android uiautomator:new UiSelector().text(\"CONTINUE\")");
  await expect(continuePress).toBeDisplayed();
  //await expect(continuePress.isEnabled()).toBe(true);
  await continuePress.click();
  await driver.pause(10000);

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


  it('should display all key elements and pick up the route', async () => {

    const testId = "a9cd327a-1c6c-450e-b299-48656dac1663"

// Send results
let testStatus = "Pass";
    let screenshotPath = "";
    let testDetails = ""
    let error = null;

    try {


   // Check key elements on route selection screen
    const routeHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Travel Options\")");
    await expect(routeHeader).toBeDisplayed();

    // Verify destination info is displayed
    
    // const toLocation = await driver.$("-android uiautomator:new UiSelector().textContains(\"Zoo\")");
    // await expect(toLocation).toBeDisplayed();


   // Verify route details are displayed
   //const routeDetails = await driver.$("-android uiautomator:new UiSelector().resourceId(\"RouteDetailsContainer\")");
   //await expect(routeDetails).toBeDisplayed();

    // Select first route by clicking euro symbol
    const firstRoutePrice = await driver.$("(//android.widget.TextView[contains(@text, '€')])[1]");
    await expect(firstRoutePrice).toBeDisplayed();
    await firstRoutePrice.click();
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

it('should check screen and buy e-ticket', async () => {

  const testId = "b7149cf2-3c8f-40d2-ac3b-3f4c4362fa89"

// Send results
let testStatus = "Pass";
    let screenshotPath = "";
    let testDetails = ""
    let error = null;

    try {

  

  //check header is displayed
  const travelDetails = await driver.$("-android uiautomator:new UiSelector().text(\"Travel details\")");
  await expect(travelDetails).toBeDisplayed();

  //check data for payment card is displayed
  const card = await driver.$("-android uiautomator:new UiSelector().text(\"**** **** 1115\")");
  await expect(card).toBeDisplayed();
  
  await driver.pause(2000);
  //Scroll to bottom
  await driver.executeScript('mobile: scrollGesture', [{
    left: 5,
    top: 1200,
    width: 200,
    height: 100,
    direction: 'down',
    percent: 100
  }]); 
  await driver.pause(6000);
  // //check final destination after scrolling is Rotterdam Zoo Rotterdam
  // const finalDestination = await driver.$("-android uiautomator:new UiSelector().textContains(\"Zoo\")");
  // await expect(finalDestination).toBeDisplayed();

  //check back button is displayed
  const backButton = await driver.$("accessibility id:back_button");
await expect(backButton).toBeDisplayed();
await driver.pause(2000);

  //check "buy e-tickets" button is enabled and click it
  const buyButton = await driver.$("-android uiautomator:new UiSelector().text(\"BUY E-TICKETS\")");
  //await expect(buyButton.isEnabled()).toBe(true);
  await buyButton.click();
  await driver.pause(7000);

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


it('final step of confirmation for buying a ticket', async () => {

  const testId = "2923bdca-4d57-4962-94d7-09907c0068d3"

// Send results
let testStatus = "Pass";
    let screenshotPath = "";
    let testDetails = ""
    let error = null;

    try {


//check key elements are displayed (header)
const header = await driver.$("-android uiautomator:new UiSelector().text(\"Buy e-tickets\")");
  await expect(header).toBeDisplayed();


//check key elements are displayed (conditions,travel costs)
//const conditions = await driver.$("id:ticket-TranzerUmob:31540186-terms-and-conditions");
const travelCosts = await driver.$("-android uiautomator:new UiSelector().text(\"Travel costs\")");
//await expect(conditions).toHaveText("Ticket conditions");
await expect(travelCosts).toBeDisplayed();


//check key elements are displayed (total amount and service fee)
const serviceFee = await driver.$("-android uiautomator:new UiSelector().text(\"Service fee\")");
  const totalAmount = await driver.$("-android uiautomator:new UiSelector().text(\"Total amount\")");
  await expect(serviceFee).toBeDisplayed();
  await expect(totalAmount).toBeDisplayed();

//check key elements are displayed (euro symbol)


//check key elements are displayed (back button)
const backButton = await driver.$("accessibility id:back_button");
  await expect(backButton).toBeDisplayed();

//check key elements are displayed (agreement text: "i agree to the sharing...")
const agreementText = await driver.$("~I agree to the sharing of personal data required for purchasing e-tickets with carriers and Tranzer, and the ticketing conditions of umob and carriers.");
  await expect(agreementText).toBeDisplayed();

//click to the checking box
const checkbox = await driver.$('-android uiautomator:new UiSelector().className("android.view.ViewGroup").instance(21)');
await expect(checkbox).toBeDisplayed();
await checkbox.click();

//click on enabled confirm button and wait 10seconds
const confirmButton = await driver.$("-android uiautomator:new UiSelector().text(\"CONFIRM\")");
  //await expect(confirmButton).toBeEnabled();
  await confirmButton.click();
  await driver.pause(15000);

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

it('check key elements, scroll and click show e-tickets', async () => {

  const testId = "bf5c25a6-a863-4635-820f-5459703ccbe2"

// Send results
let testStatus = "Pass";
    let screenshotPath = "";
    let testDetails = ""
    let error = null;

    try {


  
  //checking header is displayed
  const headerBooking = await driver.$("-android uiautomator:new UiSelector().text(\"Booking complete\")");
  await headerBooking.waitForDisplayed({ timeout: 15000 });
  await expect(headerBooking).toBeDisplayed();

//Scroll to bottom
await driver.executeScript('mobile: scrollGesture', [{
  left: 100,
  top: 1200,
  width: 200,
  height: 100,
  direction: 'down',
  percent: 100
}]); 
await driver.pause(7000);


  //checking final point of destination after scrolling (Rotterdam Zoo Rotterdam)
  // const zoo = await driver.$("-android uiautomator:new UiSelector().textContains(\"Zoo\")");
  // await expect(zoo).toBeDisplayed();

  //check text "make sure you download your..."
  const assureText = await driver.$("-android uiautomator:new UiSelector().text(\"Make sure you download your tickets at least 15 mins before the trip. You can always find your tickets in Rides & Tickets\")");
  await expect(assureText).toBeDisplayed();

  //button "show e-tickets" is enabled and click the button
  const showButton = await driver.$("-android uiautomator:new UiSelector().text(\"SHOW E-TICKETS\")");
  //await expect(showButton).toBeEnabled();
  await showButton.click();
  await driver.pause(10000);

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

it('check ticket information and click got_it button', async () => {

  const testId = "f8b9d103-0549-434c-ba15-a133b7e806b6"

// Send results
let testStatus = "Pass";
    let screenshotPath = "";
    let testDetails = ""
    let error = null;

    try {



// Check header is displayed
const ticketHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Ticket\")");
  await expect(ticketHeader).toBeDisplayed();

 // Check route information using direct text selector
 const fromSection = await driver.$('android=new UiSelector().text("From")');
 await expect(fromSection).toBeDisplayed();

 const toSection = await driver.$('android=new UiSelector().text("To")');
 await expect(toSection).toBeDisplayed();

// Check valid between section using compound selector
const validBetweenSection = await driver.$('android=new UiSelector().className("android.widget.TextView").text("Valid between")');
await expect(validBetweenSection).toBeDisplayed();


// Check vehicle section is displayed
  const vehicleHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Vehicle\")");
  await expect(vehicleHeader).toBeDisplayed();

// Check vehicle type is displayed
const vehicleType = await driver.$("-android uiautomator:new UiSelector().text(\"Vehicle type\")");
await expect(vehicleType).toBeDisplayed();


// Check booking number is displayed
const bookingNo = await driver.$("-android uiautomator:new UiSelector().text(\"Booking no\")");
await expect(bookingNo).toBeDisplayed();

//scroll to bottom
await driver.executeScript('mobile: scrollGesture', [{
  left: 100,
  top: 1000,
  width: 200,
  height: 800,
  direction: 'down',
  percent: 100.0
}]);
await driver.pause(1000);

await driver.executeScript('mobile: scrollGesture', [{
  left: 100,
  top: 1500,
  width: 200,
  height: 100,
  direction: 'down',
  percent: 100
}]);

// Check payment details are displayed
const travelCost = await driver.$('-android uiautomator:new UiSelector().text("Travel cost")');
await expect(travelCost).toBeDisplayed();

const serviceFee = await driver.$('-android uiautomator:new UiSelector().text("Service fee")');
await expect(serviceFee).toBeDisplayed();

const totalAmount = await driver.$('-android uiautomator:new UiSelector().text("Total amount")');
await expect(totalAmount).toBeDisplayed();

// Click GOT IT button using multiple fallback strategies
try {
  const gotItButton = await driver.$('android=new UiSelector().text("GOT IT").resourceId("ride-details-primary-button-text")');
  await gotItButton.waitForDisplayed({ timeout: 5000 });
  await gotItButton.click();
} catch (error) {
  // Fallback to content-desc
  const gotItButtonAlt = await driver.$('[content-desc="ride-details-primary-button"]');
  await gotItButtonAlt.click();
}

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

  // terminate the app afterAll
  after(async () => {
    await driver.terminateApp("com.umob.umob");
  });
});