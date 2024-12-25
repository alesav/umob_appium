describe('Map Theme Settings Screen Elements Validation', () => {
  beforeEach(async () => {
    await driver.activateApp("com.umob.umob");
    await driver.pause(7000);
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