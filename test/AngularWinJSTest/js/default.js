(function () {
    "use strict";

    var app = angular.module("app", ["winjs"]);

    app.controller("AppController", function ($scope) {
        $scope.name = "Josh Williams";
        $scope.rating = 3;
        var ratings = [];
        for (var i = 0; i < 500; i++) {
            ratings.push(i % 5);
        }
        $scope.ratings = ratings;
    })

})();
