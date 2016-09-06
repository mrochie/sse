// This is a JavaScript file

// Create the module that deals with the controllers
var app = angular.module("myApp", ['onsen', 'sharedProperties', 'networkConnection', 'downloadPatrolFormDataService', 'createLocalStorageTablesService', 'createFormArraysService',
                        'loginController', 'landingPageController', 'loginConfirmationController', 'mainNavigationController',
                        'syncPatrolDataController', 'syncPatrolDataSubmitController', 'syncPatrolDefectController', 'syncPatrolDataDetailsController',
                        'patrolDetailsController',
                        'addAPoleController',
                        'defectListController', 'magicalQuestionsController', 'defectDetailsController',
						'oneZeroSixDefectController', 'oneZeroSixDefectConfirmationController',
                        'additionalClassAController', 'additionalClassAConfirmationController',
                        'landAccessMainNavigationController', 'landAccessDetailsController', 'landAccessConfirmationController',
                        'gridSquareListController', 'transformerListController', 'transformerHeaderController',
                        'wiraFormController', 'wiraConfirmationController',
                        'graphsController',

                        'photoTestController'
]);