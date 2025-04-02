import { execSync } from "child_process";
import submitTestRun from "../../helpers/SendResults.js";
import PageObjects from "../../pageobjects/umobPageObjects.page.js";


/////////////////////////////////////////////////////////////////////////////////
describe('Add Payment Method', () => {
  let scooters;

  before(async () => {

        await PageObjects.login({ username:'4bigfoot+11@gmail.com', password: '123Qwerty!' });


  });

  beforeEach(async () => {
    await driver.activateApp("com.umob.umob");
        // Wait for screen to be loaded
        await PageObjects.accountButton.waitForExist();
  });

  ////////////////////////////////////////////////////////////////////////////////
  it('Positive Scenario: Add credit card', async () => {

    const testId = "19f3aab0-8cd8-4770-9093-d329714dc817"
    
    // Send results
    let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = ""
        let error = null;
    
        try {
    
    await driver.pause(2000);

        // Check Account is presented
        await PageObjects.accountButton.waitForExist();
    await PageObjects.accountButton.click();
     await driver.pause(2000);

           //CLick Payment Settings
          await driver.$(
            '-android uiautomator:new UiSelector().text("Payment settings")'
          ).waitForDisplayed();
          await driver.$(
            '-android uiautomator:new UiSelector().text("Payment settings")'
          ).click();

           //CLick Add payment method
           await driver.$(
            '-android uiautomator:new UiSelector().text("ADD PAYMENT METHOD")'
          ).waitForDisplayed();
          await driver.pause(2000);
          await driver.$(
            '-android uiautomator:new UiSelector().text("ADD PAYMENT METHOD")'
          ).click();

           //CLick Remove payment method
           /*
           await driver.$(
            '-android uiautomator:new UiSelector().text("REMOVE PAYMENT METHOD")'
          ).waitForDisplayed();
          await driver.$(
            '-android uiautomator:new UiSelector().text("REMOVE PAYMENT METHOD")'
          ).click();          
          */

           //CLick Cards
           await driver.$(
            '-android uiautomator:new UiSelector().text("Cards")'
          ).waitForDisplayed();
          await driver.$(
            '-android uiautomator:new UiSelector().text("Cards")'
          ).click();

          const el1 = await driver.$("id:com.umob.umob:id/editText_cardNumber");
          await el1.click();
          await el1.addValue("5555341244441115");
          const el2 = await driver.$("id:com.umob.umob:id/editText_expiryDate");
          await el2.click();
          await el2.addValue("0330");
          const el3 = await driver.$("id:com.umob.umob:id/editText_securityCode");
          await el3.click();
          await el3.addValue("737");
          const el4 = await driver.$("id:com.umob.umob:id/editText_cardHolder");
          await el4.click();
          await el4.addValue("Test Account");
          const el5 = await driver.$("id:com.umob.umob:id/payButton");
          await el5.click();

           //Assert Remove payment method button is displayed
            const removeBtn =await driver.$(
             '-android uiautomator:new UiSelector().text("REMOVE PAYMENT METHOD")'
           )
           await removeBtn.waitForDisplayed();
           await driver.pause(2000);
           await removeBtn.click();

          //  await driver.pause(5000);
          //  const el6 = await driver.$("accessibility id:back_button");
          //  await el6.click();

           //CLick Payment Settings
           await driver.$(
            '-android uiautomator:new UiSelector().text("Payment settings")'
          ).waitForDisplayed();
          await driver.$(
            '-android uiautomator:new UiSelector().text("Payment settings")'
          ).click();

           //Verify Add payment method
           await driver.$(
            '-android uiautomator:new UiSelector().text("ADD PAYMENT METHOD")'
          ).waitForDisplayed();

        } catch (e) {
          error = e;
          console.error("Test failed:", error);
          testStatus = "Fail";
          testDetails = e.message;
        
        
          // Capture screenshot on failure
          screenshotPath = "./screenshots/"+ testId+".png";
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