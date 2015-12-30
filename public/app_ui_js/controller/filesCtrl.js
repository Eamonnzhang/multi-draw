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
                    $scope.setFileSelected(true,$scope.file);
                }
                else{
                    $(this).removeClass('file-item-select');
                    $(this).css('background-color','#FFFFFF');
                    $scope.setFileSelected(false);
                }
            });
            $($element).on('dblclick', function (e) {
                $scope.loadFile();
            });
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

fileListModule.directive('objectButtonsEnabled', function() {
    return {
        restrict: 'A',

        link: function ($scope, $element, $attrs) {
            $scope.$watch($attrs.objectButtonsEnabled, function(newVal) {

            });
        }
    };
});


fileListModule.controller('FileListCtrl', function($scope, $http) {
    $http.get("/loadAllFiles")
        .success(function (response) {
            if(response.success)
                $scope.files = response.data;
        });
    $http.get('loadAllRecyCleFiles').success(function (res) {
        if(res.success) $scope.recycleFiles = res.data;
    });

    $scope.loadFile = function () {
        var queryObj = {};
        queryObj.id = this.selectedFile.id;
        window.open('/board'+mdUtils.convertJSONToQueryStr(queryObj,true));
    };


    $scope.putFileInRecycle = function () {

    };

    $scope.restoreFile = function () {

    };

    $scope.deleteFile = function () {

    };

    $scope.isFileExist = function () {
        if(this.files)
            return this.files.length > 0;
    };

    $scope.isFileSelected = false;

    $scope.getFileSelected = function () {
       return  $scope.isFileSelected;
    };

    $scope.setFileSelected = function(val,obj){
        $scope.isFileSelected = val;
        $scope.selectedFile = obj;
        $scope.$$phase || $scope.$digest();
    };

    $scope.discardSelectedFile = function(){
        $('.ng-file-item').removeClass('file-item-select');
        $('.ng-file-item').css('background-color','#FFFFFF');
        this.setFileSelected(false);
    }


    $scope.viewCookie =  mdUtils.getCookie('view')?JSON.parse(unescape(mdUtils.getCookie('view'))):null;

    if($scope.viewCookie){
        $scope.thView =  $scope.viewCookie.thView;
        $scope.listView = $scope.viewCookie.listView;
    }else{
        $scope.thView = true;
        $scope.listView = !$scope.thView;
    }

    $scope.toggleView = function () {
        $scope.thView =  !$scope.thView;
        $scope.listView =  !$scope.listView;
        mdUtils.addCookie('view',JSON.stringify({thView:$scope.thView,listView:$scope.listView}),12);
    };
    
    $scope.isThView = function () {
        return $scope.thView;
    };
    
    $scope.isListView = function () {
        return $scope.listView;
    };
});