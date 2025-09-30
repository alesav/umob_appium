import { join } from "node:path";
import { config as baseConfig } from "./wdio.shared.local.appium.conf.js";

export const config: WebdriverIO.Config = {
    ...baseConfig,

    //specs: ["/Users/alesav/Dev/umob/appium-boilerplate/tests/specs/book/*.spec.ts"],
    specs: [
        //"c:/dev/umob_appium/tests/specs/book/failedPaymentNoBooking.spec.ts"
        //  "/Users/alesav/Dev/umob/umob_appium/tests/specs/account/*.spec.ts",
        // "c:/dev/umob_appium/tests/specs/newUser/nCombinedLoggedTest.spec.ts"
        //"c:/dev/umob_appium/tests/specs/book/reserveFelyx.spec.ts",
        //"c:/dev/umob_appium/tests/specs/notLoggedTests/combinedNotLogged.spec.ts"
        //"c:/dev/umob_appium/tests/specs/book/bookUmobMoped.spec.ts",
        //"c:/dev/umob_appium/tests/specs/book/bookUmobMoped.spec.ts"
        //"c:/dev/umob_appium/tests/specs/book/bookPublicTransport.spec.ts",
        // "../tests/specs/newUser/popupAddPaymentMethod.spec.ts",
        //"../tests/specs/newUserVoucher/vBookDonkeyMocked.spec.ts",
        //"../tests/specs/newUser/nReserveFelyxNoCard.spec.ts"
        //"c:/dev/umob_appium/tests/specs/book/failedPaymentNoBooking.spec.ts",
        // "c:/dev/umob_appium/tests/specs/newUser/nReserveCheckNoCard.spec.ts",
        // "c:/dev/umob_appium/tests/specs/newUser/popupAddPaymentMethod.spec.ts"
        //"c:/dev/umob_appium/tests/specs/account/AddPaymentMethod.spec.ts",
        //"c:/dev/umob_appium/tests/specs/account/AddAdress.spec.ts",
        //"c:/dev/umob_appium/tests/specs/newUser/nReserveFelyxNoCard.spec.ts"
        //"c:/dev/umob_appium/tests/specs/newUser/welcomeBookDonkey.spec.ts",
        //"c:/dev/umob_appium/tests/specs/newUser/nReserveFelyxNoId.spec.ts",
        // "c:/dev/umob_appium/tests/specs/newUser/addVoucher.spec.ts",
        // "c:/dev/umob_appium/tests/specs/notLoggedTests/combinedNotLogged.spec.ts",
        //"../tests/specs/newUser/popupAddPaymentMethod.spec.ts"
        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        //"c:/dev/umob_appium/tests/specs/book/failedPaymentNoBooking.spec.ts" //problem, a lot of manual work
        ////"c:/dev/umob_appium/tests/specs/book/reserveFelyx.spec.ts",
        //"c:/dev/umob_appium/tests/specs/book/bookUmobBike.spec.ts"
        //"c:/dev/umob_appium/tests/specs/book/bookUmobBike.spec.ts",
        //"../tests/specs/newUser/addVoucher.spec.ts"
        //"c:/dev/umob_appium/tests/specs/newUser/welcomeBookDonkey.spec.ts"
        //"../tests/specs/newUserVoucher/vBookFelyx.spec.ts"/// umknown timeout problem
        //"c:/dev/umob_appium/tests/specs/book/reserveFelyx.spec.ts" // new18 driver id required
        //"c:/dev/umob_appium/tests/specs/book/failedPaymentNoBooking.spec.ts" //problem, a lot of manual work
        //"c:/dev/umob_appium/tests/specs/book/bookTaxi.spec.ts"
        //"c:/dev/umob_appium/tests/specs/newUser/nReserveDonkeyNoCard.spec.js"
        //"c:/dev/umob_appium/tests/specs/newUser/nReserveFelyxNoCard.spec.js"
        //"c:/dev/umob_appium/tests/specs/account/AddPaymentMethod.spec.ts",
        //"c:/dev/umob_appium/tests/specs/notLoggedTests/combinedNotLogged.spec.ts"
        //"../tests/specs/newUserVoucher/vBookDonkeyMocked.spec.ts" //Umob Boke 23
        //"../tests/specs/newUser/COPYpopupAddPaymentMethod.spec.ts"
        //"c:/dev/umob_appium/tests/specs/newUser/nReserveFelyxNoId.spec.ts"
        //"../tests/specs/newUserVoucher/vBookCheck.spec.ts"
        //"c:/dev/umob_appium/tests/specs/book/bookUmobMoped.spec.ts", //new49 (blocked) stop booking after night run
        //"c:/dev/umob_appium/tests/specs/book/bookUmobScooters.spec.js" //JS file. new43(blocked) stop booking after night run
        //"../tests/specs/newUser/nReserveCheckNoCard.spec.ts"
        //"../tests/specs/newUser/nReserveFelyxNoId.spec.ts"
        //"../tests/specs/book/bookDonkeyMocked.spec.ts"
        //"../tests/specs/newUser/deleteCard.spec.ts"
        ///////////////////////////////////////////////////////////////////////////////////
        //"../tests/specs/newUser/nCombinedLoggedTest.spec.ts",
        //"../tests/specs/book/bookDonkeyMocked.spec.ts",
        //morning run
        //"../tests/specs/book/reserveFelyx.spec.ts",
        //"../tests/specs/newUserVoucher/vBookFelyx.spec.ts",
        //"c:/dev/umob_appium/tests/specs/book/bookPublicTransport.spec.ts", //new35 //ok
        //"c:/dev/umob_appium/tests/specs/newUser/nReserveCheckNoCard.spec.ts",// doesnt click on moped manually!
        //"../tests/specs/newUser/nReserveDonkeyNoCard.spec.js", //JS file required. new39 //bike 21    ok. not in center of the map, verification in progress could be after nreservechecknocard
        //"c:/dev/umob_appium/tests/specs/book/bookUmobBike.spec.ts",      //   new33 not in center for positive scenario. после приближения и перезапуска нужно приближение. негатвного сценария нет
        // "../tests/specs/newUserVoucher/vCombinedLoggedTest.spec.ts", // new //ok. looks like no card but card is!!! check on screenshot.
        //"c:/dev/umob_appium/tests/specs/book/bookDonkeyMocked.spec.ts", //   new36  //Umob Bike 24/ not in center. bike FAIL (bike 22 is missing)
        //"../tests/specs/newUserVoucher/vBookDonkeyMocked.spec.ts", //   new17  //bike23  /location problem FAIL (something wrong with finger str197, index.js 1488 20, 1559 14). fully ok
        ///////////////////"c:/dev/umob_appium/tests/specs/account/AddAdress.spec.ts",
        "c:/dev/umob_appium/tests/specs/login/login.positive.spec.ts", //ok
        //////////////"../tests/specs/newUser/nReserveCheckNoCard.spec.ts",
        //"../tests/specs/newUser/COPYpopupAddPaymentMethod.spec.ts",  //it was new13, now newUser in credentials  //ok sometimes verification in progress problem
        //"../tests/specs/newUser/deleteCard.spec.ts"
        //"c:/dev/umob_appium/tests/specs/notLoggedTests/combinedNotLogged.spec.ts", //ok
        ///////"c:/dev/umob_appium/tests/specs/book/reserveCheck.spec.ts", //new25 //ok/
        // "c:/dev/umob_appium/tests/specs/newUser/nReserveFelyxNoId.spec.ts",  //new38 //ok. not in center, so doesnt click a moped
        //"../tests/specs/newUser/nCombinedLoggedTest.spec.ts",
        ////////"../tests/specs/newUserVoucher/vBookCheck.spec.ts", //new61 (end ride is not clicked because timeout)click on pointer for location during manual run//not in center of the screen (updated test because of new user check voucher presence)
        //"../tests/specs/newUserVoucher/vBookFelyx.spec.ts",
        //"../tests/specs/newUser/nReserveFelyxNoId.spec.ts"
        //"../tests/specs/newUser/nReserveCheckNoCard.spec.ts",
        //"../tests/specs/account/qrCode.spec.ts", //new12
        //"../tests/specs/newUser/nReserveDonkeyNoCard.spec.js",
        //"../tests/specs/account/nearbyAssets.spec.ts", //new12
        /*
//new user tests should be in some order 
    "../tests/specs/newUser/nCombinedLoggedTest.spec.ts",      //was new13  //now newUser in credentials (new48)
    "../tests/specs/newUser/nReserveCheckNoCard.spec.ts",      //new20  //new43
    "../tests/specs/newUser/nReserveDonkeyNoCard.spec.js", //js file  //new39  //newUser (174str)
    "../tests/specs/newUser/nReserveFelyxNoCard.spec.js",   //js file  //new11   newUser 
    "../tests/specs/newUser/COPYpopupAddPaymentMethod.spec.ts",      ///new13   //newUser
    "../tests/specs/newUser/nReserveFelyxNoId.spec.ts",    //new38   //newUser
    //"../tests/specs/newUser/welcomeBookDonkey.spec.ts", //DO NOT RUN! always new welcome voucher required//it was new20  //new40
    //"../tests/specs/newUser/addVoucher.spec.ts",//DO NOT RUN! voucher could be added to different users but only once
    "../tests/specs/newUser/deleteCard.spec.ts"
*/
        //tests for accept version of app
        //"../tests/specs/login/login.negative.spec.ts",
        // "../tests/specs/notLoggedTests/combinedNotLogged.spec.ts",
        // "../tests/specs/account/AddAdress.spec.ts", //new12 /test@gmail.com)
        // "../tests/specs/newUser/COPYpopupAddPaymentMethod.spec.ts", //newUser
        // "../tests/specs/newUser/nCombinedLoggedTest.spec.ts", //newUser
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
