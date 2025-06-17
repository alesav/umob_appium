import { join } from "node:path";
import { config as baseConfig } from "./wdio.shared.local.appium.conf.js";

export const config: WebdriverIO.Config = {
    ...baseConfig,

    //specs: ["/Users/alesav/Dev/umob/appium-boilerplate/tests/specs/book/*.spec.ts"],
    specs: [//"c:/dev/umob_appium/tests/specs/book/failedPaymentNoBooking.spec.ts"
      //  "/Users/alesav/Dev/umob/umob_appium/tests/specs/account/*.spec.ts",
   //"c:/dev/umob_appium/tests/specs/newUser/nCombinedLoggedTest.spec.ts",
 
 //"c:/dev/umob_appium/tests/specs/book/bookTaxi.spec.ts",
 //"c:/dev/umob_appium/tests/specs/book/bookUmobMoped.spec.ts",
 //"c:/dev/umob_appium/tests/specs/book/bookUmobBike.spec.ts"
 //"c:/dev/umob_appium/tests/specs/book/bookPublicTransport.spec.ts",
 //"../tests/specs/newUserVoucher/vCombinedLoggedTest.spec.ts",
 //"c:/dev/umob_appium/tests/specs/book/failedPaymentNoBooking.spec.ts",
 // "c:/dev/umob_appium/tests/specs/newUser/nReserveCheckNoCard.spec.ts",
// "c:/dev/umob_appium/tests/specs/newUser/popupAddPaymentMethod.spec.ts",
 //"c:/dev/umob_appium/tests/specs/newUser/welcomeBookDonkey.spec.ts",
//"c:/dev/umob_appium/tests/specs/newUser/nReserveFelyxNoId.spec.ts",
// "c:/dev/umob_appium/tests/specs/newUser/addVoucher.spec.ts",
// "c:/dev/umob_appium/tests/specs/notLoggedTests/combinedNotLogged.spec.ts",


"c:/dev/umob_appium/tests/specs/book/failedPaymentNoBooking.spec.ts",
////"c:/dev/umob_appium/tests/specs/book/reserveFelyx.spec.ts",
/// "../tests/specs/newUser/popupAddPaymentMethod.spec.ts",
/// "../tests/specs/newUserVoucher/vBookDonkeyMocked.spec.ts",
 ///"../tests/specs/newUserVoucher/vBookFelyx.spec.ts"

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