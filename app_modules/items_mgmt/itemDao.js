/**
 * Created by Eamonn on 2016/1/11.
 */
var AbstractDao = require('./../AbstractDao.js');
var utils = require('./../_utils/utils.js');
var message = require('../_utils/messageGenerator.js');

var itemDao = function(collectionName,dbInstance){
    AbstractDao.call(this,collectionName,dbInstance);
};

utils.extend(itemDao,AbstractDao);

itemDao.prototype.saveItem = function (data,next) {
    this.insertOne(data,next);
};

itemDao.prototype.deleteItemInCanvas = function (query,canvasId,next) {
    query.canvasId = canvasId;
    this.deleteOne(query,next);
};

itemDao.prototype.deleteAllItemsInCanvas = function (canvasId,next) {
    this.deleteMany({canvasId:canvasId},next);
};

itemDao.prototype.updateItemInCanvas = function (query,canvasId,update,next) {
    query.canvasId = canvasId;
    console.log('query',query);
    console.log('update',update);
    this.updateOne(query,update,next);
};

itemDao.prototype.findItemsInCanvas = function (canvasId,next) {
    this.findMany({canvasId : canvasId},next);
};

module.exports = itemDao;


