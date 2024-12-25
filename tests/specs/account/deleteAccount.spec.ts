describe('Delete Account Screen Elements Validation', () => {
  beforeEach(async () => {
    await driver.activateApp("com.umob.umob");
    await driver.pause(7000);
  });

  it('should display all key delete account screen elements', async () => {
    // Click on Account button
    const accountButton = await driver.$("-android uiautomator:new UiSelector().text(\"Account\")");
    await accountButton.click();
    await driver.pause(2000);

    // Scroll down to make Delete account button visible
    await driver.executeScript('mobile: scrollGesture', [{
      left: 100,
      top: 1000,
      width: 200,
      height: 800,
      direction: 'down',
      percent: 50.0
    }]);
    await driver.pause(1000);

    // Click on Delete account button
    const deleteAccountButton = await driver.$("-android uiautomator:new UiSelector().text(\"Delete account\")");
    await expect(deleteAccountButton).toBeDisplayed();
    await deleteAccountButton.click();
    await driver.pause(2000);

    // Verify delete account screen title
    const screenTitle = await driver.$("-android uiautomator:new UiSelector().resourceId(\"DeleteAccountDetailsTitle\")");
    await expect(screenTitle).toBeDisplayed();
    await expect(await screenTitle.getText()).toBe("Are you sure you want to delete your account?");

    // Verify warning message
    const warningMessage = await driver.$("-android uiautomator:new UiSelector().resourceId(\"DeleteAccountDetailsMessage\")");
    await expect(warningMessage).toBeDisplayed();
    const messageText = await warningMessage.getText();
    await expect(messageText).toContain("Please note that by confirming deletion");
    await expect(messageText).toContain("Delete Policy");

    // Verify checkbox and its text
    const checkbox = await driver.$("-android uiautomator:new UiSelector().resourceId(\"DeleteAccountDetailsCheckBox\")");
    await expect(checkbox).toBeDisplayed();
    const checkboxText = await checkbox.getText();
    await expect(checkboxText).toBe("I understand that all my data will be deleted and I can no longer use the umob service");

    // Verify DELETE button
    const deleteButton = await driver.$("-android uiautomator:new UiSelector().resourceId(\"DeleteAccountDetailsDelete\")");
    await expect(deleteButton).toBeDisplayed();
    const deleteButtonText = await driver.$("-android uiautomator:new UiSelector().resourceId(\"DeleteAccountDetailsDelete-text\")");
    await expect(await deleteButtonText.getText()).toBe("DELETE");
    // Verify DELETE button is initially disabled
    await expect(await deleteButton.isEnabled()).toBe(false);

    // Verify CANCEL button
    const cancelButton = await driver.$("-android uiautomator:new UiSelector().resourceId(\"DeleteAccountDetailsCancel\")");
    await expect(cancelButton).toBeDisplayed();
    const cancelButtonText = await driver.$("-android uiautomator:new UiSelector().resourceId(\"DeleteAccountDetailsCancel-text\")");
    await expect(await cancelButtonText.getText()).toBe("CANCEL");
    // Verify CANCEL button is enabled
    await expect(await cancelButton.isEnabled()).toBe(true);

    // Verify Help button
    const helpButton = await driver.$("-android uiautomator:new UiSelector().text(\"Help\")");
    await expect(helpButton).toBeDisplayed();
  });

  afterEach(async () => {
    try {
      await driver.terminateApp("com.umob.umob");
    } catch (error) {
      console.log('Error terminating app:', error);
    }
  });
});