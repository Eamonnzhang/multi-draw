/**
 * Created by Eamonn on 2015/10/16.
 */
var fileService = require('./fileService.js');

exports.save = function(req,res){
    console.log(req.body);
    var id = req.body.id;
    var fileName = req.body.fileName;
    var usersId = req.body.usersId;
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