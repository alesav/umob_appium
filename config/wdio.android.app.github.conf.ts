import { join } from "node:path";
import { config as baseConfig } from "./wdio.shared.local.appium.conf.js";

export const config: WebdriverIO.Config = {
    ...baseConfig,

    specs: [
        
        //first 6 lines for night running scope of tests
        // "../tests/specs/account/*.spec.ts",
        //  "../tests/specs/login/*.spec.ts",
        //  "../tests/specs/book/*.spec.ts",
        //  "../tests/specs/newUserVoucher/*.spec.ts",
        //  "../tests/specs/newUser/*.spec.ts",
        //  "../tests/specs/notLoggedTests/*.spec.ts"


         "../tests/specs/account/combinedLoggedTest.spec.ts",
           "../tests/specs/book/failedPaymentNoBooking.spec.ts",
       "../tests/specs/newUser/nReserveCheckNoCard.spec.ts",
          "../tests/specs/book/bookUmobScooters.spec.ts",
        //  "../tests/specs/account/combinedLoggedTest.spec.ts",
        //  "../tests/specs/login/login.negative.spec.ts",
        //  "../tests/specs/newUser/nReserveCheckNoCard.spec.ts"
        

        // "../tests/specs/book/bookDonkeyMocked.spec.ts",
        // "../tests/specs/book/bookUmobBike.spec.ts",
        // "../tests/specs/book/bookUmobMoped.spec.ts",
        // "../tests/specs/book/bookUmobScooter.spec.ts"
    ],

    // specs: ["../tests/specs/account/*.spec.ts",
    //     "../tests/specs/login/*.spec.ts",
    //     "tests/specs/account/addAdress.spec.ts"
    // ],
    //specs: ["c:/dev/umob_appium/tests/specs/newUserVoucher/vCombinedLoggedTest.spec.ts"],
    capabilities: [
        {
            platformName: "Android",
            "appium:automationName": "UiAutomator2",
            "appium:deviceName": "Android_GithubActions",
            "appium:appPackage": "com.umob.umob",
            "appium:appActivity": "com.umob.umob.MainActivity",
            "appium:newCommandTimeout": 100,
            //"appium:autoGrantPermissions": true
            //"appium:noReset": true,
          },
    ],
    maxInstances: 1
};
       