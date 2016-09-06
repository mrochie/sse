// This is a JavaScript file

// Get the main app.js module and inject the SharedProperties service
var landingPage = angular.module("landingPageController", []);
landingPage.controller("LandingPageController", function ($scope, $http, SharedProperties, NetworkConnection) 
{
    // Watch for changes in the User ID text field
    $scope.$watch('userIDSearch', function(newVal, oldVal)
    {  
        if (newVal !== oldVal)
        {
            // Save the User ID
            $scope.saveUserID(newVal);
        }
    });

    // Save the User ID
    $scope.saveUserID = function(userID)
    {
        // Save the User ID
        SharedProperties.setUserID(userID);
        console.log("User ID: " + SharedProperties.getUserID());
    };
});




