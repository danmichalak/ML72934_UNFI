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

            xmpControllerDriverVar.scope.xmp.r["SAVE_CONT"] = "enrollee-info.html";

            // validation variables for date of birth field
            xmpControllerDriverVar.scope.dateStatus = { "dob": "valid" };
            xmpControllerDriverVar.scope.maxDt = moment().subtract(18, 'years');
            xmpControllerDriverVar.scope.minDt = moment().subtract(99, 'years');

            // Transfer to global.js?
            xmpControllerDriverVar.scope.checkSSN = function() {
                var str = xmpControllerDriverVar.scope.xmp.r["SSN"];
                var regex = /^(?!111-11-1111|222-22-2222|333-33-3333|444-44-4444|555-55-5555|777-77-7777|888-88-8888|999-99-9999|000-00-0000|123-45-6789)(?!666|000|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4}$/

                xmpControllerDriverVar.scope.ssnValid = false;
                xmpControllerDriverVar.scope.ssnMatch = false;

                if (str !== "" && str !== undefined) {
                    if (str.match(regex)) {
                        xmpControllerDriverVar.scope.ssnValid = true;

                        var subStr = str.substring(7,11);

                        if (subStr === xmpControllerDriverVar.scope.xmp.r["LAST4"]) {
                            xmpControllerDriverVar.scope.ssnMatch = true;
                        }
                    }
                }
            };

            // Transfer to global.js?
            xmpControllerDriverVar.scope.checkEmail = function() {

                if (!xmpControllerDriverVar.scope.xmp.r["EMAIL"]) {
                    xmpControllerDriverVar.scope.xmp.r["EMAIL"] = "";
                }

                var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                var email = xmpControllerDriverVar.scope.xmp.r["EMAIL"];

                if (email.match(regex)) {
                    xmpControllerDriverVar.scope.emailValid = true;
                } else {
                    xmpControllerDriverVar.scope.emailValid = false;
                }

            };

            var resourceDriver = new xmpResourceDriver();
            resourceDriver.saveRecipientADORs(xmpControllerDriverVar.scope.xmp.recipientID, {"SAVE_CONT": "enrollee-info.html"});

            var inOptions = { adors: ["LAST4"] };

            resourceDriver.getRecipientADORs(xmpControllerDriverVar.xmp.recipientID, inOptions, function (data) {
                xmpControllerDriverVar.scope.xmp.r["LAST4"] = data["LAST4"];

                xmpControllerDriverVar.scope.checkSSN();
                xmpControllerDriverVar.scope.checkEmail();
            });


        });

    });
};