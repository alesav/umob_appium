import PageObjects from "../../pageobjects/umobPageObjects.page.js";
import { getCredentials, executeTest } from "../../helpers/TestHelpers.js";

// Get environment and user from env variables or use defaults
const ENV = process.env.TEST_ENV || "test";
const USER = process.env.TEST_USER || "newUser";

/////////////////////////////////////////////////////////////////////////////////
describe("Add voucher for the New User", () => {
    before(async () => {
        const credentials = getCredentials(ENV, USER);

        await PageObjects.login({
            username: credentials.username,
            password: credentials.password,
        });
    });

    ////////////////////////////////////////////////////////////////////////////////
    it("Add voucher for the New User", async () => {
        const testId = "91244991-8026-493d-a5ca-8b8bebfaba56";

        await executeTest(testId, async () => {
            await driver.pause(2000);
            //click account button
            await PageObjects.clickAccountButton();
            await driver.pause(2000);

            //scroll
            const { width, height } = await driver.getWindowSize();
            await driver.performActions([
                {
                    type: "pointer",
                    id: "finger1",
                    parameters: { pointerType: "touch" },
                    actions: [
                        {
                            type: "pointerMove",
                            duration: 0,
                            x: width / 2,
                            y: height * 0.8,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 100 },
                        {
                            type: "pointerMove",
                            duration: 1000,
                            x: width / 2,
                            y: height * 0.6,
                        },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);
            await driver.pause(1000);

            //go to ride credit/Vouchers
            await expect(PageObjects.vouchersButton).toBeDisplayed();
            await PageObjects.vouchersButton.click();
            await expect(PageObjects.voucherCodeLabel).toBeDisplayed();
            await driver.pause(2000);

            //click on code section and add value of voucher
            await PageObjects.voucherCodeInput.addValue("multi5");

            //click on Submit button
            await expect(PageObjects.submitPromotionalCodeButton).toBeDisplayed();
            await PageObjects.submitPromotionalCodeButton.click();

            //check that voucher was added
            await expect(PageObjects.multiPaymentOption).toBeDisplayed();
        });
    });

    afterEach(async () => {
        await driver.terminateApp("com.umob.umob");
    });
});
