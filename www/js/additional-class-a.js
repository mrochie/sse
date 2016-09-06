// This is a JavaScript file

// Get the main app.js module and inject the SharedProperties service
var additionalClassA = angular.module("additionalClassAController", []);
additionalClassA.controller("AdditionalClassAController", function ($scope, $http, $timeout, SharedProperties, NetworkConnection, CreateLocalStorageTablesService)
{
    // Initialising Database variable
    var db;

    // Initialise UI logic
    $scope.showPatrolForm = false;

    // Variables to hold localStorage Tables data - to be able to access from view
    $scope.GridSquareArray = [];
    $scope.TransformerArray = [];
    $scope.PoleArray = [];
    $scope.GradeArray = [];
    $scope.FeatureTypeArray = [];
    $scope.FeatureArray = [];
    $scope.ClassACableTypeArray = [];
    $scope.CableSizeArray = [];
    $scope.MeasuredToArray = [];

    $scope.gridSquareID = "";
    $scope.transformerID = "";
    $scope.poleID = "";

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
        tablename: "gradevalues",
        arrayname: "GradeArray"
    }, {
        tablename: "featuretypevalues",
        arrayname: "FeatureTypeArray"
    }, {
        tablename: "featurevalues",
        arrayname: "FeatureArray"
    }, {
        tablename: "cabletypes",
        arrayname: "ClassACableTypeArray"
    }, {
        tablename: "cablesize",
        arrayname: "CableSizeArray"
    }, {
        tablename: "measuredto",
        arrayname: "MeasuredToArray"
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

        // Create the Tables for storing the Patrol Form Input Data
        CreateLocalStorageTablesService.createAdditionalClassATable("tb_additional_class_a", "grid_square_id", "transformer_id", "pole_id", "year", "pole_height", "grade", "type", "feature", "cable_type", "size", "feature_height", "measured_to", "photo");

        // Query the localStorage API - populated Tables to get the Form select values
        queryLocalStorageTablesAndBuildArrays($scope.tableArrayAssociation);

        // Camera variables
        //pictureSource = navigator.camera.PictureSourceType;
        //destinationType = navigator.camera.DestinationType;
    }


















    $scope.capturePhotoISO = function (source) {
        alert("ISO Photo");
        // Retrieve image file location from specified source
        //navigator.camera.getPicture(onPhotoDataSuccessISO, onFail, { quality: 50, destinationType: destinationType.FILE_URI, sourceType: pictureSource });

        navigator.camera.getPicture(onPhotoDataSuccessISO, onFail, {
            quality: 75, destinationType: destinationType.FILE_URI, sourceType: Camera.PictureSourceType.CAMERA, encodingType: Camera.EncodingType.JPEG, targetWidth: 400, targetHeight: 400
        });
    }

    function onPhotoDataSuccessISO(imageURI) {
        // Uncomment to view the base64-encoded image data
        alert("ISO Photo Success");

        // Get image handle
        var smallImage = document.getElementById('smallImage');

        // Unhide image elements
        smallImage.style.display = 'block';

        // Show the captured photo
        // The in-line CSS rules are used to resize the image
        //smallImage.src = "data:image/jpeg;base64," + imageData;
        smallImage.src = imageURI;
        //  alert(smallImage.src);

        //Convert the image to Base64 BLOB
        //$scope.blob = dataURItoBlob(smallImage.src);
        //alert("$scope.blob: " + $scope.blob);




        //updatePhotoISO(smallImage.src);
    }

    // Called if something bad happens.
    function onFail(message) {
        alert('Failed because: ' + message);
    }




    function dataURItoBlob(dataURI) {
        alert("Getting heeere...");
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        var byteString = atob(dataURI.split(',')[1]);
        alert("byteString: " + byteString);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
        alert("mimeString: " + mimeString);

        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);
        alert("ab: " + ab);

        var ia = new Uint8Array(ab);
        alert("ia: " + ia);

        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
            alert("ia[i]: " + ia[i]);
        }

        // write the ArrayBuffer to a blob, and you're done
        var bb = new BlobBuilder();
        bb.append(ab);
        alert("bb.getBlob(mimeString): " + bb.getBlob(mimeString));

        return bb.getBlob(mimeString);
    }



    function updatePhotoISO(selectedValue) {
        alert("Photo Selected Value: " + selectedValue);
        var sql = 'UPDATE tb_additional_class_a SET photo = "' + selectedValue + '" WHERE pole_id = "' + SharedProperties.getPoleID() + '"';
        alert("Photo SQL: " + sql)
        db.transaction(function (tx) { tx.executeSql(sql); });
        // alert(SharedProperties.getTransformerID());
        queryFormInputTable("tb_additional_class_a");

    }
























    // Get the data from the local Storage Tables and populate the local variable Arrays to populate the views 
    function queryLocalStorageTablesAndBuildArrays(tableArrayAssociation) {
        // Loop through the Table/Array Association array
        //alert("queryLocalStorageTablesAndBuildArrays");
        for (var i = 0; i < $scope.tableArrayAssociation.length; i++) {
            queryTable($scope.tableArrayAssociation[i].tablename, $scope.tableArrayAssociation[i].arrayname);
        }
    }

    // Query the Tables
    function queryTable(tableName, arrayName) {
        var sql = 'SELECT * FROM ' + tableName + '';
        //alert("SQL: " + sql);
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
            //alert("$scope[arrayName]: " + $scope[arrayName]);
        }
    }

    // Query Error Callback
    function queryError(tx, err) {
        //alert("An error has occured - Error processing SQL query at additional-class-a.js -> queryLocalStorageTablesAndBuildArrays()." +
        //    "\n\nPlease make sure you have Patrol data synced to the local device. If the problem persists, please contact a member of the TLI Development Team quoting the error code and message below." + 
        //    "\n\nError Code: " + err.code + ".\nError Message: " + err.message);
    }

    // Watch for changes in the Year field
    $scope.$watch("year", function (newVal, oldVal) {
        if (newVal !== oldVal) {
            //alert("Pole ID: " + SharedProperties.getPoleID());
            var sql = 'UPDATE tb_additional_class_a SET year = ' + newVal + ' WHERE pole_id = "' + SharedProperties.getPoleID() + '"';
            db.transaction(function (tx) { tx.executeSql(sql); });
            //alert("Year SQL: " + sql);
            //queryFormInputTable("tb_additional_class_a");
        }
    });

    // Watch for changes in the Pole Height field
    $scope.$watch("poleHeight", function (newVal, oldVal) {
        if (newVal !== oldVal) {
            var sql = 'UPDATE tb_additional_class_a SET pole_height = ' + newVal + ' WHERE pole_id = "' + SharedProperties.getPoleID() + '"';
            //alert("Pole Height SQL: " + sql);
            db.transaction(function (tx) { tx.executeSql(sql); });
            //queryFormInputTable("tb_additional_class_a");
        }
    });

    // Watch for changes in the Feature Height field
    $scope.$watch("featureHeight", function (newVal, oldVal) {
        if (newVal !== oldVal) {
            var sql = 'UPDATE tb_additional_class_a SET feature_height = ' + newVal + ' WHERE pole_id = "' + SharedProperties.getPoleID() + '"';
            db.transaction(function (tx) { tx.executeSql(sql); });
            //alert("Feature Height SQL: " + sql);
            //queryFormInputTable("tb_additional_class_a");
        }
    });


    
    













    // Get selected Header values from Form
    $scope.changedValue = function (selectedValue, identifier) {
        switch (identifier) {
            case "GridSquare":
                SharedProperties.setGridSquareID(selectedValue);
                //alert("SharedProperties.getGridSquareID(): " + SharedProperties.getGridSquareID());
                break;

            case "Transformer":
                SharedProperties.setTransformerID(selectedValue);
                //alert("SharedProperties.getTransformerID(): " + SharedProperties.getTransformerID());
                var sql = 'INSERT OR IGNORE INTO tb_additional_class_a (grid_square_id, transformer_id) VALUES (' + SharedProperties.getGridSquareID() + ', ' + +SharedProperties.getTransformerID() + ')';
                //alert("Transformer SQL: " + sql)
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryFormInputTable("tb_patrol_header");
                break;

            case "Pole":
                SharedProperties.setPoleID(selectedValue);
                //alert("SharedProperties.getPoleID(): " + SharedProperties.getPoleID());

                //alert("SharedProperties.getTransformerID(): " + SharedProperties.getTransformerID());
                var sql = 'UPDATE tb_additional_class_a SET pole_id = "' + selectedValue + '" WHERE transformer_id = ' + SharedProperties.getTransformerID() + '';
                //alert("Pole UPDATE SQL: " + sql);
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryFormInputTable("tb_additional_class_a");
                break;

            case "GradeArray":
                var sql = 'UPDATE tb_additional_class_a SET grade = ' + selectedValue + ' WHERE pole_id = "' + SharedProperties.getPoleID() + '"';
                //alert("Grade UPDATE SQL: " + sql);
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryFormInputTable("tb_additional_class_a");
                break;

            case "FeatureTypeArray":
                var sql = 'UPDATE tb_additional_class_a SET type = ' + selectedValue + ' WHERE pole_id = "' + SharedProperties.getPoleID() + '"';
                //alert("Feature Type UPDATE SQL: " + sql);
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryFormInputTable("tb_additional_class_a");
                break;

            case "FeatureArray":
                var sql = 'UPDATE tb_additional_class_a SET feature = ' + selectedValue + ' WHERE pole_id = "' + SharedProperties.getPoleID() + '"';
                //alert("Feature UPDATE SQL: " + sql);
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryFormInputTable("tb_additional_class_a");
                break;

            case "ClassACableTypeArray":
                var sql = 'UPDATE tb_additional_class_a SET cable_type = ' + selectedValue + ' WHERE pole_id = "' + SharedProperties.getPoleID() + '"';
                //alert("Cable Type UPDATE SQL: " + sql);
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryFormInputTable("tb_additional_class_a");
                break;

            case "CableSizeArray":
                var sql = 'UPDATE tb_additional_class_a SET size = ' + selectedValue + ' WHERE pole_id = "' + SharedProperties.getPoleID() + '"';
                //alert("Cable Size UPDATE SQL: " + sql);
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryFormInputTable("tb_additional_class_a");
                break;

            case "MeasuredToArray":
                var sql = 'UPDATE tb_additional_class_a SET measured_to = ' + selectedValue + ' WHERE pole_id = "' + SharedProperties.getPoleID() + '"';
                //alert("Measured To UPDATE SQL: " + sql);
                db.transaction(function (tx) { tx.executeSql(sql); });
                //queryFormInputTable("tb_additional_class_a");
                break;

            

            default:
                break;
        }
    }



    // Query the Tables
    function queryFormInputTable(tableName) {
        var sql = 'SELECT * FROM ' + tableName;
        //alert("Class A SELECT SQL: " + sql);
        db.transaction(function (tx) {
            tx.executeSql(sql, [], queryClassASuccess, queryClassAError);
        });
    }
    // Query Success Callback
    function queryClassASuccess(tx, results) {
        alert("Class A Length: " + results.rows.length);

        for (var i = 0; i < results.rows.length; i++) {



            if (i >= 23) {
                alert("#" + i + " - grid_square_id: " + results.rows.item(i).grid_square_id);
                alert("#" + i + " - transformer_id: " + results.rows.item(i).transformer_id);
                alert("#" + i + " - pole_id: " + results.rows.item(i).pole_id);
                alert("#" + i + " - year: " + results.rows.item(i).year);
                alert("#" + i + " - pole_height: " + results.rows.item(i).pole_height);
                alert("#" + i + " - grade: " + results.rows.item(i).grade);
                alert("#" + i + " - type: " + results.rows.item(i).type);
                alert("#" + i + " - feature: " + results.rows.item(i).feature);
                alert("#" + i + " - cable_type: " + results.rows.item(i).cable_type);
                alert("#" + i + " - size: " + results.rows.item(i).size);
                alert("#" + i + " - feature_height: " + results.rows.item(i).feature_height);
                alert("#" + i + " - measured_to: " + results.rows.item(i).measured_to);
                alert("#" + i + " - photo: " + results.rows.item(i).photo);
            }

            
            
        }
    }

    // Query Error Callback
    function queryClassAError(tx, err) {
        alert("ERROR!\n\nUnable to access local storage tables to build drop-down list options. Please close the app and try again. " +
            "If the problem persists, please contact the TLI development team, quoting Error Code and Error Message below.\n\nError Code: " + err.code + ".\nError Message: " + err.message);
    }



    
});