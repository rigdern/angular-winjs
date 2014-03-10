(function () {
    "use strict";

    var data = "{\"projects\":{\"project\":[{\"project-id\":{\"_type\":\"integer\",\"__text\":\"34407\"},\"account-name\":\"Greiner spa\",\"group-id\":\"\",\"icon\":{\"_type\":\"integer\",\"__text\":\"66\"},\"name\":\"Gloreha\",\"overview\":{\"_nil\":\"true\"},\"start-page\":\"overview\",\"status\":\"active\",\"permalink\":\"gloreha\",\"total-tickets\":{\"_type\":\"integer\",\"__text\":\"95\"},\"open-tickets\":{\"_type\":\"integer\",\"__text\":\"23\"},\"closed-tickets\":{\"_type\":\"integer\",\"__text\":\"72\"}},{\"project-id\":{\"_type\":\"integer\",\"__text\":\"34408\"},\"account-name\":\"Greiner spa\",\"group-id\":\"\",\"icon\":{\"_type\":\"integer\",\"__text\":\"20\"},\"name\":\"It\",\"overview\":{\"_nil\":\"true\"},\"start-page\":\"tickets\",\"status\":\"active\",\"permalink\":\"it\",\"total-tickets\":{\"_type\":\"integer\",\"__text\":\"1194\"},\"open-tickets\":{\"_type\":\"integer\",\"__text\":\"173\"},\"closed-tickets\":{\"_type\":\"integer\",\"__text\":\"1021\"}},{\"project-id\":{\"_type\":\"integer\",\"__text\":\"34534\"},\"account-name\":\"Greiner spa\",\"group-id\":\"\",\"icon\":{\"_type\":\"integer\",\"__text\":\"78\"},\"name\":\"OneDoo\",\"overview\":{\"_nil\":\"true\"},\"start-page\":\"overview\",\"status\":\"active\",\"permalink\":\"onedoo\",\"total-tickets\":{\"_type\":\"integer\",\"__text\":\"336\"},\"open-tickets\":{\"_type\":\"integer\",\"__text\":\"81\"},\"closed-tickets\":{\"_type\":\"integer\",\"__text\":\"255\"}}],\"_type\":\"array\"}}";

    var app = angular.module("app", ["winjs"]);

    app.controller("AppController", function ($scope) {
        setTimeout(function () {
            $scope.$apply(function () {
                $scope.projects = JSON.parse(data);
            });
        }, 2000);
    })

})();
