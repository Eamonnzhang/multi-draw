/**
 * Created by Eamonn on 2015/10/16.
 */
var fileService = require('./fileService.js');
var moment = require('moment');

exports.save = function(req,res){
    var user = req.session.userData;
    var data = req.body;//这里拿到的就是前台传过来的对象，无需转换
    if(!data.id){
        fileService.save(data,user,function (data) {
            res.send(data);
        });
    }
    else{
        data.lastModify = moment().format('YYYY-MM-DD HH:mm:ss');
        fileService.update({id : data.id},data,function (data) {
            res.send(data);
        });
    }
};

exports.renameFile = function(req,res){
    var query = {
        id : req.query.id,
        fileName : req.query.fileName
    };
    fileService.renameFile(query,function (data) {
        res.send(data);
    });
};

exports.loadAllFiles = function (req,res) {
    var user = req.session.userData;
    var isRecycled = req.query.isRecycled;
    var query = {};
    if(isRecycled === 'true')
        query.isRecycled = true;
    else
        query.isRecycled = false;
    if(user){
        fileService.loadAllFiles(query, user, function (data) {
            res.send(data);
        })
    }
};

exports.recycleFiles = function (req,res) {
    var user = req.session.userData;
    var idArray = req.query.id;
    if(user){
        fileService.recycleOrRestoreFiles(idArray,true,function (data) {
            res.send(data);
        })
    }

};

exports.restoreFiles = function (req,res) {
    var user = req.session.userData;
    var idArray = req.query.id;
    if(user){
        fileService.recycleOrRestoreFiles(idArray,false, function (data) {
            res.send(data);
        })
    }
};

exports.deleteFiles = function (req,res) {
    var user = req.session.userData;
    var idArray = req.query.id;
    if(user){
        fileService.deleteFiles(idArray,function (data) {
            res.send(data);
        })
    }
};

exports.loadFile = function (userApi,req,res) {
    var id = req.query.id;
    var userKey = req.query.userKey;
    for (var i = 0; i < userApi.length; i++) {
        if (userApi[i].apiKey && userKey) {
            if (userApi[i].apiKey === userKey) {
                fileService.loadFile(id, userApi[i].userData, function (data) {
                    res.send(data);
                });
                break;
            }
        }
    }
};