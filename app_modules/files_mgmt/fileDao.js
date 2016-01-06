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

fileDao.prototype.loadAllFileUnderAccount = function (query,user,next) {
    query.createUserId = user.id;
    this.findAll(query,next);
};

fileDao.prototype.loadFileByIdUnderAccount = function (id,user,next) {
    var query = {
        id : id,
        createUserId : user.id
    };
    this.findAll(query,next);
};

fileDao.prototype.recycleOrRestoreFiles = function (id,isRecycled,next) {
    this.dataCollection.update(
        {'id': id},
        {
            $set: {
                'isRecycled': isRecycled
            }
        },
        function (err, data) {
            if (err) {
                throw err;
            } else {
                next(data.result);
            }
        }
    );
};

fileDao.prototype.removeById = function (id, next) {
    this.dataCollection.remove({'id': id}, function (err, result) {
        if (err) {
            throw err;
        } else {
            next(result);
        }
    });
};


fileDao.prototype.renameById = function (id,fileName, next) {
    this.dataCollection.update({'id': id},
        {
            $set: {
                'fileName': fileName
            }
        }, function (err, result) {
        if (err) {
            throw err;
        } else {
            next(result);
        }
    });
};

module.exports = fileDao;