// Get the main app.js module and inject the SharedProperties service
var wiraForm = angular.module("wiraFormController", []);
wiraForm.controller("WiraFormController", function ($scope, $http, $timeout, SharedProperties, NetworkConnection, CreateLocalStorageTablesService) {

    // Patrol form variables
    $scope.gridSquareID = SharedProperties.getGridSquareID();
    $scope.transformerID = SharedProperties.getTransformerID();
    $scope.poleID = SharedProperties.getPoleID();
    $scope.userName = SharedProperties.getUserName();
    $scope.userID = SharedProperties.getUserID();

    //alert("SharedProperties.getGridSquareID(): " + SharedProperties.getGridSquareID());
    //alert("SharedProperties.getTransformerID(): " + SharedProperties.getTransformerID()); 
    //alert("SharedProperties.getPoleID(): " + SharedProperties.getPoleID());
    //alert("SharedProperties.getUserName(): " + SharedProperties.getUserName());
    //alert("SharedProperties.getUserID(): " + SharedProperties.getUserID());

    /* ********** TEST ********** */
    //$scope.gridSquareID = 23;
    //$scope.transformerID = 23423;
    //$scope.poleID = 3452;
    //$scope.userID = 666;
    






    // Initialise
    var init = function () {
        document.addEventListener("deviceready", onDeviceReady, false);
    };

    // Fire init() after definition
    init();

    // Device APIs are available
    function onDeviceReady() {
        db = window.openDatabase("tliphp", "1.0", "TLI Rapid", 200000);

        // Create the localStorage Table for storing the WIRA data
        CreateLocalStorageTablesService.createWIRATable("tb_wira", "grid_square_id", "transformer_id", "pole_id", "location_and_activity", "esqcr_issues", "day", "month", "year", "patroller_id", "road_schematic", "road_type", "road_width", "speed_limit", "environment", "traffic_volume", "footpath_diversion", "traffic_management_selection", "comments");

        // Varable to hold the filtered results
        $scope.filter = {};

        // Create the initial Database entry - populating with values from previous patrol form
        var sql = 'INSERT OR IGNORE INTO tb_wira (grid_square_id, transformer_id, pole_id, patroller_id) VALUES (' + SharedProperties.getGridSquareID() + ', ' + SharedProperties.getTransformerID() + ', "' + SharedProperties.getPoleID() + '", ' + SharedProperties.getUserID() + ')';
        //var sql = 'INSERT OR IGNORE INTO tb_wira (grid_square_id, transformer_id, pole_id, patroller_id) VALUES (' + $scope.gridSquareID + ', ' + $scope.transformerID + ', "' + $scope.poleID + '", ' + $scope.userID + ')';
        //alert("Insert SQL: " + sql);
        db.transaction(function (tx) { tx.executeSql(sql); });
        queryWIRATable("tb_wira");
    }

    













    // Query the Form Input Data Tables
    function queryWIRATable(tableName) {
        //alert("Querying table: " + tableName);
        var sql = 'SELECT * FROM ' + tableName + '';
        db.transaction(function (tx) {
            tx.executeSql(sql, [], queryWIRASuccess, queryWIRAError);
        });
    }

    // Query Success Callback
    function queryWIRASuccess(tx, results) {
        //alert("Query success...");
        var len = results.rows.length;
        //alert("WIRA Length: " + len);

        for (var i = 0; i < len; i++) {
            /*
            alert("grid_square_id: " + results.rows.item(i).grid_square_id);
            alert("transformer_id: " + results.rows.item(i).transformer_id);
            alert("pole_id: " + results.rows.item(i).pole_id);
            alert("location_and_activity: " + results.rows.item(i).location_and_activity);
            alert("esqcr_issues: " + results.rows.item(i).esqcr_issues);
            alert("day: " + results.rows.item(i).day);
            alert("month: " + results.rows.item(i).month);
            alert("year: " + results.rows.item(i).year);
            alert("patroller_id: " + results.rows.item(i).patroller_id);
            alert("road_schematic: " + results.rows.item(i).road_schematic);
            alert("road_type: " + results.rows.item(i).road_type);
            alert("road_width: " + results.rows.item(i).road_width);
            alert("speed_limit: " + results.rows.item(i).speed_limit);
            alert("environment: " + results.rows.item(i).environment);
            alert("traffic_volume: " + results.rows.item(i).traffic_volume);
            alert("footpath_diversion: " + results.rows.item(i).footpath_diversion);
            alert("traffic_management_selection: " + results.rows.item(i).traffic_management_selection);
            alert("comments: " + results.rows.item(i).comments);
            */
        }
    }

    // Query Error Callback
    function queryWIRAError(err) {
        alert("Error processing SQL query with Error Code: " + err.code + ". Error Message: " + err.message);
    }

































    // Save the Location and Activity comments to SharedProperties
    $scope.$watch("locationAndActivityComments", function (newVal, oldVal) {
        if (newVal !== oldVal) {
            var sql = 'UPDATE tb_wira SET location_and_activity = "' + newVal + '" WHERE pole_id = "' + $scope.poleID + '"';
            db.transaction(function (tx) { tx.executeSql(sql); });
            //queryWIRATable(tableName);
        }
    });

    // Save the Road Width to SharedProperties
    $scope.$watch("roadWidth", function (newVal, oldVal) {
        if (newVal !== oldVal) {
            var sql = 'UPDATE tb_wira SET road_width = "' + newVal + '" WHERE pole_id = "' + $scope.poleID + '"';
            db.transaction(function (tx) { tx.executeSql(sql); });
            //queryWIRATable("tb_wira");
        }
    });

    // Save the Speed Limit to SharedProperties
    $scope.$watch("speedLimit", function (newVal, oldVal) {
        if (newVal !== oldVal) {
            var sql = 'UPDATE tb_wira SET speed_limit = "' + newVal + '" WHERE pole_id = "' + $scope.poleID + '"';
            db.transaction(function (tx) { tx.executeSql(sql); });
            //queryWIRATable("tb_wira");
        }
    });

    // Save the Additional comments to SharedProperties
    $scope.$watch("additionalComments", function (newVal, oldVal) {
        if (newVal !== oldVal) {
            var sql = 'UPDATE tb_wira SET comments = "' + newVal + '" WHERE pole_id = "' + $scope.poleID + '"';
            db.transaction(function (tx) { tx.executeSql(sql); });
            //queryWIRATable("tb_wira");
        }
    });



    
    // Get selected WIRA values from Form
    $scope.changedWIRAValue = function (selectedValue, identifier) {
        switch (identifier) {

            /* *********************** Location and Activity Comment *********************** */

            case "ESQCRIssue":
                //alert("Selected Value: " + selectedValue);
                var sql = 'UPDATE tb_wira SET esqcr_issues = ' + selectedValue + ' WHERE pole_id = "' + $scope.poleID + '"';
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryWIRATable("tb_wira");
                break;

            case "Day":
                var sql = 'UPDATE tb_wira SET day = ' + selectedValue + ' WHERE pole_id = "' + $scope.poleID + '"';
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryWIRATable("tb_wira");
                break;

            case "Month":
                var sql = 'UPDATE tb_wira SET month = ' + selectedValue + ' WHERE pole_id = "' + $scope.poleID + '"';
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryWIRATable("tb_wira");
                break;

            case "Year":
                var sql = 'UPDATE tb_wira SET year = ' + selectedValue + ' WHERE pole_id = "' + $scope.poleID + '"';
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryWIRATable("tb_wira");
                break;

            case "RoadSchematic":
                var sql = 'UPDATE tb_wira SET road_schematic = ' + selectedValue + ' WHERE pole_id = "' + $scope.poleID + '"';
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryWIRATable("tb_wira");
                break;

            case "RoadType":
                var sql = 'UPDATE tb_wira SET road_type = ' + selectedValue + ' WHERE pole_id = "' + $scope.poleID + '"';
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryWIRATable("tb_wira");
                break;

                /* *********************** Road Width *********************** */

                /* *********************** Speed Limit *********************** */

            case "Environment":
                var sql = 'UPDATE tb_wira SET environment = ' + selectedValue + 'WHERE pole_id = "' + $scope.poleID + '"';
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryWIRATable("tb_wira");
                break;

            case "TrafficVolume":
                var sql = 'UPDATE tb_wira SET traffic_volume = ' + selectedValue + ' WHERE pole_id = "' + $scope.poleID + '"';
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryWIRATable("tb_wira");
                break;

            case "FootpathDiversion":
                var sql = 'UPDATE tb_wira SET footpath_diversion = ' + selectedValue + ' WHERE pole_id = "' + $scope.poleID + '"';
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryWIRATable("tb_wira");
                break;

            case "TrafficManagementSelection":
                var sql = 'UPDATE tb_wira SET traffic_management_selection = ' + selectedValue + ' WHERE pole_id = "' + $scope.poleID + '"';
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryWIRATable("tb_wira");
                break;

            default:
        }
    }






    // Drop Down List Arrays
    // ESQCR ISsues
    $scope.ESQCRIssues = [{
        esqcrIssuesDesc: "Rotten Pole Replacements",
        esqcrIssuesID: "1"
    }, {
        esqcrIssuesDesc: "Statutory Clearance",
        esqcrIssuesID: "2"
    }];

    // Day 
    $scope.Day = [{
        dayDesc: "1",
        dayID: "1"
    }, {
        dayDesc: "2",
        dayID: "2"
    }, {
        dayDesc: "3",
        dayID: "3"
    }, {
        dayDesc: "4",
        dayID: "4"
    }, {
        dayDesc: "5",
        dayID: "5"
    }, {
        dayDesc: "6",
        dayID: "6"
    }, {
        dayDesc: "7",
        dayID: "7"
    }, {
        dayDesc: "8",
        dayID: "8"
    }, {
        dayDesc: "9",
        dayID: "9"
    }, {
        dayDesc: "10",
        dayID: "10"
    }, {
        dayDesc: "11",
        dayID: "11"
    }, {
        dayDesc: "12",
        dayID: "12"
    }, {
        dayDesc: "13",
        dayID: "13"
    }, {
        dayDesc: "14",
        dayID: "14"
    }, {
        dayDesc: "15",
        dayID: "15"
    }, {
        dayDesc: "16",
        dayID: "16"
    }, {
        dayDesc: "17",
        dayID: "17"
    }, {
        dayDesc: "18",
        dayID: "18"
    }, {
        dayDesc: "19",
        dayID: "19"
    }, {
        dayDesc: "20",
        dayID: "20"
    }, {
        dayDesc: "21",
        dayID: "21"
    }, {
        dayDesc: "22",
        dayID: "22"
    }, {
        dayDesc: "23",
        dayID: "23"
    }, {
        dayDesc: "24",
        dayID: "24"
    }, {
        dayDesc: "25",
        dayID: "25"
    }, {
        dayDesc: "26",
        dayID: "26"
    }, {
        dayDesc: "27",
        dayID: "27"
    }, {
        dayDesc: "28",
        dayID: "28"
    }, {
        dayDesc: "29",
        dayID: "29"
    }, {
        dayDesc: "30",
        dayID: "30"
    }, {
        dayDesc: "31",
        dayID: "31"
    }];

    // Month
    $scope.Month = [{
        monthDesc: "Jan",
        monthID: "1"
    }, {
        monthDesc: "Feb",
        monthID: "2"
    }, {
        monthDesc: "March",
        monthID: "3"
    }, {
        monthDesc: "April",
        monthID: "4"
    }, {
        monthDesc: "May",
        monthID: "5"
    }, {
        monthDesc: "June",
        monthID: "6"
    }, {
        monthDesc: "July",
        monthID: "7"
    }, {
        monthDesc: "Aug",
        monthID: "8"
    }, {
        monthDesc: "Sept",
        monthID: "9"
    }, {
        monthDesc: "Oct",
        monthID: "10"
    }, {
        monthDesc: "Nov",
        monthID: "11"
    }, {
        monthDesc: "Dec",
        monthID: "12"
    }];

    // Year
    $scope.Year = [{
        yearDesc: "2016",
        yearID: "1"
    }, {
        yearDesc: "2017",
        yearID: "2"
    }];

    // Road Schematic
    $scope.RoadSchematic = [{
        roadSchematicDesc: "Straight line",
        roadSchematicID: "1"
    }, {
        roadSchematicDesc: "Corner",
        roadSchematicID: "2"
    }, {
        roadSchematicDesc: "Curved",
        roadSchematicID: "3"
    }, {
        roadSchematicDesc: "T-junction",
        roadSchematicID: "4"
    }, {
        roadSchematicDesc: "Cross roads",
        roadSchematicID: "5"
    }];

    // Road Type
    $scope.RoadType = [{
        roadTypeDesc: "A road",
        roadTypeID: "1"
    }, {
        roadTypeDesc: "B road",
        roadTypeID: "2"
    }, {
        roadTypeDesc: "Dual carriageway",
        roadTypeID: "3"
    }, {
        roadTypeDesc: "Private road",
        roadTypeID: "4"
    }];

    // Environment
    $scope.Environment = [{
        environmentDesc: "Urban",
        environmentID: "1"
    }, {
        environmentDesc: "Rural",
        environmentID: "2"
    }];

    // Traffic Volume
    $scope.TrafficVolume = [{
        trafficVolumeDesc: "Heavy",
        trafficVolumeID: "1"
    }, {
        trafficVolumeDesc: "Light",
        trafficVolumeID: "2"
    }];

    // Footpath Diversion
    $scope.FootpathDiversion = [{
        footpathDiversionDesc: "Yes",
        footpathDiversionID: "1"
    }, {
        footpathDiversionDesc: "No",
        footpathDiversionID: "2"
    }];

    // Traffic MAnagement Selection
    $scope.TrafficManagementSelection = [{
        trafficManagementSelectionDesc: "3 Way traffic lights",
        trafficManagementSelectionID: "1"
    }, {
        trafficManagementSelectionDesc: "2 Way traffic lights",
        trafficManagementSelectionID: "2"
    }, {
        trafficManagementSelectionDesc: "Stop/go",
        trafficManagementSelectionID: "3"
    }, {
        trafficManagementSelectionDesc: "Piority",
        trafficManagementSelectionID: "4"
    }, {
        trafficManagementSelectionDesc: "Tapers",
        trafficManagementSelectionID: "5"
    }, {
        trafficManagementSelectionDesc: "Give and take",
        trafficManagementSelectionID: "6"
    }];

});