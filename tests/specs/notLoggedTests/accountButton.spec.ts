describe('Account Screen Elements Validation', () => {
  beforeEach(async () => {
    await driver.activateApp("com.umob.umob");
    await driver.pause(7000);

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
      await driver.pause(3000);
    } catch (error) {
      console.log('Popup not found or already handled:', error);
    }
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
  });

  afterEach(async () => {
    try {
      await driver.terminateApp("com.umob.umob");
    } catch (error) {
      console.log('Error terminating app:', error);
    }
  });
});