/**
 * Created by Eamonn on 2016/2/18.
 */

$('#selectUsers').val('');
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

userModule.directive('ngUserItem', function () {
    return {
        restrict: 'C',
        link : function ($scope,$element,$attrs) {
            $($element).on('click', function (event) {
                $(this).attr('data-value',$scope.user.id+'+'+$scope.user.username);
            })
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
                if(inputUsers && pms){
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

    $scope.getParticipants = function () {
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

    $scope.participatedUsers = [];

    $scope.loadAllUsers = function () {
        $http.get("/loadAllUsers")
            .success(function (res) {
                if(res.success) {
                    var allUsers = res.data;
                    for(var i = 0; i < allUsers.length; ++i){
                       for(var j = 0 ; j < $scope.participatedUsers.length; j++){
                           if(allUsers[i].id === $scope.participatedUsers[j]){
                               allUsers.splice(i,1);
                               i--;
                               break;
                           }
                       }
                    }
                    $scope.users = allUsers;
                }
            });
    };

    $scope.addParticipants = function (participants) {
        $http.post("/addParticipants",participants)
            .success(function (res) {
                if(res.success) {
                    console.log(res);
                }
            });
    };


});

