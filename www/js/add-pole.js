// This is a JavaScript file

// Get the main app.js module and inject the SharedProperties service
var addAPole = angular.module("addAPoleController", []);
addAPole.controller("AddAPoleController", function ($scope, $http, $filter, $timeout, SharedProperties, NetworkConnection, CreateLocalStorageTablesService) {

    // Initialising Database variable
    var db;

    // Initialise UI logic
    $scope.showPatrolForm = false;

    // Variables to hold localStorage Tables data - to be able to access from view
    $scope.GridSquareArray = [];
    $scope.TransformerArray = [];
    $scope.PoleArray = [];

    // Show Pole association
    $scope.poleAdded = false;
    
    // Create Table names and associated Array names
    $scope.tableArrayAssociation = [{
        tablename: "tb_grid_square_list",
        arrayname: "GridSquareArray"
    }, {
        tablename: "tb_transformer_list",
        arrayname: "TransformerArray"
    }, {
        tablename: "tb_pole_list",
        arrayname: "PoleArray"
    }];

    // Initialise
    var init = function () {
        document.addEventListener("deviceready", onDeviceReady, false);
    };

    // Fire init() after definition
    init();

    // Device APIs are available
    function onDeviceReady() {
        db = window.openDatabase("tliphp", "1.0", "TLI Rapid", 200000);

        // Get date
        getDate();

        // Query the localStorage API - populated Tables to get the Form select values
        queryLocalStorageTablesAndBuildArrays($scope.tableArrayAssociation);
    }



    // Get and set the Date
    function getDate() {
        $scope.date = new Date();
        $scope.patrolDate = $filter('date')(new Date(), 'yyyy-MM-dd');
        SharedProperties.setPatrolDate($scope.patrolDate);
    }






    // Get the data from the local Storage Tables and populate the local variable Arrays to populate the views 
    function queryLocalStorageTablesAndBuildArrays(tableArrayAssociation) {
        // Loop through the Table/Array Association array
        for (var i = 0; i < $scope.tableArrayAssociation.length; i++) {
            queryTable($scope.tableArrayAssociation[i].tablename, $scope.tableArrayAssociation[i].arrayname);
        }
    }

    // Query the Tables
    function queryTable(tableName, arrayName) {
        var sql = 'SELECT * FROM ' + tableName + '';
        db.transaction(function (tx) {
            tx.executeSql(sql, [],
                (function (arrayName) {
                    return function (tx, results) {
                        querySuccess(tx, results, arrayName);
                    };
                })(arrayName), queryError);
        });
    }

    // Query Success Callback
    function querySuccess(tx, results, arrayName) {
        // There are no records in the Database
        if (results.rows.length == 0) {
            // Dont show the Patrol form
            $timeout(function () {
                $scope.showPatrolForm = false;
            }, 1);
        }
        else {
            // There are records in the Database - Show the patrol form
            $timeout(function () {
                $scope.showPatrolForm = true;
            }, 1);
        }

        for (var i = 0; i < results.rows.length; i++) {
            $scope[arrayName].push(results.rows.item(i));
        }
    }

    // Query Error Callback
    function queryError(tx, err) {
        //alert("ERROR!\n\nUnable to access local storage tables to build drop-down list options. Please close the app and try again. " + 
        //    "If the problem persists, please contact the TLI development team, quoting Error Code and Error Message below.\n\nError Code: " + err.code + ".\nError Message: " + err.message);
    }




    // Watch for changes in the Pole Number text field
    $scope.$watch("newPoleNumber", function (newVal, oldVal) {
        if (newVal !== oldVal) {
            SharedProperties.setAddedPoleNumber(newVal);
            //alert("Added Pole Number: " + SharedProperties.getAddedPoleNumber());
        }
    });


    // Get selected Header values from Form
    $scope.changedValue = function (selectedValue, identifier) {
        switch (identifier) {
            case "GridSquare":
                //SharedProperties.setGridSquareID(selectedValue);
                break;

            case "Transformer":
                SharedProperties.setTransformerID(selectedValue);
                
                //var sql = 'INSERT OR IGNORE INTO tb_patrol_header (grid_square_id, transformer_id, patroller_id, patrol_date) VALUES (' + SharedProperties.getGridSquareID() + ', ' + +SharedProperties.getTransformerID() + ', ' + SharedProperties.getUserID() + ', "' + SharedProperties.getPatrolDate() + '")';
                //alert("Transformer SQL: " + sql)
               // db.transaction(function (tx) { tx.executeSql(sql); });
                //queryFormInputTable("tb_patrol_header");
                break;

                /* *********************** Pole *********************** */
                
            case "Pole":
                SharedProperties.setPoleID(selectedValue);
                break;

            default:
        }
    }

    // Query the Form Input Data Tables
    function queryFormInputTable(tableName) {
        var sql = 'SELECT * FROM ' + tableName;
        //alert("Select SQL: " + sql);
        db.transaction(function (tx) {
            tx.executeSql(sql, [], queryFormInputSuccess, queryFormInputError);
        });
    }

    // Query Success Callback
    function queryFormInputSuccess(tx, results) {
        //alert("Add a Pole - Length: " + results.rows.length);

        for (var i = 0; i < results.rows.length; i++) {
            // CHECK tb_pole_list
            if (i >= 83) {
                //alert("idpole #" + i + ": " + results.rows.item(i).idpole);
                //alert("polekey #" + i + ": " + results.rows.item(i).polekey);
                //alert("polenum #" + i + ": " + results.rows.item(i).polenum);
                //alert("idtransformer #" + i + ": " + results.rows.item(i).idtransformer);
            }
            

            // HEADER DATA CHECKS 
            //alert("Grid Square: " + results.rows.item(i).grid_square_id);
            //alert("Transformer ID: " + results.rows.item(i).transformer_id);
            //alert("Isolation Point ID: " + results.rows.item(i).isolation_point_id);
            //alert("Isolation Point Comment: " + results.rows.item(i).isolation_point_comments);
            //alert("Normally Open Point: " + results.rows.item(i).normally_open_point_id);
            //alert("Normally Open Point Checked: " + results.rows.item(i).normally_open_point_checked_id);
            //alert("Normally Open Point Comment: " + results.rows.item(i).normally_open_point_comments);
            //alert("Patroller ID: " + results.rows.item(i).patroller_id);
            //alert("Patrol Date: " + results.rows.item(i).patrol_date);
            

            // DETAILS DATA CHECKS 
            //alert("Pole Key ID: " + results.rows.item(i).pole_key_id);
            //alert("Linked To: " + results.rows.item(i).linked_to);
            //alert("Pole Number - Changed: " + results.rows.item(i).pole_number);
            //alert("Pole Change Required: " + results.rows.item(i).pole_change_required);
            //alert("Pole Change Reason: " + results.rows.item(i).pole_change_reason);
            //alert("Pole Type: " + results.rows.item(i).pole_type);
            //alert("Poling Options: " + results.rows.item(i).poling_option);
            //alert("Height: " + results.rows.item(i).height);
            //alert("Length: " + results.rows.item(i).length);
            //alert("Surface Type: " + results.rows.item(i).surface_type);
            //alert("Excavation Method: " + results.rows.item(i).excavation_method);
            //alert("Machinery Required: " + results.rows.item(i).machinery_required);
            //alert("Mainline Conductor Change Required: " + results.rows.item(i).mainline_conductor_change_required);
            //alert("Service Change Required: " + results.rows.item(i).service_change_required);
            //alert("Number of Services: " + results.rows.item(i).no_of_services);
            //alert("Quantity 1: " + results.rows.item(i).quantity_1);
            //alert("Quantity 2: " + results.rows.item(i).quantity_2);
            //alert("House No: " + results.rows.item(i).house_no);
            //alert("Street: " + results.rows.item(i).street_name);
            //alert("Service Type - One: " + results.rows.item(i).service_type_one);
            //alert("Service Type - Two: " + results.rows.item(i).service_type_two);
            //alert("Existing Conductor Type: " + results.rows.item(i).existing_conductor_type);
            //alert("Cable Type: " + results.rows.item(i).cable_type);
            //alert("New Conductor Type: " + results.rows.item(i).new_conductor_type);
            //alert("Land Access Required: " + results.rows.item(i).land_access_required);
            

            // TASKS DATA CHECKS
            //alert("Pole ID: " + results.rows.item(i).pole_number);
            //alert("Pole Task ID: " + results.rows.item(i).pole_task_id);
            //alert("Pole Task Value: " + results.rows.item(i).pole_task_value);

            // Segue to the Add a Pole Confirmation page
            

        }

        var page = "add-pole-confirmation.html";
        var element = document.querySelector("ons-navigator");
        var scope = angular.element(element).scope();

        scope.myNavigator.pushPage(page);
    }

    // Query Error Callback
    function queryFormInputError(err) {
        alert("Error processing SQL query with Error Code: " + err.code + ". Error Message: " + err.message);
    }





    // Add a pole
    $scope.saveAddedPoleDetails = function () {
        if (SharedProperties.getAddedPoleNumber() == "") {
            alert("Please enter a Pole Number.");
        }
        else {


            //alert("SharedProperties.getTransformerID(): " + SharedProperties.getTransformerID());

            var sql = 'INSERT OR IGNORE INTO tb_pole_list (polekey, idtransformer) VALUES ("' + SharedProperties.getAddedPoleNumber() + '", ' + SharedProperties.getTransformerID() + ')';
            //alert("Pole SQL: " + sql)
            db.transaction(function (tx) { tx.executeSql(sql); });
            queryFormInputTable("tb_pole_list");
            






            //var sql = 'INSERT OR IGNORE INTO tb_patrol_details (pole_key_id) VALUES ("' + SharedProperties.getPoleID() + '")';
            //alert("SQL: " + sql);
            //db.transaction(function (tx) { tx.executeSql(sql); });
            //queryFormInputTable("tb_patrol_details");

            



            $timeout(function () {
                $scope.poleAdded = true;
            }, 1);
        }
    }

    


});