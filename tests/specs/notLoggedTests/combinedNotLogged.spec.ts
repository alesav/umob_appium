import submitTestRun from '../../helpers/SendResults.js';
import PageObjects from "../../pageobjects/umobPageObjects.page.js";

describe('Combined Not Logged User Tests', () => {
  beforeEach(async () => {
    await driver.activateApp("com.umob.umob");
    await driver.pause(7000);
  

    //should start the app without logging in and check key elements
    // Wait for and handle the initial popup
    try {
      // Wait for the popup text to be visible
      const popupText = await driver.$('android=new UiSelector().text("Sign up & get €10,-")');
      await popupText.waitForDisplayed({ timeout: 7000 });

      // Verify popup elements
      const popupDescription = await driver.$('android=new UiSelector().text("Sign up to explore or get started right away, no registration needed! Just planning a trip? For taxis and public transport, all we need is your phone number and payment method.")');
      await expect(popupDescription).toBeDisplayed();

      // Click the "EXPLORE MAP" button
      const exploreMapButton = await driver.$('android=new UiSelector().text("EXPLORE MAP")');
      await expect(exploreMapButton).toBeDisplayed();
      await exploreMapButton.click();
      await driver.pause(2000);
      
    } catch (error) {
      console.log('Popup not found or already handled:', error);
    }
  });
  

  it('should display key navigation elements on the main screen', async () => {

    const testId = "357faf65-b266-417b-bd0d-cc3596cffebc"
      // Send results
   let testStatus = "Pass";
   let screenshotPath = "";
   let testDetails = ""
   let error = null;
   
   try {


          // Handle location permissions
          const allowForegroundPermissionBtn = await driver.$("id:com.android.permissioncontroller:id/permission_allow_foreground_only_button");
          await expect(allowForegroundPermissionBtn).toBeDisplayed();
          await allowForegroundPermissionBtn.click();

     // Verify filter button is displayed
     const assetFilterToggle = await driver.$('-android uiautomator:new UiSelector().resourceId("home_asset_filter_toggle")');
     await expect(assetFilterToggle).toBeDisplayed();
   
     // Check for map root element
     const mapRoot = await driver.$('-android uiautomator:new UiSelector().resourceId("map_root")');
     await expect(mapRoot).toBeDisplayed();
 

    // Verify bottom navigation menu items
    await PageObjects.accountButton.waitForExist();
    // const planTrip = await driver.$('-android uiautomator:new UiSelector().text("PLAN TRIP")');
    // await expect(planTrip).toBeDisplayed();
    await PageObjects.planTripBtn.waitForExist();
    // const promos = await driver.$('-android uiautomator:new UiSelector().text("PROMOS")');
    // await expect(promos).toBeDisplayed();
    await PageObjects.promosBtn.waitForExist();

    //click PLAN TRIP button to verify taxi and public transport options
    //await planTrip.click();
    await PageObjects.planTripBtn.click();

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

    const taxiButton = await driver.$('-android uiautomator:new UiSelector().text("GRAB TAXI")');
    await expect(taxiButton).toBeDisplayed();
  
    const publicTransportButton = await driver.$('-android uiautomator:new UiSelector().text("PUBLIC TRANSPORT")');
    await expect(publicTransportButton).toBeDisplayed();
  
    
    // const settingsButton = await driver.$('-android uiautomator:new UiSelector().text("Settings")');
    // await expect(settingsButton).toBeDisplayed();
  
   
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
  

  it('it should test support screen', async () => {

    const testId = "785c3575-e331-4b27-933c-54f78fcbceb3"
    // Send results
 let testStatus = "Pass";
 let screenshotPath = "";
 let testDetails = ""
 let error = null;
 
 try {

    //await driver.activateApp("com.umob.umob");
    //await driver.pause(7000);    
    const qButton = await driver.$("-android uiautomator:new UiSelector().className(\"com.horcrux.svg.PathView\").instance(4)");
    await expect(qButton).toBeDisplayed();
    await driver.pause(2000);
    await qButton.click();

    // Verify screen header
    const screenHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Support\")");
    await expect(screenHeader).toBeDisplayed();
    await screenHeader.waitForDisplayed({ timeout: 4000 });

    // Verify tabs
    const faq = await driver.$("-android uiautomator:new UiSelector().text(\"FAQ\")");
    await expect(faq).toBeDisplayed();

    const chat = await driver.$("-android uiautomator:new UiSelector().text(\"Chat\")");
    await expect(chat).toBeDisplayed();

    const about = await driver.$("-android uiautomator:new UiSelector().text(\"About\")");
    await expect(about).toBeDisplayed();

    const where = await driver.$("-android uiautomator:new UiSelector().text(\"Where\")");
    await expect(where).toBeDisplayed();

    // Click on "FAQ" to be sure you are in the right place
    await faq.click()
    
        // Verify main content headers and text
        const contentElements = [
          "How does it work (e-bike)",
          "Looking for your e-bike",
          "Open the umob app to see all available e-bikes.",
          "Start race",
          "Find your e-bike and press 'Start' in the app to begin your ride.",
          "Pause",
          "Do you want to take a break while on the go? Switch the e-bike to 'parking mode' at a small fee per minute. The e-bike will be turned off, but remains reserved for you.",
          "Flexible travel"
         // "Do you want to take a break while on the go? Switch the e-bike to 'parking mode' at a small fee per minute. The e-bike will be turned off, but remains reserved for you.",
         // "Flexible travel",
         // "Enjoy the freedom to stop wherever you want, while your e-bike waits for you safely."
      ];

      for (const text of contentElements) {
          const element = await driver.$(`-android uiautomator:new UiSelector().text("${text}")`);
          await expect(element).toBeDisplayed();
      }

      //Scroll to bottom

      /*
  await driver.executeScript('mobile: scrollGesture', [{
    left: 100,
    top: 1500,
    width: 200,
    height: 100,
    direction: 'down',
    percent: 100
  }]); 
  await driver.pause(6000);

  */

  // Get window size 
const { width, height } = await driver.getWindowSize();

 for (let i = 0; i < 2; i++) {
  await driver.pause(2000);
  await driver.executeScript('mobile: scrollGesture', [{
  left: width/2,
  top: height * 0.2,
  width: width * 0.85,
  height: height * 0.4,
  direction: 'down',
  percent: 0.9
}]);
await driver.pause(3000);
};


  const contentElements2 = [
    
    "Enjoy the freedom to stop wherever you want, while your e-bike waits for you safely.",
    "End ride",
    "End your ride only within the service area, indicated by green in the app.",
    "Park neatly",
    "Make sure the e-bike is parked correctly before you end the ride in the app.",
    "Driving in the city",
    "With e-bikes, you can ride and park almost anywhere in the city within designated zones to keep the public roads accessible.",
    "Follow the rules",
    "Always respect local traffic rules and ensure a safe and responsible ride."
    
];

for (const text of contentElements2) {
    const element2 = await driver.$(`-android uiautomator:new UiSelector().text("${text}")`);
    await expect(element2).toBeDisplayed();
}


for (let i = 0; i < 2; i++) {
  await driver.pause(2000);
  await driver.executeScript('mobile: scrollGesture', [{
  left: width/2,
  top: height * 0.2,
  width: width * 0.8,
  height: height * 0.6,
  direction: 'down',
  percent: 0.9
}]);
await driver.pause(3000);
};

await driver.pause(2000);
await driver.executeScript('mobile: scrollGesture', [{
  left: width/2,
  top: 0,
  width: 0,
  height: height*0.8,
  direction: 'down',
  percent: 2
 }]);
 await driver.pause(1000);


  const contentElements4 = [
    "Follow the rules",
    "Always respect local traffic rules and ensure a safe and responsible ride."
    
];

for (const text of contentElements4) {
    const element4 = await driver.$(`-android uiautomator:new UiSelector().text("${text}")`);
    await expect(element4).toBeDisplayed();
}

  // go to chat tab
  await chat.click();
  await driver.pause(2000);

  //send test message to chat
  //const textField = await driver.$("-android uiautomator:new UiSelector().className(\"android.view.ViewGroup\").instance(58)");
  const welcomeMessage = await driver.$(`-android uiautomator:new UiSelector().text("Start typing here")`);
  await expect(welcomeMessage).toBeDisplayed();
      //await expect(textField).toBeDisplayed();
      await welcomeMessage.addValue("test");

      //click on send button

      const sendButton = await driver.$("-android uiautomator:new UiSelector().description(\"Send\")");
      await expect(sendButton).toBeDisplayed();
      await sendButton.click();

      //check if message was sent
      const messageCheck = await driver.$(`-android uiautomator:new UiSelector().text("test")`);
      await expect(messageCheck).toBeDisplayed();

      //if the message is sent then after seeing "test" you should see welcome message again: "Start typing here")`);
      await expect(welcomeMessage).toBeDisplayed();



      //go to about tab
     await about.click();
     await driver.pause(2000);

     //check for text on about tab

     const contentElements3 = [
      "On a mission",
      "We're here to evolutionize mobility into seamless, accessible, and sustainable journeys.",
      "Making movement a breeze, not a burden.",
      "The problem we solve",
      "Urban mobility is complex. Too many apps & accounts cause frustration. But less congestion and more green travel is imperative for a sustainable future."
            
  ];
  
  for (const text of contentElements3) {
      const element3 = await driver.$(`-android uiautomator:new UiSelector().text("${text}")`);
      await expect(element3).toBeDisplayed();
  }

    //Scroll to bottom
    await driver.executeScript('mobile: scrollGesture', [{
    left: 100,
    top: 1500,
    width: 200,
    height: 100,
    direction: 'down',
    percent: 100
    }]); 
    await driver.pause(6000);

    //test the text after scrolling
    const text1 = await driver.$("-android uiautomator:new UiSelector().text(\"The solution\")");
    await expect(text1).toBeDisplayed();

    const text2 = await driver.$("-android uiautomator:new UiSelector().text(\"One app for all rides simplifies travel and cuts the clutter. Shift from owning to sharing.\")");
    await expect(text2).toBeDisplayed();

    // const text3 = await driver.$("-android uiautomator:new UiSelector().text(\"We're shaping a better world.\")");
    // await expect(text3).toBeDisplayed();

    //go to where tab
    await where.click();
    await driver.pause(2000);

    //check key elements for "where" tab
    const availability = await driver.$("-android uiautomator:new UiSelector().text(\"Availability\")");
    await expect(availability).toBeDisplayed();

    //languages check
    // const tick = await driver.$("-android uiautomator:new UiSelector().className(\"com.horcrux.svg.PathView\").instance(19)");
    // await tick.click();
    // await driver.pause(2000);

    const netherlands = await driver.$("-android uiautomator:new UiSelector().text(\"Netherlands\")");
    await expect(netherlands).toBeDisplayed();
    await netherlands.click();
    await driver.pause(2000);

    const Portugal = await driver.$("-android uiautomator:new UiSelector().text(\"Portugal\")");
    await expect(Portugal).toBeDisplayed();

    const Spain = await driver.$("-android uiautomator:new UiSelector().text(\"Spain\")");
    await expect(Spain).toBeDisplayed();

    const unitedKingdom = await driver.$("-android uiautomator:new UiSelector().text(\"United Kingdom\")");
    await expect(unitedKingdom).toBeDisplayed();

    const France = await driver.$("-android uiautomator:new UiSelector().text(\"France\")");
    await expect(France).toBeDisplayed();


    //checking amount of providers
    const bicycle = await driver.$("-android uiautomator:new UiSelector().text(\"Bicycle\")");
    await expect(bicycle).toBeDisplayed();

    const bicycleProviders = await driver.$("-android uiautomator:new UiSelector().text(\"8 providers\")");
    await expect(bicycleProviders).toBeDisplayed();

    const moped = await driver.$("-android uiautomator:new UiSelector().text(\"Moped\")");
    await expect(moped).toBeDisplayed();

    const mopedProviders = await driver.$("-android uiautomator:new UiSelector().text(\"5 providers\")");
    await expect(mopedProviders).toBeDisplayed();
    
    const step = await driver.$("-android uiautomator:new UiSelector().text(\"Step\")");
    await expect(moped).toBeDisplayed();

    const stepProviders = await driver.$("-android uiautomator:new UiSelector().text(\"3 providers\")");
    await expect(stepProviders).toBeDisplayed();

    //Scroll to bottom
   await driver.executeScript('mobile: scrollGesture', [{
    left: 100,
    top: 1500,
    width: 200,
    height: 100,
    direction: 'down',
    percent: 100
   }]); 
    await driver.pause(6000);

    const taxi = await driver.$("-android uiautomator:new UiSelector().text(\"Taxi\")");
    await expect(taxi).toBeDisplayed();

    const taxiProviders = await driver.$("-android uiautomator:new UiSelector().text(\"2 providers\")");
    await expect(taxiProviders).toBeDisplayed();

    const any = await driver.$("-android uiautomator:new UiSelector().text(\"Any\")");
    await expect(any).toBeDisplayed();

    const anyProviders = await driver.$("-android uiautomator:new UiSelector().text(\"1 provider\")");
    await expect(anyProviders).toBeDisplayed();

    const publicTransport = await driver.$("-android uiautomator:new UiSelector().text(\"Public transport\")");
    await expect(publicTransport).toBeDisplayed();

    const publicProviders = await driver.$("-android uiautomator:new UiSelector().text(\"1 provider\")");
    await expect(publicProviders).toBeDisplayed();

    //quit support screen
    const quit = await driver.$("class name:com.horcrux.svg.RectView");
    await quit.click();

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



  it('should display all key account screen elements', async () => {
    
    const testId = "fc11c3a5-b6d4-484d-ba45-5cd9ad7716d0"
    // Send results
 let testStatus = "Pass";
 let screenshotPath = "";
 let testDetails = ""
 let error = null;
 
 try {

    // Step 1: Locate the account button and click it
    await PageObjects.accountButton.waitForExist();
    await PageObjects.accountButton.click();
    // const accountButton = await driver.$('android=new UiSelector().text("Account")');
    // await accountButton.waitForDisplayed({ timeout: 3000 }); 
    // await accountButton.click();

    // Verify account screen title 
    const text1 = await driver.$('android=new UiSelector().text("Let\'s get started!")');
    await expect(text1).toBeDisplayed();
    
    // // Verify the €10 free text using resourceId with index
    // const freeText = await driver.$('android=new UiSelector().resourceId("screenTitle").instance(1)');
    // await expect(freeText).toBeDisplayed();

    // // Verify the account image
    // const accountImage = await driver.$('android=new UiSelector().className("android.widget.ImageView")');
    // await expect(accountImage).toBeDisplayed();

    // Verify LOGIN and REGISTER button
    const logButton = await driver.$('android=new UiSelector().text("LOGIN")');
    await expect(logButton).toBeDisplayed();
    const register = await driver.$('android=new UiSelector().text("REGISTER")');
    await expect(register).toBeDisplayed();
    
    // Verify listed menu options
    const language = await driver.$('android=new UiSelector().text("Language")');
    await expect(language).toBeDisplayed();

    
    const mapTheme = await driver.$('android=new UiSelector().text("Map theme settings")');
    await expect(mapTheme).toBeDisplayed();

    
    const support = await driver.$('android=new UiSelector().text("Support")');
    await expect(support).toBeDisplayed();


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

  
  

  it('should display all key map theme settings screen elements', async () => {

    const testId = "8fddd25c-4166-48c3-bbb5-b53008a6c36b"
    // Send results
 let testStatus = "Pass";
 let screenshotPath = "";
 let testDetails = ""
 let error = null;
 
 try {

    // Click on Settings button to navigate to settings
    // const settingsButton = await driver.$("-android uiautomator:new UiSelector().text(\"Settings\")");
    // await driver.pause(2000);
    // await settingsButton.click();
    await driver.pause(2000);
    await PageObjects.accountButton.waitForExist();
    await PageObjects.accountButton.click();
    await driver.pause(2000);

    // Click on Map theme settings option
    const mapThemeOption = await driver.$("-android uiautomator:new UiSelector().text(\"Map theme settings\")");
    await mapThemeOption.click();
    await driver.pause(2000);

    // Verify header elements
    const backButton = await driver.$('~back_button');
    await expect(backButton).toBeDisplayed();

    const headerTitle = await driver.$("-android uiautomator:new UiSelector().text(\"Map theme settings\")");
    await expect(headerTitle).toBeDisplayed();
    
    // Verify map preview image is displayed
    const mapPreviewImage = await driver.$('android.widget.ImageView');
    await expect(mapPreviewImage).toBeDisplayed();

    // Verify all theme options are displayed and check their properties
    const themeOptions = [
      { name: 'Dark' },
      { name: 'Light' },
      { name: 'Terrain' },
      { name: 'Playground' }
    ];

    for (const theme of themeOptions) {
      // Verify the theme text using UiSelector
      const themeText = await driver.$(`-android uiautomator:new UiSelector().text("${theme.name}")`);
      await expect(themeText).toBeDisplayed();

      // Verify the theme container using content-desc
      const themeContainer = await driver.$(`~${theme.name}`);
      await expect(themeContainer).toBeDisplayed();

      // If it's the Light theme (which appears selected in the XML), verify the selection indicator
      if (theme.name === 'Light') {
        const container = await driver.$(`-android uiautomator:new UiSelector().text("${theme.name}").fromParent(new UiSelector().className("com.horcrux.svg.SvgView"))`);
        await expect(container).toBeDisplayed();
      }
    }
    // click back button to go to the app settings
    await backButton.click();
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



  it('should display all key language screen elements', async () => {

    const testId = "e5c72f00-fb50-45e9-a197-12c1c2c771ce"
    // Send results
 let testStatus = "Pass";
 let screenshotPath = "";
 let testDetails = ""
 let error = null;
 
 try {
    
    // const settingsButton = await driver.$("-android uiautomator:new UiSelector().text(\"Settings\")");
    // await settingsButton.click();
    // await driver.pause(2000);

    await PageObjects.accountButton.waitForExist();
    await PageObjects.accountButton.click();


    // Click on Language option to navigate to language screen
    const languageOption = await driver.$("-android uiautomator:new UiSelector().text(\"Language\")");
    await languageOption.click();
    await driver.pause(2000);

    // Verify header elements
    const backButton = await driver.$('~back_button');
    await expect(backButton).toBeDisplayed();

    const headerTitle = await driver.$("-android uiautomator:new UiSelector().text(\"Language\")");
    await expect(headerTitle).toBeDisplayed();
    

    // Verify all language options are displayed
    const languageOptions = [
      { name: "English", selected: true },
      { name: "Français", selected: false },
      { name: "Dutch", selected: false },
      { name: "Deutsche", selected: false },
      { name: "Español", selected: false }
    ];

    for (const language of languageOptions) {
      const languageElement = await driver.$(`~${language.name}`);
      await expect(languageElement).toBeDisplayed();
      
      // Verify the language text
      const languageText = await driver.$(`-android uiautomator:new UiSelector().text("${language.name}")`);
      await expect(languageText).toBeDisplayed();

      // If it's the selected language (English by default), verify the selection indicator
      if (language.selected) {
        // The SVG checkmark is present only for the selected language
        const checkmark = await languageElement.$('com.horcrux.svg.SvgView');
        await expect(checkmark).toBeDisplayed();
      }
    }

    //click the back button to the app settings screen
    await backButton.click();
    await driver.pause(2000);

    
    // Verify Support section header
    const supportHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Support\")");
    await expect(supportHeader).toBeDisplayed();

    // Verify Privacy & Legal section
    const privacyLegalButton = await driver.$("-android uiautomator:new UiSelector().text(\"Privacy & Legal\")");
    await expect(privacyLegalButton).toBeDisplayed();

    // Verify Login button
    const logoutButton = await driver.$("-android uiautomator:new UiSelector().text(\"LOGIN\")");
    await expect(logoutButton).toBeDisplayed();

    // Verify sign up button
    const signUp = await driver.$("-android uiautomator:new UiSelector().text(\"REGISTER\")");
    await expect(signUp).toBeDisplayed();


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
    try {
      await driver.terminateApp("com.umob.umob");
    } catch (error) {
      console.log('Error terminating app:', error);
    }
  }); 


});