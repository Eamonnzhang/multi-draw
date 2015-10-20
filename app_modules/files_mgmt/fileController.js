/**
 * Created by Eamonn on 2015/10/16.
 */
var fileService = require('./fileService.js');

exports.save = function(req,res){
    var fileName = req.body.fileName;
    fileService.save(fileName,function(data){
        res.send(data);
    });
};