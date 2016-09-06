// Get the main app.js module and inject the SharedProperties service
var oneZeroSixDefect = angular.module("oneZeroSixDefectController", []);
oneZeroSixDefect.controller("OneZeroSixDefectController", function ($scope, $http, SharedProperties, NetworkConnection, CreateLocalStorageTablesService) {
    // Patrol form variables
    $scope.gridSquareID = SharedProperties.getGridSquareID();
    $scope.transformerID = SharedProperties.getTransformerID();
    $scope.poleID = SharedProperties.getPoleID();
    $scope.userName = SharedProperties.getUserName();
    $scope.userID = SharedProperties.getUserID();


    // Variables to hold localStorage API-populated Form select options data
    $scope.GridSquareArray = [];


    // Initialising Database variable
    var db;

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

        // Create the localStorage Table for storing the 106 data
        CreateLocalStorageTablesService.createOneZeroSixTable("tb_one_zero_six", "grid_square_id", "transformer_id", "pole_id", "patroller_id", "no_defect_no_solution", "defect_description", "insufficient_clearance", "actual_clearanceLocation", "actual_clearance_value", "voltage_line", "voltage_type", "conductor", "risk_code_land", "risk_code_bare_covered", "risk_code_vandalism", "conductor_type", "day", "month", "year", "comments", "land_owner_name", "land_owner_address", "land_owner_tel", "land_owner_informed", "speed_limit", "bt_on_pole", "photo");


        // Query the localStorage API-populated tables to get the Form select values
        db.transaction(queryGridSquareDatabase, errorCB, successCB);
        //db.transaction(queryTransformerDatabase, errorCB, successCB);
        //db.transaction(queryPoleDatabase, errorCB, successCB);
        
        // Varable to hold the filtered results
        $scope.filter = {};
    }

    /* ******************** Grid Square Query ******************** */
    function queryGridSquareDatabase(tx) {
        tx.executeSql('SELECT * FROM tb_grid_square_list', [], queryGridSquareSuccess, errorCB);
    }

    // Query the success callback
    function queryGridSquareSuccess(tx, results) {
        var len = results.rows.length;

        // There are no records in the Database
        if (len == 0) {
            alert("There are no records in the Griod Square Database");
        }
        else {
            for (var i = 0; i < len; i++) {
                $scope.GridSquareArray.push(results.rows.item(i));
            }
            //alert("Grid Square Array - Len: " + $scope.GridSquareArray.length);
        }
    }


    function createOneZeroSixTable (tableName) {

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



    // Drop Down List Arrays
    // No Defect No Solution
    $scope.NoDefectNoSolution = [{
        noDefectNoSolutionDesc: "No defect",
        noDefectNoSolutionID: "1"
    }, {
        noDefectNoSolutionDesc: "No solution",
        noDefectNoSolutionID: "2"
    }];













});