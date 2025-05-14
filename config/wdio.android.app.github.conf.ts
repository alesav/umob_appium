import { join } from "node:path";
import { config as baseConfig } from "./wdio.shared.local.appium.conf.js";

export const config: WebdriverIO.Config = {
    ...baseConfig,

    specs: [
        
        //first lines for night running scope of tests

        /*
          "../tests/specs/account/*.spec.ts",
          "../tests/specs/login/*.spec.ts",
          "../tests/specs/book/*.spec.ts",
          "../tests/specs/newUserVoucher/*.spec.ts",
          "../tests/specs/notLoggedTests/*.spec.ts",
          //new user tests should be in some order
          //"../tests/specs/newUser/*.spec.ts",
          "../tests/specs/newUser/nCombinedLoggedTest.spec.ts",
          "../tests/specs/newUser/nReserveCheckNoCard.spec.ts",
          "../tests/specs/newUser/nReserveDonkeyNoCard.spec.ts",
          "../tests/specs/newUser/popupAddPaymentMethod.spec.ts",
          "../tests/specs/newUser/welcomeBookDonkey.spec.ts",
          "../tests/specs/newUser/nReserveFelyxNoId.spec.ts",
          "../tests/specs/newUser/addVoucher.spec.ts"

          */
/////////////////////////////////////////////////////////////////////////////////////////          

        // "../tests/specs/book/reserveCheck.spec.ts",
         "../tests/specs/book/reserveFelyx.spec.ts",
         //"../tests/specs/newUserVoucher/vCombinedLoggedTest.spec.ts"
         //"../tests/specs/newUser/nReserveCheckNoCard.spec.ts"
           "../tests/specs/newUser/nReserveDonkeyNoCard.spec.ts",
         //  "../tests/specs/newUser/nReserveCheckNoCard.spec.ts"


    //      "../tests/specs/account/combinedLoggedTest.spec.ts",
            "../tests/specs/book/failedPaymentNoBooking.spec.ts"
    //    "../tests/specs/newUser/nReserveCheckNoCard.spec.ts",
    //       "../tests/specs/book/bookUmobScooters.spec.ts",
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
       