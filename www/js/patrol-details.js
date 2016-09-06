// This is a JavaScript file

// Get the main app.js module and inject the SharedProperties service
var patrolDetails = angular.module("patrolDetailsController", []);
patrolDetails.controller("PatrolDetailsController", function ($scope, $http, SharedProperties, NetworkConnection, $timeout)
{


    $scope.templates = [];
    $scope.addTemplate = function (templatename)
    {
        $scope.templates.push(templatename);
        console.log(templatename);
    };



});