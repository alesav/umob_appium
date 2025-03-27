import { execSync } from "child_process";
import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import submitTestRun from "../../helpers/SendResults.js";


/////////////////////////////////////////////////////////////////////////////////
describe('Add adress for any user', () => {
  let scooters;

  before(async () => {

    const deviceCapabilities = await JSON.stringify(driver.capabilities).toString();

      // Find and click LOG IN button
      const logInBtn = await driver.$('-android uiautomator:new UiSelector().text("LOG IN")');
      //await logInBtn.isClickable();
      await driver.pause(2000);
      await logInBtn.click();

      // Login form elements
      const usernameField = await driver.$("accessibility id:login_username_field");
      await expect(usernameField).toBeDisplayed();
      await usernameField.addValue("new12@gmail.com");

      const passwordField = await driver.$("accessibility id:login_password_field");
      await expect(passwordField).toBeDisplayed();
      await passwordField.addValue("123Qwerty!");

      const loginButtonText = await driver.$("accessibility id:login_button-text");
      await expect(loginButtonText).toBeDisplayed();
      await loginButtonText.click();

      const loginButton = await driver.$("accessibility id:login_button");
      await expect(loginButton).toBeDisplayed();
      await loginButton.click();

    // Wait for permissions popup
     const permissionsPopup = await driver.$('-android uiautomator:new UiSelector().textContains("Allow")');
     await permissionsPopup.isDisplayed();
     await expect(permissionsPopup).toBeDisplayed();


     console.log("deviceInfo "+ deviceCapabilities);
     if (!deviceCapabilities.includes("bstack:options")) {
      const enableNotifications = await driver.$("id:com.android.permissioncontroller:id/permission_allow_button");
      await expect(enableNotifications).toBeDisplayed();
      await enableNotifications.click();
     }

     const enableLocation = await driver.$("id:com.android.permissioncontroller:id/permission_allow_foreground_only_button");
     await expect(enableLocation).toBeDisplayed();
     await enableLocation.click();

        // Check Account is presented
        //await driver.$(
        //  '-android uiautomator:new UiSelector().text("Account")'
       // ).waitForEnabled();


  });

  

  ////////////////////////////////////////////////////////////////////////////////
  it('Add adress for any user', async () => {

    const testId = "ffddb0c7-90db-485d-a2d7-9857c6108e3d"
    
    // Send results
    let testStatus = "Pass";
        let screenshotPath = "";
        let testDetails = ""
        let error = null;
    
        try {
    
    await driver.pause(2000);
          //click account button
    await PageObjects.accountButton.waitForExist();
    await driver.pause(2000);
    await PageObjects.accountButton.click();
     await driver.pause(2000);

        //go to personal info
        const infoButton = await driver.$('-android uiautomator:new UiSelector().textContains("Personal info")');
        await expect (infoButton).toBeDisplayed();
        await infoButton.click();

        // Scroll down to zip code section
    await driver.pause(5000);
    await driver.executeScript('mobile: scrollGesture', [{
      left: 100,
      top: 1500,
      width: 200,
      height: 100,
      direction: 'down',
      percent: 100
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
    await nCountry.click();

    await driver.executeScript('mobile: scrollGesture', [{
      left: 100,
      top: 1000,
      width: 200,
      height: 100,
      direction: 'down',
      percent: 5
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
    await streetSection.addValue("bloemstraat");


     //choosing number of building
     const number = await driver.$('-android uiautomator:new UiSelector().textContains("Number")');
     await expect (number).toBeDisplayed();
     
 
     //click on building number section and add value 
     const numberSection = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(1)");
     await numberSection.clearValue()
     await numberSection.addValue("80");

     await driver.executeScript('mobile: scrollGesture', [{
      left: 100,
      top: 1000,
      width: 200,
      height: 100,
      direction: 'down',
      percent: 5
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