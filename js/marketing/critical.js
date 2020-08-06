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

            // critical 4-tier
            xmpControllerDriverVar.scope.calc_vars = {
                "option": "",
                "coverage": "",
                "rate": ""
            };

            // critical 3-tier
            /*xmpControllerDriverVar.scope.calc_vars = {
                "member": {
                    "age": "",
                    "amount": 10000
                },
                "spouse": {
                    "check": "",
                    "age": "",
                    "amount": 10000
                },
                "child": {
                    "check": "",
                    "amount": 5000
                }
            };*/

            xmpControllerDriverVar.scope.resetRate = function (objName) {
                $(".rate-calc").html("");
            };

            // critical 4-tier
            xmpControllerDriverVar.scope.calcSubmit = function (objName) {

                xmpControllerDriverVar.scope.resetRate();

                var obj = xmpControllerDriverVar.scope.calc_vars;

                if (obj.option == "" || obj.coverage == "") {
                    $(".rate-calc").html("<strong>All fields are required</strong>");
                } else {

                    xmpControllerDriverVar.scope.$parent.getJson("json/critical-4tier.json", function (calcResponse) {
                        var calcData = calcResponse.data;
                        var rate = xmpControllerDriverVar.scope.$parent.getRate(calcData, obj);
                        var amount = Number(rate.base);
                        $(".rate-calc").html("Your rate is<strong> $" + amount + "</strong>");
                    });
                }

            };

            // critical 3-tier
            /*xmpControllerDriverVar.scope.calcSubmit = function (objName) {

                xmpControllerDriverVar.scope.resetRate();

                var obj_ee = xmpControllerDriverVar.scope.calc_vars.member;
                var obj_sp = xmpControllerDriverVar.scope.calc_vars.spouse;
                var obj_ch = xmpControllerDriverVar.scope.calc_vars.child;

                if (obj_ee.age == "" || (obj_sp.check == "X" && obj_sp.age == "")) {
                    $(".rate-calc").html("<strong>All fields are required</strong>");
                } else {

                    xmpControllerDriverVar.scope.$parent.getJson("json/critical-3tier.json", function (calcResponse) {
                        var calcData = calcResponse.data;

                        var rate_ee = xmpControllerDriverVar.scope.$parent.getRate(calcData, obj_ee);
                        var amount_ee = Number(rate_ee.member);

                        var amount_sp = 0;

                        if (obj_sp.check === "X") {
                            var rate_sp = xmpControllerDriverVar.scope.$parent.getRate(calcData, obj_sp);
                            amount_sp = Number(rate_sp.spouse);
                        }

                        var amount_ch = 0;

                        if (obj_ch.check === "X") {
                            amount_ch = 0.25;
                        }

                        var amount = amount_ee + amount_sp + amount_ch;
                        var amount_str = amount.toFixed(2);

                        $(".rate-calc").html("Your rate is<strong> $" + amount_str + "</strong>");

                    });
                }

            };*/

        });

    });

};