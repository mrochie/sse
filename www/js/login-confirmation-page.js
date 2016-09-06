// This is a JavaScript file

// Get the main app.js module and inject the SharedProperties service
var loginConfirmation = angular.module("loginConfirmationController", []);
loginConfirmation.controller("LoginConfirmationController", function ($scope, $http, SharedProperties, NetworkConnection, $timeout)
{
    // Initialising the Booleans for User actions on view load
    $scope.showLoginScreenUI = false;
    $scope.showNoNetworkAndNoDatabaseValuesErrorMessage = false;
    $scope.showMainNavigationScreenSegueButton = false;

    // Initialising the values to store the Database User ID and Database Username in 
    $scope.databaseUserID;
    $scope.databaseUserName;

    // Initialising Database variable
    var db;

    // Check if User details are stored in "Remember Me"
    var init = function () {
        // Wait for Cordova to load. The deviceready event fires once Cordova has fully loaded. Once the event fires, you can safely make calls to Cordova APIs
        document.addEventListener("deviceready", onDeviceReady, false);
    };

    // Fire init() after definition
    init();

    // Cordova is ready
    function onDeviceReady() {
        /* Open the Database - the entry point into creating or opening a database is the window.openDatabase() method
           var db = window.openDatabase(name, version, displayName, estimatedSize);
           name (string): The unique name of the database, as it will be stored in disk.
           version (string): The version of the database.
           displayName (string): A human friendly name for the database, which the system will use if it needs to describe your database to the user (for example, when requesting permission to increase the size of the database).
           estimatedSize (number): The expected maximum size of the database, in bytes. As the database increases in size, the user may be prompted for permission. If you make a reasonable first guess, the user is likely to be prompted less often.
           The returned Database object provides a transaction() method (or readTransaction() to optimize read-only transactions) that let's you create a failure-safe transaction
        */
        db = window.openDatabase("tliphp", "1.0", "TLI Rapid", 200000);

        // Create the database table if it doesnt exist...
        db.transaction(createDB, errorCB, successCB);

        // ...then query the table for any entries
        db.transaction(queryDB, errorCB, successCB);
    }

    // Create the Database Users table
    function createDB(tx) {
        console.log("Creating the database...");

        // *********** FOR TESTING ONLY ***********
        console.log("Dropping database table tb_remember_me...");
        tx.executeSql('DROP TABLE IF EXISTS tb_remember_me');

        console.log("Creating database table tb_remember_me...");
        tx.executeSql('CREATE TABLE IF NOT EXISTS tb_remember_me (id INTEGER PRIMARY KEY, name)');

        // *********** FOR TESTING ONLY ***********
        console.log("Inserting values into database table tb_remember_me for testing...");
        //tx.executeSql('INSERT INTO tb_remember_me (id, name) VALUES (545, "Hans Moolman")');
    }

    // Query the database
    function queryDB(tx) {
        console.log("Querying the Database...");
        tx.executeSql('SELECT * FROM tb_remember_me', [], querySuccess, errorCB);
    }

    // Query the success callback
    function querySuccess(tx, results)
    {
        var len = results.rows.length;

        // There are no records in the Database
        if (len == 0)
        {
            // There is a active Network connection
            if (navigator.onLine)
            {
                console.log("LEN = 0 and navigator is ONLINE");

                // Allow the User to segue to the Login screen
                $timeout(function ()
                {
                    // Display the Users entered User ID to them in the view
                    $scope.userEnteredUserID = SharedProperties.getUserID();
                    console.log("User entered User ID: " + $scope.userEnteredUserID);

                    $scope.showLoginScreenUI = true;
                    
                }, 1)
            }
            // There is NO active Network connection
            else
            {
                console.log("LEN = 0 and navigator is OFFLINE");

                // Show error message that Database contains no values and that there is no active Network connection
                $timeout(function ()
                {
                    $scope.showNoNetworkAndNoDatabaseValuesErrorMessage = true;
                }, 1)
            }
        }
        else
        {
            // There are records in the Database
            for (var i = 0; i < len; i++)
            {
                // Get the UserID and UserName from the Database
                $scope.databaseUserID = results.rows.item(i).id;
                $scope.databaseUserName = results.rows.item(i).name;
                console.log("Database User ID BOI: " + $scope.databaseUserID);
                console.log("Database User Name BOI: " + $scope.databaseUserName);
            }

            if (SharedProperties.getUserID() == $scope.databaseUserID)
            {
                // User entered UserID matches Database UserID
                console.log("User entered UserID matches Database UserID");

                // Allow the User to segue to the Main Navigation screen
                $timeout(function ()
                {
                    $scope.showMainNavigationScreenSegueButton = true;
                }, 1)
            }
            else
            {
                // User entered UserID DOES NOT match Database UserID
                console.log("User entered UserID DOES NOT match Database UserID");

                // There is a active Network connection
                if (navigator.onLine)
                {
                    console.log("LEN = 0 and navigator is ONLINE");

                    // Allow the User to segue to the Login screen
                    $timeout(function ()
                    {
                        $scope.showLoginScreenUI = true;

                        // Display the Users entered User ID to them in the view
                        $scope.userEnteredUserID = SharedProperties.getUserID();
                        console.log("User entered User ID: " + $scope.userEnteredUserID);
                    }, 1)
                }
                // There is NO active Network connection
                else
                {
                    console.log("LEN = 0 and navigator is OFFLINE");

                    // There is no active Network connection and entered UserID does not match Database UserID - Log Out
                    $timeout(function () {
                        $scope.showNoNetworkAndNoDatabaseValuesErrorMessage = true;
                    }, 1)
                }

                // User entered UserID DOES NOT match Database UserID
                console.log("User entered UserID DOES NOT match Database UserID");
            }

            // There is a Users datails in the Database - set to TRUE to display the Confirmation screen UI to the User 
            //$scope.databaseContainUserValues = true;
            //console.log("Database contains user values - BOOL: " + $scope.databaseContainUserValues);
        }
    }






    // Transaction error callback
    function errorCB(err) {
        alert("Error processing SQL with ERROR CODE: " + err.code);
    }

    // Transaction success callback
    function successCB() {
        console.log("Success CB...returning true...");
        return true;

        // *********** WHAT TO DO HERE ***********

        //db = window.openDatabase("tliphp", "1.0", "TLI Rapid", 200000);
        //db.transaction(queryDB, errorCB);
    }

    //Insert query
    function goInsert() {
        console.log("goInsert()...");
        db = window.openDatabase("tliphp", "1.0", "TLI Rapid", 200000);
        db.transaction(insertDB, errorCB, successCB);
    }

    function insertDB(tx) {
        console.log("Inserting into DataBase...");
        tx.executeSql('INSERT INTO tb_remember_me (id, name) VALUES ("' + SharedProperties.getUserID() + '","' + SharedProperties.getUserName() + '")');
        //tx.executeSql('INSERT INTO tb_users (id, name) VALUES (545, "Hans Moolman")');


        tx.executeSql('INSERT INTO tb_remember_me (id, name) VALUES (545, "Hans Moolman")');
    }

    function goSearch() {
        db = window.openDatabase("tliphp", "1.0", "TLI Rapid", 200000);
        db.transaction(searchQueryDB, errorCB);
    }

    // Delete query
    function goDelete() {
        db = window.openDatabase("tliphp", "1.0", "TLI Rapid", 200000);
        db.transaction(deleteRow, errorCB);
    }

    //Delete query
    function deleteRow(tx) {
        console.log("Preparing to DELETE * FROM tb_remember_me...");
        tx.executeSql('DELETE * FROM tb_remember_me');
    }

    /* Show the popup after tapping a row in table
    function goPopup(row, rowname, rownum) {
        currentRow = row;
        document.getElementById("qrpopup").style.display = "block";
        document.getElementById("editNameBox").value = rowname;
        document.getElementById("editNumberBox").value = rownum;
    }
    */

    /*
    function editRow(tx) {
        tx.executeSql('UPDATE DEMO SET name ="' + document.getElementById("editNameBox").value +
                '", number= "' + document.getElementById("editNumberBox").value + '" WHERE id = '
                + currentRow, [], queryDB, errorCB);
    }
    function goEdit() {
        var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
        db.transaction(editRow, errorCB);
        document.getElementById('qrpopup').style.display = 'none';
    }
    */


});