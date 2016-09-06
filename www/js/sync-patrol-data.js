// Get the main app.js module and inject the SharedProperties service
var syncPatrolData = angular.module("syncPatrolDataController", []);
syncPatrolData.controller("SyncPatrolDataController", function($scope, $http, $timeout, $interval, SharedProperties, DownloadPatrolFormDataService, NetworkConnection)
{
    // Initialising Database variable
    var db;

    // Variable to show UI whether Patro data exists or not
    $scope.showPatrolDataUI = false;

    // Variable to hold the completed patrol Details
    $scope.completedPatrolDetails = [];
    $scope.completedPatrolPole = [];


    
    // Initialise
    var init = function ()
    {
        // Wait for the device API libraries to load
        document.addEventListener("deviceready", onDeviceReady, false);
    };

    // Fire init() after definition
    init();

    // Device APIs are available
    function onDeviceReady()
    {
        // Open connection to Database
        db = window.openDatabase("tliphp", "1.0", "TLI Rapid", 200000);

        // Wait for changes in the download progress and display the Download progress bar
        $interval(function () {
            $scope.progress = DownloadPatrolFormDataService.getDownloadProgress();
        }, 500);

        //alert("Calling this...");
        //queryPatrolTable("tb_patrol_header");
        queryPatrolTable("tb_patrol_details");
    }


    // Query the Header database
    function queryPatrolTable(tableName) {
        //alert("queryPatrolHeaderTable()...");
        var sql = 'SELECT * FROM ' + tableName;
        //alert("SQL: " + sql);
        db.transaction(function (tx) {
            tx.executeSql(sql, [], queryPatrolTableSuccess, queryPatrolTableError);
        });
    }

    // Query the success callback
    function queryPatrolTableSuccess(tx, results) {
        var len = results.rows.length;
        //alert("Query Patrol Table Length: " + len);

        if (len == 0) {
            //alert("There are no values in the Database...");
        }
        else {
            // Display the Patrol UI
            $timeout(function () {
                $scope.showPatrolDataUI = true;
            }, 1);

            for (var i = 0; i < len; i++) {
                /*
                //alert("Item: " + results.rows.item(i));
                alert("Grid Square: " + results.rows.item(i).grid_square_id);
                alert("Transformer ID: " + results.rows.item(i).transformer_id);
                alert("Isolation Point ID: " + results.rows.item(i).isolation_point_id);
                alert("Isolation Point Comment: " + results.rows.item(i).isolation_point_comments);
                alert("Normally Open Point: " + results.rows.item(i).normally_open_point_id);
                alert("Normally Open Point Checked: " + results.rows.item(i).normally_open_point_checked_id);
                alert("Normally Open Point Comment: " + results.rows.item(i).normally_open_point_comments);
                alert("Patroller ID: " + results.rows.item(i).patroller_id);
                alert("Patrol Date: " + results.rows.item(i).patrol_date);
                */

                /*
                alert("Pole Key ID: " + results.rows.item(i).pole_key_id);
                alert("Pole Number - Changed: " + results.rows.item(i).pole_number);
                alert("Pole Change Required: " + results.rows.item(i).pole_change_required);
                alert("Pole Change Reason: " + results.rows.item(i).pole_change_reason);
                alert("Pole Type: " + results.rows.item(i).pole_type);
                alert("Poling Options: " + results.rows.item(i).poling_option);
                alert("Height: " + results.rows.item(i).height);
                alert("Length: " + results.rows.item(i).length);
                alert("Surface Type: " + results.rows.item(i).surface_type);
                alert("Excavation Method: " + results.rows.item(i).excavation_method);
                alert("Machinery Required: " + results.rows.item(i).machinery_required);
                alert("Mainline Conductor Change Required: " + results.rows.item(i).mainline_conductor_change_required);
                alert("Service Change Required: " + results.rows.item(i).service_change_required);
                alert("Number of Services: " + results.rows.item(i).no_of_services);
                alert("Quantity 1: " + results.rows.item(i).quantity_1);
                alert("Quantity 2: " + results.rows.item(i).quantity_2);
                alert("House No: " + results.rows.item(i).house_no);
                alert("Street: " + results.rows.item(i).street_name);
                alert("Service Type - One: " + results.rows.item(i).service_type_one);
                alert("Service Type - Two: " + results.rows.item(i).service_type_two);
                alert("Existing Conductor Type: " + results.rows.item(i).existing_conductor_type);
                alert("Cable Type: " + results.rows.item(i).cable_type);
                alert("New Conductor Type: " + results.rows.item(i).new_conductor_type);
                alert("Land Access Required: " + results.rows.item(i).land_access_required);
                */




                // Add the localStorage Table data to the array for display in view
                $scope.completedPatrolPole.push(results.rows.item(i));
                //alert("Array: " + $scope.completedPatrolPole);
            }
        }
    }

    // Query Error Callback
    function queryPatrolTableError(tx, err) {
        //alert("No previous patrol details currently available. Please complete a patrol to sync data.\n\nError Code: " + err.code + ".\nError Message: " + err.message);
    }





    $scope.getDetailsAndPushPage = function (poleID, nextPage) {
        // Set the Pole ID
        SharedProperties.setSelectedPoleID(poleID);
        //alert("SharedProperties.getSelectedPoleID(): " + SharedProperties.getSelectedPoleID());

        // Navigate to the next page
        var element = document.querySelector("ons-navigator");
        var scope = angular.element(element).scope();
        scope.myNavigator.pushPage(nextPage);
    }

    


    // If there is a Network Connection...
    if (navigator.onLine)
    {
        // Get the list of Grid Square(s) assigned by passing Employee ID to API
    }
    else
    {
        // Unable to sync
        console.log("No Network Connection available. Unable to sync.");
    }
});