/**
 * Created by Eamonn on 2015/10/16.
 * My own CRUD for file
 */
var AbstractDao = require('./../AbstractDao.js');
var itemDao = new (require('./../items_mgmt/itemDao.js'))('canvasItems');
var utils = require('./../_utils/utils.js');
var message = require('../_utils/messageGenerator.js');
var fileDao = function(collectionName){
    AbstractDao.call(this,collectionName);
};
utils.extend(fileDao,AbstractDao);

fileDao.prototype.saveFile = function (data,next) {
    this.insertOne(data,next);
};

fileDao.prototype.deleteFileById = function (id,next) {
    this.deleteOne({'id': id}, function (result) {
        itemDao.deleteAllItemsInCanvas(id, function (data) {
            next(result);
        })
    });
};

fileDao.prototype.updateFileById = function (id,update,next) {
    this.updateOne({'id' : id},update,next);
};

fileDao.prototype.findManyFilesUnderAccount = function (query,user,next) {
    query.createUserId = user.id;
    this.findMany(query,next);
};

fileDao.prototype.findFileByIdUnderAccount = function (id,user,next) {
    var query = {
        id : id,
        createUserId : user.id
    };
    this.findOne(query, function (result) {
        if(result.data[0]){
            itemDao.findItemsInCanvas(id, function (itemsData) {
                if(itemsData.success){
                    result.data[0].objects = itemsData.data;
                }
                next(result);
            })
        }else{
            next(result.data[0]);
        }
    });
};

module.exports = fileDao;