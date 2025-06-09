import { join } from "node:path";
import { config as baseConfig } from "./wdio.shared.local.appium.conf.js";

export const config: WebdriverIO.Config = {
    ...baseConfig,

    specs: [
        
      
      "../tests/specs/login/login.negative.spec.ts",
      "../tests/specs/notLoggedTests/combinedNotLogged.spec.ts",  
      "../tests/specs/newUserVoucher/vCombinedLoggedTest.spec.ts",
      "../tests/specs/account/addPaymentMethod.spec.ts",
       "../tests/specs/book/bookTaxi.spec.ts",
       "../tests/specs/newUser/popupAddPaymentMethod.spec.ts"
           // "../tests/specs/*/*.spec.ts",
           // "../tests/specs/*/*.spec.js",
            // "../tests/specs/notLoggedTests/combinedNotLogged.spec.ts",            
            // "../tests/specs/newUserVoucher/vCombinedLoggedTest.spec.ts",
            // "../tests/specs/login/login.negative.spec.ts",
            // "../tests/specs/book/bookPublicTransport.spec.ts",
            // "../tests/specs/book/bookTaxi.spec.ts",
            //"../tests/specs/book/reserveFelyx.spec.ts"            
           // "../tests/specs/book/reserveCheck.spec.ts"
            //"../tests/specs/newUser/nCombinedLoggedTest.spec.ts"
           
            // "../tests/specs/book/bookUmobScooters.spec.js",
            //"../tests/specs/newUser/nReserveDonkeyNoCard.spec.js",
            //  "../tests/specs/newUser/nReserveCheckNoCard.spec.ts",
            //  "../tests/specs/newUser/nReserveDonkeyNoCard.spec.ts"
            // "../tests/specs/book/failedPaymentNoBooking.spec.ts",
            //"../tests/specs/account/combinedLoggedTest.spec.ts"
            // "../tests/specs/book/bookUmobScooters.spec.ts",
            // "../tests/specs/book/bookTaxi.spec.ts"
            //
           
            // "../tests/specs/account/combinedLoggedTest.spec.ts",
            // "../tests/specs/newUserVoucher/vCombinedLoggedTest.spec.ts",
            //  "../tests/specs/newUserVoucher/vBookFelyx.spec.ts",
            //  "../tests/specs/newUserVoucher/vBookDonkeyMocked.spec.ts",
            //  "../tests/specs/newUserVoucher/vBookCheck.spec.ts",
            // "../tests/specs/newUser/nCombinedLoggedTest.spec.ts"
             //"../tests/specs/notLoggedTests/*.spec.ts"

          
/*
            "../tests/specs/account/*.spec.ts",
          "../tests/specs/login/*.spec.ts",
          "../tests/specs/notLoggedTests/combinedNotLogged.spec.ts",
          "../tests/specs/newUserVoucher/*.spec.ts",
          
          
          //new user tests should be in some order
          //"../tests/specs/newUser/*.spec.ts",
          "../tests/specs/newUser/nCombinedLoggedTest.spec.ts",
          "../tests/specs/newUser/nReserveCheckNoCard.spec.ts",
          "../tests/specs/newUser/nReserveDonkeyNoCard.spec.ts",
          "../tests/specs/newUser/popupAddPaymentMethod.spec.ts",
          //"../tests/specs/newUser/welcomeBookDonkey.spec.ts", //always required new welcome voucher
          "../tests/specs/newUser/nReserveFelyxNoId.spec.ts",
          "../tests/specs/newUser/addVoucher.spec.ts",// voucher could be added to different users

          "../tests/specs/book/*.spec.ts"
         */
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
       