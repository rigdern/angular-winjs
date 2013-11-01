Test app showing AngularJS usage with WinJS controls
----------------------------------------------------

In order to use Angular in the Windows application environment you need to do a couple of things:

* You need to use jQuery, which has done work to address some security boundaries in the Windows
HTML application environment, current versions of jQuery work great. In this test app I grabbed the
latest released jQuery 2.0 and dropped it in my app.


    <script src="/js/lib/jquery.js"></script>

* You need to use AngularJS. I grabbed the latest 1.2.0-rc3 build off of their site and dropped it
in my app.


    <script src="/js/lib/angular.js"></script>
