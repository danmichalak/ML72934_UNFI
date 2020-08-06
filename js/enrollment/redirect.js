"use strict";

var xmplOnReady = function() {
    var xmpControllerDriverVar = new xmpControllerDriver($("[ng-controller='XMPPersonalizedPage']"));
    xmpControllerDriverVar.ready(function() {

        // check for rid error
        if (xmpControllerDriverVar.xmp.recipientFailed) {
            window.location = "error.html";
        } else {

            var resourceDriver = new xmpResourceDriver();
            var inOptions = { adors: ["SAVE_CONT"] };

            resourceDriver.getRecipientADORs(xmpControllerDriverVar.xmp.recipientID, inOptions, function (data) {

                var successPage = "";

                if (data["SAVE_CONT"] === "" || data["SAVE_CONT"] === undefined) {
                    successPage = "product-selection.html";
                } else {
                    successPage = data["SAVE_CONT"];
                }

                window.location.href = successPage;
            });
        }

    });
}