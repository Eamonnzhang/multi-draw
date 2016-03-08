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


exports.loadAllUsers = function (next) {
    userDao.loadAll(next);
};