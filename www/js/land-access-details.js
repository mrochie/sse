// This is a JavaScript file

// Get the main app.js module and inject the SharedProperties service
var landAccessDetails = angular.module("landAccessDetailsController", []);
landAccessDetails.controller("LandAccessDetailsController", function ($scope, $http, $timeout, SharedProperties)
{
    // Initialising Database variable
    var db;

    // Initialise UI logic
    $scope.showPatrolForm = false;

    // Variables to hold localStorage API-populated Form select options data
    $scope.GridSquareArray = [];
    $scope.TransformerArray = [];
    $scope.PoleArray = [];
   


    // Initialise
    var init = function () {
        document.addEventListener("deviceready", onDeviceReady, false);
    };

    // Fire init() after definition
    init();

    // Device APIs are available
    function onDeviceReady() {
        // Open connection to Database
        db = window.openDatabase("tliphp", "1.0", "TLI Rapid", 200000);

        // Create the localStorage tables for storing the Patrol data
        db.transaction(createLandAccessTable, errorCB, successCB);

        // Query the localStorage API-populated tables to get the Form select values
        db.transaction(queryGridSquareDatabase, errorCB, successCB);
        db.transaction(queryTransformerDatabase, errorCB, successCB);
        db.transaction(queryPoleDatabase, errorCB, successCB);
       

        // Varable to hold the filtered results
        $scope.filter = {};
  
    }

    /* ******************** Create Land Access Table ******************** */
    // Create the Land Access Table
    function createLandAccessTable(tx) {
        tx.executeSql('DROP TABLE IF EXISTS tb_land_access');
        tx.executeSql('CREATE TABLE IF NOT EXISTS tb_land_access (grid_square_id PRIMARY KEY, transformer_id, pole_id, power_cut_duration, time, hour, mins, date, month, year, preferred_day, name, customer_comments, email, home_tel, mobile_tel, status, meter_location, meter_access_required, type_of_work, work_on_property, renew_to_meter, type_of_access, access_allowed_pre_shutdown, access_allowed_pre_shutdown_comments, access_egress_photo, access_egress_comments, additional_comments )');
    }

    /* ******************** Grid Square Query ******************** */
    // Query the Grid Square database
    function queryGridSquareDatabase(tx) {
        tx.executeSql('SELECT * FROM tb_grid_square_list', [], queryGridSquareSuccess, errorCB);
    }

    // Query the success callback
    function queryGridSquareSuccess(tx, results) {
        var len = results.rows.length;
        //alert("Grid Square Database Length: " + len);

        // There are no records in the Database
        if (len == 0) {
            // Dont show the Patrol form
            $timeout(function () {
                $scope.showPatrolForm = false;
            }, 1)
        }
        else {
            // There are records in the Database - Show the patrol form
            $timeout(function () {
                $scope.showPatrolForm = true;
            }, 1)

            // Loop through the Database "results" array object
            for (var i = 0; i < len; i++) {
                // Add each object to new Array
                $scope.GridSquareArray.push(results.rows.item(i));
            }
            //alert("Grid Square Array - Len: " + $scope.GridSquareArray.length);
        }
    }

    /* ******************** Transformer Query ******************** */
    // Query the Transformer database
    function queryTransformerDatabase(tx) {
        tx.executeSql('SELECT * FROM tb_transformer_list', [], queryTransformerDatabaseSuccess, errorCB);
    }

    // Query the success callback
    function queryTransformerDatabaseSuccess(tx, results) {
        var len = results.rows.length;
        //alert("Transformer Database Length: " + len);

        // There are no records in the Database
        if (len == 0) {
            // Dont show the Patrol form
            $timeout(function () {
                $scope.showPatrolForm = false;
            }, 1)
        }
        else {
            // There are records in the Database - Show the patrol form
            $timeout(function () {
                $scope.showPatrolForm = true;
            }, 1)

            // Loop through the Database "results" array object
            for (var i = 0; i < len; i++) {
                // Add each object to new Array
                $scope.TransformerArray.push(results.rows.item(i));
            }
            //alert("TransformerArray - Len: " + $scope.TransformerArray.length);
        }
    }

    /* ******************** Pole Query ******************** */
    // Query the Pole database
    function queryPoleDatabase(tx) {
        tx.executeSql('SELECT * FROM tb_pole_list', [], queryPoleDatabaseSuccess, errorCB);
    }

    // Query the success callback
    function queryPoleDatabaseSuccess(tx, results) {
        var len = results.rows.length;
        //alert("Pole Database Length: " + len);

        // There are no records in the Database
        if (len == 0) {
            //alert("Pole Database Length: " + len);
        }
        else {
            // Loop through the Database "results" array object
            for (var i = 0; i < len; i++) {
                // Add each object to new Array
                $scope.PoleArray.push(results.rows.item(i));
            }
            //alert("PoleArray - Length: " + $scope.PoleArray.length);
        }
    }


    


    // Transaction error callback
    function errorCB(err) {
        alert("Error processing SQL with ERROR CODE: " + err.code + " ERROR MESSAGE: " + err.message);
    }

    // Transaction success callback
    function successCB() {
        console.log("Success CB...returning true...");
        return true;
    }
});