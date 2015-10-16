/**
 * Created by Eamonn on 2015/10/16.
 */
var FileDao = new (require('./fileDao.js'))('multidraw');
//var uuId = require('./_utils/uuidGenerator.js');
var message = require('./_utils/messageGenerator.js');
exports.save = function(fileName,next){
    var drawData = {};
    drawData.fileName = fileName;
    FileDao.insertOne(drawData,next);
};