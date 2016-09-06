// Get the main app.js module
var createLocalStorageTables = angular.module("createLocalStorageTablesService", []);
createLocalStorageTables.service("CreateLocalStorageTablesService", function ($http, SharedProperties, NetworkConnection, $timeout) {

    // Initialising Database variable
    var db = window.openDatabase("tliphp", "1.0", "TLI Rapid", 200000);

    var myFunctions = {


        /* ********** Patrol Header ********** */
        createPatrolHeaderTable: function (tableName, gridSquareID, transformerID, isolationPointID, isolationPointComments,
                                        isolationPointPhoto, normallyOpenPointID, normallyOpenPointCheckedID, normallyOpenPointComments, normally_open_point_photo, patrollerID, patrolDate) {
            var sql = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + gridSquareID + ', ' + transformerID + '  INTEGER PRIMARY KEY, ' + isolationPointID + ', ' + isolationPointComments + ', ' + isolationPointPhoto + ', ' + normallyOpenPointID + ', ' + normallyOpenPointCheckedID + ', ' + normallyOpenPointComments + ', ' + normally_open_point_photo + ', ' + patrollerID + ', ' + patrolDate + ')';
            //alert("Create Patrol Header SQL: " + sql);
            db.transaction(function (tx) {
                tx.executeSql(sql);
            });
            
            myFunctions.queryTable(tableName);
        },

        /* ********** Patrol Details ********** */
        createPatrolDetailsTable: function (tableName, poleKeyID, poleNo, poleChangeRequired, poleChangeReason, poleType, polingOption, height, surfaceType, excavationMethod, machineryRequired,
                                            mainlineConductorChangeRequired, existingConductorType, cableType, length, newConductorType, serviceChangeRequired, noOfServices, quantityOne, serviceTypeOne,
                                            quantityTwo, serviceTypeTwo, houseNo, streetName, landAccessRequired) {
            var sql = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + poleKeyID + ' PRIMARY KEY, ' + poleNo + ', ' + poleChangeRequired + ', ' + poleChangeReason + ', ' + poleType + ', ' + polingOption + ', ' + height + ', ' + surfaceType + ', ' + excavationMethod + ', ' + machineryRequired + ', ' + mainlineConductorChangeRequired + ', ' + existingConductorType + ', ' + cableType + ', ' + length + ', ' + newConductorType + ', ' + serviceChangeRequired + ', ' + noOfServices + ', ' + quantityOne + ', ' + serviceTypeOne + ', ' + quantityTwo + ', ' + serviceTypeTwo + ', ' + houseNo + ', ' + streetName + ', ' + landAccessRequired + ')';
            //alert("Create Patrol Details SQL: " + sql);
            db.transaction(function (tx) { tx.executeSql(sql); });
            
            myFunctions.queryTable(tableName);
        },

        /* ********** Patrol Tasks ********** */
        createTasksTable: function (tableName, poleNo, poleTaskID, poleTaskValue) {
            var sql = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + poleNo + ', ' + poleTaskID + ' PRIMARY KEY, ' + poleTaskValue + ')';
            //alert("Create Patrol Tasks SQL: " + sql);
            db.transaction(function (tx) { tx.executeSql(sql); });
            
            myFunctions.queryTable(tableName);
        },

        /* ********** WIRA Table ********** */
        createWIRATable: function (tableName, gridSquareID, transformerID, poleID, locationAndActivity, esqcrIssues, day, month, year, patrollerID, roadSchematic, roadType, roadWidth, speedLimit, environment, trafficVolume, footpathDiversion, trafficManagementSelection, comments) {
            var sql = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + gridSquareID + ', ' + transformerID + ', ' + poleID + ' PRIMARY KEY, ' + locationAndActivity + ', ' + esqcrIssues + ', ' + day + ', ' + month + ', ' + year + ', ' + patrollerID + ', ' + roadSchematic + ', ' + roadType + ', ' + roadWidth + ', ' + speedLimit + ', ' + environment + ', ' + trafficVolume + ', ' + footpathDiversion + ', ' + trafficManagementSelection + ', ' + comments + ')';
            //alert("Create WIRA SQL: " + sql);
            db.transaction(function (tx) {
                tx.executeSql(sql);
            });

            myFunctions.queryTable(tableName);
        },

        /* ********** 106 Table ********** */
        createOneZeroSixTable: function (tableName, gridSquareID, transformerID, poleID, patrollerID, noDefectNoSolution, defectDescription, insufficientClearance, actualClearanceLocation, actualClearanceValue, voltageLine, voltageType, conductor, riskCodeLand, riskCodeBareCovered, riskCodeVandalism, conductorType, day, month, year, comments, landOwnerName, landOwnerAddress, landOwnerTel, landOwnerInformed, speedLimit, btOnPole, photo) {
            var sql = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + gridSquareID + ', ' + transformerID + ', ' + poleID + ' PRIMARY KEY, ' + patrollerID + ', ' + noDefectNoSolution + ', ' + defectDescription + ', ' + insufficientClearance + ', ' + actualClearanceLocation + ', ' + voltageLine + ', ' + voltageType + ', ' + conductor + ', ' + riskCodeLand + ', ' + riskCodeBareCovered + ', ' + riskCodeVandalism + ', ' + conductorType + ', ' + day + ', ' + month + ', ' + year + ', ' + comments + ', ' + landOwnerName + ', ' + landOwnerAddress + ', ' + landOwnerTel + ', ' + landOwnerInformed + ', ' + speedLimit + ', ' + btOnPole + ', ' + photo + ')';
            //alert("Create 106 SQL: " + sql);
            db.transaction(function (tx) {
                tx.executeSql(sql);
            });

            myFunctions.queryTable(tableName);
        },














        /* ********** Additional Class A Table ********** */
        createAdditionalClassATable: function (tableName, gridSquareID, transformerID, poleID, year, poleHeight, grade, type, feature, cableType, size, featureHeight, measuredTo, photo) {
            var sql = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + gridSquareID + ', ' + transformerID + ', ' + poleID + ', ' + year + ', ' + poleHeight + ', ' + grade + ', ' + type + ', ' + feature + ', ' + cableType + ', ' + size + ', ' + featureHeight + ', ' + measuredTo + ', ' + photo + ' BLOB)';
            //alert("Create Additional Class A SQL: " + sql);
            db.transaction(function (tx) {
                tx.executeSql(sql);
            });

            //myFunctions.queryTable(tableName);
        },















        // Query the Table
        queryTable: function (tableName) {
            //alert("Querying table: " + tableName);
            var sql = 'SELECT * FROM ' + tableName + '';
            //db.transaction(function (tx) {
            //    tx.executeSql(sql, [], myFunctions.querySuccess, myFunctions.queryError);
            //});


            db.transaction(function (tx) {
                tx.executeSql(sql, [],
                    (function (tableName) {
                        return function (tx, results) {
                            myFunctions.querySuccess(tx, results, tableName);
                        };
                    })(tableName), myFunctions.queryError);
            });
        },

        // Query Success Callback
        querySuccess: function (tx, results, tableName) {
            //alert("Query success...");
            
            //alert("Length: " + results.rows.length);

            for (var i = 0; i < results.rows.length; i++) {
                // Query the Grid Square ID, Grid Square Name and Assigned To from the Database
                //alert("idpole: " + results.rows.item(i).idpole);
                //alert("polekey: " + results.rows.item(i).polekey);
                //alert("polenum: " + results.rows.item(i).polenum);
                //alert("idtransformer: " + results.rows.item(i).idtransformer);
            }
        },

        // Query Error Callback
        queryError: function (tx, err) {
            alert("Error processing API call SQL query. \n\nError Code: " + err.code + ".\nError Message: " + err.message);
        },



    } // myFunctions() end

    return myFunctions;

});