import { join } from "node:path";
import { config as baseConfig } from "./wdio.shared.local.appium.conf.js";

export const config: WebdriverIO.Config = {
    ...baseConfig,

    specs: [
        //TESTS FOR ACCEPT APP (npm run android.app.test.accept)
        //"../tests/specs/login/login.negative.spec.ts",
        //"../tests/specs/notLoggedTests/combinedNotLogged.spec.ts",
        //"../tests/specs/account/AddAdress.spec.ts", //new12 /test@gmail.com)
        "../tests/specs/newUser/COPYpopupAddPaymentMethod.spec.ts", //newUser
        "../tests/specs/newUser/nCombinedLoggedTest.spec.ts", //newUser
        // "../tests/specs/newUser/deleteCard.spec.ts", //newUser (new48/test@gmail.com)
    ],
    capabilities: [
        {
            platformName: "Android",
            "appium:automationName": "UiAutomator2",
            "appium:deviceName": "Android_Local",
            "appium:appPackage": "com.umob.umob",
            "appium:appActivity": "com.umob.umob.MainActivity",
            "appium:newCommandTimeout": 180,
            //"appium:autoGrantPermissions": true
            //"appium:noReset": true,
        },
    ],
    maxInstances: 1,
};
