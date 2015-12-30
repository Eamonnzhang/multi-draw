/**
 * Created by Eamonn on 2015/10/16.
 */
var dataSource = require('../app_db/dataSource.js');
var uuid = require('node-uuid');
var message = require('./_utils/messageGenerator.js');

var AbstractDao = function(collectionName){
    this.dataCollection = dataSource.getDB().collection(collectionName);
};
AbstractDao.prototype.prepareNewObj = function(obj){
    if(obj === undefined || obj === null){
        obj = {};
    }
    obj.id = uuid.v1(); // -> '6c84fb90-12c4-11e1-840d-7b25c5ee775a'
    obj.createTime = new Date();
    obj.lastModify = obj.createTime;
    return obj;
};

AbstractDao.prototype.insertOne = function(data,next){
    data = this.prepareNewObj(data);
    this.dataCollection.insert(data,function(err,result){
        if(err){
            next(message.genSimpFailedMsg(err.message, err.stack));
        }else{
            next(message.genSimpSuccessMsg(null, data.id));
        }
    })
};

AbstractDao.prototype.findOne = function(data,next){
    this.dataCollection.findOne(data,function(err,data){
        if(err){
            next(message.genSimpFailedMsg(err.message, err.stack));
        }else{
            next(message.genSimpSuccessMsg(null, data));
        }
    })

};

AbstractDao.prototype.updateOneRecord = function(query,update, next) {
    this.dataCollection.updateOne(query, {
        $set: update
    }, function (err, data) {
        if (err) {
            next(message.genSimpFailedMsg(err.message, err.stack));
        } else {
            next(message.genSimpSuccessMsg(null, data));
        }
    });
};

AbstractDao.prototype.deleteRecord = function(query, callback){
    this.dataCollection.deleteMany(query, {safe: true}, function (err, data) {
        if (err) {
            throw err;
            callback({success:false});
        } else {
            callback({success:true});
        }
    });
};

module.exports = AbstractDao;