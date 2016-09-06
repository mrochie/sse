// This is a JavaScript file

// Get the main app.js module and inject the SharedProperties service
var gridSquareList = angular.module("gridSquareListController", []);
gridSquareList.controller("GridSquareListController", function ($scope, $http, $filter, $timeout, $interval, SharedProperties, NetworkConnection, CreateLocalStorageTablesService, DownloadPatrolFormDataService, CreateFormArraysService) {



    $scope.dob = "2013-01-01";

    $scope.getDateOfBirth = function (dob) {
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]
        var split = dob.split("-");
        return parseInt(split[2]) + " " + months[parseInt(split[1]) - 1];
    }

    //$scope.GridSquareArray = [];
    //alert("$scope.GridSquareArray: " + $scope.GridSquareArray);

    //$scope.GridSquareArray = [CreateFormArraysService.getArray("GridSquareArray")];
    //alert("$scope.GridSquareArray: " + $scope.GridSquareArray);




    // Initialising Database variable
    var db;

    // Initialise UI logic
    $scope.showPatrolForm = false;

    /* Defect / No Deect / No Solution */
    $scope.defect_noDefect_noSolution_option = "n/a";

    // Variables to hold localStorage Tables data - to be able to access from view
    $scope.GridSquareArray = [];
    $scope.TransformerArray = [];
    $scope.PoleArray = [];
    $scope.PoleChangeReasonArray = [];
    $scope.PoleTypeArray = [];
    $scope.PolingOptionsArray = [];
    $scope.IsolationPointsArray = [];
    $scope.SurfaceTypesArray = [];
    $scope.ExcavationMethodArray = [];
    $scope.MachineryValuesArray = [];
    $scope.ConductorTypesArray = [];
    $scope.CableTypesArray = [];
    $scope.ServiceTypesArray = [];
    $scope.TreeCuttingArray = [];
    $scope.PMEArray = [];
    $scope.BTTransferArray = [];
    $scope.StayWireArray = [];
    $scope.JointBayArray = [];
    $scope.UndergroundServiceArray = [];

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
    }, {
        tablename: "polechangereason",
        arrayname: "PoleChangeReasonArray"
    }, {
        tablename: "poletypes",
        arrayname: "PoleTypeArray"
    }, {
        tablename: "polingoptions",
        arrayname: "PolingOptionsArray"
    }, {
        tablename: "isolationpoints",
        arrayname: "IsolationPointsArray"
    }, {
        tablename: "surfacetypes",
        arrayname: "SurfaceTypesArray"
    }, {
        tablename: "excavationmethod",
        arrayname: "ExcavationMethodArray"
    }, {
        tablename: "machineryvalues",
        arrayname: "MachineryValuesArray"
    }, {
        tablename: "conductortypes",
        arrayname: "ConductorTypesArray"
    }, {
        tablename: "cabletypes",
        arrayname: "CableTypesArray"
    }, {
        tablename: "servicetypes",
        arrayname: "ServiceTypesArray"
    }, {
        tablename: "treecutting",
        arrayname: "TreeCuttingArray"
    }, {
        tablename: "pme",
        arrayname: "PMEArray"
    }, {
        tablename: "bttransfer",
        arrayname: "BTTransferArray"
    }, {
        tablename: "staywire",
        arrayname: "StayWireArray"
    }, {
        tablename: "jointbay",
        arrayname: "JointBayArray"
    }, {
        tablename: "undergroundservice",
        arrayname: "UndergroundServiceArray"
    }];
    
    

    // Initialise
    var init = function ()
    {
        // Wait for the device API libraries to load
        document.addEventListener("deviceready", onDeviceReady, false);
    };

    // Fire init() after definition
    init();
    
        // Camera variables
        var pictureSource;
        var destinationType;

    // Device APIs are available
    function onDeviceReady()
    {
        // Open connection to Database
        db = window.openDatabase("tliphp", "1.0", "TLI Rapid", 200000);

        // Get date
        getDate();

        // Create the Tables for storing the Patrol Form Input Data
        CreateLocalStorageTablesService.createPatrolHeaderTable("tb_patrol_header", "grid_square_id", "transformer_id", "isolation_point_id", "isolation_point_comments", "isolation_point_photo", "normally_open_point_id", "normally_open_point_checked_id", "normally_open_point_comments", "normally_open_point_photo", "patroller_id", "patrol_date");
        CreateLocalStorageTablesService.createPatrolDetailsTable("tb_patrol_details", "pole_key_id", "pole_number", "pole_change_required", "pole_change_reason", "pole_type", "poling_option", "height", "surface_type", "excavation_method", "machinery_required", "mainline_conductor_change_required", "existing_conductor_type", "cable_type", "length", "new_conductor_type", "service_change_required", "no_of_services", "quantity_1", "service_type_one", "quantity_2", "service_type_two", "house_no", "street_name", "land_access_required");
        CreateLocalStorageTablesService.createTasksTable("tb_patrol_tasks", "pole_number", "pole_task_id", "pole_task_value");

        // Query the localStorage API - populated Tables to get the Form select values
        queryLocalStorageTablesAndBuildArrays($scope.tableArrayAssociation);

        // Varable to hold the filtered results
        $scope.filter = {};

        // Camera variables
        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;
    }



    $scope.capturePhotoISO = function (source) {
        //alert("ISO Photo");
        // Retrieve image file location from specified source
        //navigator.camera.getPicture(onPhotoDataSuccessISO, onFail, { quality: 50, destinationType: destinationType.FILE_URI, sourceType: pictureSource });

        navigator.camera.getPicture(onPhotoDataSuccessISO, onFail, {
            quality: 75, destinationType: destinationType.FILE_URI, sourceType: Camera.PictureSourceType.CAMERA, encodingType: Camera.EncodingType.JPEG, targetWidth: 500, targetHeight: 500
        });
    }

    function onPhotoDataSuccessISO(imageURI) {
        // Uncomment to view the base64-encoded image data
        //alert("ISO Photo Success");

        // Get image handle
        var smallImage = document.getElementById('smallImage');

        // Unhide image elements
        smallImage.style.display = 'block';

        // Show the captured photo
        // The in-line CSS rules are used to resize the image
        //smallImage.src = "data:image/jpeg;base64," + imageData;
        smallImage.src = imageURI;
        //  alert(smallImage.src);
        //updatePhotoISO(smallImage.src);
    }
    
     $scope.capturePhotoNOP = function (source) {
        //alert("ISO Photo");
        // Retrieve image file location from specified source
        //navigator.camera.getPicture(onPhotoDataSuccessISO, onFail, { quality: 50, destinationType: destinationType.FILE_URI, sourceType: pictureSource });

        navigator.camera.getPicture(onPhotoDataSuccessNOP, onFail, {
            quality: 75, destinationType: destinationType.FILE_URI, sourceType: Camera.PictureSourceType.CAMERA, encodingType: Camera.EncodingType.JPEG, targetWidth: 500, targetHeight: 500
        });
    }

    function onPhotoDataSuccessNOP(imageURI) {
        // Uncomment to view the base64-encoded image data
        //alert("ISO Photo Success");

        // Get image handle
        var smallImageNOP = document.getElementById('smallImageNOP');

        // Unhide image elements
        smallImageNOP.style.display = 'block';

        // Show the captured photo
        // The in-line CSS rules are used to resize the image
        //smallImage.src = "data:image/jpeg;base64," + imageData;
        smallImageNOP.src = imageURI;
        //  alert(smallImage.src);
        //updatePhotoISO(smallImage.src);
    }

    // Called if something bad happens.
    function onFail(message) {
        alert('Photo capture failed because: ' + message);
    }

    function updatePhotoISO(selectedValue) {
        var sql = 'UPDATE tb_patrol_header SET isolation_point_photo = "' + selectedValue + '" WHERE transformer_id = ' + SharedProperties.getTransformerID() + '';
        //alert("Transformer SQL: " + sql)
        db.transaction(function (tx) { tx.executeSql(sql); });
        // alert(SharedProperties.getTransformerID());
        queryFormInputTable("tb_patrol_header");

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
        //alert("An error has occured - Error processing SQL query at grid-square-list.js -> queryLocalStorageTablesAndBuildArrays()." +
        //    "\n\nPlease make sure you have a active network connection and download the latest patrol data assigned to you.. If the problem persists please contact the TLI Development Team with the error code and message below." +
        //    "\n\nError Code: " + err.code + ".\nError Message: " + err.message);
    }


    //$scope.showNormallypenPointPhotos = false;
    $scope.normallyOpenPointPhotoModel = {};

    $scope.showNormallypenPointPhotos = false;
    // DUMMY PHOTO FUNCTION T SHOW THE PHOTOS
    $scope.showPhoto = function () {
        //alert("Getting here...");
        
            $scope.showNormallypenPointPhotos = true;
            //alert("Showing photo...");
    };



    /* ******************** Patrol Header ******************** */
    // Watch for changes in the Isolation Point comments and save to Header Table
    $scope.$watch("isolationPointComments", function (newVal, oldVal) {
        if (newVal !== oldVal) {
            var sql = 'UPDATE tb_patrol_header SET isolation_point_comments = "' + newVal + '" WHERE transformer_id = ' + SharedProperties.getTransformerID() + '';
            db.transaction(function (tx) { tx.executeSql(sql); });
            //queryFormInputTable("tb_patrol_header");
        }
    });

    // Save the Normally Open Point comments to SharedProperties
    $scope.$watch("normallyOpenPointComments", function (newVal, oldVal) {
        if (newVal !== oldVal) {
            var sql = 'UPDATE tb_patrol_header SET normally_open_point_comments = "' + newVal + '" WHERE transformer_id = ' + SharedProperties.getTransformerID() + '';
            db.transaction(function (tx) { tx.executeSql(sql); });
            //queryFormInputTable("tb_patrol_header");
        }
    });

    /* Header localStorage variables */
    //$scope.gridSquareID = "";
    //$scope.transformerID = "";
    $scope.isolationPointPhoto = "N/A";
    $scope.normallyOpenPointPhoto = "N/A";
    //$scope.patrollerID = SharedProperties.getUserID();
    //$scope.date = new Date();
    //$scope.patrolDate = $filter('date')(new Date(), 'yyyy-MM-dd');
    //SharedProperties.setDateSubmitted($scope.patrolDate);

    
    // Get selected Header values from Form
    $scope.changedHeaderValue = function (selectedValue, identifier)
    {
        switch (identifier)
        {
            case "GridSquare":
                //$scope.gridSquareID = selectedValue;
                SharedProperties.setGridSquareID(selectedValue);
                //alert("SharedProperties.getGridSquareID(): " + SharedProperties.getGridSquareID());

                //queryFormInputTable("tb_patrol_header");
                break;

            case "Transformer":
                //$scope.transformerID = selectedValue;
                //alert("SharedProperties.getGridSquareID(): " + SharedProperties.getGridSquareID());
                SharedProperties.setTransformerID(selectedValue);
                //alert("SharedProperties.getTransformerID(): " + SharedProperties.getTransformerID());
                var sql = 'INSERT OR IGNORE INTO tb_patrol_header (grid_square_id, transformer_id, patroller_id, patrol_date) VALUES (' + SharedProperties.getGridSquareID() + ', ' + +SharedProperties.getTransformerID() + ', ' + SharedProperties.getUserID() + ', "' + SharedProperties.getPatrolDate() + '")';
                //alert("Transformer SQL: " + sql)
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryFormInputTable("tb_patrol_header");
                break;

            case "IsolationPoint":
                var sql = 'UPDATE tb_patrol_header SET isolation_point_id = ' + selectedValue + ' WHERE transformer_id = ' + SharedProperties.getTransformerID() + '';
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryFormInputTable("tb_patrol_header");
                break;

                /* *********************** Isolation Point Comment *********************** */

                /* *********************** Isolation Point Photo *********************** */

            case "NormallyOpenPoint":
                var sql = 'UPDATE tb_patrol_header SET normally_open_point_id = ' + selectedValue + ' WHERE transformer_id = ' + SharedProperties.getTransformerID() + '';
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryFormInputTable("tb_patrol_header");
                break;

            case "NormallyOpenPointChecked":
                var sql = 'UPDATE tb_patrol_header SET normally_open_point_checked_id = ' + selectedValue + ' WHERE transformer_id = ' + SharedProperties.getTransformerID() + '';
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryFormInputTable("tb_patrol_header");
                break;

                /* *********************** Normally Open Point Comment *********************** */

                /* *********************** Normally Open Point Photo *********************** */

            default:
        }
    }

   


    // Query the Form Input Data Tables
    function queryFormInputTable(tableName) {
        //alert("Querying table: " + tableName);
        var sql = 'SELECT * FROM ' + tableName + '';
        db.transaction(function (tx) {
            tx.executeSql(sql, [], queryFormInputSuccess, queryFormInputError);
        });
    }

    // Query Success Callback
    function queryFormInputSuccess(tx, results) {
        //alert("Query success...");
        var len = results.rows.length;
        //alert("Length: " + len);

        for (var i = 0; i < len; i++) {
            /* HEADER DATA CHECKS 
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

            /* DETAILS DATA CHECKS 
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

            /* TASKS DATA CHECKS */
            alert("Pole ID: " + results.rows.item(i).pole_number);
            alert("Pole Task ID: " + results.rows.item(i).pole_task_id);
            alert("Pole Task Value: " + results.rows.item(i).pole_task_value);
        }
    }

    // Query Error Callback
    function queryFormInputError(tx, err) {
        alert("Error processing SQL query. \n\nError Code: " + err.code + ".\nError Message: " + err.message);
    }


    /* ******************** Patrol Details ******************** */
    // Watch for changes in Pole edit field
    $scope.$watch("PoleArray.polekey", function (newVal, oldVal) {
        if (newVal !== oldVal) {
            var sql = 'UPDATE tb_patrol_details SET pole_number = "' + newVal + '" WHERE pole_key_id = ' + SharedProperties.getPoleID() + '';
            db.transaction(function (tx) { tx.executeSql(sql); });
            //queryFormInputTable("tb_patrol_details");
        }
    });

    // Watch for changes in Height field
    $scope.$watch("height", function (newVal, oldVal) {
        if (newVal !== oldVal) {
            var sql = 'UPDATE tb_patrol_details SET height = ' + newVal + ' WHERE pole_key_id = "' + SharedProperties.getPoleID() + '"';
            db.transaction(function (tx) { tx.executeSql(sql); });
            //queryFormInputTable("tb_patrol_details");
        }
    });

    // Watch for changes in Length field
    $scope.$watch("length", function (newVal, oldVal) {
        if (newVal !== oldVal) {
            var sql = 'UPDATE tb_patrol_details SET length = ' + newVal + ' WHERE pole_key_id = "' + SharedProperties.getPoleID() + '"';
            db.transaction(function (tx) { tx.executeSql(sql); });
            //queryFormInputTable("tb_patrol_details");
        }
    });

    // Watch for changes in Number of Services field
    $scope.$watch("numberOfServices", function (newVal, oldVal) {
        if (newVal !== oldVal) {
            var sql = 'UPDATE tb_patrol_details SET no_of_services = ' + newVal + ' WHERE pole_key_id = "' + SharedProperties.getPoleID() + '"';
            db.transaction(function (tx) { tx.executeSql(sql); });
            //queryFormInputTable("tb_patrol_details");
        }
    });

    // Watch for changes in Service Quantity 1 field
    $scope.$watch("quantity1", function (newVal, oldVal) {
        if (newVal !== oldVal) {
            var sql = 'UPDATE tb_patrol_details SET quantity_1 = ' + newVal + ' WHERE pole_key_id = "' + SharedProperties.getPoleID() + '"';
            db.transaction(function (tx) { tx.executeSql(sql); });
            //queryFormInputTable("tb_patrol_details");
        }
    });

    // Watch for changes in Service Quantity 2 field
    $scope.$watch("quantity2", function (newVal, oldVal) {
        if (newVal !== oldVal) {
            var sql = 'UPDATE tb_patrol_details SET quantity_2 = ' + newVal + ' WHERE pole_key_id = "' + SharedProperties.getPoleID() + '"';
            db.transaction(function (tx) { tx.executeSql(sql); });
            //queryFormInputTable("tb_patrol_details");
        }
    });

    // Watch for changes in Hose No field
    $scope.$watch("houesNo", function (newVal, oldVal) {
        if (newVal !== oldVal) {
            var sql = 'UPDATE tb_patrol_details SET house_no = ' + newVal + ' WHERE pole_key_id = "' + SharedProperties.getPoleID() + '"';
            db.transaction(function (tx) { tx.executeSql(sql); });
            //queryFormInputTable("tb_patrol_details");
        }
    });

    // Watch for changes in Street field
    $scope.$watch("streetName", function (newVal, oldVal) {
        if (newVal !== oldVal) {
            var sql = 'UPDATE tb_patrol_details SET street_name = "' + newVal + '" WHERE pole_key_id = "' + SharedProperties.getPoleID() + '"';
            db.transaction(function (tx) { tx.executeSql(sql); });
            //queryFormInputTable("tb_patrol_details");
        }
    });

    /* Header localStorage variables */
    //$scope.poleKeyID = "";

    // Get selected Detail values from Form
    $scope.changedDetailsValue = function (selectedValue, identifier) {
        switch (identifier) {

            case "Pole":
                //alert("Selected Value: " + selectedValue);
                //$scope.poleKeyID = selectedValue;
                SharedProperties.setPoleID(selectedValue);
                //alert("Shared Properties - get pole ID: " + SharedProperties.getPoleID());

                var sql = 'INSERT OR IGNORE INTO tb_patrol_details (pole_key_id) VALUES (?)';
                db.transaction(function (tx) { tx.executeSql(sql, [selectedValue]); });
                //queryFormInputTable("tb_patrol_details");
                break;

            /* *********************** Pole Number changed *********************** */

            case "PoleChangeRequired":
                var sql = 'UPDATE tb_patrol_details SET pole_change_required = ' + selectedValue + ' WHERE pole_key_id = "' + SharedProperties.getPoleID() + '"';
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryFormInputTable("tb_patrol_details");
                break;

            case "PoleChangeReason":
                var sql = 'UPDATE tb_patrol_details SET pole_change_reason = ' + selectedValue + ' WHERE pole_key_id = "' + SharedProperties.getPoleID() + '"';
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryFormInputTable("tb_patrol_details");
                break;

            case "PoleType":
                var sql = 'UPDATE tb_patrol_details SET pole_type = ' + selectedValue + ' WHERE pole_key_id = "' + SharedProperties.getPoleID() + '"';
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryFormInputTable("tb_patrol_details");
                break;

            case "PolingOptions":
                var sql = 'UPDATE tb_patrol_details SET poling_option = ' + selectedValue + ' WHERE pole_key_id = "' + SharedProperties.getPoleID() + '"';
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryFormInputTable("tb_patrol_details");
                break;

            /* *********************** Height *********************** */

            case "SurfaceType":
                var sql = 'UPDATE tb_patrol_details SET surface_type = ' + selectedValue + ' WHERE pole_key_id = "' + SharedProperties.getPoleID() + '"';
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryFormInputTable("tb_patrol_details");
                break;

            case "ExcavationMethod":
                var sql = 'UPDATE tb_patrol_details SET excavation_method = ' + selectedValue + ' WHERE pole_key_id = "' + SharedProperties.getPoleID() + '"';
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryFormInputTable("tb_patrol_details");
                break;

            case "MacineryRequired":
                var sql = 'UPDATE tb_patrol_details SET machinery_required = ' + selectedValue + ' WHERE pole_key_id = "' + SharedProperties.getPoleID() + '"';
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryFormInputTable("tb_patrol_details");
                break;

            case "MainlineConductorChangeRequired":
                var sql = 'UPDATE tb_patrol_details SET mainline_conductor_change_required = ' + selectedValue + ' WHERE pole_key_id = "' + SharedProperties.getPoleID() + '"';
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryFormInputTable("tb_patrol_details");
                break;

            case "ExistingConductorTypes":
                var sql = 'UPDATE tb_patrol_details SET existing_conductor_type = ' + selectedValue + ' WHERE pole_key_id = "' + SharedProperties.getPoleID() + '"';
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryFormInputTable("tb_patrol_details");
                break;

            case "CableTypes":
                var sql = 'UPDATE tb_patrol_details SET cable_type = ' + selectedValue + ' WHERE pole_key_id = "' + SharedProperties.getPoleID() + '"';
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryFormInputTable("tb_patrol_details");
                break;

            /* *********************** Length *********************** */

            case "NewConductorTypes":
                var sql = 'UPDATE tb_patrol_details SET new_conductor_type = ' + selectedValue + ' WHERE pole_key_id = "' + SharedProperties.getPoleID() + '"';
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryFormInputTable("tb_patrol_details");
                break;

            case "ServiceChangeRequired":
                var sql = 'UPDATE tb_patrol_details SET service_change_required = ' + selectedValue + ' WHERE pole_key_id = "' + SharedProperties.getPoleID() + '"';
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryFormInputTable("tb_patrol_details");
                break;

            /* *********************** No Services *********************** */

            /* *********************** Quantity 1 *********************** */

            case "ServiceTypeOne":
                var sql = 'UPDATE tb_patrol_details SET service_type_one = ' + selectedValue + ' WHERE pole_key_id = "' + SharedProperties.getPoleID() + '"';
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryFormInputTable("tb_patrol_details");
                break;

            /* *********************** Quantity 1 *********************** */

            case "ServiceTypeTwo":
                var sql = 'UPDATE tb_patrol_details SET service_type_two = ' + selectedValue + ' WHERE pole_key_id = "' + SharedProperties.getPoleID() + '"';
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryFormInputTable("tb_patrol_details");
                break;

            /* *********************** House No *********************** */

            /* *********************** Street Name *********************** */

            case "LandAccessRequired":
                var sql = 'UPDATE tb_patrol_details SET land_access_required = ' + selectedValue + ' WHERE pole_key_id = "' + SharedProperties.getPoleID() + '"';
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryFormInputTable("tb_patrol_details");
                break;
        }
    }

    // Query the Details database
    function queryDetailsDB(tx) {
        tx.executeSql('SELECT * FROM tb_patrol_details', [], queryDetailsDatabaseSuccess, errorCB);
    }

    // Query the success callback
    function queryDetailsDatabaseSuccess(tx, results) {
        var len = results.rows.length;
        //alert("Details Database Length: " + len);

        if (len == 0) {
            //alert("There are no values in the Details Database...");
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
            }
        }
    }

    /* ******************** Patrol Tasks ******************** */
    // Generic YES/NO options
    $scope.YesNoOption = [{
        yesnooptiondesc: "No",
        yesnooptionid: "0"
    }, {
        yesnooptiondesc: "Yes",
        yesnooptionid: "1"
    }];

    
    $scope.$watch("isolationPointComments", function (newVal, oldVal) {
        if (newVal !== oldVal) {
            var sql = 'UPDATE tb_patrol_header SET isolation_point_comments = "' + newVal + '" WHERE transformer_id = ' + SharedProperties.getTransformerID() + '';
            db.transaction(function (tx) { tx.executeSql(sql); });
            //queryFormInputTable("tb_patrol_header");
        }
    });

    // Watch for changes in the U/G Service Quantity
    $scope.$watch("ugServiceQuantity", function (newVal, oldVal) {
        if (newVal !== oldVal) {
            var sql = 'UPDATE tb_patrol_tasks SET pole_number = "' + SharedProperties.getPoleID() + '", pole_task_id = 13, pole_task_value = "' + newVal + '" WHERE pole_task_value = "' + oldVal + '")';
            //alert("SQL: " + sql);
            db.transaction(function (tx) {
                tx.executeSql(sql);
            });
        }
    });

    // Watch for changes in the U/G Service Comments
    $scope.$watch("ugServiceComments", function (newVal, oldVal) {
        if (newVal !== oldVal) {
            var sql = 'UPDATE tb_patrol_tasks SET pole_number = "' + SharedProperties.getPoleID() + '", pole_task_id = 15, pole_task_value = "' + newVal + '" WHERE pole_task_value = "' + oldVal + '")';
            //alert("SQL: " + sql);
            db.transaction(function (tx) {
                tx.executeSql(sql);
            });
        }
    });


    // Get selected Tasks values from form and INSERT INTO table
 /*   $scope.changedTasksValue = function (selectedValue, taskID) {
        //alert("Selected Value: " + selectedValue);
        //alert("Task ID: " + taskID);
        //alert("Shared Properties - Pole ID: " + SharedProperties.getPoleID());
        var sql = 'INSERT OR IGNORE INTO tb_patrol_tasks (pole_number, pole_task_id, pole_task_value) VALUES ("' + SharedProperties.getPoleID() + '", ' + taskID + ', ' + selectedValue + ')';

        //alert("SQL: " + sql);

        db.transaction(function (tx) { tx.executeSql(sql); });

        //queryFormInputTable("tb_patrol_tasks");
    } */
});