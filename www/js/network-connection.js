// Get the main newapp.js module
var networkConn = angular.module("networkConnection", []);
networkConn.service("NetworkConnection", function($rootScope, $window)
{
    var init = function ()
    {
        //alert("Checking Network Connection...");

        $rootScope.online = navigator.onLine;
        //alert("Network Connection: " + $rootScope.online);

        $window.addEventListener("offline", function () {
            $rootScope.$apply(function() {
                $rootScope.online = false;
                alert("Off-line: " + $rootScope.online);
            });
        }, false);

        $window.addEventListener("online", function () {
            $rootScope.$apply(function() {
                $rootScope.online = true;
                alertc("On-line: " + $rootScope.online);
            });
        }, false);
    };
    
    // And fire it after definition
    init();
});

