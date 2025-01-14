describe('Combined test for logged in user', () => {
  beforeEach(async () => {
    await driver.activateApp("com.umob.umob");
    await driver.pause(7000);
  });

  it('should display all key account screen elements', async () => {
    // Click on Account button
    const accountButton = await driver.$("-android uiautomator:new UiSelector().text(\"Account\")");
    await accountButton.click();
    await driver.pause(2000);

    // Verify screen header
    const screenHeader = await driver.$("-android uiautomator:new UiSelector().resourceId(\"MyAccountContainer-header-title\")");
    await expect(screenHeader).toBeDisplayed();
    await expect(await screenHeader.getText()).toBe("My Account");

    // Verify user welcome message
    const welcomeText = await driver.$("-android uiautomator:new UiSelector().text(\"Welcome back,\")");
    await expect(welcomeText).toBeDisplayed();

    
    // Verify last ride section
    const lastRideSection = await driver.$("-android uiautomator:new UiSelector().text(\"Your last ride\")");
    await expect(lastRideSection).toBeDisplayed();
    await driver.pause(2000);
    
    // Check last ride amount (flexible verification)
    const lastRideAmount = await driver.$("-android uiautomator:new UiSelector().textContains(\"€\")");
    await expect(lastRideAmount).toBeDisplayed();

    // Verify account menu items
    const accountMenuItems = [
      "My Rides & Tickets",
      "My payments",
      "Personal info",
      "Ride credit",
      "Invite friends",
      "Payment settings",
      "ID Document",
      "Delete account"
    ];

    await driver.executeScript('mobile: scrollGesture', [{
      left: 100, 
      top: 1000, 
      width: 200, 
      height: 800, 
      direction: 'down',
      percent: 10.0
    }]);

    for (const menuItem of accountMenuItems) {
      const menuElement = await driver.$(`-android uiautomator:new UiSelector().text("${menuItem}")`);
      await expect(menuElement).toBeDisplayed();
    }

    // Verify back button is present
    const backButton = await driver.$("-android uiautomator:new UiSelector().resourceId(\"back_button\")");
    await expect(backButton).toBeDisplayed();
  });



  it('should display all key My Rides & Tickets screen elements', async () => {
    
    // Click on Account button
   const accountButton = await driver.$("-android uiautomator:new UiSelector().text(\"Account\")");
   await accountButton.click();
   await driver.pause(2000);

    // Navigate to My Rides & Tickets
    const myRidesAndTicketsButton = await driver.$("-android uiautomator:new UiSelector().text(\"My Rides & Tickets\")");
    await myRidesAndTicketsButton.click();
    await driver.pause(3000);

    // Verify screen header
    const screenHeader = await driver.$("-android uiautomator:new UiSelector().text(\"My Rides & Tickets\")");
    await expect(screenHeader).toBeDisplayed();
    await driver.pause(3000);

    // Verify back button is present
    const backButton = await driver.$("-android uiautomator:new UiSelector().resourceId(\"back_button\")");
    await expect(backButton).toBeDisplayed();

    // Verify last ride section
    const lastRideSection = await driver.$("-android uiautomator:new UiSelector().text(\"Your last ride\")");
    await expect(lastRideSection).toBeDisplayed();


    // Verify last ride amount contains € symbol
    const lastRideAmount = await driver.$("-android uiautomator:new UiSelector().textMatches(\".*€.*\")");
    await expect(lastRideAmount).toBeDisplayed();
    
    const lastRideAmountText = await lastRideAmount.getText();
    await expect(lastRideAmountText).toMatch(/€.*\d/);
    // Updated regex to handle both "€0.-" and "€X.XX" formats
    //await expect(lastRideAmountText).toMatch(/€\s*(\d+\.\d+|0\.-)/);

    // Verify "Previous rides" section header
    const previousRidesHeader = await driver.$("-android uiautomator:new UiSelector().textContains(\"Previous rides\")");
    await expect(previousRidesHeader).toBeDisplayed();
    await driver.pause(3000);


    // back to common list of account menu
    await backButton.click();
    await driver.pause(2000);
  });



  it('should display all key My Payments screen elements', async () => {

    // Click on Account button
    const accountButton = await driver.$("-android uiautomator:new UiSelector().text(\"Account\")");
    await accountButton.click();
    await driver.pause(2000);
    
    // Navigate to My Payments
    const myPaymentsButton = await driver.$("-android uiautomator:new UiSelector().text(\"My payments\")");
    await myPaymentsButton.click();
    await driver.pause(3000);

    // Verify screen header
    const screenHeader = await driver.$("-android uiautomator:new UiSelector().text(\"My payments\")");
    await expect(screenHeader).toBeDisplayed();

    // Verify back button is present
    const backButton = await driver.$("-android uiautomator:new UiSelector().description(\"back_button\")");
    await expect(backButton).toBeDisplayed();

    // Verify last payment section
    const lastPaymentSection = await driver.$("-android uiautomator:new UiSelector().text(\"Your last payment\")");
    await expect(lastPaymentSection).toBeDisplayed();

    // Verify last payment date
    const lastPaymentDateElement = await driver.$("-android uiautomator:new UiSelector().textMatches(\"\\d{1,2} \\w+ \\d{4}\")");
    await expect(lastPaymentDateElement).toBeDisplayed();
    const lastPaymentDateText = await lastPaymentDateElement.getText();
    
    // Validate date format (e.g., 17 December 2024)
    expect(lastPaymentDateText).toMatch(/^\d{1,2}\s[A-Z][a-z]+\s\d{4}$/);

    // Verify last payment amount contains € symbol
    const lastPaymentAmount = await driver.$("-android uiautomator:new UiSelector().textMatches(\".*€.*\")");
    await expect(lastPaymentAmount).toBeDisplayed();
    const lastPaymentAmountText = await lastPaymentAmount.getText();
    await expect(lastPaymentAmountText).toMatch(/€\d+\.\d+/);

    // Verify "Previous payments" section header
    const previousPaymentsHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Previous payments\")");
    await expect(previousPaymentsHeader).toBeDisplayed();

    /*// Check previous payments list
    const previousPaymentsList = await driver.$$("-android uiautomator:new UiSelector().className(\"android.view.ViewGroup\").description(\"09 December 2024, €4.50\")");
    
    // Verify at least one previous payment exists
    await expect(previousPaymentsList.length).toBeGreaterThan(0);


    // Validate each previous payment entry
    for (const paymentEntry of [previousPaymentsList]) {
      // Check date is present and in correct format
      const paymentDateElement = await paymentEntry.$("-android uiautomator:new UiSelector().textMatches(\"\\d{1,2} \\w+ \\d{4}\")");
      await expect(paymentDateElement).toBeDisplayed();
      const paymentDateText = await paymentDateElement.getText();
      expect(paymentDateText).toMatch(/^\d{1,2}\s[A-Z][a-z]+\s\d{4}$/); 
      
      // Check amount contains € symbol
      const paymentAmountElement = await paymentEntry.$("-android uiautomator:new UiSelector().textMatches(\".*€.*\")");
      await expect(paymentAmountElement).toBeDisplayed();
      const paymentAmountText = await paymentAmountElement.getText();
      await expect(paymentAmountText).toMatch(/€\d+\.\d+/);
    }*/

    // back to common list of account menu
    await backButton.click();
    await driver.pause(2000);
  });



  it('should display all key Personal Info screen elements', async () => {

    // Click on Account button
    const accountButton = await driver.$("-android uiautomator:new UiSelector().text(\"Account\")");
    await accountButton.click();
    await driver.pause(2000);

    //navigate to personal info

    const personalInfo = await driver.$("-android uiautomator:new UiSelector().text(\"Personal info\")");
    await personalInfo.click();

    // Verify screen header
    const screenHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Personal Info\")");
    await expect(screenHeader).toBeDisplayed();

    // Verify back button is present
    const backButton = await driver.$("-android uiautomator:new UiSelector().description(\"back_button\")");
    await expect(backButton).toBeDisplayed();

    // Verify Email Section
    const emailQuestion = await driver.$("-android uiautomator:new UiSelector().text(\"What is your email?\")");
    await expect(emailQuestion).toBeDisplayed();

    /*const emailValue = await driver.$("-android uiautomator:new UiSelector().text(\"new@gmail.com\")");
    await expect(emailValue).toBeDisplayed(); */

    // Verify Edit button for email
    const emailEditButton = await driver.$("-android uiautomator:new UiSelector().text(\"Edit\")");
    await expect(emailEditButton).toBeDisplayed();

    // Verify Phone Number Section
    const phoneQuestion = await driver.$("-android uiautomator:new UiSelector().text(\"What is your phone number?\")");
    await expect(phoneQuestion).toBeDisplayed();

    /*const phoneValue = await driver.$("-android uiautomator:new UiSelector().text(\"+3197010586556\")");
    await expect(phoneValue).toBeDisplayed(); */

    // Verify Name Section
    const nameQuestion = await driver.$("-android uiautomator:new UiSelector().text(\"What is your name?\")");
    await expect(nameQuestion).toBeDisplayed();

    /*const nameValue = await driver.$("-android uiautomator:new UiSelector().text(\"New\")");
    await expect(nameValue).toBeDisplayed(); */

    // Verify Last Name Section
    const lastNameQuestion = await driver.$("-android uiautomator:new UiSelector().text(\"What is your last name?\")");
    await expect(lastNameQuestion).toBeDisplayed();

    /*const lastNameValue = await driver.$("-android uiautomator:new UiSelector().text(\"New\")");
    await expect(lastNameValue).toBeDisplayed(); */

    // Verify Address Section
    const addressQuestion = await driver.$("-android uiautomator:new UiSelector().text(\"What is your address?\")");
    await expect(addressQuestion).toBeDisplayed();

    // Verify Street field
    /*const streetLabel = await driver.$("-android uiautomator:new UiSelector().text(\"Street\")");
    await expect(streetLabel).toBeDisplayed(); */

    const streetInput = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(0)");
    await expect(streetInput).toBeDisplayed();

    // Verify Number field
    /*const numberLabel = await driver.$("-android uiautomator:new UiSelector().text(\"Number\")");
    await expect(numberLabel).toBeDisplayed(); */

    const numberInput = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(1)");
    await expect(numberInput).toBeDisplayed();

    // Verify Country field
   /* const countryLabel = await driver.$("-android uiautomator:new UiSelector().text(\"Country\")");
    await expect(countryLabel).toBeDisplayed(); */

    const countryInput = await driver.$("-android uiautomator:new UiSelector().className(\"android.view.ViewGroup\").description(\"\")");
    await expect(countryInput).toBeDisplayed();

      //Scroll to bottom
   await driver.executeScript('mobile: scrollGesture', [{
    left: 100,
    top: 1500,
    width: 200,
    height: 100,
    direction: 'down',
    percent: 100
  }]); 
  await driver.pause(5000);

  
   // Verify Zip Code field
   const zipCode = await driver.$("-android uiautomator:new UiSelector().text(\"Zip Code\")");
    await expect(zipCode).toBeDisplayed();

    // Verify City field
   const city = await driver.$("-android uiautomator:new UiSelector().text(\"City\")");
   await expect(city).toBeDisplayed();

   // Verify Save button
   const saveButton = await driver.$("-android uiautomator:new UiSelector().text(\"SAVE\")");
   await expect(saveButton).toBeDisplayed();

   // Verify Help button
   const helpButton = await driver.$("-android uiautomator:new UiSelector().text(\"Help\")");
   await expect(helpButton).toBeDisplayed();


    // click back button to main acount menu
    await backButton.click();
    await driver.pause(2000);
  });



  it('should display all key Ride Credit screen elements', async () => {

    // Click on Account button
    const accountButton = await driver.$("-android uiautomator:new UiSelector().text(\"Account\")");
    await accountButton.click();
    await driver.pause(2000);
    
    // Navigate to Ride Credit
    const rideCreditButton = await driver.$("-android uiautomator:new UiSelector().text(\"Ride credit\")");
    await rideCreditButton.click();
    await driver.pause(3000);

    // Verify screen header
    const screenHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Ride credit\")");
    await expect(screenHeader).toBeDisplayed();

    // Verify back button is present
    const backButton = await driver.$("-android uiautomator:new UiSelector().description(\"back_button\")");
    await expect(backButton).toBeDisplayed();


    // Verify "Your promotional code" section header
    const promotionalCodeHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Your promotional code\")");
    await expect(promotionalCodeHeader).toBeDisplayed();

    // Verify promotional code description
    const promotionalCodeDescription = await driver.$("-android uiautomator:new UiSelector().textContains(\"Received a promotional code?\")");
    await expect(promotionalCodeDescription).toBeDisplayed();

    // Verify promotional code input field
    const promotionalCodeInput = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\")");
    await expect(promotionalCodeInput).toBeDisplayed();

    // Verify "SUBMIT PROMOTIONAL CODE" button
    const submitPromotionalCodeButton = await driver.$("-android uiautomator:new UiSelector().text(\"SUBMIT PROMOTIONAL CODE\")");
    await expect(submitPromotionalCodeButton).toBeDisplayed();

    // click back button to main acount menu
    await backButton.click();
    await driver.pause(2000);
  });



  it('should display all key Invite Friends screen elements', async () => {

    // Click on Account button
    const accountButton = await driver.$("-android uiautomator:new UiSelector().text(\"Account\")");
    await accountButton.click();
    await driver.pause(2000);
    
    // Navigate to Invite Friends
    const inviteFriendsButton = await driver.$("-android uiautomator:new UiSelector().text(\"Invite friends\")");
    await inviteFriendsButton.click();
    await driver.pause(3000);

    // Verify back button is present
    const backButton = await driver.$("-android uiautomator:new UiSelector().description(\"back_button\")");
    await expect(backButton).toBeDisplayed();

    // Verify screen title
    const screenTitle = await driver.$("-android uiautomator:new UiSelector().text(\"Invite friends and earn €10 for each one!\")");
    await expect(screenTitle).toBeDisplayed();

    // Verify screen description
    const screenDescription = await driver.$("-android uiautomator:new UiSelector().textContains(\"Make a friend ride with umob - both get €10,- ride credit\")");
    await expect(screenDescription).toBeDisplayed();

    // Verify Your Code section
    const yourCodeLabel = await driver.$("-android uiautomator:new UiSelector().text(\"Your code\")");
    await expect(yourCodeLabel).toBeDisplayed();

    /* Verify the actual referral code
    const referralCode = await driver.$("-android uiautomator:new UiSelector().text(\"QYI-S50\")");
    await expect(referralCode).toBeDisplayed(); */

    // Verify usage count
    const usageCount = await driver.$("-android uiautomator:new UiSelector().text(\"Your code has been used 0 out of 5 times\")");
    await expect(usageCount).toBeDisplayed();

    // Verify Share Code button
    const shareCodeButton = await driver.$("-android uiautomator:new UiSelector().text(\"SHARE CODE\")");
    await expect(shareCodeButton).toBeDisplayed();

    // click back button to main acount menu
    await backButton.click();
    await driver.pause(2000);
  });


  
  it('should display all key Payment Settings screen elements', async () => {

    // Click on Account button
    const accountButton = await driver.$("-android uiautomator:new UiSelector().text(\"Account\")");
    await accountButton.click();
    await driver.pause(2000);
    
    // Navigate to Payment Settings screen
    const paymentSettingsButton = await driver.$("-android uiautomator:new UiSelector().text(\"Payment settings\")");
    await expect(paymentSettingsButton).toBeDisplayed();
    await paymentSettingsButton.click();

    // Verify screen header
    const screenHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Payment method\")");
    await expect(screenHeader).toBeDisplayed();

    // Verify back button is present
    const backButton = await driver.$("-android uiautomator:new UiSelector().description(\"back_button\")");
    await expect(backButton).toBeDisplayed();

    // Verify card information
    //const releaseText = await driver.$("-android uiautomator:new UiSelector().text(\"RELEASE 69\")");
    //await expect(releaseText).toBeDisplayed();

    const cardType = await driver.$("-android uiautomator:new UiSelector().text(\"MasterCard\")");
    await expect(cardType).toBeDisplayed();

    const cardNumber = await driver.$("-android uiautomator:new UiSelector().text(\"**** **** **** 1115\")");
    await expect(cardNumber).toBeDisplayed();

    const expiryDate = await driver.$("-android uiautomator:new UiSelector().text(\"03/2030\")");
    await expect(expiryDate).toBeDisplayed();

    // Verify action buttons
    const removeButton = await driver.$("-android uiautomator:new UiSelector().text(\"REMOVE PAYMENT METHOD\")");
    await expect(removeButton).toBeDisplayed();

    const helpButton = await driver.$("-android uiautomator:new UiSelector().text(\"Help\")");
    await expect(helpButton).toBeDisplayed();

    // Optional: Verify container element
    const paymentDetailsContainer = await driver.$("-android uiautomator:new UiSelector().description(\"PaymentDetailsContainer\")");
    await expect(paymentDetailsContainer).toBeDisplayed();

    // click back button to main acount menu
    await backButton.click();
    await driver.pause(2000);
  });

  it('should display all key ID Document screen elements', async () => {
    // Navigate to Account screen first
    const accountButton = await driver.$("-android uiautomator:new UiSelector().text(\"Account\")");
    await accountButton.click();

    // Navigate to ID Document screen
    const idDocumentButton = await driver.$("-android uiautomator:new UiSelector().text(\"ID Document\")");
    await expect(idDocumentButton).toBeDisplayed();
    await idDocumentButton.click();

    // Verify screen header
    const screenHeader = await driver.$("-android uiautomator:new UiSelector().text(\"ID document\")");
    await expect(screenHeader).toBeDisplayed();

    // Verify back button is present
    const backButton = await driver.$("-android uiautomator:new UiSelector().description(\"back_button\")");
    await expect(backButton).toBeDisplayed();

    // Verify "Verified" status text
    const verifiedStatus = await driver.$("-android uiautomator:new UiSelector().text(\"Verified\")");
    await expect(verifiedStatus).toBeDisplayed();

    // Verify Document Type section
    const documentTypeTitle = await driver.$("-android uiautomator:new UiSelector().text(\"Document type\")");
    await expect(documentTypeTitle).toBeDisplayed();

    const driverLicenseText = await driver.$("-android uiautomator:new UiSelector().text(\"Driver license\")");
    await expect(driverLicenseText).toBeDisplayed();

    // Verify Status section
    const statusTitle = await driver.$("-android uiautomator:new UiSelector().text(\"Status\")");
    await expect(statusTitle).toBeDisplayed();

    const statusVerifiedText = await driver.$("-android uiautomator:new UiSelector().description(\"IdDocumentStatusIdDocumentItemContent\")");
    await expect(statusVerifiedText).toBeDisplayed();

    // Verify Expiration Date section
    const expirationTitle = await driver.$("-android uiautomator:new UiSelector().text(\"Expiration date\")");
    await expect(expirationTitle).toBeDisplayed();

    const expirationDate = await driver.$("-android uiautomator:new UiSelector().text(\"28 May 2031\")");
    await expect(expirationDate).toBeDisplayed();

    // Verify Categories section
    const categoriesTitle = await driver.$("-android uiautomator:new UiSelector().text(\"Categories\")");
    await expect(categoriesTitle).toBeDisplayed();

    // Verify all license categories
    const categoryB = await driver.$("-android uiautomator:new UiSelector().description(\"undefinedIdDocumentItemContentB\")");
    await expect(categoryB).toBeDisplayed();

    const categoryA = await driver.$("-android uiautomator:new UiSelector().description(\"undefinedIdDocumentItemContentA\")");
    await expect(categoryA).toBeDisplayed();

    const categoryB1 = await driver.$("-android uiautomator:new UiSelector().description(\"undefinedIdDocumentItemContentB1\")");
    await expect(categoryB1).toBeDisplayed();

    const categoryAM = await driver.$("-android uiautomator:new UiSelector().description(\"undefinedIdDocumentItemContentAM\")");
    await expect(categoryAM).toBeDisplayed();

    // Verify Home Address section
    const homeAddressTitle = await driver.$("-android uiautomator:new UiSelector().text(\"Home address\")");
    await expect(homeAddressTitle).toBeDisplayed();

    const addAddressButton = await driver.$("-android uiautomator:new UiSelector().text(\"ADD\")");
    await expect(addAddressButton).toBeDisplayed();

    // Verify bottom buttons
    const changeDocumentButton = await driver.$("-android uiautomator:new UiSelector().text(\"CHANGE DOCUMENT\")");
    await expect(changeDocumentButton).toBeDisplayed();

    const helpButton = await driver.$("-android uiautomator:new UiSelector().text(\"Help\")");
    await expect(helpButton).toBeDisplayed();

    // Optional: Verify main container
    const idDocumentContainer = await driver.$("-android uiautomator:new UiSelector().description(\"IdDocumentContainer\")");
    await expect(idDocumentContainer).toBeDisplayed();
  });






  afterEach(async () => {
    try {
      await driver.terminateApp("com.umob.umob");
    } catch (error) {
      console.log('Error terminating app:', error);
    }
  });
});