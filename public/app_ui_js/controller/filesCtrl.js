/**
 * Created by Eamonn on 2015/11/3.
 */
var fileListModule = angular.module('FileListModule', []);
fileListModule.controller('FileListCtrl', function($scope, $http) {
    $http.get("/loadAllFiles")
        .success(function (response) {
            if(response.success)
                $scope.files = response.data;
        });
    $scope.loadFile = function () {
        var queryObj = {};
        queryObj.fileName = this.file.fileName;
        queryObj.id = this.file.id;
        window.open('/board'+mdUtils.convertJSONToQueryStr(queryObj,true));
    }
});