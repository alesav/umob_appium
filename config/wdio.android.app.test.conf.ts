import { join } from "node:path";
import { config as baseConfig } from "./wdio.shared.local.appium.conf.js";

export const config: WebdriverIO.Config = {
    ...baseConfig,

<<<<<<< HEAD
    //specs: ["/Users/alesav/Dev/umob/appium-boilerplate/tests/specs/book/bookLime.spec.ts"],
    specs: ["c:/dev/umob_appium/tests/specs/newUserVoucher/vCombinedLoggedTest.spec.ts"],
=======
    specs: ["/Users/alesav/Dev/umob/appium-boilerplate/tests/specs/book/*.spec.ts"],
    //specs: ["c:/dev/umob_appium/tests/specs/book/reserveFelyx.spec.ts"],
>>>>>>> 798e136c6282ad2ac70fe903c822f37b68ca8c39
    capabilities: [
        {
            platformName: "Android",
            "appium:automationName": "UiAutomator2",
            "appium:deviceName": "Android",
            "appium:appPackage": "com.umob.umob",
            "appium:appActivity": "com.umob.umob.MainActivity",
            "appium:newCommandTimeout": 120,
            //"appium:noReset": true,
          },
    ],
    maxInstances: 1
};
       