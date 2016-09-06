﻿// This is a JavaScript file

// Get the main app.js module and inject the SharedProperties service
var graphs = angular.module("graphsController", []);
graphs.controller("GraphsController", function ($scope, $http, SharedProperties, NetworkConnection)
{

    // Generic YES/NO options
    $scope.YesNo = [{
        yesnooptiondesc: "No",
        yesnooptionid: "0"
    }, {
        yesnooptiondesc: "Yes",
        yesnooptionid: "1"
    }];

    $scope.NormallyOpenPointCheckedYesNo = [{
        yesnooptiondesc: "No",
        yesnooptionid: "0"
    }, {
        yesnooptiondesc: "Yes",
        yesnooptionid: "1"
    }];




    // Get selected Header values from Form
    $scope.changedValue = function (selectedValue, identifier) {
        switch (identifier) {
            case "NormallyOpenPoint":
                alert("NormallyOpenPoint");
                break;

            case "NormallyOpenPointChecked":
                alert("NormallyOpenPointChecked");
                break;

            
        }
    }


    /*
    var init = function ()
    {
        var graphData = [{
            // Visits
            data: [[6, 1300], [7, 1600], [8, 1900], [9, 2100], [10, 2500], [11, 2200], [12, 2000], [13, 1950], [14, 1900], [15, 2000]],
            color: '#71c73e'
        }, {
            // Returning Visits
            data: [[6, 500], [7, 600], [8, 550], [9, 600], [10, 800], [11, 900], [12, 800], [13, 850], [14, 830], [15, 1000]],
            color: '#77b7c5',
            points: { radius: 4, fillColor: '#77b7c5' }
        }
        ];

        // Lines
        $.plot($('#graph-lines'), graphData, {
            series: {
                points: {
                    show: true,
                    radius: 5
                },
                lines: {
                    show: true
                },
                shadowSize: 0
            },
            grid: {
                color: '#646464',
                borderColor: 'transparent',
                borderWidth: 20,
                hoverable: true
            },
            xaxis: {
                tickColor: 'transparent',
                tickDecimals: 2
            },
            yaxis: {
                tickSize: 1000
            }
        });

        // Bars
        $.plot($('#graph-bars'), graphData, {
            series: {
                bars: {
                    show: true,
                    barWidth: .9,
                    align: 'center'
                },
                shadowSize: 0
            },
            grid: {
                color: '#646464',
                borderColor: 'transparent',
                borderWidth: 20,
                hoverable: true
            },
            xaxis: {
                tickColor: 'transparent',
                tickDecimals: 2
            },
            yaxis: {
                tickSize: 1000
            }
        });
        
    };

    // Fire init() after definition
    init();
    */



});