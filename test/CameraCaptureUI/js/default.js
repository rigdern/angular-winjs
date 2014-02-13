(function () {
    "use strict";

    var app = angular.module("app", ["winjs"]);

    app.directive("cameraImage", function () {
        return {
            restrict: "E",
            template: "<div><img width='300' height='300'><br/><button>Capture</button></div>",
            replace: true,
            link: function ($scope, elements, attrs) {
                var img = elements[0].querySelector("IMG");
                elements[0].querySelector("BUTTON").addEventListener("click", function () {
                    // Using Windows.Media.Capture.CameraCaptureUI API to capture a photo 
                    var dialog = new Windows.Media.Capture.CameraCaptureUI();
                    var aspectRatio = { width: 1, height: 1 };
                    dialog.photoSettings.croppedAspectRatio = aspectRatio;
                    dialog.captureFileAsync(Windows.Media.Capture.CameraCaptureUIMode.photo).then(function (file) {
                        if (file) {
                            var photoBlobUrl = URL.createObjectURL(file, { oneTimeOnly: true });
                            img.src = photoBlobUrl;
                        } else {
                            throw "No photo captured";
                        }
                    }).then(null, function (err) {
                        console.log("error: " + err);
                    });
                });
            }
        }
    });

    app.controller("AppController", function ($scope) {
        // @TODO, scope...
    })

})();
