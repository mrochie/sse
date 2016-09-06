// This is a JavaScript file

// Get the main app.js module and inject the SharedProperties service
var photoTest = angular.module("photoTestController", []);
photoTest.controller("PhotoTestController", function ($scope, $http, SharedProperties, NetworkConnection) {
    
    var pictureSource;   // picture source
    var destinationType; // sets the format of returned value


    // Initialise
    var init = function () {
        document.addEventListener("deviceready", onDeviceReady, false);
    };

    // Fire init() after definition
    init();

    // Device APIs are available
    function onDeviceReady() {

        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType; 
    }


    // Called when a photo is successfully retrieved
    function onPhotoDataSuccess(imageData) {

        // Uncomment to view the base64-encoded image data
        // console.log(imageData);

        // Get image handle
        var smallImage = document.getElementById('smallImage');
  
        // Unhide image elements
        smallImage.style.display = 'block';
   
        // Show the captured photo
        // The in-line CSS rules are used to resize the image
        smallImage.src = "data:image/jpeg;base64," + imageData;
   
    }

    // Called when a photo is successfully retrieved
    function onPhotoURISuccess(imageURI) {
        
        // Uncomment to view the image file URI
        // console.log(imageURI);
        
        // Get image handle
        var largeImage = document.getElementById('largeImage');
    
        // Unhide image elements
        largeImage.style.display = 'block';
    
        // Show the captured photo
        // The in-line CSS rules are used to resize the image
        largeImage.src = imageURI;
    }

    // A button will call this function
    $scope.capturePhoto = function () {
        // Take picture using device camera and retrieve image as base64-encoded string
        navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50, destinationType: destinationType.DATA_URL });
    }

    // A button will call this function
    $scope.capturePhotoEdit = function () {
        // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
        navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true, destinationType: destinationType.DATA_URL });
    }

    // A button will call this function
    $scope.getPhoto = function (source) {
        // Retrieve image file location from specified source
        navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, destinationType: destinationType.FILE_URI, sourceType: source });
    }

    // Called if something bad happens.
    function onFail(message) {
        alert('Failed because: ' + message);
    }
});