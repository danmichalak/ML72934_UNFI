"use strict";

// xmp-clear-all-cookies-onload does not appear to be working, so this does what it's supposed to
document.cookie = "xmpSecurityToken=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
document.cookie = "xmpRecipientID=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
document.cookie = "xmpServiceToken=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
document.cookie = "xmpReferredID=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";

var xmplOnReady = function() {
    var xmpControllerDriverVar = new xmpControllerDriver($("[ng-controller='XMPAnonymousPage']"));
    xmpControllerDriverVar.ready(function() {

        // load in global variables
        xmpControllerDriverVar.scope.$parent.getJson("json/global.json", function(response) {

            var globalVars = response.data;

            Object.keys(globalVars).forEach(function (key) {
                xmpControllerDriverVar.scope[key] = globalVars[key];
            });

            // validation variables for the "state" field
            xmpControllerDriverVar.scope.stateValid = false;

            // validation variables for the "email" field
            xmpControllerDriverVar.scope.emailValid = false;

            // validation variables for the "email match" field
            xmpControllerDriverVar.scope.emailMatch = "";
            xmpControllerDriverVar.scope.emailMatchValid = false;

            // validation variables for the "password2" field
            xmpControllerDriverVar.scope.showPassInfo = false;
            xmpControllerDriverVar.scope.passValid = false;
            xmpControllerDriverVar.scope.passValidLength = false;
            xmpControllerDriverVar.scope.passHasUpper = false;
            xmpControllerDriverVar.scope.passHasLower = false;
            xmpControllerDriverVar.scope.passHasNumber = false;
            xmpControllerDriverVar.scope.passHasSpecial = false;

            // validation variables for the "password match" field
            xmpControllerDriverVar.scope.passMatchValid = false;

            // validation variables for the consent form
            xmpControllerDriverVar.scope.consentFormReady = false;
            xmpControllerDriverVar.scope.consentFormValid = false;

            // validation variables for date of birth field
            xmpControllerDriverVar.scope.dateStatus = {"dob": "valid"};
            xmpControllerDriverVar.scope.maxDt = moment().subtract(18, 'years');
            xmpControllerDriverVar.scope.minDt = moment().subtract(99, 'years');

            // validation variables for reCaptcha
            xmpControllerDriverVar.scope.captchaValid = false;

            xmpControllerDriverVar.scope.xmp = xmpControllerDriverVar.scope.xmp;

            // initializing values here for easier validation
            // also includes some commented-out variables that are currently un-used, but will be in later versions
            //xmpControllerDriverVar.scope.xmp.r["STATE"] = "";
            xmpControllerDriverVar.scope.xmp.r["PASSWORD1"] = "";
            xmpControllerDriverVar.scope.xmp.r["PASSWORD2"] = "";
            xmpControllerDriverVar.scope.xmp.r["GROUP"] = xmpControllerDriverVar.scope.general_vars.group;
            xmpControllerDriverVar.scope.xmp.r["GRP_NUM"] = xmpControllerDriverVar.scope.general_vars.grp_num;
            xmpControllerDriverVar.scope.xmp.r["GRP_ABBR"] = xmpControllerDriverVar.scope.general_vars.grp_abbr;
            xmpControllerDriverVar.scope.xmp.r["SITUS"] = xmpControllerDriverVar.scope.general_vars.situs;
            xmpControllerDriverVar.scope.xmp.r["GPC"] = xmpControllerDriverVar.scope.general_vars.gpc;
            xmpControllerDriverVar.scope.xmp.r["NAME_URL"] = "";
            //xmpControllerDriverVar.scope.xmp.r["PREFIX"] = "";
            xmpControllerDriverVar.scope.xmp.r["FNAME"] = "";
            //xmpControllerDriverVar.scope.xmp.r["MI"] = "";
            xmpControllerDriverVar.scope.xmp.r["LNAME"] = "";
            //xmpControllerDriverVar.scope.xmp.r["ADDRESS"] = "";
            //xmpControllerDriverVar.scope.xmp.r["CITY"] = "";
            //xmpControllerDriverVar.scope.xmp.r["STATE"] = "";
            //xmpControllerDriverVar.scope.xmp.r["ZIP"] = "";
            //xmpControllerDriverVar.scope.xmp.r["SSN"] = "";
            xmpControllerDriverVar.scope.xmp.r["LAST4"] = "";
            //xmpControllerDriverVar.scope.xmp.r["GENDER"] = "";
            //xmpControllerDriverVar.scope.xmp.r["PHONE"] = "";
            xmpControllerDriverVar.scope.xmp.r["DOB"] = "";
            xmpControllerDriverVar.scope.xmp.r["AGE"] = "";
            xmpControllerDriverVar.scope.xmp.r["EMAIL"] = "";
            //xmpControllerDriverVar.scope.xmp.r["MEMBER"] = "";
            //xmpControllerDriverVar.scope.xmp.r["MEMB_DATE"] = "";

            xmpControllerDriverVar.scope.asOfAge = 0;

            // validation variables for date of birth field
            xmpControllerDriverVar.scope.dateStatus = { "dob": "valid" };
            xmpControllerDriverVar.scope.maxDt = moment().subtract(18, 'years');
            xmpControllerDriverVar.scope.minDt = moment().subtract(99, 'years');

            xmpControllerDriverVar.scope.checkForm = function(field) {
                if ($("#"+field).is(":checked")) {
                    xmpControllerDriverVar.scope[field+"Valid"] = true;
                } else {
                    xmpControllerDriverVar.scope[field+"Valid"] = false;
                }
            };

            xmpControllerDriverVar.scope.checkPass = function () {

                if (xmpControllerDriverVar.scope.xmp.r["XMPie.Web.NewPassword"] === undefined) {
                    xmpControllerDriverVar.scope.xmp.r["XMPie.Web.NewPassword"] = "";
                }

                var pass = xmpControllerDriverVar.scope.xmp.r["XMPie.Web.NewPassword"];
                var passPts = 0;

                //validate the length
                if (pass.length < 8) {
                    $("#length").removeClass("valid").addClass("invalid");
                    xmpControllerDriverVar.scope.passValidLength = false;
                } else {
                    $("#length").removeClass("invalid").addClass("valid");
                    xmpControllerDriverVar.scope.passValidLength = true;
                }

                //validate lowercase letter
                if (pass.match(/[a-z]/)) {
                    $("#letter").removeClass("invalid").addClass("valid");
                    xmpControllerDriverVar.scope.passHasLower = true;
                    passPts++;
                } else {
                    $("#letter").removeClass("valid").addClass("invalid");
                    xmpControllerDriverVar.scope.passHasLower = false;
                }

                //validate capital letter
                if (pass.match(/[A-Z]/)) {
                    $("#capital").removeClass("invalid").addClass("valid");
                    xmpControllerDriverVar.scope.passHasUpper = true;
                    passPts++;
                } else {
                    $("#capital").removeClass("valid").addClass("invalid");
                    xmpControllerDriverVar.scope.passHasUpper = false;
                }

                //validate number
                if (pass.match(/\d/)) {
                    $("#number").removeClass("invalid").addClass("valid");
                    xmpControllerDriverVar.scope.passHasNumber = true;
                    passPts++;
                } else {
                    $("#number").removeClass("valid").addClass("invalid");
                    xmpControllerDriverVar.scope.passHasNumber = false;
                }

                //validate special characters
                if (pass.match(/[\s\-."",~`!@#$%^&*()_+={}|:;<>?\/[\]\\]/)) {
                    $("#specialChars").removeClass("invalid").addClass("valid");
                    xmpControllerDriverVar.scope.passHasSpecial = true;
                    passPts++;
                } else {
                    $("#specialChars").removeClass("valid").addClass("invalid");
                    xmpControllerDriverVar.scope.passHasSpecial = false;
                }

                if (xmpControllerDriverVar.scope.passValidLength && passPts >= 3) {
                    xmpControllerDriverVar.scope.passValid = true;
                } else {
                    xmpControllerDriverVar.scope.passValid = false;
                }

                xmpControllerDriverVar.scope.checkPassMatch();

            };

            xmpControllerDriverVar.scope.checkEmail = function () {

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

                xmpControllerDriverVar.scope.checkEmailMatch();

            };

            xmpControllerDriverVar.scope.checkEmailMatch = function () {
                xmpControllerDriverVar.scope.emailMatch = $("#emailmatch").val();

                if (!xmpControllerDriverVar.scope.xmp.r["EMAIL"]) {
                    xmpControllerDriverVar.scope.xmp.r["EMAIL"] = "";
                }

                if (!xmpControllerDriverVar.scope.emailMatch) {
                    xmpControllerDriverVar.scope.emailMatch = "";
                }

                if (xmpControllerDriverVar.scope.xmp.r["EMAIL"] === xmpControllerDriverVar.scope.emailMatch) {
                    xmpControllerDriverVar.scope.emailMatchValid = true;
                } else {
                    xmpControllerDriverVar.scope.emailMatchValid = false;
                }

            };

            xmpControllerDriverVar.scope.checkPassMatch = function () {

                if (xmpControllerDriverVar.scope.xmp.r["XMPie.Web.NewPassword"] === undefined) {
                    xmpControllerDriverVar.scope.xmp.r["XMPie.Web.NewPassword"] = "";
                }

                var passMatch = $("#passmatch").val();

                if (passMatch === undefined) {
                    passMatch = "";
                }

                if (xmpControllerDriverVar.scope.xmp.r["XMPie.Web.NewPassword"] === passMatch) {
                    xmpControllerDriverVar.scope.passMatchValid = true;
                } else {
                    xmpControllerDriverVar.scope.passMatchValid = false;
                }

            };

            xmpControllerDriverVar.scope.setAge = function () {

                if (xmpControllerDriverVar.scope.xmp.r["DOB"] && xmpControllerDriverVar.scope.dateStatus.dob === "valid") {

                    var asOfDate = moment(xmpControllerDriverVar.scope.general_vars.as_of_date, "MM/DD/YYYY");

                    var asOfDay = asOfDate.get("date");
                    var asOfMonth = asOfDate.get("month");
                    var asOfYear = asOfDate.get("year");

                    var currentDay = moment().get("date");
                    var currentMonth = moment().get("month");
                    var currentYear = moment().get("year");

                    var dob = moment(xmpControllerDriverVar.scope.xmp.r["DOB"], "MM/DD/YYYY");

                    var birthDay = dob.get("date");
                    var birthMonth = dob.get("month");
                    var birthYear = dob.get("year");

                    xmpControllerDriverVar.scope.xmp.r["AGE"] = currentYear - birthYear;

                    if (currentMonth < (birthMonth - 1)) {
                        xmpControllerDriverVar.scope.xmp.r["AGE"]--;
                    }

                    if ((birthMonth == currentMonth) && (currentDay < birthDay)) {
                        xmpControllerDriverVar.scope.xmp.r["AGE"]--;
                    }

                    xmpControllerDriverVar.scope.asOfAge = asOfYear - birthYear;

                    if (asOfMonth < (birthMonth - 1)) {
                        xmpControllerDriverVar.scope.asOfAge--;
                    }

                    if ((birthMonth == asOfMonth) && (asOfDay < birthDay)) {
                        xmpControllerDriverVar.scope.asOfAge--;
                    }

                }

            };

            xmpControllerDriverVar.scope.setNameUrl = function () {
                if (xmpControllerDriverVar.scope.xmp.r["FNAME"] === undefined || xmpControllerDriverVar.scope.xmp.r["FNAME"] === "") {
                    xmpControllerDriverVar.scope.xmp.r["FNAME"] = "";
                } else {
                    xmpControllerDriverVar.scope.xmp.r["FNAME"] = xmpControllerDriverVar.scope.xmp.r["FNAME"].trim();
                }

                if (xmpControllerDriverVar.scope.xmp.r["LNAME"] === undefined || xmpControllerDriverVar.scope.xmp.r["LNAME"] === "") {
                    xmpControllerDriverVar.scope.xmp.r["LNAME"] = "";
                } else {
                    xmpControllerDriverVar.scope.xmp.r["LNAME"] = xmpControllerDriverVar.scope.xmp.r["LNAME"].trim();
                }

                xmpControllerDriverVar.scope.xmp.r["NAME_URL"] = xmpControllerDriverVar.scope.xmp.r["FNAME"] + xmpControllerDriverVar.scope.xmp.r["LNAME"];

            };

            xmpControllerDriverVar.scope.runCaptchaTest = function () {
                xmpControllerDriverVar.scope.$apply(function () {
                    xmpControllerDriverVar.scope.captchaValid = true;
                });
            };

            xmpControllerDriverVar.scope.runCaptchaCancel = function () {
                xmpControllerDriverVar.scope.$apply(function () {
                    xmpControllerDriverVar.scope.captchaValid = false;
                });
            };

        });

    });
};