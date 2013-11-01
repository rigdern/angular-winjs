Test app showing AngularJS usage with WinJS controls
----------------------------------------------------

In order to use Angular in the Windows application environment you need to do a couple of things:

* You need to use jQuery, which has done work to address some security boundaries in the Windows HTML application environment, current versions of jQuery work great. In this test app I grabbed the latest released jQuery 2.0 and dropped it in my app.
* You need to use AngularJS. I grabbed the latest 1.2.0-rc3 build off of their site and dropped it in my app.
* Unforunately right now there is a line at the end of the angular.js file which triggers the Windows 8 app enviornment's [HTML security][1], in order to work around this wrap the last line of the file in a call to [MSApp.execUnsafeLocalFunction][0]

[0]: http://msdn.microsoft.com/en-us/library/windows/apps/hh767331.aspx
[1]: http://msdn.microsoft.com/en-us/library/windows/apps/hh465388.aspx
  
The test app itself is pretty simple, it has a ListView which renders Rating controls for a bunch of fake people as well as telling you what the sum of all the ratings is.

![screenshot](https://raw.github.com/codemonkeychris/angular-winjs/master/test/AngularWinJSTest/screenshot.png)

The JS for the app is:

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
    })

And the HTML is:

    <body>
        <h2>Hi {{name}}, your rating is: {{ratings[0].rating}} (<win-rating max-rating="5" user-rating="ratings[0].rating"></win-rating>)</h2>
        <br/>
        <h1>The total rating is: {{sum()}}</h1>
        <br/>
        <win-list-view item-data-source="ratings">
            <win-item-template>{{item.data.name}}'s rating: <win-rating max-rating="5" user-rating="item.data.rating"></win-rating></win-item-template>
            <win-list-layout></win-list-layout>
        </win-list-view>
    </body>
