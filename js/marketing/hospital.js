"use strict";

var xmplOnReady = function() {
    var xmpControllerDriverVar = new xmpControllerDriver($("[ng-controller='XMPAnonymousPage']"));
    xmpControllerDriverVar.ready(function() {

        // load in global variables
        xmpControllerDriverVar.scope.$parent.getJson("json/global.json", function(response) {

            var globalVars = response.data;

            Object.keys(globalVars).forEach(function (key) {
                xmpControllerDriverVar.scope[key] = globalVars[key];
            });

            xmpControllerDriverVar.scope.calc_vars = {
                "option": "",
                "coverage": "",
                "rate": ""
            };

            xmpControllerDriverVar.scope.resetRate = function (objName) {
                $(".rate-calc").html("");
            };

            xmpControllerDriverVar.scope.calcSubmit = function (objName) {

                xmpControllerDriverVar.scope.resetRate();

                var obj = xmpControllerDriverVar.scope.calc_vars;

                if (obj.option == "" || obj.coverage == "") {
                    $(".rate-calc").html("<strong>All fields are required</strong>");
                } else {

                    xmpControllerDriverVar.scope.$parent.getJson("json/hospital.json", function (calcResponse) {
                        var calcData = calcResponse.data;
                        var rate = xmpControllerDriverVar.scope.$parent.getRate(calcData, obj);
                        var amount = Number(rate.base);
                        var amountStr = amount.toFixed(2);
                        $(".rate-calc").html("Your rate is<strong> $" + amountStr + "</strong>");
                    });
                }

            };

        });

    });

};