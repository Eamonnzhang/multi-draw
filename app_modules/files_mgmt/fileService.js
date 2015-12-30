/**
 * Created by Eamonn on 2015/10/16.
 */
var fileDao = new (require('./fileDao.js'))('canvasData');
var message = require('./../_utils/messageGenerator.js');

exports.save = function (data,user,next) {
    data.createUserId = user.id;
    data.createUserName = user.name.firstName+' '+user.name.lastName;
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

exports.loadAllFiles= function(user,next){
    fileDao.loadAllFileUnderAccount(user, function (data) {
        if(data){
            next(data);
        }
    });
};

exports.loadFile= function(id,user,next){
    fileDao.loadFileByIdUnderAccount(id,user, function (data) {
        if(data){
            next(data);
        }
    });
};