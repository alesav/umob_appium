describe('Login Negative Scenarios', () => {
  beforeEach(async () => {
   
    await driver.activateApp("com.umob.umob");
    await driver.pause(7000);
  });
  it('should display key navigation elements', async () => {
    // Verify bottom navigation menu items
    const taxiButton = await driver.$('-android uiautomator:new UiSelector().text("Taxi")');
    await expect(taxiButton).toBeDisplayed();

    const publicTransportButton = await driver.$('-android uiautomator:new UiSelector().text("Public transport")');
    await expect(publicTransportButton).toBeDisplayed();

    const accountButton = await driver.$('-android uiautomator:new UiSelector().text("Account")');
    await expect(accountButton).toBeDisplayed();

    const settingsButton = await driver.$('-android uiautomator:new UiSelector().text("Settings")');
    await expect(settingsButton).toBeDisplayed();

    // Verify filter button is displayed
    const assetFilterToggle = await driver.$('-android uiautomator:new UiSelector().resourceId("home_asset_filter_toggle")');
    await expect(assetFilterToggle).toBeDisplayed();

    // Check for map root element
    const mapRoot = await driver.$('-android uiautomator:new UiSelector().resourceId("map_root")');
    await expect(mapRoot).toBeDisplayed();
  });

  it('confirmation of existing menu button my rides and tickets', async () => {
    const el1 = await driver.$("-android uiautomator:new UiSelector().text(\"Account\")");
await el1.click();
await driver.pause(2000);

const el4 = await driver.$("accessibility id:0-AccountListItemButton");
await el4.click();
const el5 = await driver.$("accessibility id:undefined-header-title");
await el5.click();
});

  

  afterEach(async () => {
    // Optional: Reset the app state after each test
    try {
      await driver.terminateApp("com.umob.umob");

    } catch (error) {
      console.log('Error terminating app:', error);
    }
  });
});