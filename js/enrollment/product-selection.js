"use strict";

var xmplOnReady = function() {
    var xmpControllerDriverVar = new xmpControllerDriver($("[ng-controller='XMPPersonalizedPage']"));
    xmpControllerDriverVar.ready(function() {

        // check for rid error
        if (xmpControllerDriverVar.xmp.recipientFailed) {
            window.location = "error.html";
        }

        // load in global variables
        xmpControllerDriverVar.scope.$parent.getJson("json/global.json", function(response) {

            var globalVars = response.data;

            Object.keys(globalVars).forEach(function (key) {
                xmpControllerDriverVar.scope[key] = globalVars[key];
            });

            // set variables for determining page flow
            xmpControllerDriverVar.scope.$parent.getPageFlow(xmpControllerDriverVar.scope);

            xmpControllerDriverVar.scope.xmp.r["SAVE_CONT"] = "product-selection.html";

            xmpControllerDriverVar.scope.prodAccidentUpdate = function() {

                xmpControllerDriverVar.scope.xmp.r["AI_RATE"] = "0.00";

                if (xmpControllerDriverVar.scope.xmp.r["PROD_AI"] !== "X") {
                    xmpControllerDriverVar.scope.xmp.r["AI_OPT"] = "";
                    xmpControllerDriverVar.scope.xmp.r["AI_COV"] = "";
                }

                if (xmpControllerDriverVar.scope.xmp.r["AI_OPT"] && xmpControllerDriverVar.scope.xmp.r["AI_COV"]) {
                    xmpControllerDriverVar.scope.$parent.getJson("json/accident.json", function (aiCalcResponse) {

                        xmpControllerDriverVar.scope.ai_calc_vars = {
                            "option": xmpControllerDriverVar.scope.xmp.r["AI_OPT"],
                            "coverage": xmpControllerDriverVar.scope.xmp.r["AI_COV"],
                            "rate": ""
                        };

                        var aiCalcData = aiCalcResponse.data;
                        var aiRate = xmpControllerDriverVar.scope.$parent.getRate(aiCalcData, xmpControllerDriverVar.scope.ai_calc_vars);

                        xmpControllerDriverVar.scope.xmp.r["AI_RATE"] = aiRate.base;

                        xmpControllerDriverVar.scope.prodTotalUpdate();
                    });
                } else {
                    xmpControllerDriverVar.scope.prodTotalUpdate();
                }
            };

            // critical 4-tier
            xmpControllerDriverVar.scope.prodCriticalUpdate = function() {

                xmpControllerDriverVar.scope.xmp.r["CI_RATE"] = "0.00";

                if (xmpControllerDriverVar.scope.xmp.r["PROD_CI"] !== "X") {
                    xmpControllerDriverVar.scope.xmp.r["CI_OPT"] = "";
                    xmpControllerDriverVar.scope.xmp.r["CI_OPT1"] = "";
                    xmpControllerDriverVar.scope.xmp.r["CI_OPT2"] = "";
                    xmpControllerDriverVar.scope.xmp.r["CI_COV"] = "";
                }

                if (xmpControllerDriverVar.scope.xmp.r["CI_OPT"] && xmpControllerDriverVar.scope.xmp.r["CI_COV"]) {
                    xmpControllerDriverVar.scope.$parent.getJson("json/critical-4tier.json", function (ciCalcResponse) {

                        xmpControllerDriverVar.scope.ci_calc_vars = {
                            "age": xmpControllerDriverVar.scope.xmp.r["AGE"],
                            "option": xmpControllerDriverVar.scope.xmp.r["CI_OPT"],
                            "coverage": xmpControllerDriverVar.scope.xmp.r["CI_COV"],
                            "smoker": xmpControllerDriverVar.scope.xmp.r["MISC02"],
                            "rate": ""
                        };

                        var ciCalcData = ciCalcResponse.data;
                        var ciRate = xmpControllerDriverVar.scope.$parent.getRate(ciCalcData, xmpControllerDriverVar.scope.ci_calc_vars);

                        xmpControllerDriverVar.scope.xmp.r["CI_RATE"] = ciRate[xmpControllerDriverVar.scope.xmp.r["CI_COV"]];

                        xmpControllerDriverVar.scope.prodTotalUpdate();
                    });
                } else {
                    xmpControllerDriverVar.scope.prodTotalUpdate();
                }
            };

            xmpControllerDriverVar.scope.prodHospitalUpdate = function() {

                xmpControllerDriverVar.scope.xmp.r["HI_RATE"] = "0.00";

                if (xmpControllerDriverVar.scope.xmp.r["PROD_HI"] !== "X") {
                    xmpControllerDriverVar.scope.xmp.r["HI_OPT"] = "";
                    xmpControllerDriverVar.scope.xmp.r["HI_COV"] = "";
                }

                if (xmpControllerDriverVar.scope.xmp.r["HI_OPT"] && xmpControllerDriverVar.scope.xmp.r["HI_COV"]) {
                    xmpControllerDriverVar.scope.$parent.getJson("json/hospital.json", function (hiCalcResponse) {

                        xmpControllerDriverVar.scope.hi_calc_vars = {
                            "option": xmpControllerDriverVar.scope.xmp.r["HI_OPT"],
                            "coverage": xmpControllerDriverVar.scope.xmp.r["HI_COV"],
                            "rate": ""
                        };

                        var hiCalcData = hiCalcResponse.data;
                        var hiRate = xmpControllerDriverVar.scope.$parent.getRate(hiCalcData, xmpControllerDriverVar.scope.hi_calc_vars);

                        xmpControllerDriverVar.scope.xmp.r["HI_RATE"] = hiRate.base;

                        xmpControllerDriverVar.scope.prodTotalUpdate();
                    });
                } else {
                    xmpControllerDriverVar.scope.prodTotalUpdate();
                }
            };

            xmpControllerDriverVar.scope.prodTotalUpdate = function() {

                xmpControllerDriverVar.scope.xmp.r["TOTAL_RATE"] = "0.00";

                var aiRate = Number(xmpControllerDriverVar.scope.xmp.r["AI_RATE"]);
                var ciRate = Number(xmpControllerDriverVar.scope.xmp.r["CI_RATE"]);
                var hiRate = Number(xmpControllerDriverVar.scope.xmp.r["HI_RATE"]);
                var totalRate = 0;

                if (!aiRate || aiRate === NaN) {
                    aiRate = 0;
                }

                if (!ciRate || ciRate === NaN) {
                    ciRate = 0;
                }

                if (!hiRate || hiRate === NaN) {
                    hiRate = 0;
                }

                totalRate = aiRate + ciRate + hiRate;

                xmpControllerDriverVar.scope.xmp.r["TOTAL_RATE"] = totalRate.toFixed(2);

            };

            xmpControllerDriverVar.scope.prodAccidentUpdate();
            xmpControllerDriverVar.scope.prodCriticalUpdate();
            xmpControllerDriverVar.scope.prodHospitalUpdate();

            var resourceDriver = new xmpResourceDriver();
            resourceDriver.saveRecipientADORs(xmpControllerDriverVar.scope.xmp.recipientID, {"SAVE_CONT": "product-selection.html"});

        });

    });
};