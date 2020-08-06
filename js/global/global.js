"use strict";

$(document).ready(function() {

    var statusControllers = angular.module("globalController", []).controller("GlobalController", ["$scope","$cookies","$http","$filter", function ($scope, $cookies, $http, $filter) {
        $scope.xmp = {};

        $scope.currentDate = moment();

        $scope.stateList = [
            {abbr: "AL", name: "Alabama"},
            {abbr: "AK", name: "Alaska"},
            {abbr: "AZ", name: "Arizona"},
            {abbr: "AR", name: "Arkansas"},
            {abbr: "CA", name: "California"},
            {abbr: "CNMI", name: "Commonwealth of Northern Mariana Islands"},
            {abbr: "CO", name: "Colorado"},
            {abbr: "CT", name: "Connecticut"},
            {abbr: "DE", name: "Delaware"},
            {abbr: "DC", name: "District Of Columbia"},
            {abbr: "FL", name: "Florida"},
            {abbr: "GA", name: "Georgia"},
            {abbr: "GU", name: "Guam"},
            {abbr: "HI", name: "Hawaii"},
            {abbr: "ID", name: "Idaho"},
            {abbr: "IL", name: "Illinois"},
            {abbr: "IN", name: "Indiana"},
            {abbr: "IA", name: "Iowa"},
            {abbr: "KS", name: "Kansas"},
            {abbr: "KY", name: "Kentucky"},
            {abbr: "LA", name: "Louisiana"},
            {abbr: "ME", name: "Maine"},
            {abbr: "MD", name: "Maryland"},
            {abbr: "MA", name: "Massachusetts"},
            {abbr: "MI", name: "Michigan"},
            {abbr: "MN", name: "Minnesota"},
            {abbr: "MS", name: "Mississippi"},
            {abbr: "MO", name: "Missouri"},
            {abbr: "MT", name: "Montana"},
            {abbr: "NE", name: "Nebraska"},
            {abbr: "NV", name: "Nevada"},
            {abbr: "NH", name: "New Hampshire"},
            {abbr: "NJ", name: "New Jersey"},
            {abbr: "NM", name: "New Mexico"},
            {abbr: "NY", name: "New York"},
            {abbr: "NC", name: "North Carolina"},
            {abbr: "ND", name: "North Dakota"},
            {abbr: "OH", name: "Ohio"},
            {abbr: "OK", name: "Oklahoma"},
            {abbr: "OR", name: "Oregon"},
            {abbr: "PA", name: "Pennsylvania"},
            {abbr: "PR", name: "Puerto Rico"},
            {abbr: "RI", name: "Rhode Island"},
            {abbr: "SC", name: "South Carolina"},
            {abbr: "SD", name: "South Dakota"},
            {abbr: "TN", name: "Tennessee"},
            {abbr: "TX", name: "Texas"},
            {abbr: "UT", name: "Utah"},
            {abbr: "VT", name: "Vermont"},
            {abbr: "VA", name: "Virginia"},
            {abbr: "VI", name: "Virgin Islands"},
            {abbr: "WA", name: "Washington"},
            {abbr: "WV", name: "West Virginia"},
            {abbr: "WI", name: "Wisconsin"},
            {abbr: "WY", name: "Wyoming"}
        ];

        $scope.getPageFlow = function(pageScope) {

            // build ordered list of all pages currently in enrollment page flow

            $scope.pages = pageScope.enrollment_pages;
            var adors = pageScope.xmp.r;
            var hasDep = false;

            $scope.pagesUsed = [];

            // add pages to the page flow, based on user input (usually in product selection and health info)

            $scope.pagesUsed.push($scope.pages[0]); // product selection
            $scope.pagesUsed.push($scope.pages[1]); // enrollee information

            // critical 4-tier
            if (
                adors["AI_COV"] === "EE+SP" || adors["AI_COV"] === "EE+CH" || adors["AI_COV"] === "FAM" ||
                adors["CI_COV"] === "EE+SP" || adors["CI_COV"] === "EE+CH" || adors["CI_COV"] === "FAM" ||
                adors["HI_COV"] === "EE+SP" || adors["HI_COV"] === "EE+CH" || adors["HI_COV"] === "FAM"
            ) {
                $scope.pagesUsed.push($scope.pages[2]); // dependent information
                hasDep = true;
            }

            // critical 3-tier
            /*if (
                adors["AI_COV"] === "EE+SP" || adors["AI_COV"] === "EE+CH" || adors["AI_COV"] === "FAM" ||
                adors["CI_OPT1"] === "X" || adors["CI_OPT2"] === "X" ||
                adors["HI_COV"] === "EE+SP" || adors["HI_COV"] === "EE+CH" || adors["HI_COV"] === "FAM"
            ) {
                $scope.pagesUsed.push($scope.pages[2]); // dependent information
                hasDep = true;
            }*/

            $scope.pagesUsed.push($scope.pages[3]); // enrollment summary
            $scope.pagesUsed.push($scope.pages[4]); // signature
            $scope.pagesUsed.push($scope.pages[5]); // thank you

            // Now that the pages are set up, find the active page, previous page, and next page
            $scope.thisPageIndex = -1;

            for (var pageIdx = 0; pageIdx < $scope.pagesUsed.length; pageIdx++) {

                var page = $scope.pagesUsed[pageIdx];

                if (page.trackingPageName === pageScope.trackingPageName) {
                    $scope.thisPageIndex = pageIdx;
                }

            }

            if ($scope.thisPageIndex === -1) {

                // page does not exist in page flow
                // redirect to error page
                window.location.href = "error.html";

            } else {

                $scope.thisPage = $scope.pagesUsed[$scope.thisPageIndex];

                // assign prev/next pages
                $scope.prevPage = null;
                $scope.nextPage = null;

                if ($scope.thisPageIndex > 0) {
                    $scope.prevPage = $scope.pagesUsed[$scope.thisPageIndex-1];
                }

                if ($scope.thisPageIndex < $scope.pagesUsed.length+1) {
                    $scope.nextPage = $scope.pagesUsed[$scope.thisPageIndex+1];
                }

                var activePageStyleFound = false;

                for (var pageStyleIdx = 0; pageStyleIdx < $scope.pages.length; pageStyleIdx++) {

                    if ($scope.pages[pageStyleIdx].trackingPageName === pageScope.trackingPageName) {
                        // current page
                        $scope.pages[pageStyleIdx].styleClass = "col-xs-12 col-sm-12 col-md-2 step-col activeStep";
                        activePageStyleFound = true;
                    } else if (activePageStyleFound) {
                        // later page
                        $scope.pages[pageStyleIdx].styleClass = "col-xs-12 col-sm-12 col-md-2 step-col inactiveStep";
                    } else if ($scope.pages[pageStyleIdx].trackingPageName === "Dependent Information" && !hasDep) {
                        // earlier dependent info page, where dependent info is not in page flow
                        $scope.pages[pageStyleIdx].styleClass = "col-xs-12 col-sm-12 col-md-2 step-col inactiveStep";
                    } else {
                        // earlier page
                        $scope.pages[pageStyleIdx].styleClass = "col-xs-12 col-sm-12 col-md-2 step-col";
                    }
                }

            }

        };

        $scope.getDateStatus = function(field, minDt, maxDt, format) {

            // check if a date field on the page is formatted incorrectly, or outside of a defined range

            var str = $("#"+field).val();

            var status = "invalid";

            if ($("#"+field).val() === "" || $("#"+field).val() === undefined) {
                str = "";
            }

            if (!maxDt) {
                maxDt = moment();
            }

            if (!minDt) {
                minDt = moment().subtract(100, "years");
            }

            if (str === "") {
                status = "valid";
            } else {

                var regex;
                var m;
                var d;
                var y;

                if (format === "MM/YYYY") {
                    // Validates date value in MM/YYYY format
                    regex = /(0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/;
                } else {
                    // Validates date value in MM/DD/YYYY format
                    regex = /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/;
                }

                if (str.match(regex)) {

                    if (format === "MM/YYYY") {
                        m = str.substr(0,2);
                        d = "01";
                        y = str.substr(3,4);
                    } else {
                        m = str.substr(0,2);
                        d = str.substr(3,2);
                        y = str.substr(6,4);
                    }

                    var dtStr = m + "/" + d + "/" + y;

                    var dtMoment = moment(dtStr, "MM/DD/YYYY");

                    if (dtMoment.isBefore(minDt) || dtMoment.isAfter(maxDt)) {
                        status = "out of bounds";
                    } else {
                        status = "valid";
                    }

                }
            }

            return status;
        };

        $scope.loadingModal = function() {
            $("#submitModal").modal("hide");
            $("#loadingModal").modal();
        };

        $scope.submitModal = function() {
            $("#submitModal").modal();
        };

        $scope.logoutModal = function(id) {
            var originStr = window.location.origin;
            var pathStr = window.location.pathname;
            var pageStr = pathStr.split("/").pop();

            $scope.loginUrl = originStr + pathStr.replace(pageStr, "login.html") + "?rid=" + id;

            $("#logoutModal").modal();
        };

        $scope.saveForm = function(id, obj) {
            resourceDriver.saveRecipientADORs(id, obj);
            $("#saveModal").modal();
        };

        $scope.saveFormNoModal = function(id, obj, success) {
            resourceDriver.saveRecipientADORs(id, obj, null, function() {
                window.location.href = success;
            });
        };

        $scope.goToPage = function(page) {
            // need to change window.location.href in a function when the name of the page to switch to is variable

            window.location.href = page;
        };

        $scope.getTimestamp = function() {
            // timestamp for page submission
            // make sure timezone set to default (EST) before checking for timestamp
            moment.tz.setDefault();

            var timestamp = moment();
            var timestamp_et = timestamp.clone().tz("America/New_York").format("HH:mm:ss:MM/DD/YYYY");

            return timestamp_et;
        };

        $scope.range = function(min, max, step) {
            // function for generating a range of numbers

            step = step || 1;
            var input = [];
            for (var i = min; i <= max; i += step) {
                input.push(i);
            }

            return input;
        };

        $scope.getRate = function(data,obj) {

            // check input values against a list of rates

            var filterObj = {};

            // build the filter object by assigning the input value to the appriate rate-determining variables
            Object.keys(data[0]).forEach(function(key) {
                if (key !== "rate") {
                    filterObj[key] = obj[key];
                }
            });

            // uses the filter to find the data array item with the appropriate rate
            // this filter will return only one item in a properly-built data array, but it will still return an array with one item
            // instead, retrieving the only object in the array for easier formatting
            var item = $filter("filter")(data, filterObj, true)[0];

            return item.rate;
        };

        $scope.getProductsArr = function(obj) {
            var arr = [];

            if (obj) {

                Object.keys(obj).forEach(function (key) {
                    arr.push(obj[key]);
                });

            }

            return arr;
        };

        $scope.getProductsStr = function(obj) {
            var str = "";

            if (obj) {
                var arr = $scope.getProductsArr(obj);
                var last = arr.length - 1;

                for (var prodIdx = 0; prodIdx < arr.length; prodIdx++) {

                    if (prodIdx === last) {
                        str += " and ";
                    } else if (prodIdx > 0) {
                        str += ", ";
                    }

                    str += arr[prodIdx].name;

                }
            }

            return str;
        };

        $scope.filterZip = function(zipList, zipFirst3) {
            return $filter("filter")(zipList, {"zip": zipFirst3})[0];
        };

        $scope.copyToClipboard = function() {
            // create hidden text element, if it doesn't already exist
            var elem = document.getElementById("copy-target");
            var targetId = "_hiddenCopyText_";
            var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
            var origSelectionStart, origSelectionEnd;
            if (isInput) {
                // can just use the original source element for the selection and copy
                target = elem;
                origSelectionStart = elem.selectionStart;
                origSelectionEnd = elem.selectionEnd;
            } else {
                // must use a temporary form element for the selection and copy
                target = document.getElementById(targetId);
                if (!target) {
                    var target = document.createElement("textarea");
                    target.style.position = "absolute";
                    target.style.left = "-9999px";
                    target.style.top = "0";
                    target.id = targetId;
                    document.body.appendChild(target);
                }
                target.textContent = elem.textContent;
            };
            // select the content
            var currentFocus = document.activeElement;
            target.focus();
            target.setSelectionRange(0, target.value.length);
            // copy the selection
            var succeed;
            try {
                succeed = document.execCommand("copy");
            } catch(e) {
                succeed = false;
            }
            // restore original focus
            if (currentFocus && typeof currentFocus.focus === "function") {
                currentFocus.focus();
            }

            if (isInput) {
                // restore prior selection
                elem.setSelectionRange(origSelectionStart, origSelectionEnd);
            } else {
                // clear temporary content
                target.textContent = "";
            }
            return succeed;
        };

        /*$scope.sendEnrollmentEmail = function(id) {
            var emailUrl = xmpcfg.access.url+"/v1/projects/"+xmpcfg.access.accessToken+"/emails";

            var emailSettings = {
                "url": emailUrl,
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "cache-control": "no-cache"
                },
                "data": JSON.stringify({
                    "customizations": {},
                    "emailTouchpointID":"E2",
                    "recipientID":id
                })
            };

            $http(emailSettings).then(function successCallback(response) {
                resourceDriver.saveRecipientADORs(id, {"MISC03": "X"});
            }, function errorCallback(response) {
                alert(response.data);
            });
        };*/

        $scope.getJson = function (urlStr, callback) {
            $http.get(urlStr).then(function successCallback(response) {
                callback(response);
            }, function errorCallback(response) {
                alert(response.data);
            });
        };

    }]);

    // app
    var xmpApp = angular.module("xmp.app", [
        "globalController",
        "xmp.directives",
        "xmp.controllers",
        "xmp.services"
    ]).config(["xmpResourceProvider", function(inProvider) {
        // 	xmpcfg is defined externally at the site.
        inProvider.configure({
            access:xmpcfg.access
        });
    }]);

    // setting up jQuery functions
    $("[data-toggle='popover']").popover();

    resizeHeader();
});

$(window).resize(function() {
    resizeHeader();
});

$(window).scroll(function() {
    resizeHeader();
});

var resizeHeader = function() {
    var pos = $(window).scrollTop();
    var wth = $(window).width();

    if (wth < 768 || pos > 7) {
        $(".global-header").addClass("global-header--minimized");
        $(".global-header__row").addClass("global-header__row--minimized");
        $(".global-header__left").addClass("global-header__left--minimized");
        $(".global-header__right").addClass("global-header__right--minimized");
        //$(".global-header__logo-metlife").addClass("global-header__logo-metlife--minimized");
        //$(".global-header__logo-sponsor").addClass("global-header__logo-sponsor--minimized");

        if (wth < 768) {
            $("body").css("padding-top", "90px");
        } else {
            $("body").css("padding-top", "50px");
        }
    } else {
        $("body").css("padding-top", "70px");
        $(".global-header").removeClass("global-header--minimized");
        $(".global-header__row").removeClass("global-header__row--minimized");
        $(".global-header__left").removeClass("global-header__left--minimized");
        $(".global-header__right").removeClass("global-header__right--minimized");
        //$(".global-header__logo-metlife").removeClass("global-header__logo-metlife--minimized");
        //$(".global-header__logo-sponsor").removeClass("global-header__logo-sponsor--minimized");
    }

};

$('.collapse-btn .btn-icon').attr('action-icon', 'open');

// Preventing default collapse functionality in order to determine specific actions
$('.collapse-btn').on('click', function(ev) {

    ev.stopPropagation();

    var id = $(this).attr('data-target');
    var trgt = $('#' + id + '.collapse');
    var button = $(this).find('.btn-icon');

    var trgtChildren = trgt.find('.collapse');

    if (button.attr('action-icon') == 'open-all') {
        trgtChildren.collapse('show');
    } else if (button.attr('action-icon') == 'open') {
        $(trgt).collapse('show');
    } else {
        $(trgt).collapse('hide');
    }
});

$('.collapse').on('show.bs.collapse', function(ev) {

    ev.stopPropagation();

    var id = $(this).attr('id');
    var button = $('[data-target="'+id+'"].collapse-btn .btn-icon');
    var parent = $(this).parent().closest('.collapse');
    var children = $(this).find('.collapse');

    if (children.length > 0) {
        button.attr('action-icon', 'open-all');
    } else {
        button.attr('action-icon', 'close');
    }
});

$('.collapse').on('shown.bs.collapse', function(ev) {

    ev.stopPropagation();

    var id = $(this).attr('id');
    var button = $('[data-target="'+id+'"].collapse-btn .btn-icon');
    var parent = $(this).parent().closest('.collapse');
    var children = $(this).find('.collapse');

    if (parent.hasClass('collapse')) {
        var parentBtn = $('[data-target="' + parent.attr('id') + '"].collapse-btn .btn-icon');
        var siblings = parent.find('.collapse');
        var siblingsOpen = parent.find('.collapse[aria-expanded="true"]');

        if (siblings.length > 1 && siblings.length == siblingsOpen.length) {
            parentBtn.attr('action-icon', 'close-all');
        }
    }
});

$('.collapse').on('hide.bs.collapse', function(ev) {

    ev.stopPropagation();

    var id = $(this).attr('id');
    var button = $('[data-target="'+id+'"].collapse-btn .btn-icon');
    var parent = $(this).parent().closest('.collapse');
    var children = $(this).find('.collapse');

    if (parent.hasClass('collapse')) {
        var parentBtn = $('[data-target="' + parent.attr('id') + '"].collapse-btn .btn-icon');
        var siblings = parent.find('.collapse');
        var siblingsOpen = parent.find('.collapse[aria-expanded="true"]');

        if (siblings.length > 1 && siblingsOpen.length == 1) {
            parentBtn.attr('action-icon', 'open-all');
        }
    }

    button.attr('action-icon', 'open');
    children.collapse('hide');

});
