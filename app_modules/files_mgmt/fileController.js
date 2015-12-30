/**
 * Created by Eamonn on 2015/10/16.
 */
var fileService = require('./fileService.js');

exports.save = function(req,res){
    var user = req.session.userData;
    var data = req.body[0];
    var dataObj = JSON.parse(data);
    console.log(dataObj);
    if(!dataObj.id)
        fileService.save(dataObj,user,function (data) {
            res.send(data);
        });
    else
        fileService.update({id:dataObj.id},dataObj,function (data) {
            res.send(data);
        });

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