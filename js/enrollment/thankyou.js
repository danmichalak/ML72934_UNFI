"use strict";

var xmplOnReady = function() {
    var xmpControllerDriverVar = new xmpControllerDriver($("[ng-controller='XMPPersonalizedPage']"));
    xmpControllerDriverVar.ready(function() {

        // check for rid error
        if (xmpControllerDriverVar.xmp.recipientFailed) {
            window.location = "error.html";
        }

        var resourceDriver = new xmpResourceDriver();

        resourceDriver.getRecipientADORs(xmpControllerDriverVar.xmp.recipientID, {adors: [
                "MISC03",
                "GROUP", "GRP_NUM", "GRP_ABBR", "SITUS", "GPC",
                "PROD_AI", "AI_OPT", "AI_COV", "AI_RATE",
                "PROD_CI", "CI_OPT", "CI_OPT1", "CI_OPT2", "CI_COV", "CI_RATE",
                "PROD_HI", "HI_OPT", "HI_COV", "HI_RATE",
                "PROD_LP", "LP_RATE",
                "TOTAL_RATE"
            ]}, function (data) {

            xmpControllerDriverVar.scope.xmp.r["GROUP"] = data["GROUP"];
            xmpControllerDriverVar.scope.xmp.r["GRP_NUM"] = data["GRP_NUM"];
            xmpControllerDriverVar.scope.xmp.r["GRP_ABBR"] = data["GRP_ABBR"];
            xmpControllerDriverVar.scope.xmp.r["SITUS"] = data["SITUS"];
            xmpControllerDriverVar.scope.xmp.r["GPC"] = data["GPC"];

            xmpControllerDriverVar.scope.xmp.r["PROD_AI"] = data["PROD_AI"];
            xmpControllerDriverVar.scope.xmp.r["AI_OPT"] = data["AI_OPT"];
            xmpControllerDriverVar.scope.xmp.r["AI_COV"] = data["AI_COV"];
            xmpControllerDriverVar.scope.xmp.r["AI_RATE"] = data["AI_RATE"];

            xmpControllerDriverVar.scope.xmp.r["PROD_CI"] = data["PROD_CI"];
            xmpControllerDriverVar.scope.xmp.r["CI_OPT"] = data["CI_OPT"];
            xmpControllerDriverVar.scope.xmp.r["CI_OPT1"] = data["CI_OPT1"];
            xmpControllerDriverVar.scope.xmp.r["CI_OPT2"] = data["CI_OPT2"];
            xmpControllerDriverVar.scope.xmp.r["CI_COV"] = data["CI_COV"];
            xmpControllerDriverVar.scope.xmp.r["CI_RATE"] = data["CI_RATE"];

            xmpControllerDriverVar.scope.xmp.r["PROD_HI"] = data["PROD_HI"];
            xmpControllerDriverVar.scope.xmp.r["HI_OPT"] = data["HI_OPT"];
            xmpControllerDriverVar.scope.xmp.r["HI_COV"] = data["HI_COV"];
            xmpControllerDriverVar.scope.xmp.r["HI_RATE"] = data["HI_RATE"];

            xmpControllerDriverVar.scope.xmp.r["PROD_LP"] = data["PROD_LP"];
            xmpControllerDriverVar.scope.xmp.r["LP_RATE"] = data["LP_RATE"];

            xmpControllerDriverVar.scope.xmp.r["TOTAL_RATE"] = data["TOTAL_RATE"];

            xmpControllerDriverVar.scope.hasSp = false;

            // critical 4-tier
            if (
                data['AI_COV'] === 'EE+SP' || data['AI_COV'] === 'FAM' ||
                data['CI_COV'] === 'EE+SP' || data['CI_COV'] === 'FAM' ||
                data['HI_COV'] === 'EE+SP' || data['HI_COV'] === 'FAM'
            ) {
                xmpControllerDriverVar.scope.hasSp = true;
            }

            // critical 3-tier
            /*if (
                data['AI_COV'] === 'EE+SP' || data['AI_COV'] === 'FAM' ||
                data['HI_COV'] === 'EE+SP' || data['HI_COV'] === 'FAM' ||
                data['CI_OPT1'] === 'X'
            ) {
                xmpControllerDriverVar.scope.hasSp = true;
            }*/

            // load in global variables
            xmpControllerDriverVar.scope.$parent.getJson("json/global.json", function(response) {

                var globalVars = response.data;

                Object.keys(globalVars).forEach(function(key) {
                    xmpControllerDriverVar.scope[key] = globalVars[key];
                });

                // set variables for determining page flow
                xmpControllerDriverVar.scope.$parent.getPageFlow(xmpControllerDriverVar.scope);

                xmpControllerDriverVar.scope.xmp.r["SAVE_CONT"] = "thankyou.html";

                resourceDriver.saveRecipientADORs(xmpControllerDriverVar.scope.xmp.recipientID, {"SAVE_CONT": "thankyou.html"});

                /*if (data["MISC03"] !== "X") {

                    xmpControllerDriverVar.scope.$parent.sendEnrollmentEmail(xmpControllerDriverVar.xmp.recipientID);

                }*/

            });
        });//getRecipientADORs

    });
};