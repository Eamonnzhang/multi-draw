/**
 * Created by Eamonn on 2015/11/3.
 */
var fileListModule = angular.module('FileListModule', []);
var keyValue = '';
fileListModule.directive('ngFileItem', function () {
    return {
        restrict: 'C',
        link : function ($scope,$element,$attrs) {
            $($element).on('click', function (event) {
                event.stopPropagation();
                mdUtils.getKeyPressValue(function (keyPress) {
                    keyValue = keyPress;
                }, function (keyUp) {
                    keyValue === keyUp ? keyValue = '' : null;
                });
                if(!$(this).hasClass('file-item-select') && keyValue !== 'ctrl'){
                    $('.file-item').removeClass('file-item-select');
                    $('.file-item-list').removeClass('file-item-select');
                    $(this).removeAttr('style');
                    $(this).addClass('file-item-select');
                    if($scope.files){
                        $scope.files.forEach(function (file) {
                            if(file.isSelected){
                                file.isSelected = false;
                            }
                        });
                    }
                    $scope.setMultiFilesSelected(true,$scope.file);
                } else if(!$(this).hasClass('file-item-select') && keyValue === 'ctrl'){ //多选
                    $(this).removeAttr('style');
                    $(this).addClass('file-item-select');
                    $scope.setMultiFilesSelected(true,$scope.file);
                }else {
                    $(this).removeClass('file-item-select');
                    $(this).css('background-color','#FFFFFF');
                    $scope.setMultiFilesSelected(false,$scope.file);
                }
            });
            $($element).on('dblclick', function (e) {
                $scope.loadFile($scope.file);
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
});

fileListModule.directive('objectButtonsEnabled', function() {
    return {
        restrict: 'A',

        link: function ($scope, $element, $attrs) {
            $scope.$watch($attrs.objectButtonsEnabled, function(newVal) {

            });
        }
    };
});

//解决IE下，无法更新scope模型的问题
fileListModule.config(['$httpProvider', function($httpProvider) {
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }

    // Answer edited to include suggestions from comments
    // because previous version of code introduced browser-related errors

    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
}]);

fileListModule.controller('FileListCtrl', function($scope, $http) {

    $scope.loadAllNotRecycledFiles = function () {
        $http.get("/loadAllFiles?isRecycled=false")
            .success(function (res) {
                if(res.success) $scope.files = res.data;
            });
    };
    $scope.loadAllNotRecycledFiles();


    $scope.loadAllRecycledFiles = function () {
        $http.get('/loadAllFiles?isRecycled=true')
            .success(function (res) {
                if(res.success) $scope.files = res.data;
            });
    };

    $scope.loadFile = function (file,isReload) {
        console.log(isReload);
        var queryObj = {};
        if(this.getSelectedFilesIds())
            queryObj.id = this.getSelectedFilesIds()[0];
        if(file)
            queryObj.id = file.id;
        if(!isReload)
            window.open('/board' + mdUtils.convertJSONToQueryStr(queryObj,true));
        else
            window.location.href= '/board' + mdUtils.convertJSONToQueryStr(queryObj,true);
    };


    //回收
    $scope.recycleFile = function () {
        var queryObj = {};
        if(this.getSelectedFilesIds())
            queryObj.id = this.getSelectedFilesIds();
        $http.get("/recycleFiles" + mdUtils.convertJSONToQueryStr(queryObj,true))
            .success(function (res) {
                if(res.success)
                    $scope.loadAllNotRecycledFiles();
            });
    };

    //还原
    $scope.restoreFiles = function () {
        var queryObj = {};
        if(this.getSelectedFilesIds())
            queryObj.id = this.getSelectedFilesIds();
        $http.get("/restoreFiles" + mdUtils.convertJSONToQueryStr(queryObj,true))
            .success(function (res) {
                if(res.success)
                    $scope.loadAllRecycledFiles();
            });
    };

    //彻底删除
    $scope.deleteFiles = function () {
        var queryObj = {};
        if(this.getSelectedFilesIds())
            queryObj.id = this.getSelectedFilesIds();
        $http.get("/deleteFiles" + mdUtils.convertJSONToQueryStr(queryObj,true))
            .success(function (res) {
                if(res.success)
                    $scope.loadAllRecycledFiles();
            });
    };
    
    $scope.restoreAll = function () {
        var queryObj = {};
        if(this.getAllFilesIds())
            queryObj.id = this.getAllFilesIds();
        $http.get("/restoreFiles" + mdUtils.convertJSONToQueryStr(queryObj,true))
            .success(function (res) {
                if(res.success)
                    $scope.loadAllRecycledFiles();
            });
    };
    
    $scope.deleteAll = function () {
        var queryObj = {};
        if(this.getAllFilesIds())
            queryObj.id = this.getAllFilesIds();
        $http.get("/deleteFiles" + mdUtils.convertJSONToQueryStr(queryObj,true))
            .success(function (res) {
                if(res.success)
                    $scope.loadAllRecycledFiles();
            });
    };

    $scope.isFileExist = function () {
        if(this.files)
            return this.files.length > 0;
    };

    $scope.getSelectedFiles = function(){
        $scope.selectedFiles = [];
        if(this.files){
            this.files.forEach(function (file) {
                if(file.isSelected){
                    $scope.selectedFiles.push(file);
                }
            });
            return this.selectedFiles;
        }
    };


    $scope.getSelectedFilesIds = function(){
        if(this.getSelectedFiles()){
            var selectedFiles = this.getSelectedFiles();
            var ids = [];
            selectedFiles.forEach(function (file) {
                ids.push(file.id);
            })
        }
        return ids;
    };

    $scope.getAllFilesIds = function(){
        if(this.files){
            var ids = [];
            this.files.forEach(function (file) {
                ids.push(file.id);
            })
        }
        return ids;
    };

    $scope.isMultiFilesSelected = function () {
        if(this.getSelectedFiles())
            return  this.getSelectedFiles().length > 1;
    };

    $scope.isFileSelected = function () {
        if(this.getSelectedFiles())
            return  this.getSelectedFiles().length === 1;
    };

    $scope.setMultiFilesSelected = function (val,obj) {
        if(obj) {
            obj.isSelected = val;
            $scope.currentSelectedObj = obj;
        }
        $scope.$$phase || $scope.$digest();
    };

    $scope.discardSelectedFile = function(){
        $('.ng-file-item').removeClass('file-item-select');
        $('.ng-file-item').css('background-color','#FFFFFF');
        if(this.files){
            this.files.forEach(function (file) {
                if(file.isSelected){
                    file.isSelected = false;
                }
            });
        }
    };

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