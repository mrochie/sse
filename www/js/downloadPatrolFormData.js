// Get the main app.js module
var downloadPatrolForm = angular.module("downloadPatrolFormDataService", []);
downloadPatrolForm.service("DownloadPatrolFormDataService", function ($http, SharedProperties, NetworkConnection, $timeout) {
   
    // Initialising Database variable
    var db = window.openDatabase("tliphp", "1.0", "TLI Rapid", 200000);

    // Initialise the Download Progress 
    var progress = 0;
    
    

 

    // Patrol Form - Initialise API URL variables
    var gridSquareAPIURL = "http://rapid.tli.ie:8081/public/sseapi/getgridsquareSSE.php?userid=";
    var transformerAPIURL = "http://rapid.tli.ie:8081/public/sseapi/gettransformersSSE.php?userid=";
    var poleAPIURL = "http://rapid.tli.ie:8081/public/sseapi/getpoleSSE.php?userid=";
    var poleChangeReasonAPIURL = "http://rapid.tli.ie:8081/public/sseapi/getpolechangereasonoptionsSSE.php?userid=";
    var poleTypeAPIURL = "http://rapid.tli.ie:8081/public/sseapi/getpoletypeoptionsSSE.php?userid=";
    var polingOptionAPIURL = "http://rapid.tli.ie:8081/public/sseapi/getpolingoptionsSSE.php?userid=";
    var isolationPointAPIURL = "http://rapid.tli.ie:8081/public/sseapi/getisolationoptionsSSE.php?userid=";
    var surfaceTypeAPIURL = "http://rapid.tli.ie:8081/public/sseapi/getsurfacetypeoptionsSSE.php?userid=";
    var excavationMethodAPIURL = "http://rapid.tli.ie:8081/public/sseapi/getexcavationmethodoptionsSSE.php?userid=";
    var machineryValueAPIURL = "http://rapid.tli.ie:8081/public/sseapi/getmachineryvaluesSSE.php?userid=";
    var conductorTypeAPIURL = "http://rapid.tli.ie:8081/public/sseapi/getconductortypeoptionsSSE.php?userid=";
    var cableTypeAPIURL = "http://rapid.tli.ie:8081/public/sseapi/getcabletypeoptionsSSE.php?userid=";
    var serviceTypeAPIURL = "http://rapid.tli.ie:8081/public/sseapi/getservicetypeoptionsSSE.php?userid=";
    var treeCuttingAPIURL = "http://rapid.tli.ie:8081/public/sseapi/gettreecuttingoptionsSSE.php?userid=";
    var pmeAPIURL = "http://rapid.tli.ie:8081/public/sseapi/getpmeoptionsSSE.php?userid=";
    var btTransferAPIURL = "http://rapid.tli.ie:8081/public/sseapi/getbttransferoptionsSSE.php?userid=";
    var stayWireAPIURL = "http://rapid.tli.ie:8081/public/sseapi/getstaywireoptionssse.php?userid=";
    var jointBayAPIURL = "http://rapid.tli.ie:8081/public/sseapi/getjointbayoptionssse.php?userid=";
    var undergroundServiceAPIURL = "http://rapid.tli.ie:8081/public/sseapi/getundergroundservicesoptionssse.php?userid=";

    // Additional Class A Form - Initialise the API variables
    var gradeAPIURL = "http://rapid.tli.ie:8081/public/sseapi/getgradevaluesSSE.php?userid=";
    var featureTypeAPIURL = "http://rapid.tli.ie:8081/public/sseapi/getfeaturetypevaluesSSE.php?userid=";
    var featureAPIURL = "http://rapid.tli.ie:8081/public/sseapi/getfeaturevaluesSSE.php?userid=";
    var classACableTypeAPIURL = "http://rapid.tli.ie:8081/public/sseapi/getcabletypeoptionsSSE.php?userid=";
    var cableSizeAPIURL = "http://rapid.tli.ie:8081/public/sseapi/getcablesizeoptionsSSE.php?userid=";
    var measuredToAPIURL = "http://rapid.tli.ie:8081/public/sseapi/getmeasuredtooptionsSSE.php?userid=";


    // Array to hold list of all API calls
    var apiArray = [poleChangeReasonAPIURL, poleTypeAPIURL, polingOptionAPIURL, isolationPointAPIURL, surfaceTypeAPIURL, excavationMethodAPIURL, machineryValueAPIURL, conductorTypeAPIURL, cableTypeAPIURL, serviceTypeAPIURL,
        treeCuttingAPIURL, pmeAPIURL, btTransferAPIURL, stayWireAPIURL, jointBayAPIURL, undergroundServiceAPIURL, gradeAPIURL, featureTypeAPIURL, featureAPIURL, classACableTypeAPIURL, cableSizeAPIURL, measuredToAPIURL];

    
    var myFunctions = {
        /* ********** Grid Square Table ********** */
        initGridSquareTable: function (tableName, id, description, assignedTo) {

            // Check if Employee ID exists
            if (SharedProperties.getUserID() !== "") {
                
                // Only make the $http call if there is a Network Connection
                if (navigator.onLine) {
                    
                    // Make the API call passing the Employee ID
                    $http.get(gridSquareAPIURL + SharedProperties.getUserID()).then(
                    function success(response) {
                        
                        // Create the Table
                        myFunctions.createGridSquareTable(tableName, id, description, assignedTo);

                        // Checking if Grid Square List -> gridsquarecount != 0
                        if (response.data[0].gridsquarecount != "0") {
                            angular.forEach(response.data, function (value, key) {
                                
                                // Inner loop to return nested JSON objects
                                angular.forEach(value.gridsquares, function (v, k) {
                                    var sql = 'INSERT OR IGNORE INTO ' + tableName + ' (' + id + ', ' + description + ', ' + assignedTo + ') VALUES (' + v.idmap + ', "' + v.mapdesc + '", "' + SharedProperties.getUserID() + '")';
                                    //alert("Grid Square Insert SQL: " + sql);
                                    
                                    db.transaction(function (tx) {
                                        tx.executeSql(sql, [],
                                            (function (tableName) {
                                                return function (tx, results) {
                                                    myFunctions.insertSuccess(tx, results, tableName);
                                                };
                                            })(tableName), myFunctions.insertError);
                                    });
                                });
                            });
                        }
                        else {
                            alert("An error has occured - There are no Grid Squares assigned to this Employee ID. Please close the app and try again later. If the problem persists please report the error message below to the TLI Development Team." +
                            "\n\nError message at DownloadPatrolFormData.js -> initGridSquareTable() -> response.data[0].gridsquarecount: " + response.data[0].gridsquarecount);
                        }

                        progress = progress + 1;
                        
                    },
                    function error(response) {
                        // API $http error
                        alert("A $http API connection error to the TLI Server has occured. Please close the app and try again later. If the problem persists, please report the error code below to the TLI Development Team." +
                            "\n\nError Code at DownloadPatrolFormData.js -> initGridSquareTable(): " + response);
                    });
                }
                else {
                    // There is a Network Error
                    alert("A Network error has occured. Please close the app and make sure there is a valid Network connection before attempting this operation again.");
                    return;
                }
            }
            else {
                // No Employee ID exists
                alert("No Employee ID or invalid Employee ID detected. Please close the application and try again. If the problem persists please contact the TLI Development Team with the error message below." + 
                    "\n\nError message at: DownloadPatrolFormData.js -> initGridSquareTable() -> SharedProperties.getUserID() == \"\"");
                return;
            }
        },

        // Create tb_grid_square_list 
        createGridSquareTable: function (tableName, id, description, assignedTo) {
            // Drop the Table
            var dropSQL = 'DROP TABLE IF EXISTS ' + tableName;
            //alert("Drop SQL: " + dropSQL);
            db.transaction(function (tx) {
                tx.executeSql(dropSQL);
            });

            // Create the Table
            var sql = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + id + ' INTEGER PRIMARY KEY, ' + description + ', ' + assignedTo + ')';
            //alert("SQL: " + sql);
            db.transaction(function (tx) {
                tx.executeSql(sql);
            });
        },




        /* ********** Transformer Table ********** */
        initTransformerTable: function (tableName, transformerID, transformerDescription, mapID, assignedTo) {
            // Check if Employee ID exists
            if (SharedProperties.getUserID() !== "") {
                // Only make the $http call if there is a Network Connection
                if (navigator.onLine) {
                    // Make the API call passing the Employee ID
                    $http.get(transformerAPIURL + SharedProperties.getUserID()).then(
                    function success(response) {
                        // Create the Table
                        myFunctions.createTransformerTable(tableName, transformerID, transformerDescription, mapID, assignedTo);

                        // Checking if Transformer -> transformercount != 0
                        if (response.data[0].transformercount != "0") {
                            angular.forEach(response.data, function (value, key) {
                                // Inner loop to return nested JSON objects
                                angular.forEach(value.transformers, function (v, k) {
                                    var sql = 'INSERT OR IGNORE INTO ' + tableName + ' (' + transformerID + ', ' + transformerDescription + ', ' + mapID + ', ' + assignedTo + ') VALUES (' + v.idtransformer + ', "' + v.transformerdesc + '", ' + v.mapid + ', ' + v.assignedto + ')';
                                    ////alert("Insert SQL: " + sql);
                                    //db.transaction(function (tx) {
                                    //    tx.executeSql(sql);
                                    //});



                                    //alert("Transformer Insert SQL: " + sql);

                                    db.transaction(function (tx) {
                                        tx.executeSql(sql, [],
                                            (function (tableName) {
                                                return function (tx, results) {
                                                    myFunctions.insertSuccess(tx, results, tableName);
                                                };
                                            })(tableName), myFunctions.insertError);
                                    });


                                    //myFunctions.queryTable(tableName);
                                });
                            });

                            //progress = progress + 1;
                            //alert("Download Progress + 25: " + progress);
                        }
                        else {
                            alert("There are no Transformers assigned to this Grid Square. Please close the app and contact your Planner before attempting this action again.");
                        }

                        progress = progress + 1;
                        
                    },
                    function error(response) {
                        // API $http error
                        alert("A $http API connection error to the TLI Server has occured. Please close the app and try again later. If the problem persists, please report the error code below to the TLI Development Team." +
                            "\n\nError Code at DownloadPatrolFormData.js -> initTransformerTable(): " + response);
                    });
                }
                else {
                    // There is a Network Error
                    alert("A Network Error has occured. Please close the app and make sure there is a valid Network connection before attempting this operation again.");
                    return;
                }
            }
            else {
                // No Employee ID exists
                alert("No Employee ID or invalid Employee ID detected. Please close the application and try again. If the problem persists please contact the TLI Development Team with the error message below." +
                    "\n\nError message at: DownloadPatrolFormData.js -> initTransformerTable() -> SharedProperties.getUserID() == \"\"");
                return;
            }
        },

        // Create the Transformer table
        createTransformerTable: function (tableName, transformerID, description, mapID, assignedTo) {
            var dropSQL = 'DROP TABLE IF EXISTS ' + tableName;
            //alert("Drop SQL: " + dropSQL);
            db.transaction(function (tx) {
                tx.executeSql(dropSQL);
            });

            var sql = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + transformerID + ' INTEGER PRIMARY KEY, ' + description + ', ' + mapID + ', ' + assignedTo + ')';
            //alert("SQL: " + sql);
            db.transaction(function (tx) {
                tx.executeSql(sql);
            });
        },




        /* ********** Pole Table ********** */
        initPoleTable: function (tableName, id, poleKey, poleNum, transformerID) {
            // Check if Employee ID exists
            if (SharedProperties.getUserID() !== "") {
                // Only make the $http call if there is a Network Connection
                if (navigator.onLine) {
                    // Make the API call passing the Employee ID
                    $http.get(poleAPIURL + SharedProperties.getUserID()).then(
                    function success(response) {

                        // Create the Table
                        myFunctions.createPoleTable(tableName, id, poleKey, poleNum, transformerID);

                        // Checking if Pole List -> polecount != 0
                        if (response.data[0].polecount != "0") {
                            angular.forEach(response.data, function (value, key) {
                                // Inner loop to return nested JSON objects
                                angular.forEach(value.pole, function (v, k) {
                                    var sql = 'INSERT OR IGNORE INTO tb_pole_list (idpole, polekey, polenum, idtransformer) VALUES (' + v.idpole + ', "' + v.polekey + '", ' + v.polenum + ', ' + v.idtransformer + ')';
                                    //alert("Pole Insert SQL: " + sql);

                                    //db.transaction(function (tx) {
                                    //    tx.executeSql(sql);
                                    //});

                                    db.transaction(function (tx) {
                                        tx.executeSql(sql, [],
                                            (function (tableName) {
                                                return function (tx, results) {
                                                    myFunctions.insertSuccess(tx, results, tableName);
                                                };
                                            })(tableName), myFunctions.insertError);
                                    });

                                    //myFunctions.queryTable(tableName);
                                });
                            });

                            //progress = progress + 1;
                            //alert("Download Progress + 25: " + progress);
                        }
                        else {
                            //alert("Error: Data - idmap = 0");
                        }

                        progress = progress + 1;
                        
                    },
                    function error(response) {
                        // API $http error
                        alert("A $http API connection error to the TLI Server has occured. Please close the app and try again later. If the problem persists, please report the error code below to the TLI Development Team." +
                            "\n\nError Code at DownloadPatrolFormData.js -> initPoleTable(): " + response);
                    });
                }
                else {
                    // There is a Network Error
                    alert("A Network Error has occured. Please close the app and make sure there is a valid Network connection before attempting this operation again.");
                    return;
                }
            }
            else {
                // No Employee ID exists
                alert("No Employee ID or invalid Employee ID detected. Please close the application and try again. If the problem persists please contact the TLI Development Team with the error message below." +
                    "\n\nError message at: DownloadPatrolFormData.js -> initPoleTable() -> SharedProperties.getUserID() == \"\"");
                 return;
            }
        },

        // Create the Pole Table
        createPoleTable: function (tableName, id, polekey, polenum, idtransformer) {
            var dropSQL = 'DROP TABLE IF EXISTS ' + tableName;
            //alert("Drop SQL: " + dropSQL);
            db.transaction(function (tx) {
                tx.executeSql(dropSQL);
            });

            var sql = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + id + ' INTEGER PRIMARY KEY, ' + polekey + ', ' + polenum + ', ' + idtransformer + ')';
            //alert("SQL: " + sql);
            db.transaction(function (tx) {
                tx.executeSql(sql);
            });
        },
















        // Query Success Callback
        insertSuccess: function (tx, results, tableName) {
            //alert("Querying table: " + tableName);
            var sql = 'SELECT * FROM ' + tableName + '';

            db.transaction(function (tx) {
                tx.executeSql(sql, [],
                    (function (tableName) {
                        return function (tx, results) {
                            myFunctions.querySuccess(tx, results, tableName);
                        };
                    })(tableName), myFunctions.queryError);
            });
        },

        // Query Error Callback
        insertError: function (tx, err) {
            alert("An error has occured - Unable to execute SQL INSERT statement. Please close the application and try again later. If the problem persists please contact the TLI Development Team with the error code and message below." +
                  "\n\nError code: " + err.code + ".\nError Message: " + err.message);
        },


        // Query Success Callback
        querySuccess: function (tx, results, tableName) {
            //alert(tableName + " Length: " + results.rows.length);

            // There are no records in the Database
            if (results.rows.length == 0) {
                alert("An error has occured - There were no records inserted into the Grid Square table. Please close the application and try again later. If the problem persists please contact the TLI Development Team with the error message below." +
                    "\n\nError message: Unable to insert API data into table tb_grid_square_list at DownloadPatrolFormData.js");
            }
            else {
                // There are records in the Database - add API call data to local array
                for (var i = 0; i < results.rows.length; i++) {
                    //alert("Length > 0: " + results.rows.length);

                    switch (tableName) {
                        case "tb_grid_square_list":
                            SharedProperties.setGridSquareDataDownloaded(true);
                            //alert("getGridSquareDataDownloaded(): " + SharedProperties.getGridSquareDataDownloaded());

                            //progress = progress + 1;
                            //alert("tb_grid_square_list Progress: " + progress);
                            break;

                        case "tb_transformer_list":
                            SharedProperties.setTransformerDataDownloaded(true);
                            //alert("getTransformerDataDownloaded(): " + SharedProperties.getTransformerDataDownloaded());

                            //progress = progress + 1;
                            //alert("tb_transformer_list Progress: " + progress);
                            break;

                        case "tb_pole_list":
                            SharedProperties.setPoleDataDownloaded(true);
                            //alert("getPoleDataDownloaded: " + SharedProperties.getPoleDataDownloaded());

                            //progress = progress + 1;
                            //alert("tb_pole_list Progress: " + progress);
                            break;

                        default:
                            break;
                    }
                }
            }
        },

        // Query Error Callback
        queryError: function (tx, err) {
            alert("Error processing SQL query with Error Code: " + err.code + ".\nError Message: " + err.message);
        },















        /* ********** Form Fields Tables ********** */
        initFormFieldTables: function () {
            //alert("initFormFieldTables()...");
            for (var i = 0; i < apiArray.length; i++) {
                // Make the APi call and create the Tables from call response data
                myFunctions.getAPIResponseDataAndBuildFormFieldTables(apiArray[i]);
            }
        },

        getAPIResponseDataAndBuildFormFieldTables: function (apiURL) {
            if (SharedProperties.getUserID() !== "") {
                if (navigator.onLine) {
                    $http.get(apiURL + SharedProperties.getUserID()).then(
                    function success(response) {
                        var tableName = "";
                        var idColumnName = "";
                        var descColumnName = "";
                        var id = [];
                        var desc = [];

                        response.data.forEach(function (dataset) {
                            Object.keys(dataset).forEach(function (key) {
                                tableName = key;

                                // Inner loop for nested JSON objects
                                if (Array.isArray(dataset[key])) {
                                    dataset[key].forEach(function (item) {
                                        // Use key/value to create the Tables
                                        angular.forEach(item, function (value, key) {
                                            if (idColumnName == "" || idColumnName == key) {
                                                id.push(value);
                                                idColumnName = key;
                                            }
                                            else {
                                                desc.push(value);
                                                descColumnName = key;
                                            }
                                        });
                                    });
                                }
                                else {
                                    //alert("Dataset[key]: " + dataset[key])
                                }
                            })
                        });

                        

                        // Create the Table
                        myFunctions.createFormFieldTable(tableName, idColumnName, descColumnName);

                        // Check that ID and Description Arrays are same length
                        if (id.length == desc.length) {
                            // Loop through arrays and INSERT INTO Table
                            for (var i = 0; i < id.length; i++) {
                                myFunctions.insertIntoFormFieldTable(tableName, idColumnName, descColumnName, id[i], desc[i]);
                            }
                        }
                        else {
                            alert("An error has occured. Please report the error message to TLI Technical Support: sync-patrol-data.js - TABLE " + tableName + " HAS " + id.length + " ENTRIES FOR " + idColumnName + " AND " + desc.length + " ENTRIES FOR " + descColumnName);
                        }
                    },
                    function error(response) {
                        alert("A $http connection error has occured. Please report the error code [ERROR CODE: " + response + "] to the TLI Development Team.");
                    });
                }
                else {
                    // Network Error
                    alert("A Network Error has occured. Please close the app and make sure there is a valid Network connection before attempting this operation again.");
                    return;
                }
            }
            else {
                // No Employee ID exists or wrong ID entered
                alert("No Employee ID or invalid Employee ID detected. Please clsoe the application and try again. ERROR MESSAGE: sync-patrol-data => getUserID() == \"\"");
                return;
            }

            progress = progress + 1;
            //alert("Download Progress + 25: " + progress);
        },

        // Create the Patrol Form Questions Tables 
        createFormFieldTable: function (tableName, id, description) {
            //alert("Dropping table: " + tableName);
            var dropSQL = 'DROP TABLE IF EXISTS ' + tableName;
            db.transaction(function (tx) {
                tx.executeSql(dropSQL);
            });

            //alert("Creating table: " + tableName);
            var sql = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + id + ' INTEGER PRIMARY KEY, ' + description + ')';
            db.transaction(function (tx) {
                tx.executeSql(sql);
            });
        },

        // Insert into the Patrol Form Questions Tables
        insertIntoFormFieldTable: function (tableName, idColumnName, descColumnName, id, description) {
            //alert("Inserting into table: " + tableName);
            var sql = 'INSERT OR IGNORE INTO ' + tableName + ' (' + idColumnName + ', ' + descColumnName + ') VALUES (' + id + ', "' + description + '")';
            //alert("SQl: " + sql);
            db.transaction(function (tx) {
                tx.executeSql(sql);
            });

            myFunctions.queryFormFieldTable(tableName)
        },

        // Query the Form Field Table
        queryFormFieldTable: function (tableName) {
            //alert("Querying table: " + tableName);
            var sql = 'SELECT * FROM ' + tableName + '';
            db.transaction(function (tx) {
                tx.executeSql(sql, [], myFunctions.queryFormFieldSuccess, myFunctions.queryFormFieldError);
            });
        },

        // Query Success Callback
        queryFormFieldSuccess: function (tx, results) {
            //alert("Query success...");
            var len = results.rows.length;
            //alert("Length: " + len);

            SharedProperties.setFormFieldDataDownloaded(true);
            //alert("getFormFieldDataDownloaded(): " + SharedProperties.getFormFieldDataDownloaded());

            //for (var i = 0; i < len; i++) {
            //    Query the Grid Square ID, Grid Square Name and Assigned To from the Database
            //    alert("idpole: " + results.rows.item(i).idpole);
            //    alert("polekey: " + results.rows.item(i).polekey);
            //    alert("polenum: " + results.rows.item(i).polenum);
            //    alert("idtransformer: " + results.rows.item(i).idtransformer);
            //}
        },

        // Query Error Callback
        queryFormFieldError: function (tx, err) {
            alert("Error processing SQL query with Error Code: " + err.code + ".\nError Message: " + err.message);
        },



        /* ********** Download Progress ********** */
        getDownloadProgress: function () {
            //alert("getDownloadProgress(): " + progress);
            return progress;
        }

    } // myFunctions() end

    return myFunctions;
    
});