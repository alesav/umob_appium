import { join } from "node:path";
import { config as baseConfig } from "./wdio.shared.local.appium.conf.js";

export const config: WebdriverIO.Config = {
    ...baseConfig,

    //specs: ["/Users/alesav/Dev/umob/appium-boilerplate/tests/specs/book/*.spec.ts"],
    specs: [//"c:/dev/umob_appium/tests/specs/book/failedPaymentNoBooking.spec.ts"
      //  "/Users/alesav/Dev/umob/umob_appium/tests/specs/account/*.spec.ts",
  // "c:/dev/umob_appium/tests/specs/newUser/nCombinedLoggedTest.spec.ts"
 
 //"c:/dev/umob_appium/tests/specs/book/reserveFelyx.spec.ts",
 //"c:/dev/umob_appium/tests/specs/notLoggedTests/combinedNotLogged.spec.ts"
 //"c:/dev/umob_appium/tests/specs/book/bookUmobMoped.spec.ts",
 //"c:/dev/umob_appium/tests/specs/book/bookUmobMoped.spec.ts"
 //"c:/dev/umob_appium/tests/specs/book/bookPublicTransport.spec.ts"
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
"../tests/specs/newUser/COPYpopupAddPaymentMethod.spec.ts"
//"c:/dev/umob_appium/tests/specs/newUser/nReserveFelyxNoId.spec.ts"
//"../tests/specs/newUserVoucher/vBookCheck.spec.ts"
//"c:/dev/umob_appium/tests/specs/book/bookUmobMoped.spec.ts", //new32 stop booking after night run
//"c:/dev/umob_appium/tests/specs/book/bookUmobScooters.spec.js" //JS file. new42 stop booking after night run
//"../tests/specs/newUser/nReserveCheckNoCard.spec.ts"

///////////////////////////////////////////////////////////////////////////////////
//"../tests/specs/newUser/nCombinedLoggedTest.spec.ts",

//morning run

 //"c:/dev/umob_appium/tests/specs/book/bookPublicTransport.spec.ts" //new35 //ok

 //"c:/dev/umob_appium/tests/specs/newUser/nReserveCheckNoCard.spec.ts",// doesnt click on moped manually!

 //"../tests/specs/newUser/nReserveDonkeyNoCard.spec.js", //JS file required. new39 //bike 21    ok. not in center of the map, verification in progress could be after nreservechecknocard
 //"c:/dev/umob_appium/tests/specs/book/bookUmobBike.spec.ts",      //   new33 not in center for positive scenario. после приближения и перезапуска нужно приближение. негатвного сценария нет
// "../tests/specs/newUserVoucher/vCombinedLoggedTest.spec.ts", // new //ok. looks like no card but card is!!! check on screenshot. 
 //"c:/dev/umob_appium/tests/specs/book/bookDonkeyMocked.spec.ts", //   new36  //Umob Bike 24/ not in center. bike FAIL (bike 22 is missing)
 //"../tests/specs/newUserVoucher/vBookDonkeyMocked.spec.ts",      //   new17  //bike23  /location problem FAIL (something wrong with finger str197, index.js 1488 20, 1559 14). fully ok
// "c:/dev/umob_appium/tests/specs/login/login.negative.spec.ts", //ok
// "../tests/specs/newUser/popupAddPaymentMethod.spec.ts", //it was new13, now newUser in credentials  //ok sometimes verification in progress problem
// "c:/dev/umob_appium/tests/specs/notLoggedTests/combinedNotLogged.spec.ts", //ok
// "c:/dev/umob_appium/tests/specs/book/reserveCheck.spec.ts",         //new25 //ok/ 
// "c:/dev/umob_appium/tests/specs/newUser/nReserveFelyxNoId.spec.ts",  //new38 //ok. not in center, so doesnt click a moped

//"../tests/specs/newUserVoucher/vBookCheck.spec.ts" //new37 (end ride is not clicked because timeout)click on pointer for location during manual run//not in center of the screen (updated test because of new user check voucher presence)

/*
//new user tests should be in some order 
    "../tests/specs/newUser/nCombinedLoggedTest.spec.ts",      //was new13  //now newUser in credentials (new10)
    "../tests/specs/newUser/nReserveCheckNoCard.spec.ts",      //new20  //newUser
    "../tests/specs/newUser/nReserveDonkeyNoCard.spec.js", //js file  //new39  //newUser (174str)
    "../tests/specs/newUser/nReserveFelyxNoCard.spec.js",   //js file  //new11   newUser 
    "../tests/specs/newUser/popupAddPaymentMethod.spec.ts",      ///new13   //newUser
    "../tests/specs/newUser/nReserveFelyxNoId.spec.ts",    //new38   //newUser
   // "../tests/specs/newUser/welcomeBookDonkey.spec.ts", //DO NOT RUN! always new welcome voucher required//it was new20  //new40
    //"../tests/specs/newUser/addVoucher.spec.ts",//DO NOT RUN! voucher could be added to different users but only once
*/



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
