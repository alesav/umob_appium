describe('Settings Screen Verification', () => {
  beforeEach(async () => {
    await driver.activateApp("com.umob.umob");
    await driver.pause(7000);
  });

 
  beforeEach(async () => {
  
      // Navigate to settings screen
      const settingsButton = await driver.$("-android uiautomator:new UiSelector().text(\"Settings\")");
      await settingsButton.click();
      await driver.pause(2000);
    });
  
    it('should display all key settings screen elements', async () => {
      // Verify "App settings" header is present
      const appSettingsHeader = await driver.$("-android uiautomator:new UiSelector().text(\"App settings\")");
      await expect(appSettingsHeader).toBeDisplayed();
  
      // Verify Language settings section
      const languageSettingsButton = await driver.$("-android uiautomator:new UiSelector().resourceId(\"settings_menu_language_link-AccountListItemButton\")");
      await expect(languageSettingsButton).toBeDisplayed();
      const languageText = await driver.$("-android uiautomator:new UiSelector().text(\"Language\")");
      await expect(languageText).toBeDisplayed();
  
      // Verify Map theme settings section
      const mapThemeSettingsButton = await driver.$("-android uiautomator:new UiSelector().resourceId(\"settings_menu_map_theme_link-AccountListItemButton\")");
      await expect(mapThemeSettingsButton).toBeDisplayed();
      const mapThemeText = await driver.$("-android uiautomator:new UiSelector().text(\"Map theme settings\")");
      await expect(mapThemeText).toBeDisplayed();
  
      // Verify Support section header
      const supportHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Support\")");
      await expect(supportHeader).toBeDisplayed();
  
      // Verify Privacy & Legal section
      const privacyLegalButton = await driver.$("-android uiautomator:new UiSelector().text(\"Privacy & Legal\")");
      await expect(privacyLegalButton).toBeDisplayed();
  
      // Verify Logout button
      const logoutButton = await driver.$("-android uiautomator:new UiSelector().text(\"LOG OUT\")");
      await expect(logoutButton).toBeDisplayed();
  
      
    });
  




  afterEach(async () => {
    try {
      await driver.terminateApp("com.umob.umob");
    } catch (error) {
      console.log('Error terminating app:', error);
    }
  });
})
