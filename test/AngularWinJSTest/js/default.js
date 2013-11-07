(function () {
    "use strict";

    var app = angular.module("app", ["winjs"]);

    app.controller("AppController", function ($scope) {
        var names = ["Josh", "Paul", "Chris", "Ales"]
        $scope.name = "Josh Williams";
        $scope.rating = 3;
        var ratings = [];
        for (var i = 0; i < 250; i++) {
            ratings.push({
                name: names[i % names.length] + ((i / 4) | 0),
                rating: (i % 5) + 1
            });
        }
        $scope.ratings = ratings;
        $scope.sum = function () {
            return ratings.reduce(function (t, v) { return t + (+v.rating); }, 0);
        };
        $scope.addRating = function () {
            ratings.unshift({
                name: "Kieran",
                rating: 1
            });
        };
    })

})();
