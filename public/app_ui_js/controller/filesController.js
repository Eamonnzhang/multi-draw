/**
 * Created by Eamonn on 2015/11/3.
 */
var filesApp = angular.module('filesApp', []);
filesApp.controller('filesCtrl', function($scope, $http) {
    $http.get("/loadAllFiles")
        .success(function (response) {
            if(response.success)
                $scope.files = response.data;
        });
    $scope.loadFile = function () {
        var queryObj = {};
        queryObj.fileName = this.file.fileName;
        queryObj.id = this.file.id;
        window.open('/'+Utils.convertJSONToQueryStr(queryObj,true));
    }
});