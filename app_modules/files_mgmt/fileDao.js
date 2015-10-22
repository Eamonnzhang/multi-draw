/**
 * Created by Eamonn on 2015/10/16.
 */
var AbstractDao = require('./../AbstractDao.js');
var utils = require('./../_utils/utils.js');
var message = require('../_utils/messageGenerator.js');
var fileDao = function(collectionName){
    AbstractDao.call(this,collectionName);
};

utils.extend(fileDao,AbstractDao);

fileDao.prototype.loadAllFileUnderAccount = function (user,next) {
    this.dataCollection.find({createUserId: user.id}).toArray(function (err, data) {
        if (err) {
            throw err;
        } else {
            next(message.genSimpSuccessMsg(null, data));
        }
    });
};

fileDao.prototype.loadFileByIdUnderAccount = function (id,user,next) {
    this.dataCollection.find({id: id, createUserId: user.id}).toArray(function (err, data) {
        if (err) {
            throw err;
        } else {
            next(data[0]);
        }
    });
};

module.exports = fileDao;