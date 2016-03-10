/**
 * Created by Eamonn on 2015/10/20.
 */

var userDao = new (require('./userDao.js'))('users');
var participantsDao = new (require('./userDao.js'))('canvasParticipants');
var uuId = require('../_utils/uuidGenerator.js');
var message = require('../_utils/messageGenerator.js');

exports.isExist = function(query,next){
    userDao.findOne(query,function(result){
        if(result.data.length)
            next(result);
        else
            next(message.genSimpFailedMsg('not exist',null));
    });
};

exports.addUser = function (user,next) {
    userDao.addUser(user,next);
};

exports.addParticipants = function (participants,next) {
    participantsDao.addParticipants(participants,next);
};

exports.getParticipants = function (canvasId,next) {
    participantsDao.getParticipants(canvasId,next);
};

exports.removeParticipants  = function (query,next) {
    participantsDao.removeParticipants(query,next);
};

exports.updateParticipants = function (query,updateData,next) {
    participantsDao.updateParticipants(query,updateData,next);
};

exports.isParticipantsExist = function (query,next) {
    participantsDao.isExist(query,next);
};

exports.loadUnParticipantUsers = function (reg,canvasId,next) {
    var me = this;
    userDao.loadAll(reg, function (result) {
        var count = 0;
        var handledUser = [];
        if(result.success){
            //只保留id和name
            var users = result.data;
            console.log('users',users);
            if(users[0]){
                for(var i = 0; i < users.length; i++){
                    me.isParticipantsExist( {userId:users[i].id,canvasId:canvasId},function (result) {
                        if(!result.data[0]){
                        //证明此用户未被邀请,开始处理改用户信息
                            console.log('user ',users[count]);
                            var user = {
                                id : users[count].id,
                                name : users[count].name
                            };
                            handledUser.push(user);
                        }
                        count++;
                        if(count === users.length){
                            next(message.genSimpSuccessMsg('success',handledUser));
                        }
                    });
                }
            }else{
                next(message.genSimpFailedMsg('not exist',null));
            }
        }
    });
};
