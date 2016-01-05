/**
 * Created by Eamonn on 2015/10/16.
 */
var fileDao = new (require('./fileDao.js'))('canvasData');
var message = require('./../_utils/messageGenerator.js');

exports.save = function (data,user,next) {
    data.createUserId = user.id;
    data.createUserName = user.name.firstName+' '+user.name.lastName;
    data.isRecycled =  false;
    if(!data.fileName) data.fileName = '未命名文件';
    fileDao.insertOne(data, function (data) {
        if(data){
            next(data);
        }
    });
}

exports.update = function(query,updateData,next){
    fileDao.updateOneRecord(query,updateData,function(data){
        if(data){
            next(data);
        }
    });
};

exports.loadAllFiles= function(query,user,next){
    fileDao.loadAllFileUnderAccount(query,user, function (data) {
        if(data){
            next(data);
        }
    });
};

exports.recycleOrRestoreFiles = function (idArray,isRecycled,next) {
    if(!(idArray instanceof Array)){
        idArray = idArray.split(',');
    }
    var cbNum = 0;
    var result = [];
    for (var i = 0; i < idArray.length; i++) {
        fileDao.recycleOrRestoreFiles(idArray[i], isRecycled, function (data) {
            cbNum ++ ;
            if (data) {
                result.push(data);
                if(cbNum === idArray.length) {
                    next(message.genSimpSuccessMsg(null, result))
                };
            }
        })
    }
};

exports.deleteFiles = function (idArray,next) {
    if(!(idArray instanceof Array)){
        idArray = idArray.split(',');
    }
    var cbNum = 0;
    var result = [];
    for (var i = 0; i < idArray.length; i++) {
        fileDao.removeById(idArray[i],function (data) {
            cbNum ++ ;
            if (data) {
                result.push(data);
                if(cbNum === idArray.length) {
                    next(message.genSimpSuccessMsg(null, result))
                };
            }
        })
    }
};



exports.loadFile= function(id,user,next){
    fileDao.loadFileByIdUnderAccount(id,user, function (data) {
        if(data){
            next(data);
        }
    });
};