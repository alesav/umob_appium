/**
 * Helper function to click account button and wait for Personal info to be visible
 * Retries clicking account button if Personal info is not found
 * @param {object} driver - WebdriverIO driver instance
 * @param {object} PageObjects - Page objects containing accountButton
 * @param {number} maxRetries - Maximum number of retry attempts (default: 5)
 * @param {number} delayBetweenRetries - Delay between retries in milliseconds (default: 2000)
 * @returns {Promise<object>} Personal info element
 */
export async function clickAccountAndWaitForPersonalInfo(driver, PageObjects, maxRetries = 5, delayBetweenRetries = 2000) {
  let personalInfo;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}: Clicking account button and looking for Personal info`);
      
      // Wait for account button to exist and click it
      await PageObjects.accountButton.waitForExist();
      await driver.pause(1000);
      await PageObjects.accountButton.click();
      await driver.pause(2000);

      // Try to find Personal info element
      personalInfo = await driver.$("-android uiautomator:new UiSelector().text(\"Personal info\")");
      
      // Wait a short time to see if the element becomes visible
      try {
        await personalInfo.waitForExist({ timeout: 3000 });
        console.log(`Success: Personal info found on attempt ${attempt}`);
        return personalInfo;
      } catch (waitError) {        console.log(`Attempt ${attempt}: Personal info not found, will retry...`);
        lastError = waitError;
        
        if (attempt < maxRetries) {
          await driver.pause(delayBetweenRetries);
        }
      }
    } catch (error) {
      console.log(`Attempt ${attempt}: Error clicking account button:`, error.message);
      lastError = error;
      
      if (attempt < maxRetries) {
        await driver.pause(delayBetweenRetries);
      }
    }
  }

  throw new Error(`Failed to find Personal info after ${maxRetries} attempts. Last error: ${lastError?.message}`);
}

export default clickAccountAndWaitForPersonalInfo;
