describe('Map Theme Settings Screen Elements Validation', () => {
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
  });

  afterEach(async () => {
    try {
      await driver.terminateApp("com.umob.umob");
    } catch (error) {
      console.log('Error terminating app:', error);
    }
  });
});