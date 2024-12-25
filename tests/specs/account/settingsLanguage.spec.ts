describe('Language Screen Elements Validation', () => {
  beforeEach(async () => {
    await driver.activateApp("com.umob.umob");
    await driver.pause(7000);
  });

  it('should display all key language screen elements', async () => {
    // Click on Settings button to navigate to settings
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

    
  });

  afterEach(async () => {
    try {
      await driver.terminateApp("com.umob.umob");
    } catch (error) {
      console.log('Error terminating app:', error);
    }
  });
});