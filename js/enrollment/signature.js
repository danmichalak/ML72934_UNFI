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

            xmpControllerDriverVar.scope.fraudReady = false;
            xmpControllerDriverVar.scope.fraudValid = false;

            xmpControllerDriverVar.scope.privacyReady = false;
            xmpControllerDriverVar.scope.privacyValid = false;

            xmpControllerDriverVar.scope.hospReady = false;
            xmpControllerDriverVar.scope.hospValid = false;

            xmpControllerDriverVar.scope.nameValid = false;

            xmpControllerDriverVar.scope.checkForm = function(field) {
                if ($("#"+field).is(":checked")) {
                    xmpControllerDriverVar.scope[field+"Valid"] = true;
                } else {
                    xmpControllerDriverVar.scope[field+"Valid"] = false;
                }
            };

            xmpControllerDriverVar.scope.checkName = function(field) {
                if (xmpControllerDriverVar.scope.xmp.r['SIGN_NAME'] === xmpControllerDriverVar.scope.displayName) {
                    xmpControllerDriverVar.scope.nameValid = true;
                } else {
                    xmpControllerDriverVar.scope.nameValid = false;
                }
            };

            xmpControllerDriverVar.scope.setSignDate = function() {
                // make sure timezone set to default (EST) before checking for timestamp
                moment.tz.setDefault();

                var timestamp = moment();

                var user_tz = moment.tz.guess(true);
                var timestamp_user = timestamp.clone().tz(user_tz);
                var timestamp_et = timestamp.clone().tz("America/New_York");

                xmpControllerDriverVar.scope.xmp.r["SIGN_DATE"] = timestamp_user.format("MM/DD/YYYY");
                xmpControllerDriverVar.scope.xmp.r["SIGN_DATE_ET"] = timestamp_et.format("MM/DD/YYYY");
            };

            xmpControllerDriverVar.scope.setSignTime = function() {
                // make sure timezone set to default (EST) before checking for timestamp
                moment.tz.setDefault();

                var timestamp = moment();

                var user_tz = moment.tz.guess(true);
                var timestamp_user = timestamp.clone().tz(user_tz);
                var timestamp_et = timestamp.clone().tz("America/New_York");

                xmpControllerDriverVar.scope.xmp.r["SIGN_TIME"] = timestamp_user.format("HH:mm:ss");
                xmpControllerDriverVar.scope.xmp.r["SIGN_TIME_ET"] = timestamp_et.format("HH:mm:ss");
            };

            xmpControllerDriverVar.scope.showEftModal = function() {
                $("#eftModal").modal("show");
            };

            xmpControllerDriverVar.scope.showCreditModal = function() {
                $("#creditModal").modal("show");
            };

            var resourceDriver = new xmpResourceDriver();
            var inOptions = {
                adors: ["FNAME", "LNAME"]
            };

            xmpControllerDriverVar.scope.xmp.r["SAVE_CONT"] = "signature.html";
            resourceDriver.saveRecipientADORs(xmpControllerDriverVar.scope.xmp.recipientID, {"SAVE_CONT": "signature.html"});

            resourceDriver.getRecipientADORs(xmpControllerDriverVar.xmp.recipientID, inOptions, function (data) {

                xmpControllerDriverVar.scope.displayName = data["FNAME"] + " " + data["LNAME"];
                xmpControllerDriverVar.scope.xmp.r["SIGN_NAME"] = "";
                xmpControllerDriverVar.scope.setSignDate();

            });

        });

    });
};