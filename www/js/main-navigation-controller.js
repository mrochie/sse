// Get the main app.js module and inject the SharedProperties service
var mainNavigation = angular.module("mainNavigationController", []);
mainNavigation.controller("MainNavigationController", function ($scope, $http, $timeout, $interval, SharedProperties, DownloadPatrolFormDataService, NetworkConnection)
{
    // Get the User Name and ID
    $scope.userName = SharedProperties.getUserName();
    $scope.userID = SharedProperties.getUserID();

    // Show the Progress Bar
    $scope.showProgressBar = false;

    // Initialising Database variable
    var db;

    /* ******************** TEST ******************** */
    //SharedProperties.setUserID(179);

    // Initialise
    var init = function () {
        document.addEventListener("deviceready", onDeviceReady, false);
    };

    // Fire init() after definition
    init();

    // Device APIs are available
    function onDeviceReady() {
        db = window.openDatabase("tliphp", "1.0", "TLI Rapid", 200000);
    }

    $scope.downloadUpdates = function () {
        // Show the Progress Bar
        $scope.showProgressBar = true;
        
        //alert("SharedProperties.getGridSquareDataDownloaded(): " + SharedProperties.getGridSquareDataDownloaded());
        if (SharedProperties.getGridSquareDataDownloaded() == false) {
            if (navigator.onLine) {
                // Init GridSquare table
                DownloadPatrolFormDataService.initGridSquareTable("tb_grid_square_list", "idmap", "mapdesc", "assigned_to");
                
                // Wait for changes in the download progress and display the Download progress bar
                $timeout(function () {
                    $scope.progress = DownloadPatrolFormDataService.getDownloadProgress();
                    //alert("$scope.gridSquareDataDownloaded: " + $scope.gridSquareDataDownloaded);
                }, 500);
            }
        }

        //alert("Transformer Download...");
        //alert("SharedProperties.getTransformerDataDownloaded(): " + SharedProperties.getTransformerDataDownloaded());
        if (SharedProperties.getTransformerDataDownloaded() == false) {
            if (navigator.onLine) {
                // Init Transformer table
                DownloadPatrolFormDataService.initTransformerTable("tb_transformer_list", "idtransformer", "transformerdesc", "mapid", "assignedto");

                // Wait for changes in the download progress and display the Download progress bar
                $timeout(function () {
                    $scope.progress = DownloadPatrolFormDataService.getDownloadProgress();
                    //alert("$scope.transformerDataDownloaded: " + $scope.transformerDataDownloaded);
                }, 500);
            }
        }

        //alert("Pole Download...");
        //alert("SharedProperties.getPoleDataDownloaded(): " + SharedProperties.getPoleDataDownloaded());
        if (SharedProperties.getPoleDataDownloaded() == false) {
            if (navigator.onLine) {
                // Init Pole table
                DownloadPatrolFormDataService.initPoleTable("tb_pole_list", "idpole", "polekey", "polenum", "idtransformer");

                // Wait for changes in the download progress and display the Download progress bar
                $timeout(function () {
                    $scope.progress = DownloadPatrolFormDataService.getDownloadProgress();
                    //alert("$scope.poleDataDownloaded: " + $scope.poleDataDownloaded);
                }, 500);
            }
        }

        //alert("Form Fields Download...");
        //alert("SharedProperties.getFormFieldDataDownloaded(): " + SharedProperties.getFormFieldDataDownloaded());
        if (SharedProperties.getFormFieldDataDownloaded() == false) {
            if (navigator.onLine) {
                // Init Form Field tables
                DownloadPatrolFormDataService.initFormFieldTables();

                // Wait for changes in the download progress and display the Download progress bar
                $timeout(function () {
                    $scope.progress = DownloadPatrolFormDataService.getDownloadProgress();
                }, 500);
            }
        }



        //if (SharedProperties.getGridSquareDataDownloaded() == false) {
        //    // Create the Tables if Newtwork Connection
        //    if (navigator.onLine) {
        //        // Create the Grid Square, Transformer and Pole Tables
        //        DownloadPatrolFormDataService.initGridSquareTable("tb_grid_square_list", "idmap", "mapdesc", "assigned_to");
        //        DownloadPatrolFormDataService.initTransformerTable("tb_transformer_list", "idtransformer", "transformerdesc", "mapid", "assignedto");
        //        DownloadPatrolFormDataService.initPoleTable("tb_pole_list", "idpole", "polekey", "polenum", "idtransformer");
        //        DownloadPatrolFormDataService.initFormFieldTables();

        //        SharedProperties.setDownloadConfirmation(true);

        //        // Display the progress bar
        //        $interval(function () {
        //            $scope.downloadingUpdates = true;
        //        }, 500);


        //        // Wait for changes in the download progress and display the Download progress bar
        //        $interval(function () {
        //            $scope.progress = DownloadPatrolFormDataService.getDownloadProgress();
        //        }, 500);
        //    }
        //}
        //else {
        //    alert("All updates up to date. No new updates available at this time. Please check back later.")

        //}
    }
});

