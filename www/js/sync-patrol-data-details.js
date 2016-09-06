// Get the main app.js module and inject the SharedProperties service
var syncPatrolDataDetails = angular.module("syncPatrolDataDetailsController", []);
syncPatrolDataDetails.controller("SyncPatrolDataDetailsController", function ($scope, $http, $timeout, $interval, SharedProperties, DownloadPatrolFormDataService, NetworkConnection) {
    // Initialising Database variable
    var db;
    
    // The Pole ID that was selected o the list view
    $scope.selectedPole = SharedProperties.getSelectedPoleID();

    $scope.patroller = SharedProperties.getUserID();

    // Variables for storing localStorage Patrol Data
    //$scope.headerData = [];
    //$scope.detailsData = [];
    //$scope.tasksData = [];

    $scope.gridSquareID = "";
    $scope.gridSquareName = "";
    $scope.transformerID = "";
    $scope.transformerName = "";

    $scope.isolationPoint = "";
    $scope.isolationPointComment = "";

    $scope.normallyOpenPoint = "";
    $scope.normallyOpenPointChecked = "";
    $scope.normallyOpenPointComment = "";

    $scope.poleChangeReason = "";
    $scope.poleType = "";
    $scope.polingOption = "";
    $scope.poleChangeHeight = "";
    $scope.surfaceType = "";
    $scope.excavationMethod = "";
    $scope.machineryRequired = "";
    $scope.mainlineConductorChangeRequired = "";
    $scope.existingConductorType = "";
    $scope.cableType = "";
    $scope.cableLength = "";
    $scope.mainlineConductorChangeLength = "";
    $scope.newConductorType = "";
    $scope.serviceChangeRequired = "";
    $scope.numberOfServices = "";
    $scope.serviceLengthOne = "";
    $scope.serviceLengthTwo = "";
    $scope.serviceTypeOne = "";
    $scope.serviceTypeTwo = "";
    $scope.houseNumber = "";
    $scope.streetAddress = "";
    $scope.landAccessRequired = "";

    $scope.btTransfer = "";
    $scope.pme = "";
    $scope.stay = "";
    $scope.treeCutting = "";

    $scope.replumbPole = "";
    $scope.utiliseExistingPole = "";
    $scope.removeExistingPole = "";
    $scope.streetlightTransfer = "";
    $scope.unbind = "";
    $scope.additionalSingleConductor = "";
    $scope.pc400 = "";
    $scope.poleExtensionBracket = "";
    $scope.transfereExistingUGService = "";
    $scope.lvStraighJoint = "";
    $scope.lvOutage = "";
    $scope.hvOutage = "";




    // Initialise
    var init = function () {
        document.addEventListener("deviceready", onDeviceReady, false);
    };

    // Fire init() after definition
    init();

    // Device APIs are available
    function onDeviceReady() {
        db = window.openDatabase("tliphp", "1.0", "TLI Rapid", 200000);
        


        // Get the Grid Sqaure Name and Transformer Name based on the Pole ID
        getHeaderDetails("tb_pole_list.idtransformer", "tb_pole_list", "tb_pole_list.polekey", $scope.selectedPole, "transformerID");

        
        queryPatrolDetailsTable("isolationpoints.isolationpointdesc", "isolationpoints", "tb_patrol_header", "tb_patrol_header.isolation_point_id", "isolationpoints.idisolationpoint", "isolationPoint");

        queryPatrolDetailsTable("polechangereason.polechangereasondesc", "polechangereason", "tb_patrol_details", "tb_patrol_details.pole_change_reason", "polechangereason.idpolechangereason", "poleChangeReason");
        queryPatrolDetailsTable("poletypes.poletypedesc", "poletypes", "tb_patrol_details", "tb_patrol_details.pole_type", "poletypes.idpoletype", "poleType");
        queryPatrolDetailsTable("polingoptions.polingoptiondesc", "polingoptions", "tb_patrol_details", "tb_patrol_details.poling_option", "polingoptions.idpolingoption", "polingOption");

        // Pole Height
        queryPatrolDetailsTable("polechangereason.polechangereasondesc", "polechangereason", "tb_patrol_details", "tb_patrol_details.pole_change_reason", "polechangereason.idpolechangereason", "poleHeight");

        queryPatrolDetailsTable("surfacetypes.surfacetypedesc", "surfacetypes", "tb_patrol_details", "tb_patrol_details.surface_type", "surfacetypes.idsurfacetype", "surfaceType");
        queryPatrolDetailsTable("excavationmethod.excavationmethoddesc", "excavationmethod", "tb_patrol_details", "tb_patrol_details.excavation_method", "excavationmethod.idexcavationmethod", "excavationMethod");
        queryPatrolDetailsTable("machineryvalues.machinerydesc", "machineryvalues", "tb_patrol_details", "tb_patrol_details.machinery_required", "machineryvalues.idmachinery", "machineryRequired");
        queryPatrolDetailsTable("conductortypes.conductortypedesc", "conductortypes", "tb_patrol_details", "tb_patrol_details.existing_conductor_type", "conductortypes.idconductortype", "existingConductorType");
        queryPatrolDetailsTable("cabletypes.cabletypedesc", "cabletypes", "tb_patrol_details", "tb_patrol_details.cable_type", "cabletypes.idcabletype", "cableType");

        // Conductor Length
        queryPatrolDetailsTable("polechangereason.polechangereasondesc", "polechangereason", "tb_patrol_details", "tb_patrol_details.pole_change_reason", "polechangereason.idpolechangereason", "cableLength");

        queryPatrolDetailsTable("conductortypes.conductortypedesc", "conductortypes", "tb_patrol_details", "tb_patrol_details.new_conductor_type", "conductortypes.idconductortype", "newConductorType");

        queryPatrolDetailsTable("polechangereason.polechangereasondesc", "polechangereason", "tb_patrol_details", "tb_patrol_details.pole_change_reason", "polechangereason.idpolechangereason", "serviceChangeRequired");

        // Number of Services
        queryPatrolDetailsTable("polechangereason.polechangereasondesc", "polechangereason", "tb_patrol_details", "tb_patrol_details.pole_change_reason", "polechangereason.idpolechangereason", "numberOfServices");

        // Service Length One
        queryPatrolDetailsTable("polechangereason.polechangereasondesc", "polechangereason", "tb_patrol_details", "tb_patrol_details.pole_change_reason", "polechangereason.idpolechangereason", "serviceLengthOne");

        // Service Length Two
        queryPatrolDetailsTable("polechangereason.polechangereasondesc", "polechangereason", "tb_patrol_details", "tb_patrol_details.pole_change_reason", "polechangereason.idpolechangereason", "serviceLengthTwo");

        queryPatrolDetailsTable("servicetypes.servicetypedesc", "servicetypes", "tb_patrol_details", "tb_patrol_details.service_type_one", "servicetypes.idservicetype", "serviceTypeOne");
        queryPatrolDetailsTable("servicetypes.servicetypedesc", "servicetypes", "tb_patrol_details", "tb_patrol_details.service_type_two", "servicetypes.idservicetype", "serviceTypeTwo");

        // House Number
        queryPatrolDetailsTable("polechangereason.polechangereasondesc", "polechangereason", "tb_patrol_details", "tb_patrol_details.pole_change_reason", "polechangereason.idpolechangereason", "houseNumber");

        // Address
        queryPatrolDetailsTable("polechangereason.polechangereasondesc", "polechangereason", "tb_patrol_details", "tb_patrol_details.pole_change_reason", "polechangereason.idpolechangereason", "streetAddress");

        queryPatrolDetailsTable("polechangereason.polechangereasondesc", "polechangereason", "tb_patrol_details", "tb_patrol_details.pole_change_reason", "polechangereason.idpolechangereason", "landAccessRequired");


        queryDetailsFreeFormText("tb_patrol_details.height", "tb_patrol_details", "tb_patrol_details.pole_key_id", $scope.selectedPole, "poleChangeHeight");
        queryDetailsFreeFormText("tb_patrol_details.length", "tb_patrol_details", "tb_patrol_details.pole_key_id", $scope.selectedPole, "mainlineConductorChangeLength");
        queryDetailsFreeFormText("tb_patrol_details.no_of_services", "tb_patrol_details", "tb_patrol_details.pole_key_id", $scope.selectedPole, "numberOfServices");
        queryDetailsFreeFormText("tb_patrol_details.quantity_1", "tb_patrol_details", "tb_patrol_details.pole_key_id", $scope.selectedPole, "serviceLengthOne");
        queryDetailsFreeFormText("tb_patrol_details.quantity_2", "tb_patrol_details", "tb_patrol_details.pole_key_id", $scope.selectedPole, "serviceLengthTwo");
        queryDetailsFreeFormText("tb_patrol_details.house_no", "tb_patrol_details", "tb_patrol_details.pole_key_id", $scope.selectedPole, "houseNumber");
        queryDetailsFreeFormText("tb_patrol_details.street_name", "tb_patrol_details", "tb_patrol_details.pole_key_id", $scope.selectedPole, "streetAddress");




        queryTasksTable("bttransfer.bttransferdesc", "bttransfer", "tb_patrol_tasks", "tb_patrol_tasks.pole_number", $scope.selectedPole, "tb_patrol_tasks.pole_task_value", "bttransfer.idbttransfer", "tb_patrol_tasks.pole_task_id", 1, "btTransfer");
        queryTasksTable("pme.pmedesc", "pme", "tb_patrol_tasks", "tb_patrol_tasks.pole_number", $scope.selectedPole, "tb_patrol_tasks.pole_task_value", "pme.idpme", "tb_patrol_tasks.pole_task_id", 6, "pme");
        queryTasksTable("staywire.staywiredesc", "staywire", "tb_patrol_tasks", "tb_patrol_tasks.pole_number", $scope.selectedPole, "tb_patrol_tasks.pole_task_value", "staywire.idstaywire", "tb_patrol_tasks.pole_task_id", 7, "stay");
        queryTasksTable("treecutting.treecuttingdesc", "treecutting", "tb_patrol_tasks", "tb_patrol_tasks.pole_number", $scope.selectedPole, "tb_patrol_tasks.pole_task_value", "treecutting.idtreecutting", "tb_patrol_tasks.pole_task_id", 22, "treeCutting");



        queryYesNoOptions("tb_patrol_tasks", "pole_number", $scope.selectedPole, "replumbPole");
        queryYesNoOptions("tb_patrol_tasks", "pole_number", $scope.selectedPole, "utiliseExistingPole");
        queryYesNoOptions("tb_patrol_tasks", "pole_number", $scope.selectedPole, "removeExistingPole");
        queryYesNoOptions("tb_patrol_tasks", "pole_number", $scope.selectedPole, "streetlightTransfer");
        queryYesNoOptions("tb_patrol_tasks", "pole_number", $scope.selectedPole, "unbind");
        queryYesNoOptions("tb_patrol_tasks", "pole_number", $scope.selectedPole, "additionalSingleConductor");
        queryYesNoOptions("tb_patrol_tasks", "pole_number", $scope.selectedPole, "pc400");
        queryYesNoOptions("tb_patrol_tasks", "pole_number", $scope.selectedPole, "poleExtensionBracket");
        queryYesNoOptions("tb_patrol_tasks", "pole_number", $scope.selectedPole, "transfereExistingUGService");
        queryYesNoOptions("tb_patrol_tasks", "pole_number", $scope.selectedPole, "lvStraighJoint");
        queryYesNoOptions("tb_patrol_tasks", "pole_number", $scope.selectedPole, "lvOutage");
        queryYesNoOptions("tb_patrol_tasks", "pole_number", $scope.selectedPole, "hvOutage");

        
    }


    // Query Patrol Details
    function queryPatrolDetailsTable(apiTableDescription, apiTable, patrolDetailsTable, patrolDetailsTableValue, apiTableID, previousPatrolValue) {
        var sql = 'SELECT ' + apiTableDescription + ' FROM ' + apiTable + ', ' + patrolDetailsTable + ' WHERE ' + patrolDetailsTableValue + ' = ' + apiTableID + '';
        //alert("SQL: " + sql);
        db.transaction(function (tx) {
            tx.executeSql(sql, [],
                (function (previousPatrolValue) {
                    return function (tx, results) {
                        success(tx, results, previousPatrolValue);
                    };
                })(previousPatrolValue), error);
        });
    }


    function success(tx, results, previousPatrolValue) {
        //alert("Query Length: " + results.rows.length);
        //alert("previousPatrolValue: " + previousPatrolValue);

        for (var i = 0; i < results.rows.length; i++) {
            angular.forEach(results.rows.item(i), function (value, key) {
                //alert("Value: " + value);
                //alert("Key: " + key);

                $scope[previousPatrolValue] = value;
                //alert("$scope.poleChangeReason: " + $scope.poleChangeReason);
            });
        }
    }

    function error(tx, err) {
        alert("Error: " + err.message);
    }


    function getHeaderDetails(apiTableTransformerID, apiTable, apiTablePoleKey, selectedPole, transformerID) {
        var sql = 'SELECT ' + apiTableTransformerID + ' FROM ' + apiTable + ' WHERE ' + apiTablePoleKey + ' = "' + selectedPole + '"';
        //alert("Pole SQL: " + sql);

        db.transaction(function (tx) {
            tx.executeSql(sql, [],
                (function (transformerID) {
                    return function (tx, results) {
                        poleSuccess(tx, results, transformerID);
                    };
                })(transformerID), poleError);
        });
    }

    // Get the Transformer ID
    function poleSuccess(tx, results, transformerID) {
        //alert("Query Length: " + results.rows.length);
        //alert("Transformer ID: " + transformerID);

        for (var i = 0; i < results.rows.length; i++) {
            angular.forEach(results.rows.item(i), function (value, key) {
                //alert("Value: " + value);
                //alert("Key: " + key);

                $scope[transformerID] = value;
                //alert("$scope.transformerID: " + $scope.transformerID);
            });
        }


        // Query the Header Table Freeform text boxes
        queryHeaderFreeFormText("tb_patrol_header.isolation_point_comments", "tb_patrol_header", "tb_patrol_header.transformer_id", $scope.transformerID, "isolationPointComment");
        queryHeaderFreeFormText("tb_patrol_header.normally_open_point_comments", "tb_patrol_header", "tb_patrol_header.transformer_id", $scope.transformerID, "normallyOpenPointComment");

        queryHeaderYesNoOptions("tb_patrol_header.normally_open_point_id", "tb_patrol_header", "tb_patrol_header.transformer_id", $scope.transformerID, "normallyOpenPoint");
        queryHeaderYesNoOptions("tb_patrol_header.normally_open_point_checked_id", "tb_patrol_header", "tb_patrol_header.transformer_id", $scope.transformerID, "normallyOpenPointChecked");


        // Get the Transformer Name
        var sql = 'SELECT tb_transformer_list.transformerdesc FROM tb_transformer_list WHERE tb_transformer_list.idtransformer = ' + $scope.transformerID;
        db.transaction(function (tx) {
            tx.executeSql(sql, [], transformerSuccess, transformerError);
        });
    }

    function poleError(tx, err) {
        alert("Error: " + err.message);
    }

    // Get the Transformer Name
    function transformerSuccess(tx, results) {
        //alert("Transfomer Length: " + results.rows.length);

        for (var i = 0; i < results.rows.length; i++) {
            angular.forEach(results.rows.item(i), function (value, key) {
                //alert("Value: " + value);
                //alert("Key: " + key);

                $scope.transformerName = value;
                //alert("$scope.transformerName: " + $scope.transformerName);
            });
        }

        // Get the Grid Square ID
        var sql = 'SELECT tb_transformer_list.mapid FROM tb_transformer_list WHERE tb_transformer_list.idtransformer = ' + $scope.transformerID;
        db.transaction(function (tx) {
            tx.executeSql(sql, [], gridSquareIDsuccess, gridSquareError);
        })
    }

    function transformerError(tx, err) {
        alert("Error: " + err.message);
    }

    // Grid Square ID
    function gridSquareIDsuccess(tx, results) {
        //alert("Grid Square Length: " + results.rows.length);

        for (var i = 0; i < results.rows.length; i++) {
            angular.forEach(results.rows.item(i), function (value, key) {
                //alert("Value: " + value);
                //alert("Key: " + key);

                $scope.gridSquareID = value;
                //alert("$scope.gridSquareID: " + $scope.gridSquareID);
            });
        }

        // Get the Grid Square Name
        var sql = 'SELECT tb_grid_square_list.mapdesc FROM tb_grid_square_list WHERE tb_grid_square_list.idmap = ' + $scope.gridSquareID;
        db.transaction(function (tx) {
            tx.executeSql(sql, [], gridSquareNameIDSuccess, gridSquareNameError);
        })
    }

    function gridSquareError(tx, err) {
        alert("Error: " + err.message);
    }

    // Get the Grid Square Name
    function gridSquareNameIDSuccess(tx, results) {
        //alert("Grid Square Length: " + results.rows.length);

        for (var i = 0; i < results.rows.length; i++) {
            angular.forEach(results.rows.item(i), function (value, key) {
                //alert("Value: " + value);
                //alert("Key: " + key);

                $scope.gridSquareName = value;
                //alert("$scope.gridSquareName: " + $scope.gridSquareName);
            });
        }
    }

    function gridSquareNameError(tx, err) {
        alert("Error: " + err.message);
    }




    // Task Selection Options
    function queryTasksTable(apiTableDescription, apiTableName, taskTableName, poleNumber, selectedPole, poleTaskValue, apiTableID, tasktableTaskID, questionNumber, valueToDisplay) {
        var sql = 'SELECT ' + apiTableDescription + ' FROM ' + apiTableName + ', ' + taskTableName + ' WHERE ' + poleNumber + ' = "' + selectedPole + '" AND ' + poleTaskValue + ' = ' + apiTableID + ' AND ' + tasktableTaskID + ' = ' + questionNumber;
        //alert("SQL: " + sql);
        db.transaction(function (tx) {
            tx.executeSql(sql, [],
                (function (valueToDisplay) {
                    return function (tx, results) {
                        queryTasksTableSuccess(tx, results, valueToDisplay);
                    };
                })(valueToDisplay), queryTasksTableError);
        });
    }

    function queryTasksTableSuccess(tx, results, valueToDisplay) {
        //alert("queryTasksTable Length: " + results.rows.length);
        //alert("previousPatrolValue: " + previousPatrolValue);

        for (var i = 0; i < results.rows.length; i++) {
            angular.forEach(results.rows.item(i), function (value, key) {
                //alert("Value: " + value);
                //alert("Key: " + key);

                $scope[valueToDisplay] = value;
                //alert("$scope.btTransfer: " + $scope.btTransfer);
            });
        }
    }

    function queryTasksTableError(tx, err) {
        alert("queryTasksTable Error: " + err.message);
    }



    // Header Freeform Text
    function queryHeaderFreeFormText(comments, headerTable, headerTableTransformerID, transformerID, valueToDisplay) {
        var sql = 'SELECT ' + comments + ' FROM ' + headerTable + ' WHERE ' + headerTableTransformerID + ' = ' + transformerID;
        //alert("SQL: " + sql);
        db.transaction(function (tx) {
            tx.executeSql(sql, [],
                (function (valueToDisplay) {
                    return function (tx, results) {
                        freeFormSuccess(tx, results, valueToDisplay);
                    };
                })(valueToDisplay), freeFormError);
        });
    }

    function freeFormSuccess(tx, results, valueToDisplay) {
        //alert("Query Length: " + results.rows.length);
        //alert("previousPatrolValue: " + previousPatrolValue);

        for (var i = 0; i < results.rows.length; i++) {
            angular.forEach(results.rows.item(i), function (value, key) {
                //alert("Value: " + value);
                //alert("Key: " + key);

                $scope[valueToDisplay] = value;
                //alert("$scope.isolationPointComment: " + $scope.isolationPointComment);
            });
        }
    }

    function freeFormError(tx, err) {
        alert("Header Free Form Text Error: " + err.message);
    }


    // Details Freeform Text
    function queryDetailsFreeFormText(comments, detailsTable, detailsTablePoleName, poleName, valueToDisplay) {
        var sql = 'SELECT ' + comments + ' FROM ' + detailsTable + ' WHERE ' + detailsTablePoleName + ' = "' + poleName + '"';
        //alert("SQL: " + sql);
        db.transaction(function (tx) {
            tx.executeSql(sql, [],
                (function (valueToDisplay) {
                    return function (tx, results) {
                        freeFormDetailsSuccess(tx, results, valueToDisplay);
                    };
                })(valueToDisplay), freeFormError);
        });
    }

    function freeFormDetailsSuccess(tx, results, valueToDisplay) {
        //alert("Query Length: " + results.rows.length);
        //alert("previousPatrolValue: " + previousPatrolValue);

        for (var i = 0; i < results.rows.length; i++) {
            angular.forEach(results.rows.item(i), function (value, key) {
                //alert("Value: " + value);
                //alert("Key: " + key);

                $scope[valueToDisplay] = value;
                //alert("$scope.isolationPointComment: " + $scope.isolationPointComment);
            });
        }
    }

    function freeFormDetailsError(tx, err) {
        alert("Details Free Form Text Error: " + err.message);
    }
    


    // Query Success Callback
    function queryFormInputSuccess(tx, results, variableName) {
        //alert("Query success...");
        
        alert("Length: " + results.rows.length);

        for (var i = 0; i < results.rows.length; i++) {
          
            $scope[variableName] = results.rows.item(i).polechangereasondesc;
            alert("$scope.poleChangeReason: " + $scope.poleChangeReason);
            
        }
    }

    // Query Error Callback
    function queryFormInputError(tx, err) {
        alert("Error processing SQL query with Error Code: " + err.code + ". Error Message: " + err.message);
    }



    // Header Yes/No Options
    function queryHeaderYesNoOptions(selectedValue, tableName, tableTransformerID, transformerID, valueToDisplay) {
        var sql = 'SELECT ' + selectedValue + ' FROM ' + tableName + ' WHERE ' + tableTransformerID + ' = "' + transformerID + '"';
        //alert("SQL: " + sql);
        db.transaction(function (tx) {
            tx.executeSql(sql, [],
                (function (valueToDisplay) {
                    return function (tx, results) {
                        headerYesNoSuccess(tx, results, valueToDisplay);
                    };
                })(valueToDisplay), headerYesNoError);
        });
    }

    function headerYesNoSuccess(tx, results, variableName) {
        //alert("Query Length: " + results.rows.length);
        //alert("previousPatrolValue: " + previousPatrolValue);

        for (var i = 0; i < results.rows.length; i++) {
            angular.forEach(results.rows.item(i), function (value, key) {
                //alert("Value: " + value);
                //alert("Key: " + key);

                if (value == 0) {
                    $scope[variableName] = "No";
                }
                else if (value == 1) {
                    $scope[variableName] = "Yes";
                }
                else {
                    $scope[variableName] = "N/A";
                }
                

                
                //alert("$scope.isolationPointComment: " + $scope.isolationPointComment);
            });
        }
    }

    function headerYesNoError(tx, err) {
        alert("Header Free Form Text Error: " + err.message);
    }



    function queryYesNoOptions(tableName, poleNumber, selectedPole, valueToDisplay) {
        var sql = 'SELECT * FROM ' + tableName + ' WHERE ' + poleNumber + ' = "' + selectedPole + '"';
        //alert("SQL: " + sql);

        db.transaction(function (tx) {
            tx.executeSql(sql, [],
                (function (valueToDisplay) {
                    return function (tx, results) {
                        yesNoSuccess(tx, results, valueToDisplay);
                    };
                })(valueToDisplay), yesNoError);
        });
    }

    // Query Success Callback
    function yesNoSuccess(tx, results, variableName) {
        //alert("Query success...");

        //alert("Length: " + results.rows.length);

        for (var i = 0; i < results.rows.length; i++) {
            switch (results.rows.item(i).pole_task_id) {
                case 2:
                    if (results.rows.item(i).pole_task_value == 0) {
                        $scope[variableName] = "No";
                    }
                    else if (results.rows.item(i).pole_task_value == 1) {
                        $scope[variableName] = "Yes";
                    }
                    else {
                        $scope[variableName] = "N/A";
                    }
                    break;

                case 3:
                    if (results.rows.item(i).pole_task_value == 0) {
                        $scope[variableName] = "No";
                    }
                    else if (results.rows.item(i).pole_task_value == 1) {
                        $scope[variableName] = "Yes";
                    }
                    else {
                        $scope[variableName] = "N/A";
                    }
                    break;

                case 4:
                    if (results.rows.item(i).pole_task_value == 0) {
                        $scope[variableName] = "No";
                    }
                    else if (results.rows.item(i).pole_task_value == 1) {
                        $scope[variableName] = "Yes";
                    }
                    else {
                        $scope[variableName] = "N/A";
                    }
                    break;

                case 5:
                    if (results.rows.item(i).pole_task_value == 0) {
                        $scope[variableName] = "No";
                    }
                    else if (results.rows.item(i).pole_task_value == 1) {
                        $scope[variableName] = "Yes";
                    }
                    else {
                        $scope[variableName] = "N/A";
                    }
                    break;

                case 8:
                    if (results.rows.item(i).pole_task_value == 0) {
                        $scope[variableName] = "No";
                    }
                    else if (results.rows.item(i).pole_task_value == 1) {
                        $scope[variableName] = "Yes";
                    }
                    else {
                        $scope[variableName] = "N/A";
                    }
                    break;

                case 9:
                    if (results.rows.item(i).pole_task_value == 0) {
                        $scope[variableName] = "No";
                    }
                    else if (results.rows.item(i).pole_task_value == 1) {
                        $scope[variableName] = "Yes";
                    }
                    else {
                        $scope[variableName] = "N/A";
                    }
                    break;

                case 10:
                    if (results.rows.item(i).pole_task_value == 0) {
                        $scope[variableName] = "No";
                    }
                    else if (results.rows.item(i).pole_task_value == 1) {
                        $scope[variableName] = "Yes";
                    }
                    else {
                        $scope[variableName] = "N/A";
                    }
                    break;

                case 11:
                    if (results.rows.item(i).pole_task_value == 0) {
                        $scope[variableName] = "No";
                    }
                    else if (results.rows.item(i).pole_task_value == 1) {
                        $scope[variableName] = "Yes";
                    }
                    else {
                        $scope[variableName] = "N/A";
                    }
                    break;

                case 12:
                    if (results.rows.item(i).pole_task_value == 0) {
                        $scope[variableName] = "No";
                    }
                    else if (results.rows.item(i).pole_task_value == 1) {
                        $scope[variableName] = "Yes";
                    }
                    else {
                        $scope[variableName] = "N/A";
                    }
                    break;

                case 16:
                    if (results.rows.item(i).pole_task_value == 0) {
                        $scope[variableName] = "No";
                    }
                    else if (results.rows.item(i).pole_task_value == 1) {
                        $scope[variableName] = "Yes";
                    }
                    else {
                        $scope[variableName] = "N/A";
                    }
                    break;

                case 20:
                    if (results.rows.item(i).pole_task_value == 0) {
                        $scope[variableName] = "No";
                    }
                    else if (results.rows.item(i).pole_task_value == 1) {
                        $scope[variableName] = "Yes";
                    }
                    else {
                        $scope[variableName] = "N/A";
                    }
                    break;

                case 21:
                    if (results.rows.item(i).pole_task_value == 0) {
                        $scope[variableName] = "No";
                    }
                    else if (results.rows.item(i).pole_task_value == 1) {
                        $scope[variableName] = "Yes";
                    }
                    else {
                        $scope[variableName] = "N/A";
                    }
                    break;
            }
        }
    }

    // Query Error Callback
    function yesNoError(tx, err) {
        alert("Yes/No Error: " + err.message);
    }

});