import { join } from "node:path";
import { config as baseConfig } from "./wdio.shared.local.appium.conf.js";

export const config: WebdriverIO.Config = {
    ...baseConfig,

    specs: [
        // "../tests/specs/account/addPaymentMethod.spec.ts",
        // "../tests/specs/notLoggedTests/combinedNotLogged.spec.ts",
        // "../tests/specs/newUserVoucher/vCombinedLoggedTest.spec.ts",

        // "../tests/specs/book/bookTaxi.spec.ts"
        //"../tests/specs/newUser/popupAddPaymentMethod.spec.ts"
        // "../tests/specs/*/*.spec.ts",
        // "../tests/specs/*/*.spec.js",
        // "../tests/specs/notLoggedTests/combinedNotLogged.spec.ts",
        // "../tests/specs/newUserVoucher/vCombinedLoggedTest.spec.ts",
        // "../tests/specs/login/login.negative.spec.ts",
        //  "../tests/specs/book/bookPublicTransport.spec.ts",
        //"../tests/specs/book/bookTaxi.spec.ts",
        //"../tests/specs/book/reserveFelyx.spec.ts"
        // "../tests/specs/book/reserveCheck.spec.ts"
        // "../tests/specs/newUser/nCombinedLoggedTest.spec.ts",

        //  "../tests/specs/book/bookUmobScooters.spec.js",
        //  "../tests/specs/newUser/nReserveDonkeyNoCard.spec.js",
        //  "../tests/specs/newUser/nReserveCheckNoCard.spec.ts"
        //  "../tests/specs/book/failedPaymentNoBooking.spec.ts",
        //  "../tests/specs/account/combinedLoggedTest.spec.ts"
        //  "../tests/specs/book/bookTaxi.spec.ts"
        //  "..//tests/specs/newUser/nReserveCheckNoCard.spec.ts"

        //  "../tests/specs/account/combinedLoggedTest.spec.ts",
        //  "../tests/specs/account/addPaymentMethod.spec.ts",
        //  "../tests/specs/newUserVoucher/vCombinedLoggedTest.spec.ts",
        //  "../tests/specs/newUserVoucher/vBookFelyx.spec.ts",
        //  "../tests/specs/newUserVoucher/vBookFelyx.spec.ts"
        //  "../tests/specs/book/bookPublicTransport.spec.ts",
        // "../tests/specs/book/bookDonkeyMocked.spec.ts",

        /*
              "../tests/specs/newUserVoucher/vBookDonkeyMocked.spec.ts",
              "../tests/specs/newUser/nReserveDonkeyNoCard.spec.ts", //js to be checked
              "../tests/specs/book/bookUmobScooters.spec.js", //js file. not stable, always happenong something
              "../tests/specs/newUser/nReserveCheckNoCard.spec.ts", //ok
              "../tests/specs/newUser/nReserveDonkeyNoCard.spec.js", //verification in progress often problem

            //  "../tests/specs/newUserVoucher/vBookCheck.spec.ts",
             "../tests/specs/newUser/nCombinedLoggedTest.spec.ts", //didnt run
             "../tests/specs/newUserVoucher/vBookFelyx.spec.ts", //didnt run
             "../tests/specs/login/*.spec.ts", //positive scenarios ok, negative scenarios PERMISSIONS required but there are
             "../tests/specs/book/bookUmobMoped.spec.ts", //parking photo?
             "../tests/specs/book/reserveCheck.spec.ts",
             //"../tests/specs/notLoggedTests/*.spec.ts"
             //"../tests/specs/book/failedPaymentNoBooking.spec.ts"
              "../tests/specs/newUser/popupAddPaymentMethod.spec.ts",
              "../tests/specs/newUser/nReserveFelyxNoId.spec.ts"

              */
        //  "../tests/specs/book/reserveFelyx.spec.ts"
        //    "../tests/specs/newUser/popupAddPaymentMethod.spec.ts"
        //     "../tests/specs/newUserVoucher/vBookFelyx.spec.ts", //timeout problem
        //     "../tests/specs/newUserVoucher/vCombinedLoggedTest.spec.ts",

        //    "../tests/specs/book/bookUmobMoped.spec.ts", //photo problem
        //    "../tests/specs/newUserVoucher/vBookCheck.spec.ts", //choosing from outside of area
        //    "../tests/specs/book/reserveCheck.spec.ts",

        //   "../tests/specs/book/bookUmobBike.spec.ts",
        //  "../tests/specs/book/bookUmobMoped.spec.ts",
        // "../tests/specs/book/bookUmobBike.spec.ts"

        //"../tests/specs/newUser/nReserveDonkeyNoCard.spec.js", //ok
        //////////////////"../tests/specs/newUserVoucher/vCombinedLoggedTest.spec.ts",
        //"../tests/specs/newUserVoucher/vBookCheck.spec.ts", //ok

        //"../tests/specs/book/bookUmobMoped.spec.ts",
        ////////////////"../tests/specs/book/bookPublicTransport.spec.ts", //more
        //"../tests/specs/newUser/welcomeBookDonkey.spec.ts",
        ///////////////"../tests/specs/book/bookUmobScooters.spec.js", //more
         //"../tests/specs/book/reserveFelyx.spec.ts", //more
        // "../tests/specs/book/failedPaymentNoBooking.spec.ts", //more
        //"../tests/specs/notLoggedTests/combinedNotLogged.spec.ts",
        // "../tests/specs/newUser/nReserveDonkeyNoCard.spec.js", //ok
        // "../tests/specs/newUser/COPYpopupAddPaymentMethod.spec.ts",
        // "../tests/specs/newUser/nCombinedLoggedTest.spec.ts",
        //"../tests/specs/book/bookTaxi.spec.ts",
        // "../tests/specs/newUser/nReserveFelyxNoId.spec.ts",
        //"../tests/specs/book/bookDonkeyMocked.spec.ts",
        //"../tests/specs/account/combinedLoggedTest.spec.ts",
        //"../tests/specs/newUser/nReserveCheckNoCard.spec.ts",
        //"../tests/specs/newUser/deleteCard.spec.ts",

        //"../tests/specs/account/addAdress.spec.ts",
        // "../tests/specs/book/bookUmobScooters.spec.js",
        // "../tests/specs/account/addPaymentMethod.spec.ts", // ok
        "../tests/specs/newUserVoucher/vBookCheck.spec.ts", //taking photo crashed app. Cant stop active booking for new37 user!
        //"../tests/specs/newUserVoucher/vBookDonkeyMocked.spec.ts", //ok/ ? fail, but there is no active booking for this user (new17)
        //"../tests/specs/newUserVoucher/vBookFelyx.spec.ts", //test picked up moped from outside service area
        //"../tests/specs/newUser/nReserveDonkeyNoCard.spec.js", //ok
        //"../tests/specs/newUser/COPYpopupAddPaymentMethod.spec.ts", //Need Help. Test updated. Due to some reason there is still verification in progress problem
        //"../tests/specs/newUser/nCombinedLoggedTest.spec.ts", //fail because payment card wasnt added
        //"../tests/specs/newUser/nReserveFelyxNoId.spec.ts", // fail because payment card wasnt added
        //"../tests/specs/newUser/deleteCard.spec.ts",
         ////////////"../tests/specs/newUser/nReserveCheckNoCard.spec.ts",
         ///////////////"../tests/specs/book/reserveCheck.spec.ts",
        // "../tests/specs/book/bookUmobBike.spec.ts", //location problems were before
        //"../tests/specs/book/bookUmobMoped.spec.ts" //taking photo crashed app. Cant stop active booking for new32 user!
        //"../tests/specs/login/login.negative.spec.ts"

           
/*
//night run

           "../tests/specs/account/*.spec.ts",
          "../tests/specs/login/*.spec.ts",
         "../tests/specs/notLoggedTests/combinedNotLogged.spec.ts",
         "../tests/specs/newUserVoucher/*.spec.ts",
          
        
          //new user tests should be in some order
          //"../tests/specs/newUser/*.spec.ts",
          "../tests/specs/newUser/nReserveCheckNoCard.spec.ts",
          "../tests/specs/newUser/nReserveDonkeyNoCard.spec.js", //js file
          "../tests/specs/newUser/COPYpopupAddPaymentMethod.spec.ts",
          "../tests/specs/newUser/nCombinedLoggedTest.spec.ts",
          //"../tests/specs/newUser/welcomeBookDonkey.spec.ts", //always required new welcome voucher
          "../tests/specs/newUser/nReserveFelyxNoId.spec.ts",
          //"../tests/specs/newUser/addVoucher.spec.ts",// voucher could be added to different users but only once for each user
          "../tests/specs/newUser/deleteCard.spec.ts",
          

          //book folder
          "../tests/specs/book/bookPublicTransport.spec.ts",
          "../tests/specs/book/bookTaxi.spec.ts",
          "../tests/specs/book/bookDonkeyMocked.spec.ts",
          "../tests/specs/book/failedPaymentNoBooking.spec.ts",
          "../tests/specs/book/bookUmobScooters.spec.js", //js file
          "../tests/specs/book/bookUmobBike.spec.ts",
          "../tests/specs/book/bookUmobMoped.spec.ts",
          "../tests/specs/book/reserveCheck.spec.ts",
          "../tests/specs/book/reserveFelyx.spec.ts"
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
    maxInstances: 1,
};
