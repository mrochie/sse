// This is a JavaScript file

// Get the main app.js module and inject the SharedProperties service
var defectDetails = angular.module("defectDetailsController", []);
defectDetails.controller("DefectDetailsController", function ($scope, $http, SharedProperties, NetworkConnection)
{
    // Initialise bool to show comments
    $scope.addComments = false;

    // Show the comments section
    $scope.showComments = function ()
    {
        $scope.addComments = true;
    };



});