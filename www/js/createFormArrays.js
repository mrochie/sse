// Get the main app.js module
var createFormArrays = angular.module("createFormArraysService", []);
createFormArrays.service("CreateFormArraysService", function ($http, SharedProperties, NetworkConnection, $timeout) {

    // Initialising Database variable
    var db = window.openDatabase("tliphp", "1.0", "TLI Rapid", 200000);

    // Variables to hold localStorage Tables data - to be able to access from view
    var GridSquareArray = [];
    var TransformerArray = [];
    var PoleArray = [];
    var PoleChangeReasonArray = [];
    var PoleTypeArray = [];
    var PolingOptionsArray = [];
    var IsolationPointsArray = [];
    var SurfaceTypesArray = [];
    var ExcavationMethodArray = [];
    var MachineryValuesArray = [];
    var ConductorTypesArray = [];
    var CableTypesArray = [];
    var ServiceTypesArray = [];
    var TreeCuttingArray = [];
    var PMEArray = [];
    var BTTransferArray = [];
    var StayWireArray = [];
    var JointBayArray = [];
    var UndergroundServiceArray = [];
    var GradeArray = [];
    var FeatureTypeArray = [];
    var FeatureArray = [];
    var ClassACableTypeArray = [];
    var CableSizeArray = [];
    var MeasuredToArray = [];





    var arrays = {
        top: [],
        left: [],
        right: [],
        bottom: []
    };

    





    // Create Table names and associated Array names
    var tableArrayAssociation = [{
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


    var myFunctions = {





        addToArray: function (name, index, value) {
            arrays[name][index] = value;

            //alert("arrays[name][index]: " + arrays[name][index]);
            for (var i = 0; i < arrays[name].length; i++) {
                //alert("Name: " + arrays[name]);
            }
        },





        /* ********** Build the Arrays ********** */
        innitArrays: function () {
            //alert("Table Array Association: " + tableArrayAssociation);
            //alert("Table Array Association Length: " + tableArrayAssociation.length);

            for (var i = 0; i < tableArrayAssociation.length; i++) {
                //alert("tableArrayAssociation[i].tablename: " + tableArrayAssociation[i].tablename);
                //alert("tableArrayAssociation[i].arrayname: " + tableArrayAssociation[i].arrayname);
                myFunctions.queryTable(tableArrayAssociation[i].tablename, tableArrayAssociation[i].arrayname);
            }
        },

        // Query the Tables
        queryTable: function (tableName, arrayName) {
            var sql = 'SELECT * FROM ' + tableName + '';
            db.transaction(function (tx) {
                tx.executeSql(sql, [],
                    (function (arrayName) {
                        return function (tx, results) {
                            myFunctions.querySuccess(tx, results, arrayName);
                        };
                    })(arrayName), myFunctions.queryError);
            });
        },

        // Success Callback
        querySuccess: function (tx, results, arrayName) {
            for (var i = 0; i < results.rows.length; i++) {
                //alert("Array: " + arrayName);
                [arrayName].push(results.rows.item(i));
                //alert("Array: " + [arrayName]);
            }
        },

        // Error Callback
        queryError: function (tx, err) {
            //alert("An error has occured - Error processing SQL query at grid-square-list.js -> queryLocalStorageTablesAndBuildArrays()." +
            //    "\n\nPlease make sure you have a active network connection and download the latest patrol data assigned to you.. If the problem persists please contact the TLI Development Team with the error code and message below." +
            //    "\n\nError Code: " + err.code + ".\nError Message: " + err.message);
        },






        // Get the Array
        getArray: function (arrayName) {

            myFunctions.addToArray('top', 5, 100);
            
            
            //myFunctions.innitArrays();

            //alert("arrayName: " + arrayName);
            //alert("$scope[arrayName]: " + [arrayName]);
            return [arrayName];
        },

       

    } // myFunctions() end

    return myFunctions;

});