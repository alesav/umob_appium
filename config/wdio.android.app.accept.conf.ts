import { join } from "node:path";
import { config as baseConfig } from "./wdio.shared.local.appium.conf.js";

export const config: WebdriverIO.Config = {
    ...baseConfig,

    specs: [
        //"../tests/specs/account/combinedLoggedTest.spec.ts",
        //TESTS FOR ACCEPT APP (npm run android.app.accept)
        "../tests/specs/login/login.negative.spec.ts",
        "../tests/specs/notLoggedTests/combinedNotLogged.spec.ts",
        "../tests/specs/account/AddAdress.spec.ts", //new12 /  for accept test@gmail.com)
        "../tests/specs/book/2bookPublicTransport.spec.ts", //new56  / for accept test@gmail
        "../tests/specs/newUser/addPaymentMethod.spec.ts", //newUser /   for accept test@gmail.com
        "../tests/specs/newUser/nCombinedLoggedTest.spec.ts", //newUser /   for accept test@gmail.com
        "../tests/specs/newUser/deleteCard.spec.ts", //newUser (new48)  /  for accept test@gmail.com
        "../tests/specs/account/locationPermissionOff.spec.ts", //new12 /   for accept test@gmail.com
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
