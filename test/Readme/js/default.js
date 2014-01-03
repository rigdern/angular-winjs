// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    var app = angular.module("app", ["ngSanitize", "winjs"]);

    app.directive("markdown", ["$compile", function ($compile) {
        return {
            restrict: "E",
            template: "<div></div>",
            replace: true,
            scope: {
                path: "=?",
            },
            link: function ($scope, elements, attrs) {
                var target = elements[0];
                var promise = Windows.Storage.PathIO.readTextAsync($scope.path).then(function (text) {
                    return WinJS.xhr({
                        url: "https://api.github.com/markdown",
                        type: "POST",
                        headers: { "Content-Type": "text/plain" },
                        data: JSON.stringify({
                            text: text,
                            mode: "markdown",
                        }),
                    });
                }).then(function (r) {
                    var html = r.responseText;
                    var elements = MSApp.execUnsafeLocalFunction(function () {
                        var host = document.createElement("div");
                        host.innerHTML = html;
                        var code = Array.prototype.slice.call(host.querySelectorAll("PRE"));
                        // Ignore the section which talks about how to add the scripts and css to the DOM.
                        code.filter(function (c) { return c.innerText.indexOf("<script") === -1 && c.innerText.indexOf("<link") === -1; }).forEach(function (c) {
                            var active = document.createElement("div");
                            active.className = "running-code-example"
                            var el = $.parseHTML(c.innerText);
                            var results = $compile(el)($scope.$parent);
                            for (var i = 0, len = results.length; i < len; i++) {
                                active.appendChild(results[i]);
                            }
                            c.insertAdjacentElement("afterend", document.createElement("hr"));
                            c.insertAdjacentElement("afterend", active);
                        })
                        return host;
                    });
                    while (elements.children.length) {
                        target.appendChild(elements.firstChild);
                    }
                });
                $scope.$on("$destroy", function () {
                    promise.cancel();
                });
            }
        };
    }]);

    app.controller("AppController", function ($scope, $compile) {
        $scope.path = "ms-appx:///readme.md";

        $scope.selection = [];
        $scope.ratings = [1, 2, 3, 4].map(function (r) { return { rating: r }; });
        $scope.date = new Date();
        $scope.time = new Date();
        $scope.toggleState = false;
        $scope.searchText = "Some text";
        $scope.data = new WinJS.Binding.List([1, 2, 3, 4, 5]).createGrouped(
            function (item) { return item % 2 ? "even" : "odd"; },
            function (item) { return item % 2 ? "even" : "odd"; }
        );
    });

})();
