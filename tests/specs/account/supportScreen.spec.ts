import { AfterAll } from "@wdio/cucumber-framework";

describe('Plan Your Trip Screen Verification', () => {
  /*beforeEach(async () => {
    await driver.activateApp("com.umob.umob");
    await driver.pause(7000);

    // Navigate to Public Transport screen
    // Note: The exact selector might need adjustment based on the actual UI
    const publicTransportButton = await driver.$("-android uiautomator:new UiSelector().text(\"Public transport\")");
    await publicTransportButton.click();
    await driver.pause(2000);
  });*/

  it('it should test support screen', async () => {
    await driver.activateApp("com.umob.umob");
    await driver.pause(7000);    
    const qButton = await driver.$("-android uiautomator:new UiSelector().className(\"com.horcrux.svg.PathView\").instance(2)");
    await expect(qButton).toBeDisplayed();
    await qButton.click();
    await driver.pause(2000);


    // Verify screen header
    const screenHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Support\")");
    await expect(screenHeader).toBeDisplayed();

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


  });
})
