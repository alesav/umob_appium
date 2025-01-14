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

  it('it should test key elements for book a taxi', async () => {
    await driver.activateApp("com.umob.umob");
    await driver.pause(7000);    
    const taxiButton = await driver.$("-android uiautomator:new UiSelector().text(\"Taxi\")");
    await taxiButton.click();
    await driver.pause(2000);
    // Verify screen header
    const screenHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Book a taxi\")");
    await expect(screenHeader).toBeDisplayed();

    // Verify departure and destination input section
    const departureDestinationLabel = await driver.$("-android uiautomator:new UiSelector().text(\"Enter pickup & destination points\")");
    await expect(departureDestinationLabel).toBeDisplayed();
        

    // Verify destination input
    const destinationInput = await driver.$("-android uiautomator:new UiSelector().text(\"Destination\")");
    await expect(destinationInput).toBeDisplayed();


  // click on destination and text Rotterdam Zoo Rotterdam
  //const destinationInput = await driver.$('android=new UiSelector().className("android.widget.EditText").text("")');
  //await expect(destinationInput).toBeDisplayed;
  
  await driver.pause(4000); 
  const chooseFromList = await driver.$("-android uiautomator:new UiSelector().textContains(\"Zoo\")");
  await chooseFromList.click();
  

  // click the continue button after adding destination
  const continueButton = await driver.$("-android uiautomator:new UiSelector().text(\"CONTINUE\")");
    await expect(continueButton).toBeDisplayed();
    await continueButton.click();
  await driver.pause(15000);

  });


  it('should display at least one option for taxi and click select button', async () => {
  
    // check if at least one option exists with euro price
    const firstRoutePrice = await driver.$("(//android.widget.TextView[contains(@text, '€')])[1]");
    await expect(firstRoutePrice).toBeDisplayed();
    
    //const firstTaxiOption = await driver.$('[content-desc="DTMTaxi Any taxi, Arrives in 5 mins, 4, ± €3.76"]');
    //await firstTaxiOption.click();
    
    //const selectButton = await driver.$("-android uiautomator:new UiSelector().text(\"SELECT\")");
    //await expect(selectButton).toBeDisplayed();
    //await selectButton.click();


    const selectButton = await driver.$('-android uiautomator:new UiSelector().textContains("SELECT")');
await expect(selectButton).toBeDisplayed();
await selectButton.click();
    await driver.pause(5000);

});

it('should check confirm_your_ride screen', async () => {

  //check header is displayed
  const travelDetails = await driver.$("-android uiautomator:new UiSelector().text(\"Confirm your ride\")");
  await expect(travelDetails).toBeDisplayed();

  //check data for payment card is displayed
  const card = await driver.$("-android uiautomator:new UiSelector().text(\"**** **** 1115\")");
  await expect(card).toBeDisplayed();
  
//check destination is displayed
const destRotter = await driver.$("-android uiautomator:new UiSelector().textContains(\"Zoo\")");
await expect(destRotter).toBeDisplayed();

//check driver note is displayed
const driverNote = await driver.$("-android uiautomator:new UiSelector().text(\"Add a note to the driver (optional)\")");
await expect(driverNote).toBeDisplayed();

// check if price in euro
const firstRoutePrice = await driver.$("(//android.widget.TextView[contains(@text, '€')])[1]");
await expect(firstRoutePrice).toBeDisplayed();

//check notification is displayed
const notification = await driver.$("-android uiautomator:new UiSelector().text(\"All rentals are subject to terms & conditions of umob and transport providers. Fees may apply for waiting or cancellation.\")");
await expect(notification).toBeDisplayed();

//check destination is displayed
const confirmButton = await driver.$("-android uiautomator:new UiSelector().text(\"CONFIRM YOUR RIDE\")");
await expect(confirmButton).toBeDisplayed();
await confirmButton.click();
await driver.pause(7000);

/*//booking confirmation
const bookingConfirmation = await driver.$('-android uiautomator:new UiSelector().textContains("Booking confirmed")');
await expect(bookingConfirmation).toBeDisplayed();


//acception notification
const acception = await driver.$('-android uiautomator:new UiSelector().textContains("Operator has accepted your booking. Finding you a driver. This may take a few minutes")');
await expect(acception).toBeDisplayed();

//cancelation
const cancelTrip = await driver.$("-android uiautomator:new UiSelector().text(\"Cancel trip\")");
await expect(cancelTrip).toBeDisplayed();
await cancelTrip.click();

//confirmation cancelation
const cancelConfirmation = await driver.$("-android uiautomator:new UiSelector().text(\"CANCEL MY BOOKING\")");
await expect(cancelConfirmation).toBeDisplayed();
await cancelConfirmation.click();
*/

 // Verify booking confirmation header
 const bookingConfirmedText = await driver.$('-android uiautomator:new UiSelector().text("Booking confirmed")');
 await expect(bookingConfirmedText).toBeDisplayed();

 // Verify operator acceptance message
 const operatorMessage = await driver.$('-android uiautomator:new UiSelector().textContains("Operator has accepted your booking")');
 await expect(operatorMessage).toBeDisplayed();

 // Verify destination location
 const destinationLocation = await driver.$("-android uiautomator:new UiSelector().textContains(\"Zoo\")");
 await expect(destinationLocation).toBeDisplayed();

 // Verify and click Cancel trip button
 const cancelTripButton = await driver.$('-android uiautomator:new UiSelector().text("Cancel trip")');
 await expect(cancelTripButton).toBeDisplayed();
 await cancelTripButton.click();
 
 // Wait for confirmation dialog and confirm cancellation
 await driver.pause(2000);
 const confirmCancelButton = await driver.$('-android uiautomator:new UiSelector().text("CANCEL MY BOOKING")');
 await expect(confirmCancelButton).toBeDisplayed();
 await confirmCancelButton.click();

});
});






