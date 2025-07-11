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
const USER = process.env.TEST_USER || 'newUser';

/////////////////////////////////////////////////////////////////////////////////
describe('Remove payment card for the new user', () => {
  let scooters;

  before(async () => {
    const credentials = getCredentials(ENV, USER);

    // await PageObjects.login(credentials);
    await PageObjects.login({ username: credentials.username, password: credentials.password });


  });

  

  ////////////////////////////////////////////////////////////////////////////////
  it('Remove payment card', async () => {

    const testId = "1be97f63-7dc1-4011-88cb-e8634b5de358"
    
    // Send results
    let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = ""
        let error = null;
    
        try {

await driver.pause(2000);
await PageObjects.clickAccountButton();
await driver.pause(2000);

   //go to payment settings
   const paymentSettings = await driver.$('-android uiautomator:new UiSelector().textContains("Payment settings")');
   await expect (paymentSettings).toBeDisplayed();
   await paymentSettings.click();

   await driver.pause(2000);

//verify remove button is dispayed
   const removeButton = await driver.$('-android uiautomator:new UiSelector().textContains("REMOVE PAYMENT METHOD")');
   await expect (removeButton).toBeDisplayed();
   await driver.pause(1000);
   await removeButton.click();
   await driver.pause(1000);

   //verify that it was removed by displaying Payment settings in account menu 
   await expect (paymentSettings).toBeDisplayed();
   
            

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