import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import PostHogHelper from "../../helpers/PosthogHelper.js";
import PostHogHelper from "../../helpers/PosthogHelper.js";
import { getCredentials, executeTest, ENV } from "../../helpers/TestHelpers.js";

const posthog = new PostHogHelper();
const TEST_USER = "newUser";

// Function to add payment method
async function addPaymentMethod() {
    // Click Add payment method
    await PageObjects.addPaymentMethodButton.waitForDisplayed();
    await driver.pause(6000);
    await PageObjects.addPaymentMethodButton.click();
    await driver.pause(6000);

    // Click Cards
    const cardsBtn = await driver.$(
        '-android uiautomator:new UiSelector().text("Cards")',
    );
    await cardsBtn.waitForDisplayed();
    await cardsBtn.click();

    const cardNumber = await driver.$(
        "id:com.umob.umob:id/editText_cardNumber",
    );
    await cardNumber.click();
    await cardNumber.addValue("5555341244441115");

    const expiryDate = await driver.$(
        "id:com.umob.umob:id/editText_expiryDate",
    );
    await expiryDate.click();
    await expiryDate.addValue("0330");

    const securityCode = await driver.$(
        "id:com.umob.umob:id/editText_securityCode",
    );
    await securityCode.click();
    await securityCode.addValue("737");

    const cardHolder = await driver.$(
        "id:com.umob.umob:id/editText_cardHolder",
    );
    await cardHolder.click();
    await cardHolder.addValue("Test Account");

    const payButton = await driver.$("id:com.umob.umob:id/payButton");
    await payButton.click();

    await driver.pause(2000);
}

describe("Add Payment Method through popup for the New User", () => {
    before(async () => {
        const credentials = getCredentials(ENV, TEST_USER);
        await PageObjects.login({
            username: credentials.username,
            password: credentials.password,
        });
    });

    beforeEach(async () => {
        await driver.terminateApp("com.umob.umob");
        await driver.activateApp("com.umob.umob");
    });

    it("Add credit card through popup", async () => {
        const testId = "490ea927-eebf-452a-9227-4f4098cac232";

        await executeTest(testId, async () => {
            await driver.pause(2000);

            // Verify that popup is present
            const notification = await driver.$(
                '-android uiautomator:new UiSelector().textContains("You have not finished your registration")',
            );
            await expect(notification).toBeDisplayed();

            const finishLater = await driver.$(
                '-android uiautomator:new UiSelector().text("Finish Later")',
            );
            await expect(finishLater).toBeDisplayed();
            await driver.pause(5000);

            // Verify that there is no error message
            const errorMessages = [
                "Error adding payment",
                "We couldn't add your payment",
            ];

            for (const message of errorMessages) {
                const errorElement = await driver.$(
                    `-android uiautomator:new UiSelector().textContains("${message}")`,
                );

                try {
                    const isDisplayed = await errorElement.isDisplayed();
                    if (isDisplayed) {
                        throw new Error(
                            `Problem with adding payment card: Found error message when card is not added "${message}"`,
                        );
                    }
                } catch (elementError) {
                    // If element is not found then it is good, we continue our checks
                    if (
                        elementError.message.includes(
                            "Problem with adding payment card",
                        )
                    ) {
                        throw elementError;
                    }
                }
            }

            console.log(
                "✓ All checks passed - no error message found when card is not added yet",
            );

            // Click on Continue button
            const contButton = await driver.$(
                '-android uiautomator:new UiSelector().text("Continue")',
            );
            await expect(contButton).toBeDisplayed();
            await driver.pause(5000);
            await contButton.click();

            // Verify header
            const headerPayment = await driver.$(
                '-android uiautomator:new UiSelector().text("Payment method")',
            );
            await expect(headerPayment).toBeDisplayed();
            await driver.pause(4000);

            // Try to add payment method with retry logic
            await addPaymentMethod();

            // Check if verification is in progress (need to retry)
            try {
                const verificationInProgress = await driver.$(
                    '-android uiautomator:new UiSelector().textContains("Verification in progress")',
                );
                if (await verificationInProgress.isExisting()) {
                    console.log(
                        "Verification in progress detected, clicking ADD PAYMENT METHOD and retrying...",
                    );

                    // First click on ADD PAYMENT METHOD to go to payment method page
                    await PageObjects.addPaymentMethodButton.waitForDisplayed();
                    await PageObjects.addPaymentMethodButton.click();
                    await driver.pause(2000);

                    // Then execute the payment method addition flow
                    await addPaymentMethod();
                }
            } catch (e) {
                // Element not found or not displayed - continue normally
                console.log("No verification in progress, continuing...");
            }

            // Assert Remove payment method button is displayed (success scenario)
            await PageObjects.removePaymentMethodButton.waitForDisplayed();
            await driver.pause(2000);

            // Verify PostHog events
            try {
                // Get Adyen paymentmethod registration started event
                const adyenStartedEvent = await posthog.waitForEvent(
                    {
                        eventName: "Adyen paymentmethod registration started",
                    },
                    {
                        maxRetries: 10,
                        retryDelayMs: 3000,
                        searchLimit: 20,
                        maxAgeMinutes: 5,
                    },
                );

                // Get Adyen paymentmethod registration completed event
                const adyenCompletedEvent = await posthog.waitForEvent(
                    {
                        eventName: "Adyen paymentmethod registration completed",
                    },
                    {
                        maxRetries: 10,
                        retryDelayMs: 3000,
                        searchLimit: 20,
                        maxAgeMinutes: 5,
                    },
                );

                // If we got here, event was found with all criteria matching
                posthog.printEventSummary(adyenStartedEvent);
                posthog.printEventSummary(adyenCompletedEvent);

                // Verify Adyen paymentmethod registration started event
                expect(adyenStartedEvent.event).toBe(
                    "Adyen paymentmethod registration started",
                );
                expect(adyenStartedEvent.person?.is_identified).toBe(true);
                expect(adyenStartedEvent.person?.properties?.email).toBe(
                    "new48@gmail.com",
                );

                // Verify Adyen paymentmethod registration completed event
                expect(adyenCompletedEvent.event).toBe(
                    "Adyen paymentmethod registration completed",
                );
                expect(adyenCompletedEvent.person?.is_identified).toBe(true);
                expect(adyenCompletedEvent.person?.properties?.email).toBe(
                    "new48@gmail.com",
                );
            } catch (posthogError) {
                console.error("PostHog verification failed:", posthogError);
                throw posthogError;
            }
        });
    });

    afterEach(async () => {
        await driver.terminateApp("com.umob.umob");
    });
});
