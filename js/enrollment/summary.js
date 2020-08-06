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

            xmpControllerDriverVar.scope.xmp.r["SAVE_CONT"] = "summary.html";

            var resourceDriver = new xmpResourceDriver();
            resourceDriver.saveRecipientADORs(xmpControllerDriverVar.scope.xmp.recipientID, {"SAVE_CONT": "summary.html"});

            xmpControllerDriverVar.scope.hasSp = false;
            xmpControllerDriverVar.scope.hasCh = false;

            // critical 4-tier
            if (
                xmpControllerDriverVar.scope.xmp.r["AI_COV"] === "EE+SP" || xmpControllerDriverVar.scope.xmp.r["AI_COV"] === "FAM" ||
                xmpControllerDriverVar.scope.xmp.r["CI_COV"] === "EE+SP" || xmpControllerDriverVar.scope.xmp.r["CI_COV"] === "FAM" ||
                xmpControllerDriverVar.scope.xmp.r["HI_COV"] === "EE+SP" || xmpControllerDriverVar.scope.xmp.r["HI_COV"] === "FAM"
            ) {
                xmpControllerDriverVar.scope.hasSp = true;
            }

            if (
                xmpControllerDriverVar.scope.xmp.r["AI_COV"] === "EE+CH" || xmpControllerDriverVar.scope.xmp.r["AI_COV"] === "FAM" ||
                xmpControllerDriverVar.scope.xmp.r["CI_COV"] === "EE+CH" || xmpControllerDriverVar.scope.xmp.r["CI_COV"] === "FAM" ||
                xmpControllerDriverVar.scope.xmp.r["HI_COV"] === "EE+CH" || xmpControllerDriverVar.scope.xmp.r["HI_COV"] === "FAM"
            ) {
                xmpControllerDriverVar.scope.hasCh = true;
            }

            // critical 3-tier
            /*if (
                xmpControllerDriverVar.scope.xmp.r["AI_COV"] === "EE+SP" || xmpControllerDriverVar.scope.xmp.r["AI_COV"] === "FAM" ||
                xmpControllerDriverVar.scope.xmp.r["HI_COV"] === "EE+SP" || xmpControllerDriverVar.scope.xmp.r["HI_COV"] === "FAM" ||
                xmpControllerDriverVar.scope.xmp.r["CI_OPT1"] === "X"
            ) {
                xmpControllerDriverVar.scope.hasSp = true;
            }

            if (
                xmpControllerDriverVar.scope.xmp.r["AI_COV"] === "EE+CH" || xmpControllerDriverVar.scope.xmp.r["AI_COV"] === "FAM" ||
                xmpControllerDriverVar.scope.xmp.r["HI_COV"] === "EE+CH" || xmpControllerDriverVar.scope.xmp.r["HI_COV"] === "FAM" ||
                xmpControllerDriverVar.scope.xmp.r["CI_OPT2"] === "X"
            ) {
                xmpControllerDriverVar.scope.hasCh = true;
            }*/

            var inOptions = {
                adors: ["XMPieRecipientKey",
                    "CH1_NAME", "CH1_DOB", "CH1_GENDER",
                    "CH2_NAME", "CH2_DOB", "CH2_GENDER",
                    "CH3_NAME", "CH3_DOB", "CH3_GENDER",
                    "CH4_NAME", "CH4_DOB", "CH4_GENDER",
                    "CH5_NAME", "CH5_DOB", "CH5_GENDER"]
            };

            resourceDriver.getRecipientADORs(xmpControllerDriverVar.xmp.recipientID, inOptions, function (data) {

                xmpControllerDriverVar.scope.children = [];

                // Push every non-empty child object into children array
                for (var dataIdx = 1; dataIdx <= 5; dataIdx++) {
                    if ((data["CH"+dataIdx+"_NAME"] !== "" && data["CH"+dataIdx+"_NAME"] !== undefined) ||
                        (data["CH"+dataIdx+"_DOB"] !== "" && data["CH"+dataIdx+"_DOB"] !== undefined) ||
                        (data["CH"+dataIdx+"_GENDER"] !== "" && data["CH"+dataIdx+"_GENDER"] !== undefined)
                    ) {
                        var childObj = {
                            name: data["CH"+dataIdx+"_NAME"],
                            dob: data["CH"+dataIdx+"_DOB"],
                            gender: data["CH"+dataIdx+"_GENDER"]
                        };

                        xmpControllerDriverVar.scope.children.push(childObj);
                    }
                }

            });

        });

    });
};