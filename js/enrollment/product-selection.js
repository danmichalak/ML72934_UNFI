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

            // critical 3-tier
            /*xmpControllerDriverVar.scope.dateStatus = {
                "sp_dob": "valid"
            };*/

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
                            "option": xmpControllerDriverVar.scope.xmp.r["CI_OPT"],
                            "coverage": xmpControllerDriverVar.scope.xmp.r["CI_COV"],
                            "rate": ""
                        };

                        var ciCalcData = ciCalcResponse.data;
                        var ciRate = xmpControllerDriverVar.scope.$parent.getRate(ciCalcData, xmpControllerDriverVar.scope.ci_calc_vars);

                        xmpControllerDriverVar.scope.xmp.r["CI_RATE"] = ciRate.base;

                        xmpControllerDriverVar.scope.prodTotalUpdate();
                    });
                } else {
                    xmpControllerDriverVar.scope.prodTotalUpdate();
                }
            };

            // critical 3-tier
            /*xmpControllerDriverVar.scope.prodCriticalUpdate = function() {

                xmpControllerDriverVar.scope.xmp.r["CI_RATE"] = "0.00";

                if (xmpControllerDriverVar.scope.xmp.r["PROD_CI"] !== "X") {
                    xmpControllerDriverVar.scope.xmp.r["CI_OPT"] = "";
                    xmpControllerDriverVar.scope.xmp.r["CI_OPT1"] = "";
                    xmpControllerDriverVar.scope.xmp.r["CI_OPT2"] = "";
                    xmpControllerDriverVar.scope.xmp.r["CI_COV"] = "";
                } else {
                    xmpControllerDriverVar.scope.xmp.r["CI_OPT"] = "X";
                    xmpControllerDriverVar.scope.xmp.r["CI_COV"] = 10000;
                }

                if (xmpControllerDriverVar.scope.xmp.r["CI_OPT1"] !== "X") {
                    xmpControllerDriverVar.scope.xmp.r["SP_DOB"] = "";
                }

                if (xmpControllerDriverVar.scope.xmp.r["CI_OPT"] && xmpControllerDriverVar.scope.xmp.r["CI_COV"]) {
                    xmpControllerDriverVar.scope.$parent.getJson("json/critical-3tier.json", function (ciCalcResponse) {

                        var ciCalcData = ciCalcResponse.data;

                        xmpControllerDriverVar.scope.ci_calc_vars_ee = {
                            "age": xmpControllerDriverVar.scope.xmp.r["AGE"]
                        };

                        var ciRateEE = xmpControllerDriverVar.scope.$parent.getRate(ciCalcData, xmpControllerDriverVar.scope.ci_calc_vars_ee);
                        var ciAmountEE = Number(ciRateEE.member);

                        var ciAmountSP = 0;

                        if (xmpControllerDriverVar.scope.xmp.r["CI_OPT1"] === "X" &&
                            xmpControllerDriverVar.scope.xmp.r["SP_DOB"]  &&
                            xmpControllerDriverVar.scope.dateStatus["sp_dob"] === "valid") {

                            xmpControllerDriverVar.scope.ci_calc_vars_sp = {
                                "age": xmpControllerDriverVar.scope.spAsOfAge.toString()
                            };

                            var ciRateSP = xmpControllerDriverVar.scope.$parent.getRate(ciCalcData, xmpControllerDriverVar.scope.ci_calc_vars_sp);
                            ciAmountSP = Number(ciRateSP.spouse);

                        }

                        var ciAmountCh = 0;

                        if (xmpControllerDriverVar.scope.xmp.r["CI_OPT2"] === "X") {
                            ciAmountCh = 0.25;
                        }

                        var ciAmount = ciAmountEE + ciAmountSP + ciAmountCh;
                        xmpControllerDriverVar.scope.xmp.r["CI_RATE"] = ciAmount.toFixed(2);

                        xmpControllerDriverVar.scope.prodTotalUpdate();
                    });
                } else {
                    xmpControllerDriverVar.scope.prodTotalUpdate();
                }

            };*/

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

            xmpControllerDriverVar.scope.prodLegalUpdate = function() {

                xmpControllerDriverVar.scope.xmp.r["LP_RATE"] = "0.00";

                if (xmpControllerDriverVar.scope.xmp.r["PROD_LP"] !== "X") {
                    xmpControllerDriverVar.scope.xmp.r["MISC10"] = "";
                }

                if (xmpControllerDriverVar.scope.xmp.r["MISC10"] === "X") {
                    xmpControllerDriverVar.scope.xmp.r["LP_RATE"] = "8.50";
                }

                xmpControllerDriverVar.scope.prodTotalUpdate();
            };

            xmpControllerDriverVar.scope.prodTotalUpdate = function() {

                xmpControllerDriverVar.scope.xmp.r["TOTAL_RATE"] = "0.00";

                var aiRate = Number(xmpControllerDriverVar.scope.xmp.r["AI_RATE"]);
                var ciRate = Number(xmpControllerDriverVar.scope.xmp.r["CI_RATE"]);
                var hiRate = Number(xmpControllerDriverVar.scope.xmp.r["HI_RATE"]);
                var lpRate = Number(xmpControllerDriverVar.scope.xmp.r["LP_RATE"]);
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

                if (!lpRate || lpRate === NaN) {
                    lpRate = 0;
                }

                totalRate = aiRate + ciRate + hiRate + lpRate;

                xmpControllerDriverVar.scope.xmp.r["TOTAL_RATE"] = totalRate.toFixed(2);

            };

            // critical 3-tier
            /*xmpControllerDriverVar.scope.setSpAge = function() {
                if (xmpControllerDriverVar.scope.xmp.r["SP_DOB"] && xmpControllerDriverVar.scope.dateStatus.sp_dob === "valid") {
                    var asOfDate = moment(xmpControllerDriverVar.scope.general_vars.as_of_date, "MM/DD/YYYY");
                    var asOfDay = asOfDate.get("date");
                    var asOfMonth = asOfDate.get("month");
                    var asOfYear = asOfDate.get("year");
                    var dob = moment(xmpControllerDriverVar.scope.xmp.r["SP_DOB"], "MM/DD/YYYY");
                    var birthDay = dob.get("date");
                    var birthMonth = dob.get("month");
                    var birthYear = dob.get("year");

                    xmpControllerDriverVar.scope.spAsOfAge = asOfYear - birthYear;

                    if (asOfMonth < (birthMonth - 1)) {
                        xmpControllerDriverVar.scope.spAsOfAge--;
                    }

                    if ((birthMonth == asOfMonth) && (asOfDay < birthDay)) {
                        xmpControllerDriverVar.scope.spAsOfAge--;
                    }
                }
            };*/

            xmpControllerDriverVar.scope.prodAccidentUpdate();
            xmpControllerDriverVar.scope.prodCriticalUpdate();
            xmpControllerDriverVar.scope.prodHospitalUpdate();
            xmpControllerDriverVar.scope.prodLegalUpdate();

            // critical 3-tier
            /*xmpControllerDriverVar.scope.setSpAge();*/

            var resourceDriver = new xmpResourceDriver();
            resourceDriver.saveRecipientADORs(xmpControllerDriverVar.scope.xmp.recipientID, {"SAVE_CONT": "product-selection.html"});

        });

    });
};