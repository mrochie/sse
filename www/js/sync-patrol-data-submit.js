// Get the main app.js module and inject the SharedProperties service
var syncPatrolDataSubmit = angular.module("syncPatrolDataSubmitController", []);
syncPatrolDataSubmit.controller("SyncPatrolDataSubmitController", function($scope, $http, SharedProperties, NetworkConnection) {
    $scope.online = navigator.onLine;

    // Initialising Database variable
    var db;

    // Variable to show UI whether Patro data exists or not
    $scope.showPatrolDataUI = false;

    // Variable to hold the completed patrol Details
    $scope.completedPatrolDetails = [];

    // Initialise
    var init = function () {
        document.addEventListener("deviceready", onDeviceReady, false);
    };

    // Fire init() after definition
    init();

    // Device APIs are available
    function onDeviceReady() {
        db = window.openDatabase("tliphp", "1.0", "TLI Rapid", 200000);

        // Check for Network connection
        if (navigator.onLine) {
            //alert("Calling this...");
            submitHeaderData("tb_patrol_header");
            submitDetailsData("tb_patrol_details");
            submitTasksData("tb_patrol_tasks");
            submitWIRAData("tb_wira");
        }
        else {
            alert("You need a active Network connection to sync Patrol data. Please make sure you have a active Network connection before attempting this operation again.")
        }
    }




    // Query the Header database
    function submitHeaderData(tableName) {
        var sql = 'SELECT * FROM ' + tableName;
        //alert("SQL: " + sql);
        db.transaction(function (tx) {
            tx.executeSql(sql, [], queryHeaderSuccess, queryHeaderError);
        });
    }

    // Query the success callback
    function queryHeaderSuccess(tx, results) {
        var len = results.rows.length;
        //alert("Query Header Database Length: " + len);

        if (len == 0) {
            alert("There are no values in the Database...");
        }
        else {
            for (var i = 0; i < len; i++) {
                /*
                alert("Grid Square ID: " + results.rows.item(i).grid_square_id);
                alert("Transformer ID: " + results.rows.item(i).transformer_id);
                alert("IsolationPoint ID: " + results.rows.item(i).isolation_point_id);
                alert("Isolation Point Comments: " + results.rows.item(i).isolation_point_comments);
                alert("Isolation Point Photo: " + results.rows.item(i).isolation_point_photo);
                alert("Normally Open Point: " + results.rows.item(i).normally_open_point_id);
                alert("Normally Open Point Checked ID: " + results.rows.item(i).normally_open_point_checked_id);
                alert("Normally Open Point Comments: " + results.rows.item(i).normally_open_point_comments);
                alert("Normally Open Point Photo: " + results.rows.item(i).normally_open_point_photo);
                alert("Patroller ID: " + results.rows.item(i).patroller_id);
                alert("Patrol Date: " + results.rows.item(i).patrol_date);
                */
                //alert("Submitting JSON...");

                // Create the JSON object
                $scope.jsonToBeSubmitted = {
                    "grid_square_id": results.rows.item(i).grid_square_id,
                    "transformer_id": results.rows.item(i).transformer_id,
                    "isolation_point_id": results.rows.item(i).isolation_point_id,
                    "isolation_point_comments": results.rows.item(i).isolation_point_comments,
                    "isolation_point_photo": results.rows.item(i).isolation_point_photo,
                    "normally_open_point_id": results.rows.item(i).normally_open_point_id,
                    "normally_open_point_photo": results.rows.item(i).normally_open_point_photo,
                    "normally_open_point_checked_id": results.rows.item(i).normally_open_point_checked_id,
                    "normally_open_point_comments": results.rows.item(i).normally_open_point_comments,
                    "patroller_id": results.rows.item(i).patroller_id,
                    "patrol_date": results.rows.item(i).patrol_date
                };

                // Send JSON to Database
                $http({
                    url: 'http://rapid.tli.ie:8081/public/sseapi/savepatrolheader.php',
                    method: "POST",
                    data: $scope.jsonToBeSubmitted,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                .success(function (data, status, headers, config) {
                    alert("Header Submission Successful.\n\nSubmit Success: " + data);





                    var sql = 'DELETE FROM tb_patrol_header';
                    //alert("Delete SQL: " + sql);
                    db.transaction(function (tx) {
                        tx.executeSql(sql);
                    });



                    



                    //alert("Success - Status: " + status);
                    //alert("Success - Headers: " + headers);
                    //alert("Success - Config: " + config);
                })
                .error(function (data, status, headers, config) {
                    alert("A submission error has occured. Please report the following information to the TLI Development team.\n\nHTTP Error: " + status + "\n\nError - Data: " + data + "\n\nError - Headers: " + headers + "\n\nError - Config: " + config);
                    //alert("Error - HTTP Error: " + status);
                    //alert("Error - Data: " + data);
                    //alert("Error - Headers: " + headers);
                    //alert("Error - Config: " + config);
                });
            }
        }
    }

    // Query Error Callback
    function queryHeaderError(err) {
        alert("Error processing SQL query with Error Code: " + err + ". Error Message: " + err);
    }

























    // Query the Details
    function submitDetailsData(tableName) {
        var sql = 'SELECT * FROM ' + tableName;
        //alert("SQL: " + sql);
        db.transaction(function (tx) {
            tx.executeSql(sql, [], queryDetailsSuccess, queryDetailsError);
        });
    }

    // Query the success callback
    function queryDetailsSuccess(tx, results) {
        var len = results.rows.length;
        //alert("Query Header Database Length: " + len);

        if (len == 0) {
            alert("There are no values in the Database...");
        }
        else {
            for (var i = 0; i < len; i++) {
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

                //alert("Submitting JSON...");

                // Create the JSON object
                $scope.jsonToBeSubmitted = {
                    "pole_key_id": results.rows.item(i).pole_key_id,
                    "pole_number": results.rows.item(i).pole_number,
                    "pole_change_required": results.rows.item(i).pole_change_required,
                    "pole_change_reason": results.rows.item(i).pole_change_reason,
                    "pole_type": results.rows.item(i).pole_type,
                    "poling_option": results.rows.item(i).poling_option,
                    "height": results.rows.item(i).height,
                    "length": results.rows.item(i).length,
                    "surface_type": results.rows.item(i).surface_type,
                    "excavation_method": results.rows.item(i).excavation_method,
                    "machinery_required": results.rows.item(i).machinery_required,
                    "mainline_conductor_change_required": results.rows.item(i).mainline_conductor_change_required,
                    "service_change_required": results.rows.item(i).service_change_required,
                    "no_of_services": results.rows.item(i).no_of_services,
                    "quantity_1": results.rows.item(i).quantity_1,
                    "quantity_2": results.rows.item(i).quantity_2,
                    "house_no": results.rows.item(i).house_no,
                    "street_name": results.rows.item(i).street_name,
                    "service_type_one": results.rows.item(i).service_type_one,
                    "service_type_two": results.rows.item(i).service_type_two,
                    "existing_conductor_type": results.rows.item(i).existing_conductor_type,
                    "cable_type": results.rows.item(i).cable_type,
                    "new_conductor_type": results.rows.item(i).new_conductor_type,
                    "land_access_required": results.rows.item(i).land_access_required
                };

                // Send JSON to Database
                $http({
                    url: 'http://rapid.tli.ie:8081/public/sseapi/savepatroldetails.php',
                    method: "POST",
                    data: $scope.jsonToBeSubmitted,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                .success(function (data, status, headers, config) {
                    alert("Details Submission Successful.\n\nSubmit Success: " + data);

                    var sql = 'DELETE FROM tb_patrol_details';
                    //alert("Delete SQL: " + sql);
                    db.transaction(function (tx) {
                        tx.executeSql(sql);
                    });



                    //alert("Success - Status: " + status);
                    //alert("Success - Headers: " + headers);
                    //alert("Success - Config: " + config);
                })
                .error(function (data, status, headers, config) {
                    alert("A submission error has occured. Please report the following information to the TLI Development team.\n\nHTTP Error: " + status + "\n\nError - Data: " + data + "\n\nError - Headers: " + headers + "\n\nError - Config: " + config);
                    //alert("Error - HTTP Error: " + status);
                    //alert("Error - Data: " + data);
                    //alert("Error - Headers: " + headers);
                    //alert("Error - Config: " + config);
                });
            }
        }
    }

    // Query Error Callback
    function queryDetailsError(err) {
        alert("Error processing SQL query with Error Code: " + err + ". Error Message: " + err);
    }

























    // Query the Tasks
    function submitTasksData(tableName) {
        var sql = 'SELECT * FROM ' + tableName;
        //alert("SQL: " + sql);
        db.transaction(function (tx) {
            tx.executeSql(sql, [], queryTasksSuccess, queryTasksError);
        });
    }

    // Query the success callback
    function queryTasksSuccess(tx, results) {
        var len = results.rows.length;
        //alert("Query Tasks Database Length: " + len);

        if (len == 0) {
            alert("There are no values in the Database...");
        }
        else {
            for (var i = 0; i < len; i++) {
                //alert("Pole ID: " + results.rows.item(i).pole_number);
                //alert("Pole Task ID: " + results.rows.item(i).pole_task_id);
                //alert("Pole Task Value ID: " + results.rows.item(i).pole_task_value);

                //alert("Submitting JSON...");

                // Create the JSON object
                $scope.jsonToBeSubmitted = {
                    "pole_number": results.rows.item(i).pole_number,
                    "pole_task_id": results.rows.item(i).pole_task_id,
                    "pole_task_value": results.rows.item(i).pole_task_value
                };

                //alert("JSON to be submitted: " + $scope.jsonToBeSubmitted);
                //alert("JSON Stringify(): " + JSON.stringify($scope.jsonToBeSubmitted));

                $scope.jsonData = JSON.stringify($scope.jsonToBeSubmitted);
                //alert("JSON Data: " + $scope.jsonData);


                // Send JSON to Database
                $http({
                    url: 'http://rapid.tli.ie:8081/public/sseapi/savepoletasks.php',
                    method: "POST",
                    data: $scope.jsonData,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                .success(function (data, status, headers, config) {
                    alert("Tasks Submission Successful.\n\nSubmit Success: " + data);


                    var sql = 'DELETE FROM tb_patrol_tasks';
                    //alert("Delete SQL: " + sql);
                    db.transaction(function (tx) {
                        tx.executeSql(sql);
                    });

                    //alert("Success - Status: " + status);
                    //alert("Success - Headers: " + headers);
                    //alert("Success - Config: " + config);
                })
                .error(function (data, status, headers, config) {
                    alert("A submission error has occured. Please report the following information to the TLI Development team.\n\nHTTP Error: " + status + "\n\nError - Data: " + data + "\n\nError - Headers: " + headers + "\n\nError - Config: " + config);
                    //alert("Error - HTTP Error: " + status);
                    //alert("Error - Data: " + data);
                    //alert("Error - Headers: " + headers);
                    //alert("Error - Config: " + config);
                });
            }
        }
    }

    // Query Error Callback
    function queryTasksError(err) {
        alert("Error processing SQL query with Error Code: " + err + ". Error Message: " + err);
    }

























    // Query the WIRA
    function submitWIRAData(tableName) {
        var sql = 'SELECT * FROM ' + tableName;
        //alert("SQL: " + sql);
        db.transaction(function (tx) {
            tx.executeSql(sql, [], queryWIRASuccess, queryWIRAError);
        });
    }

    // Query the success callback
    function queryWIRASuccess(tx, results) {
        var len = results.rows.length;
        //alert("Query WIRA Database Length: " + len);

        if (len == 0) {
            alert("There are no values in the Database...");
        }
        else {
            for (var i = 0; i < len; i++) {
                //alert("Pole ID: " + results.rows.item(i).pole_number);
                //alert("Pole Task ID: " + results.rows.item(i).pole_task_id);
                //alert("Pole Task Value ID: " + results.rows.item(i).pole_task_value);

                //alert("Submitting JSON...");

                // Create the JSON object
                $scope.jsonToBeSubmitted = {
                    "grid_square_id": results.rows.item(i).grid_square_id,
                    "transformer_id": results.rows.item(i).transformer_id,
                    "pole_id": results.rows.item(i).pole_id,
                    "location_and_activity": results.rows.item(i).location_and_activity,
                    "esqcr_issues": results.rows.item(i).esqcr_issues,
                    "day": results.rows.item(i).day,
                    "month": results.rows.item(i).month,
                    "year": results.rows.item(i).year,
                    "patroller_id": results.rows.item(i).patroller_id,
                    "road_schematic": results.rows.item(i).road_schematic,
                    "road_type": results.rows.item(i).road_type,
                    "road_width": results.rows.item(i).road_width,
                    "speed_limit": results.rows.item(i).speed_limit,
                    "environment": results.rows.item(i).environment,
                    "traffic_volume": results.rows.item(i).traffic_volume,
                    "footpath_diversion": results.rows.item(i).footpath_diversion,
                    "traffic_management_selection": results.rows.item(i).traffic_management_selection,
                    "comments": results.rows.item(i).comments
                };

                //alert("JSON to be submitted: " + $scope.jsonToBeSubmitted);
                //alert("JSON Stringify(): " + JSON.stringify($scope.jsonToBeSubmitted));

                $scope.jsonData = JSON.stringify($scope.jsonToBeSubmitted);
                //alert("JSON Data: " + $scope.jsonData);


                // Send JSON to Database
                $http({
                    url: 'http://rapid.tli.ie:8081/public/sseapi/savewira.php',
                    method: "POST",
                    data: $scope.jsonData,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                .success(function (data, status, headers, config) {
                    alert("WIRA Submission Successful.\n\nSubmit Success: " + data);

                    var sql = 'DELETE FROM tb_wira';
                    //alert("Delete SQL: " + sql);
                    db.transaction(function (tx) {
                        tx.executeSql(sql);
                    });


                    
                    //alert("Success - Status: " + status);
                    //alert("Success - Headers: " + headers);
                    //alert("Success - Config: " + config);
                })
                .error(function (data, status, headers, config) {
                    alert("A submission error has occured. Please report the following information to the TLI Development team.\n\nHTTP Error: " + status + "\n\nError - Data: " + data + "\n\nError - Headers: " + headers + "\n\nError - Config: " + config);
                    //alert("Error - HTTP Error: " + status);
                    //alert("Error - Data: " + data);
                    //alert("Error - Headers: " + headers);
                    //alert("Error - Config: " + config);
                });
            }
        }
    }

    // Query Error Callback
    function queryWIRAError(err) {
        alert("Error processing SQL query with Error Code: " + err + ". Error Message: " + err);
    }
    
});
