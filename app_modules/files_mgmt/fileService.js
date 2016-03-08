/**
 * Created by Eamonn on 2015/10/16.
 */
var fileDao = new (require('./fileDao.js'))('canvasMetaData');
var participantsDao = new (require('./../users_mgmt/userDao.js'))('canvasParticipants');
var message = require('./../_utils/messageGenerator.js');

exports.saveFile = function (data,user,next) {
    data.createUserId = user.id;
    data.createUserName = user.username;
    data.isRecycled =  false;
    if(!data.fileName) data.fileName = '未命名文件';
    fileDao.saveFile(data, function (data) {
        if(data){
            var participants = {
                canvasId : data.data,
                userId : user.id,
                userName : user.username,
                permission : '2'
            };
            participantsDao.addParticipants([participants], function (result) {
                next(data);
            });
        }
    });
};

exports.deleteFiles = function (idArray,next) {
    if(!(idArray instanceof Array)){
        idArray = idArray.split(',');
    }
    var cbNum = 0;
    var result = [];
    for (var i = 0; i < idArray.length; i++) {
        fileDao.deleteFileById(idArray[i],function (data) {
            cbNum ++ ;
            if (data) {
                result.push(data);
                if(cbNum === idArray.length) {
                    next(message.genSimpSuccessMsg(null, result))
                }
            }
        })
    }
};

exports.updateFile = function (id,update, next) {
    fileDao.updateFileById(id,update,function (data) {
        if(data)
            next(message.genSimpSuccessMsg(null, data));
    })
};


exports.recycleOrRestoreFiles = function (idArray,isRecycled,next) {
    if(!(idArray instanceof Array)){
        idArray = idArray.split(',');
    }
    var cbNum = 0;
    var result = [];
    for (var i = 0; i < idArray.length; i++) {
        fileDao.updateFileById(idArray[i], {isRecycled : isRecycled}, function (data) {
            cbNum ++ ;
            if (data) {
                result.push(data);
                if(cbNum === idArray.length) {
                    next(message.genSimpSuccessMsg(null, result))
                }
            }
        })
    }
};

exports.loadFile= function(id,user,next){
    fileDao.findFileByIdUnderAccount(id, user, function (data) {
        if(data){
            next(data);
        }else{
            next(message.genSimpFailedMsg('当前文件不存在！', data))
        }
    });
};

exports.loadAllFiles= function(query,user,next){
    fileDao.findManyFilesUnderAccount(query, user, function (data) {
        if(data){
            next(data);
        }
    });
};

