describe('Account Screen Elements Validation', () => {
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
      
      // Add a pause to allow the map to load after clicking explore
      await driver.pause(4000);
    } catch (error) {
      console.log('Popup not found or already handled:', error);
    }
  });

  

  it('it should test support screen', async () => {
    //await driver.activateApp("com.umob.umob");
    //await driver.pause(7000);    
    const qButton = await driver.$("-android uiautomator:new UiSelector().className(\"com.horcrux.svg.PathView\").instance(2)");
    await expect(qButton).toBeDisplayed();
    await qButton.click();
    await driver.pause(4000);


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

    
        // Verify main content headers and text
        const contentElements = [
          "How does it work (e-bike)",
          "Looking for your e-bike",
          "Open the umob app to see all available e-bikes.",
          "Start race",
          "Find your e-bike and press 'Start' in the app to begin your ride.",
          "Pause",
          "Do you want to take a break while on the go? Switch the e-bike to 'parking mode' at a small fee per minute. The e-bike will be turned off, but remains reserved for you.",
          "Flexible travel",
          "Enjoy the freedom to stop wherever you want, while your e-bike waits for you safely."
      ];

      for (const text of contentElements) {
          const element = await driver.$(`-android uiautomator:new UiSelector().text("${text}")`);
          await expect(element).toBeDisplayed();
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

  const contentElements2 = [
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
// go to chat tab
await chat.click();
await driver.pause(2000);

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

    const text3 = await driver.$("-android uiautomator:new UiSelector().text(\"We're shaping a better world.\")");
    await expect(text3).toBeDisplayed();

    //go to where tab
    await where.click();
    await driver.pause(2000);

    //check key elements for "where" tab
    const availability = await driver.$("-android uiautomator:new UiSelector().text(\"Availability\")");
    await expect(availability).toBeDisplayed();

    //languages check
    const tick = await driver.$("-android uiautomator:new UiSelector().className(\"com.horcrux.svg.PathView\").instance(19)");
    await tick.click();
    await driver.pause(2000);

    const netherlands = await driver.$("-android uiautomator:new UiSelector().text(\"Netherlands\")");
    await expect(netherlands).toBeDisplayed();

    const Portugal = await driver.$("-android uiautomator:new UiSelector().text(\"Portugal\")");
    await expect(Portugal).toBeDisplayed();

    const Spain = await driver.$("-android uiautomator:new UiSelector().text(\"Spain\")");
    await expect(Spain).toBeDisplayed();

    const unitedKingdom = await driver.$("-android uiautomator:new UiSelector().text(\"United Kingdom\")");
    await expect(unitedKingdom).toBeDisplayed();

    const France = await driver.$("-android uiautomator:new UiSelector().text(\"France\")");
    await expect(France).toBeDisplayed();

    //closing the popup with countries
    //const tick2 = await driver.$("-android uiautomator:new UiSelector().className(\"com.horcrux.svg.PathView\").instance(12)");
    //await tick2.click();
    //await driver.pause(2000);

    //checking amount of providers
    const bicycle = await driver.$("-android uiautomator:new UiSelector().text(\"Bicycle\")");
    await expect(bicycle).toBeDisplayed();

    const bicycleProviders = await driver.$("-android uiautomator:new UiSelector().text(\"7 providers\")");
    await expect(bicycleProviders).toBeDisplayed();

    const moped = await driver.$("-android uiautomator:new UiSelector().text(\"Moped\")");
    await expect(moped).toBeDisplayed();

    const mopedProviders = await driver.$("-android uiautomator:new UiSelector().text(\"5 providers\")");
    await expect(mopedProviders).toBeDisplayed();
    
    const step = await driver.$("-android uiautomator:new UiSelector().text(\"Step\")");
    await expect(moped).toBeDisplayed();

    const stepProviders = await driver.$("-android uiautomator:new UiSelector().text(\"2 providers\")");
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


  });



  it('should display all key account screen elements', async () => {
    // Step 1: Locate the account button and click it
    const accountButton = await driver.$('android=new UiSelector().text("Account")');
    await accountButton.waitForDisplayed({ timeout: 3000 }); 
    await accountButton.click();

    // Verify account screen title using resource-id instead of text
    const screenTitle = await driver.$('~screenTitle');
    await expect(screenTitle).toBeDisplayed();
    
    // Verify the €10 free text using resourceId with index
    const freeText = await driver.$('android=new UiSelector().resourceId("screenTitle").instance(1)');
    await expect(freeText).toBeDisplayed();

    // Verify the account image
    const accountImage = await driver.$('android=new UiSelector().className("android.widget.ImageView")');
    await expect(accountImage).toBeDisplayed();

    // Verify "Sign up with your email" button
    const signUpButton = await driver.$('~registerEmail');
    await expect(signUpButton).toBeDisplayed();
    const signUpText = await driver.$('~registerEmail-text');
    await expect(signUpText).toBeDisplayed();
    await expect(await signUpText.getText()).toBe("SIGN UP WITH YOUR EMAIL");

    // Verify "Already have an account?" text
    const alreadyHaveAccountText = await driver.$('android=new UiSelector().text("Already have an account? ")');
    await expect(alreadyHaveAccountText).toBeDisplayed();

    // Verify "Sign in" button
    const signInButton = await driver.$('~login_button');
    await expect(signInButton).toBeDisplayed();
    const signInButtonText = await driver.$('android=new UiSelector().className("android.widget.TextView").text("Sign in")');
    await expect(await signInButtonText.getText()).toBe("Sign in");

    //click back button to main screen
    const clickBack = await driver.$('//android.view.ViewGroup[@clickable="true" and @bounds="[44,126][88,170]"]');
await clickBack.click();
  });

  
  

  it('should display all key map theme settings screen elements', async () => {
    // Click on Settings button to navigate to settings
    const settingsButton = await driver.$("-android uiautomator:new UiSelector().text(\"Settings\")");
    await settingsButton.click();
    await driver.pause(2000);

    // Click on Map theme settings option
    const mapThemeOption = await driver.$("-android uiautomator:new UiSelector().text(\"Map theme settings\")");
    await mapThemeOption.click();
    await driver.pause(2000);

    // Verify header elements
    const backButton = await driver.$('~back_button');
    await expect(backButton).toBeDisplayed();

    const headerTitle = await driver.$('~settings_menu_map_theme_comp-header-title');
    await expect(headerTitle).toBeDisplayed();
    await expect(await headerTitle.getText()).toBe("Map theme settings");

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
  });



  it('should display all key language screen elements and settings screen key elements', async () => {
    
    const settingsButton = await driver.$("-android uiautomator:new UiSelector().text(\"Settings\")");
    await settingsButton.click();
    await driver.pause(2000);

    // Click on Language option to navigate to language screen
    const languageOption = await driver.$("-android uiautomator:new UiSelector().text(\"Language\")");
    await languageOption.click();
    await driver.pause(2000);

    // Verify header elements
    const backButton = await driver.$('~back_button');
    await expect(backButton).toBeDisplayed();

    const headerTitle = await driver.$('~undefined-header-title');
    await expect(headerTitle).toBeDisplayed();
    await expect(await headerTitle.getText()).toBe("Language");

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

    // Verify "App settings" header is present
    const appSettingsHeader = await driver.$("-android uiautomator:new UiSelector().text(\"App settings\")");
    await expect(appSettingsHeader).toBeDisplayed();

    // Verify Support section header
    const supportHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Support\")");
    await expect(supportHeader).toBeDisplayed();

    // Verify Privacy & Legal section
    const privacyLegalButton = await driver.$("-android uiautomator:new UiSelector().text(\"Privacy & Legal\")");
    await expect(privacyLegalButton).toBeDisplayed();

    // Verify Login button
    const logoutButton = await driver.$("-android uiautomator:new UiSelector().text(\"LOG IN\")");
    await expect(logoutButton).toBeDisplayed();

    // Verify sign up button
    const signUp = await driver.$("-android uiautomator:new UiSelector().text(\"Sign up\")");
    await expect(signUp).toBeDisplayed();

    const text = await driver.$("-android uiautomator:new UiSelector().text(\"You don't have an account? \")");
    await expect(text).toBeDisplayed();



  });



  afterEach(async () => {
    try {
      await driver.terminateApp("com.umob.umob");
    } catch (error) {
      console.log('Error terminating app:', error);
    }
  }); 


});