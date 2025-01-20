import { AfterAll } from "@wdio/cucumber-framework";
import PageObjects from "../../pageobjects/umobPageObjects.page.js";

describe('Plan Your Trip Screen Verification', () => {
    before(async () => {
  
        // Find and click LOG IN button
        const logInBtn = await driver.$('-android uiautomator:new UiSelector().text("LOG IN")');
        await logInBtn.isClickable();
        await logInBtn.click();
  
        await PageObjects.login({ username:'4bigfoot+10@gmail.com', password: '123Qwerty!' });
  
  
    });

  it('should display all key elements on Plan Your Trip screen', async () => {
    await driver.activateApp("com.umob.umob");
    await driver.pause(7000);    
    const publicTransportButton = await driver.$("-android uiautomator:new UiSelector().text(\"Public transport\")");
    await publicTransportButton.click();
    await driver.pause(2000);
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
  percent: 10
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
  });


  it('should put in destination and book a ticket', async () => {
  // click on destination and text Rotterdam Zoo Rotterdam
  const destinationInput = await driver.$('android=new UiSelector().className("android.widget.EditText").text("")');
  await expect(destinationInput).toBeDisplayed;
  //await destinationInput.setValue("Rotter");
  await driver.pause(4000); 
  const chooseFromList = await driver.$("-android uiautomator:new UiSelector().textContains(\"Zoo\")");
  await chooseFromList.click();
  //await destinationAdd.click();
  //await destinationAdd.addValue("Rotterdam Zoo Rotterdam");



  // Verify the continue button becomes enabled after adding destination
  const continuePress = await driver.$("-android uiautomator:new UiSelector().text(\"CONTINUE\")");
  await expect(continuePress).toBeDisplayed();
  //await expect(continuePress.isEnabled()).toBe(true);
  await continuePress.click();
  await driver.pause(10000);

  });


  it('should display all key elements and pick up the route', async () => {
   // Check key elements on route selection screen
    const routeHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Travel Options\")");
    await expect(routeHeader).toBeDisplayed();

    // Verify destination info is displayed
    
    const toLocation = await driver.$("-android uiautomator:new UiSelector().textContains(\"Zoo\")");
    await expect(toLocation).toBeDisplayed();


   // Verify route details are displayed
   //const routeDetails = await driver.$("-android uiautomator:new UiSelector().resourceId(\"RouteDetailsContainer\")");
   //await expect(routeDetails).toBeDisplayed();

    // Select first route by clicking euro symbol
    const firstRoutePrice = await driver.$("(//android.widget.TextView[contains(@text, '€')])[1]");
    await expect(firstRoutePrice).toBeDisplayed();
    await firstRoutePrice.click();
    await driver.pause(2000);

    

});

it('should check header and final destionation and buy e-ticket', async () => {

  //check header is displayed
  const travelDetails = await driver.$("-android uiautomator:new UiSelector().text(\"Travel details\")");
  await expect(travelDetails).toBeDisplayed();

  //check data for payment card is displayed
  const card = await driver.$("-android uiautomator:new UiSelector().text(\"**** **** 1115\")");
  await expect(card).toBeDisplayed();
  
  await driver.pause(2000);
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
  //check final destination after scrolling is Rotterdam Zoo Rotterdam
  const finalDestination = await driver.$("-android uiautomator:new UiSelector().textContains(\"Zoo\")");
  await expect(finalDestination).toBeDisplayed();

  //check back button is displayed
  const backButton = await driver.$("accessibility id:back_button");
await expect(backButton).toBeDisplayed();

  //check "buy e-tickets" button is enabled and click it
  const buyButton = await driver.$("-android uiautomator:new UiSelector().text(\"BUY E-TICKETS\")");
  //await expect(buyButton.isEnabled()).toBe(true);
  await buyButton.click();
  await driver.pause(7000);
  
});


it('final step of confirmation for buying a ticket', async () => {

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
const checkbox = await driver.$('//android.view.ViewGroup[@bounds="[66,1312][116,1604]"]');
await checkbox.click();

//click on enabled confirm button and wait 10seconds
const confirmButton = await driver.$("-android uiautomator:new UiSelector().text(\"CONFIRM\")");
  //await expect(confirmButton).toBeEnabled();
  await confirmButton.click();
  await driver.pause(15000);

});

it('check that key elements are displayed, scroll and click show e-tickets', async () => {

  
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
  const zoo = await driver.$("-android uiautomator:new UiSelector().textContains(\"Zoo\")");
  await expect(zoo).toBeDisplayed();

  //check text "make sure you download your..."
  const assureText = await driver.$("-android uiautomator:new UiSelector().text(\"Make sure you download your tickets at least 15 mins before the trip. You can always find your tickets in Rides & Tickets\")");
  await expect(assureText).toBeDisplayed();

  //button "show e-tickets" is enabled and click the button
  const showButton = await driver.$("-android uiautomator:new UiSelector().text(\"SHOW E-TICKETS\")");
  //await expect(showButton).toBeEnabled();
  await showButton.click();
  await driver.pause(10000);


});

it('check ticket information and click got_it button', async () => {

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

// Scroll to bottom to see payment details
await driver.executeScript('mobile: scrollGesture', [{
  left: 100,
  top: 1200,
  width: 200,
  height: 100,
  direction: 'down',
  percent: 100
}]);

await driver.executeScript('mobile: scrollGesture', [{
  left: 100,
  top: 1200,
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

});

  // terminate the app afterAll
  after(async () => {
    await driver.terminateApp("com.umob.umob");
  });
});