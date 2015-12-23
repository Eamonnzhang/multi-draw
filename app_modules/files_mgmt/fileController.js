/**
 * Created by Eamonn on 2015/10/16.
 */
var fileService = require('./fileService.js');

exports.save = function(req,res){
    var canvasData = {
        objects : JSON.parse(req.body.objects),
        background : req.body.background,
    };
    var user = req.session.userData;
    fileService.save2(canvasData, function (data) {
        console.log(data);
    })

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