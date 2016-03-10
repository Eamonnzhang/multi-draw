/**
 * Created by Eamonn on 2016/2/18.
 */

$('#selectUsers').val('');
$('.ui.dropdown').dropdown();
var userModule = angular.module('UserModule', []);
//解决IE下，scope缓存无法更新的问题
userModule.config(['$httpProvider', function($httpProvider) {
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

userModule.directive('ngUserList', function () {
    return {
        restrict: 'C',
        link : function ($scope,$element,$attrs) {
            $($element).hover(function (event) {
                $(this).children('.close').css('display','');
                $(this).css('background-color','#EEEEEE');
            },function(){
                $(this).children('.close').css('display','none');
                $(this).css('background-color','inherit');
            });
        }
    }
});

userModule.directive('ngAddUsers',function () {
    return {
        restrict: 'C',
        link : function ($scope,$element,$attrs) {
            $($element).on('click', function (event) {
                var selectedFileId = $scope.getSelectedFiles()[0].id;
                var inputUsers = $('#selectUsers').attr('value');
                var userIdAndName;
                var pms = $('#userPms').attr('value');
                var participants = [];
                if (inputUsers && pms){
                    userIdAndName = inputUsers.split(',');
                    userIdAndName.forEach(function (idAndName) {
                        participants.push({
                            canvasId : selectedFileId,
                            userId : idAndName.split('+')[0],
                            userName : idAndName.split('+')[1],
                            permission: pms
                        })
                    });
                    console.log(participants);
                    $scope.addParticipants(participants);
                } else{
                    alert('没有选择用户或者权限，无法发送邀请！');
                }
            })
        }
    }
});



userModule.controller('UserCtrl', function($scope, $http) {
    $scope.participatedUsers = [];

    //打开模态框
    //清空dropdown
    $scope.getParticipants = function () {
        $('#shareModal').modal('show');
        $('.ui .multiple .dropdown').dropdown('clear');
        $('.ui .label').remove();
        $('#selectUsers').removeAttr('value');
        $('#userPms').removeAttr('value');
        $('#userPms').parent().find('.text').addClass('default');
        $('#userPms').parent().find('.text').html('选择权限');
        var selectedFileId = $scope.getSelectedFiles()[0].id;
        $http.get("/getParticipants?canvasId=" + selectedFileId)
            .success(function (res) {
                if(res.success) {
                    var ptcpts = res.data;
                    console.log(ptcpts);
                    $scope.participants = ptcpts;
                    ptcpts.forEach(function (p) {
                        $scope.participatedUsers.push(p.userId);
                    })
                    
                }
            });
    };

    $scope.loadUninvitedUsers = function (e) {
        var selectedFileId = $scope.getSelectedFiles()[0].id;
        console.log('select ID',selectedFileId);
        var url = '/loadUninvitedUsers?keyWords={query}&canvasId=' + selectedFileId;
        var setting = {
            apiSettings: {
                cache : false,
                url: url,
                onResponse: function(res) {
                    var response = {
                        results : []
                    };
                    if(res.data){
                        res.data.forEach(function(user){
                            user.value = user.id+'+'+user.name;
                            response.results.push(user);
                        });
                    }
                    return response;
                }
            },
            fields : {
                name : 'name',
                value : 'value'
            }
        };
        $('.ui.dropdown').dropdown(setting);
    };

    $scope.addParticipants = function (participants) {
        $http.post("/addParticipants",participants)
            .success(function (res) {
                if(res.success) {
                    console.log('success');
                    $("#shareModal").modal('hide');

                    mdUtils.showAlert('邀请成功！','sm','success','toggle');
                }
            });
    };

    $scope.changePermission = function (part) {
        console.log(part);
        var data = {
            canvasId : part.canvasId,
            userId : part.userId,
            permission : part.permission
        };
        $http.post("/updateParticipants",data)
            .success(function (res) {
                if(res.success) {

                }
            });
    };

    $scope.removePermission = function ($event,part) {
        console.log('removepms');
        $http.get("/removeParticipants?canvasId="+part.canvasId+'&userId='+part.userId)
            .success(function (res) {
                if(res.success) {
                    $($event.toElement.parentNode.parentNode).remove();
                }
            });
    };
});

$('#shareModal').on('hidden.bs.modal', function (e) {
    // do something...
    //console.log('model hidee');
    $('.ui.multiple.dropdown').children('.default.text').removeClass('filtered');
    $('.ui.multiple.dropdown').children('.menu.transition').remove();
    //console.log($('.ui.multiple.dropdown'));
    //console.log($('.menu.transition'));
    $('.ui.dropdown').dropdown();
});

