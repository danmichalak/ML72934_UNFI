"use strict";

// xmp-clear-all-cookies-onload does not appear to be working, so this does what it's supposed to
document.cookie = "xmpSecurityToken=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
//document.cookie = "xmpRecipientID=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
document.cookie = "xmpServiceToken=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
//document.cookie = "xmpReferredID=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";

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

            xmpControllerDriverVar.scope.loginAttempts = 0;

            xmpControllerDriverVar.scope.checkCookies = function () {

                var cookiesStr = document.cookie;
                var cookiesArr = cookiesStr.split("; ");

                // using a for instead of forEach, since the latter doesn't allow breaks
                for (var cookieIdx = 0; cookieIdx < cookiesArr.length; cookieIdx++) {
                    var cookieStr = cookiesArr[cookieIdx];
                    var subStr = cookieStr.substring(0, 17);

                    if (subStr === "xmpLoginAttempts=") {

                        var cookieAttempts = parseInt(cookieStr.substring(17));

                        if (cookieAttempts !== NaN) {
                            xmpControllerDriverVar.scope.loginAttempts = cookieAttempts;
                        }

                        break;
                    }
                }

            };

            xmpControllerDriverVar.scope.checkError = function (data) {

                var errorCode = data.ErrorCode;
                var displayMessage = data.DisplayMessage;

                if (displayMessage === "Unauthorized") {
                    xmpControllerDriverVar.scope.loginAttempts++;
                    document.cookie = "xmpLoginAttempts=" + xmpControllerDriverVar.scope.loginAttempts;

                    if (xmpControllerDriverVar.scope.loginAttempts > 2) {
                        displayMessage = "The last 4 digits of your SSN and/or your password is incorrect.<br><br><span style=\"color: red\">Multiple failed login attempts. Due to security guidelines, if you forgot your password you must start the enrollment process over.<br>Please return to the <a href=\"register.html\">registration page</a> to create a new login.</span>";
                    } else {
                        displayMessage = "The last 4 digits of your SSN and/or your password is incorrect.";
                    }
                }

                $("#error-message").html(displayMessage);
            };

            xmpControllerDriverVar.scope.clearError = function () {

                $("#error-message").html("");
            };

            xmpControllerDriverVar.scope.checkCookies();

        });

    });
}