// Get the main app.js module and inject the SharedProperties service
var login = angular.module("loginController", []);
login.controller("LoginController", function($scope, $http, SharedProperties, NetworkConnection, $timeout)
{
    //var HOCKEY_APP_ID = "dda2f5c124ea4d5d8de6ce24dfac5e58";

    //NetworkTypeController.checkConnection();


    // Initialising the Booleans for User actions on view load
    $scope.showLoginUI = false;
    $scope.showEmployeeConfirmationUI = false;

    // Initialise API URL variables
    var employeeAPIURL = "http://rapid.tli.ie:8081/public/sseapi/loginSSE.php?userid=";

    // Initialising variables for Employee ID and Name to display in View 
    $scope.employeeID = "";
    $scope.employeeName = "";

    // Initialising Database variable
    var db;

    // Check if User details are stored in "Remember Me"
    var init = function ()
    {
        document.addEventListener("deviceready", onDeviceReady, false);
    };

    // Fire init() after definition
    init();

    // Cordova is ready
    function onDeviceReady()
    {
        //alert("App ID: " + HOCKEY_APP_ID);
        // Start the Hockey App Reporting tool
        //hockeyapp.start(null, null, "HOCKEY_APP_ID");


        db = window.openDatabase("tliphp", "1.0", "TLI Rapid", 200000);

        // Create the Table...
        createRememberMeTable("tb_remember_me", "employee_id", "employee_name");

        // ...then query the Table for any entries
        queryRememberMeTable("tb_remember_me")
    }


    // Create the Patrol Form Questions Tables 
    function createRememberMeTable(tableName, employeeID, employeeName) {
        //alert("Creating table: " + tableName);
        var sql = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + employeeID + ' INTEGER PRIMARY KEY, ' + employeeName + ')';
        //alert("SQL: " + sql);
        db.transaction(function (tx) {
            tx.executeSql(sql);
        });
    }

    // Query the Table tb_remember_me
    function queryRememberMeTable(tableName) {
        //alert("Querying table: " + tableName);
        var sql = 'SELECT * FROM ' + tableName + '';
        db.transaction(function (tx) {
            tx.executeSql(sql, [], querySuccess, queryError);
        });
    }

    // Query Success Callback
    function querySuccess(tx, results) {
        var len = results.rows.length;
        //alert("Length: " + len);

        // There are no values in the Table
        if (len == 0) {
            // Show the Login UI
            $timeout(function () {
                $scope.showLoginUI = true;
                $scope.showEmployeeConfirmationUI = false;
            }, 1);
        }
        else {
            // There is User values in the Table
            for (var i = 0; i < len; i++) {
                // Query the Table - Set Employee Name as local variable to display in Confirmation UI
                $scope.employeeName = results.rows.item(i).employee_name;
                //alert("Employee Name: " + $scope.employeeName);

                // Set User SharedProperties
                SharedProperties.setUserID(results.rows.item(i).employee_id);
                SharedProperties.setUserName(results.rows.item(i).employee_name);
                //alert("GET employee_id: " + SharedProperties.getUserID());
                //alert("GET employee_name: " + SharedProperties.getUserName());
            }

            // Show the User Confirmation UI
            $timeout(function () {
                $scope.showEmployeeConfirmationUI = true;
                $scope.showLoginUI = false;
            }, 1);
        }

        return len;
    }

    // Query Error Callback
    function queryError(err) {
        alert("Error processing SQL query with Error Code: " + err.code + ". Error Message: " + err.message);
    }


    // Display the modal based on whether a User details are valid or not
    $scope.userIDIsValid = false;

    /* Create new $scope because ngIf directive creates a child $scope. Using ng-model without the Dot Rule or controller-as-syntax will not work.
       To make it work, create a new object, e.g. */
    $scope.employeeIDModel = {};
    // Watch for changes in the User ID text field
    $scope.$watch("employeeIDModel.employeeID", function (newVal, oldVal) {
        if (newVal !== oldVal) {
            // Get the new text input value 
            $scope.employeeIDModel.newUserID = newVal;
            SharedProperties.setUserID($scope.employeeIDModel.newUserID);
            //alert("SharedProperties.getUserID(): " + SharedProperties.getUserID());
        }
    });

    // Validate the Employee login details
    $scope.validateLogin = function () {

        // Check for Network Connection
        if (!navigator.onLine) {
            // No Network connection
            alert("A Error has occured. No Network Connection detected and no Employee Login found on this device. \n\nPlease close the app and make sure there is a valid Network Connection before attempting this operation again.");
        }
        else {
            // Valid Network connection - Make the API call using the Employee ID
            if (SharedProperties.getUserID() !== "") {
                $http.get(employeeAPIURL + SharedProperties.getUserID() + "&location=2").then(
                    function success(response) {
                        //alert("Response Data - Employee Name: " + response.data[0].employee_name);
                        //alert("Response Data - Employee ID: " + response.data[0].employee_id);

                        // Checking if User ID -> Employee Name != 0
                        if (response.data[0].employee_name != "0") {
                            // Save the Employee Name
                            SharedProperties.setUserName(response.data[0].employee_name);
                            //alert("SharedProperties.getUserName(): " + SharedProperties.getUserName());

                            // Insert the resposne date into the Table    
                            angular.forEach(response.data, function (value, key) {
                                angular.forEach(value, function (v, k) {
                                    // Inner loop to return nested JSON objects
                                    //alert("Value: " + v);
                                    //alert("Key: " + k);

                                    //alert("Inserting into table...");
                                    var sql = 'INSERT OR IGNORE INTO tb_remember_me (employee_id, employee_name) VALUES (' + SharedProperties.getUserID() + ', "' + v + '")';
                                    //alert("SQL: " + sql);
                                    db.transaction(function (tx) {
                                        tx.executeSql(sql);
                                    });
                                });
                            });

                            queryRememberMeTable("tb_remember_me");
                        }
                        else {
                            // Employee ID not recognised
                            alert("ERROR.\n\nAn error has occured. The Employee ID has no been recognised. Please re-enter your Employee ID." +
                                "If the problem persists, please contact the TLI development team quoting the Error Code below.\n\nError Code: " + response);
                        }
                    },
                    function error(response) {
                        alert("ERROR. \n\nA $http connection error has occured. Please close the app and make sure you have a valid Network connection." +
                            "If the problem persists, please contact the TLI development team quoting the Error Code below.\n\nError Code: " + response);
                });
            }
            else {
                // No Employee ID exists or wrong ID entered
                alert("No Employee ID or invalid Employee ID detected. Please clsoe the application and try again. \n\nERROR MESSAGE: login.js => getUserID() == \"\"");
            }
        }
    };









    // Decline the Employee login details
    $scope.declineLogin = function () {
        // Reset the User ID and Name to default
        SharedProperties.setUserID("");
        SharedProperties.setUserName("");

        // Delete the data from the Table
        deleteEmployeeData("tb_remember_me");
    };

    // Delete the Employee Data Tables
    function deleteEmployeeData(tableName) {
        //alert("Deleting from the table: " + tableName);

        var sql = 'DELETE FROM ' + tableName + '';
        //alert("Delete SQL: " + sql);
        db.transaction(function (tx) {
            tx.executeSql(sql, [], queryDeleteSuccess, queryDeleteError);
        });
        
    }

    // Query Success Callback
    function queryDeleteSuccess(tx, results) {
        //alert("Query Delete success...");
        var len = results.rows.length;
        //alert("Length: " + len);

        // Reset the Form field
        $scope.employeeIDModel = {};
        $scope.loginForm.$setPristine(true);

        // Show the Login UI
        $timeout(function () {
            $scope.showLoginUI = true;
            $scope.showEmployeeConfirmationUI = false;
        }, 1);
    }

    // Query Error Callback
    function queryDeleteError(err) {
        alert("Error processing SQL query with Error Code: " + err.code + ". Error Message: " + err.message);
    }
});