AngularJS - WinJS
===========================
For details on usage see:
https://github.com/codemonkeychris/angular-winjs

Unforunately right now there is a line at the end of the angular.js file which triggers 
the Windows 8 app environment's HTML security, in order to work around this wrap the last 
line of the file in a call to MSApp.execUnsafeLocalFunction like this:

MSApp.execUnsafeLocalFunction(function () {
    angular.element(document).find('head').prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide{display:none !important;}ng\\:form{display:block;}</style>');
});