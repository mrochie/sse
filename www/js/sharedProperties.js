// Get the main app.js module
var shared = angular.module("sharedProperties", []);
shared.service("SharedProperties", function()
{
    // Initialise the Variables 
    var userName = "";
    var userID = "";
    var userPIN = "";
    



    /* Patrol Form */
    var gridSquareID = "";
    var transformerID = "";
    var poleID = "";
    var isolationPointComments = "";
    var normallyOpenPointComments = "";
    var editedPoleNumber = "";
    var height = "";
    var patrolDate = "";

    /* WIRA Form */
    var locationAndActivityComments = "";
    var roadWidth = "";
    var speedLimit = "";
    var additionalComments = "";

    /* Sync Patrol Details */
    var syncPatrolDetails = [];

    var selectedPoleID = "";

    
    var gridSquareDataDownloaded = false;
    var transformerDataDownloaded = false;
    var poleDataDownloaded = false;
    var formFieldDataDownloaded = false;

    var addedPoleNumber = "";



    var PERSISTANCE_TEST = "";



    
    return {

        // Get and set the User Name
        getPERSISTANCE_TEST: function () {
            return PERSISTANCE_TEST;
        },
        setPERSISTANCE_TEST: function (value) {
            PERSISTANCE_TEST = value;
        },



        // Get and set the User Name
        getUserName: function()
        {
            return userName;
        },
        setUserName: function(value)
        {
            userName = value;
        },
        
        // Get and set the User ID number
        getUserID: function()
        {
            return userID;
        },
        setUserID: function(value)
        {
            userID = value;
        },
        
        // Get and set the User PIN number
        getUserPIN: function()
        {
            return userPIN;
        },
        setUserPIN: function(value)
        {
            userPIN = value;
        },
        
        
       
        
        // Get and set the Additional Comments Text
        getAdditionalCommentsText: function()
        {
            return additionalCommentsText;
        },
        setAdditionalCommentsText: function(value)
        {
            additionalCommentsText = value;
        },
        
        // Get and set the Date
        getDateSubmitted: function()
        {
            return dateSubmitted;
        },
        setDateSubmitted: function(value)
        {
            dateSubmitted = value;
        },
        
        




        /* Patrol Form */
        // Get and set the Grid Square ID
        getGridSquareID: function (){
            return gridSquareID;
        },
        setGridSquareID: function (value){
            gridSquareID = value;
        },
        // Get and set the Transformer ID
        getTransformerID: function (){
            return transformerID;
        },
        setTransformerID: function (value){
            transformerID = value;
        },
        // Get and set the Pole ID
        getPoleID: function (){
            return poleID;
        },
        setPoleID: function (value){
            poleID = value;
        },
        // Get and set the Isolation Open Point Comments Text
        getIsolationPointComments: function () {
            return isolationPointComments;
        },
        setIsolationPointComments: function (value) {
            isolationPointComments = value;
        },

        // Get and set the Normally Open Point Comments Text
        getNormallyOpenPointComments: function () {
            return normallyOpenPointComments;
        },
        setNormallyOpenPointComments: function (value) {
            normallyOpenPointComments = value;
        },

        // Get and set the Edited Pole Number value Text
        getEditedPoleNumber: function () {
            return editedPoleNumber;
        },
        setEditedPoleNumber: function (value) {
            editedPoleNumber = value;
        },

        // Get and set the height value Text
        getHeight: function () {
            return height;
        },
        setHeight: function (value) {
            height = value;
        },

        // Get and set the Date
        getPatrolDate: function () {
            return patrolDate;
        },
        setPatrolDate: function (value) {
            patrolDate = value;
        },

        /* WIRA Form */
        // Get and set the height value Text
        getLocationAndActivityComments: function () {
            return locationAndActivityComments;
        },
        setLocationAndActivityComments: function (value) {
            locationAndActivityComments = value;
        },

        // Get and set the road width value Text
        getRoadWidth: function () {
            return roadWidth;
        },
        setRoadWidth: function (value) {
            roadWidth = value;
        },

        // Get and set the speed limit value Text
        getSpeedLimit: function () {
            return speedLimit;
        },
        setSpeedLimit: function (value) {
            speedLimit = value;
        },

        // Get and set the additional comments value Text
        getAdditionalComments: function () {
            return additionalComments;
        },
        setAdditionalComments: function (value) {
            additionalComments = value;
        },





        // Get and set the sync patrol details
        getSyncPatrolDetails: function () {
            return syncPatrolDetails;
        },
        setSyncPatrolDetails: function (value) {
            syncPatrolDetails = value;
        },







         // Get and set the selected pole ID
        getSelectedPoleID: function () {
            return selectedPoleID;
        },
        setSelectedPoleID: function (value) {
            selectedPoleID = value;
        },



        // Get and set the Download Confirmation that API Grid Square data for form fields have successfully been downloaded
        getGridSquareDataDownloaded: function () {
            return gridSquareDataDownloaded;
        },
        setGridSquareDataDownloaded: function (value) {
            gridSquareDataDownloaded = value;
        },

        // Get and set the Download Confirmation that API Transformer data for form fields have successfully been downloaded
        getTransformerDataDownloaded: function () {
            return transformerDataDownloaded;
        },
        setTransformerDataDownloaded: function (value) {
            transformerDataDownloaded = value;
        },

        // Get and set the Download Confirmation that API Pole data for form fields have successfully been downloaded
        getPoleDataDownloaded: function () {
            return poleDataDownloaded;
        },
        setPoleDataDownloaded: function (value) {
            poleDataDownloaded = value;
        },

        // Get and set the Download Confirmation that API Form Field data for form fields have successfully been downloaded
        getFormFieldDataDownloaded: function () {
            return formFieldDataDownloaded;
        },
        setFormFieldDataDownloaded: function (value) {
            formFieldDataDownloaded = value;
        },




        // Get and set the added Pole number
        getAddedPoleNumber: function () {
            return addedPoleNumber;
        },
        setAddedPoleNumber: function (value) {
            addedPoleNumber = value;
        },

        
        
        
    };
});