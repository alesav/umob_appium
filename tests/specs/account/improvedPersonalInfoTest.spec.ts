// Add these imports at the top of your test file
import clickAccountAndWaitForPersonalInfo from '../../helpers/clickAccountAndWaitForPersonalInfo.js';
import waitForSpinnerToDisappear from '../../helpers/waitForSpinnerToDisappear.js';

// Updated test method that demonstrates both approaches
it('should display all key Personal Info screen elements - IMPROVED', async () => {
    const testId = "8553a675-1b49-4cf4-b838-6bee6574d8a1"

    let testStatus = "Pass";
    let screenshotPath = "";
    let testDetails = ""
    let error = null;

    try {
        // APPROACH 1: Wait for spinner to disappear before clicking
        console.log('Approach 1: Wait for spinner to disappear first');
        await driver.pause(2000);
        
        // Wait for any loading spinner to disappear
        await waitForSpinnerToDisappear(driver, 10000);
        
        await PageObjects.clickAccountButton();
        await driver.pause(2000);

        // Try to find Personal info element
        let personalInfo;
        try {
            personalInfo = await driver.$("-android uiautomator:new UiSelector().text(\"Personal info\")");
            await personalInfo.waitForExist({ timeout: 5000 });
            console.log('Approach 1 succeeded: Personal info found');
        } catch (personalInfoError) {
            console.log('Approach 1 failed, trying Approach 2: Retry clicking account button');
            
            // APPROACH 2: Retry clicking account button until Personal info appears
            personalInfo = await clickAccountAndWaitForPersonalInfo(driver, PageObjects, 5, 2000);
        }

        // Now click on Personal info to navigate
        await personalInfo.click();

        // Rest of your existing verification code...
        const screenHeader = await driver.$("-android uiautomator:new UiSelector().text(\"Personal Info\")");
        await expect(screenHeader).toBeDisplayed();

        const backButton = await driver.$("-android uiautomator:new UiSelector().description(\"back_button\")");
        await expect(backButton).toBeDisplayed();

        // ... rest of your existing test code remains the same ...

    } catch (e) {
        error = e;
        console.error("Test failed:", error);
        testStatus = "Fail";
        testDetails = e.message;
        
        screenshotPath = "./screenshots/"+ testId+".png";
        await driver.saveScreenshot(screenshotPath);
    } finally {
        // ... your existing finally block ...
    }
});
