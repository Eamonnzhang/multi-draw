/**
 * Created by Eamonn on 2015/10/16.
 */
var fileService = require('./fileService.js');

exports.save = function(req,res){
    //console.log(req.body);
    var id = req.body.id;
    var fileName = req.body.fileName;
    var usersId = req.body.usersId;
    //var createUserName = req.body.ceateUserName;
    var isNewFile = req.body.isSaveNew;
    var pathData = JSON.parse(req.body.pathData);
    var user = req.session.userData;
    if(isNewFile === 'true'){
        fileService.save(fileName,usersId,user,pathData,function(data){
            res.send(data);
        });
    }
    else{
        var updateData = {
            fileName : fileName,
            pathData : pathData
        };
        var query  = {
            id: id
        };
        fileService.update(query,updateData,function(data){
            res.send(data);
        })
    }
};

exports.loadAllFiles = function (req,res) {
    var user = req.session.userData;
    if(user){
        fileService.loadAllFiles(user, function (data) {
            res.send(data);
        })
    }
};

exports.loadFile = function (userApi,req,res) {
    var id = req.query.id;
    //console.log(id);
    var userKey = req.query.userKey;
    for (var i = 0; i < userApi.length; i++) {
        if (userApi[i].apiKey && userKey) {
            if (userApi[i].apiKey === userKey) {
                fileService.loadFile(id, userApi[i].userData, function (data) {
                    //console.log(data);
                    res.send(data);
                });
                break;
            }
        }
    }
};