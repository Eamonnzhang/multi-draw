/**
 * Created by Eamonn on 2016/1/11.
 */

var itemService = require('./itemService.js');
var moment = require('moment');

//post
exports.saveItem = function (req,res) {
    var user = req.session.userData;
    var data = req.body;
    itemService.saveItem(data,user,function (result) {
        res.send(result);
    });
};

//get
exports.findItemsInCanvas= function (req,res) {
    var data = {
        canvasId : req.query.canvasId
    };
    itemService.findItemsInCanvas(data, function (result) {
        res.send(result);
    })
};

//post
exports.deleteItem= function (req,res) {
    var data = req.body;
    console.log(data);
    itemService.deleteItemInCanvas(data, function (result) {
        res.send(result);
    })
};

//post
exports.updateItem= function (req,res) {
    var data = req.body;
    console.log(data);
    itemService.updateItemInCanvas(data, function (result) {
        res.send(result);
    })
};

