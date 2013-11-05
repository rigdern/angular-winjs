// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    var app = angular.module("app", ["winjs"]);

    app.directive("showdown", function () {
        return {
            restrict: "E",
            scope: {
                src: "@"
            },
            link: function ($scope, element, attrs) {
                debugger;
            },
            template: "<div></div>",
            replace: true,
        }
    });

    app.controller("AppController", function ($scope) {
        $scope.foo = "my foo";
    });

})();
