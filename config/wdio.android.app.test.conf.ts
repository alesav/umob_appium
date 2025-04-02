import { join } from "node:path";
import { config as baseConfig } from "./wdio.shared.local.appium.conf.js";

export const config: WebdriverIO.Config = {
    ...baseConfig,

    specs: ["/Users/alesav/Dev/umob/appium-boilerplate/tests/specs/account/*.spec.ts",
        "/Users/alesav/Dev/umob/appium-boilerplate/tests/specs/login/*.spec.ts"
    ],
    //specs: ["c:/dev/umob_appium/tests/specs/newUserVoucher/vCombinedLoggedTest.spec.ts"],
    capabilities: [
        {
            platformName: "Android",
            "appium:automationName": "UiAutomator2",
            "appium:deviceName": "Android_Local",
            "appium:appPackage": "com.umob.umob",
            "appium:appActivity": "com.umob.umob.MainActivity",
            "appium:newCommandTimeout": 120,
            //"appium:autoGrantPermissions": true
            //"appium:noReset": true,
          },
    ],
    maxInstances: 1
};
       