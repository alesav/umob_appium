import { execSync } from "child_process";
import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import submitTestRun from "../../helpers/SendResults.js";
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
const USER = process.env.TEST_USER || 'new12';

/////////////////////////////////////////////////////////////////////////////////
describe('Add address for any user', () => {
  let scooters;

  before(async () => {
    const credentials = getCredentials(ENV, USER);

    // await PageObjects.login(credentials);
    await PageObjects.login({ username: credentials.username, password: credentials.password });


  });

  

  ////////////////////////////////////////////////////////////////////////////////
  it('Add address for any user.', async () => {

    const testId = "ffddb0c7-90db-485d-a2d7-9857c6108e3d"
    
    // Send results
    let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = ""
        let error = null;
    
        try {

await driver.pause(2000);
await PageObjects.clickAccountButton();
await driver.pause(2000);

   //go to personal info
   const infoButton = await driver.$('-android uiautomator:new UiSelector().textContains("Personal info")');
   await expect (infoButton).toBeDisplayed();
   await infoButton.click();

   // Scroll down to zip code section
await driver.pause(5000);
const { width, height } = await driver.getWindowSize();
// await driver.executeScript('mobile: swipeGesture', [{
//   left: 10,
//   top: 100,
//   width,
//   height,
//   direction: 'down',
//   percent: 1.0
// }]);

await driver.executeScript('mobile: scrollGesture', [{
 left: 100,
 top: 0,
 width: 0,
 height: height/2,
 direction: 'down',
 percent: 1
}]);

await driver.pause(2000);


   const zipCode = await driver.$('-android uiautomator:new UiSelector().textContains("Zip Code")');
   await expect (zipCode).toBeDisplayed();
   await driver.pause(1000);

   //click on zip code section and add value 
   const codeSection = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(2)");
   //await zip code Section.click();
   await codeSection.clearValue();
   await codeSection.addValue("3014");

   // //click on country section 
   // const country = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(9)");
   // await country.click();

   const countryDropdown = await driver.$('//android.widget.TextView[@text="Country"]//parent::android.view.ViewGroup');
   await countryDropdown.click();
   
//click on country 
const nCountry = await driver.$('-android uiautomator:new UiSelector().text("Argentina")');
await driver.pause(1000);
await nCountry.click();

await driver.executeScript('mobile: scrollGesture', [{
 left: 100,
 top: 0,
 width: 0,
 height: height/2,
 direction: 'down',
 percent: 1
}]);
await driver.pause(1000);

//choosing city
const city = await driver.$('-android uiautomator:new UiSelector().textContains("City")');
   await expect (city).toBeDisplayed();
   

   //click on city section and add value 
   const citySection = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(3)");
   await citySection.clearValue()
   await citySection.addValue("Rotterdam");

   //choosing street
const street = await driver.$('-android uiautomator:new UiSelector().textContains("Street")');
await expect (street).toBeDisplayed();


//click on street section and add value 
const streetSection = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(0)");
await streetSection.clearValue()
await streetSection.addValue("Bloemstraat");


//choosing number of building
const number = await driver.$('-android uiautomator:new UiSelector().textContains("Number")');
await expect (number).toBeDisplayed();


//click on building number section and add value 
const numberSection = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(1)");
await numberSection.clearValue()
await numberSection.addValue("80");

await driver.executeScript('mobile: scrollGesture', [{
 left: 100,
 top: 0,
 width: 0,
 height: height/2,
 direction: 'down',
 percent: 1
}]);
await driver.pause(1000);

   //click on Save button
   const saveButton = await driver.$('-android uiautomator:new UiSelector().text("SAVE")');
   await expect (saveButton).toBeDisplayed();
   await saveButton.click();

   //check that save button was pressed
   const idDocument = await driver.$('-android uiautomator:new UiSelector().textContains("ID Document")');
   await expect (idDocument).toBeDisplayed();

            

        } catch (e) {
          error = e;
          console.error("Test failed:", error);
          testStatus = "Fail";
          testDetails = e.message;
      
        
          // Capture screenshot on failure
          screenshotPath = testId+".png";
          console.log("Screenshot saved to", screenshotPath);
          await driver.saveScreenshot(screenshotPath);
                   // execSync(
          //   `adb exec-out screencap -p > ${screenshotPath}`
          // );
          
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



  afterEach(async () => {
    await driver.terminateApp("com.umob.umob");
  });
});