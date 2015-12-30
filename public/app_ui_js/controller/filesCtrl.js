/**
 * Created by Eamonn on 2015/11/3.
 */
var fileListModule = angular.module('FileListModule', []);

fileListModule.directive('ngFileItem', function () {
    return {
        restrict: 'C',
        link : function ($scope,$element,$attrs) {
            $($element).on('click', function (e) {
                if(!$(this).hasClass('file-item-select')){
                    $('.file-item').removeClass('file-item-select');
                    $('.file-item-list').removeClass('file-item-select');
                    $(this).removeAttr('style');
                    $(this).addClass('file-item-select');
                }
                else{
                    $(this).removeClass('file-item-select');
                    $(this).css('background-color','#FFFFFF');
                }
            });
            $($element).on('dblclick', mdUtils.bind($scope,function (e) {
                this.loadFile();
            }));
            $($element).on('mouseover', function (e) {
                if(!$(this).hasClass('file-item-select'))
                    $(this).css('background-color','#F4F6F8');
            });
            $($element).on('mouseout', function (e) {
                if(!$(this).hasClass('file-item-select'))
                    $(this).css('background-color','#FFFFFF');
            });
        }
    }
})

fileListModule.controller('FileListCtrl', function($scope, $http) {
    $http.get("/loadAllFiles")
        .success(function (response) {
            if(response.success)
                $scope.files = response.data;
        });
    $scope.loadFile = function (e) {
        var queryObj = {};
        queryObj.id = this.file.id;
        window.open('/board'+mdUtils.convertJSONToQueryStr(queryObj,true));
    };

    $scope.isFileExist = function () {
        if(this.files)
            return this.files.length > 0;
    };

    $scope.thView = true;
    $scope.listView = !$scope.thView;

    $scope.toggleView = function () {
        $scope.thView =  !$scope.thView;
        $scope.listView =  !$scope.listView;
    };
    
    $scope.isThView = function () {
        return $scope.thView;
    };
    
    $scope.isListView = function () {
        return $scope.listView;
    };

});