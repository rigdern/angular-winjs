(function () {
    "use strict";

    var app = angular.module("app", ["winjs"]);


    app.controller("AppController", function ($scope) {
        $scope.sections = [
            { header: 'header 0', content: 'content 0' },
        ];
        $scope.sections2 = [
            { header: 'sections2 0', content: 'content 0' },
            { header: 'sections2 1', content: 'content 1' },
        ];
        var n = 1;
        function t(f) {
            var thisn = n;
            n++;
            setTimeout(function () {
                $scope.$apply(function () {
                    f(thisn);
                });
            }, thisn * 1000);
        }
        t(function (n) {
            $scope.sections.push({
                header: "header " + n,
                content: "content: " + n,
                id: n
            });
        });
        t(function (n) {
            $scope.sections.push({
                header: "header " + n,
                content: "content: " + n,
                id: n
            });
        });
        t(function (n) {
            $scope.sections.push({
                header: "header " + n,
                content: "content: " + n,
                id: n
            });
        });
        t(function () {
            $scope.sections.splice(0, 1);
        })
        t(function () {
            $scope.sections.splice(0, 1);
        })
        t(function (n) {
            $scope.sections.push({
                header: "header " + n,
                content: "content: " + n,
                id: n
            });
        });
        t(function (n) {
            $scope.sections.push({
                header: "header " + n,
                content: "content: " + n,
                id: n
            });
        });
    })

})();
