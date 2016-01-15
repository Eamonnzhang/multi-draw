/**
 * Created by Eamonn on 2015/10/16.
 * CRUD in MongoDB
 */
var dataSource = require('../app_db/dataSource.js');
var uuid = require('node-uuid');
var moment = require('moment');
var message = require('./_utils/messageGenerator.js');

var AbstractDao = function(collectionName,dbInstance){
    this.dataCollection = dataSource.getDB()?dataSource.getDB().collection(collectionName):dbInstance.collection(collectionName);
};

AbstractDao.prototype.prepareNewObj = function(obj){
    if(obj === undefined || obj === null){
        obj = {};
    }
    if(!obj.itemId) obj.id = uuid.v1(); // -> '6c84fb90-12c4-11e1-840d-7b25c5ee775a'
    obj.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
    obj.lastModify = obj.createTime;
    return obj;
};

AbstractDao.prototype.insertOne = function(data,next){
    data = this.prepareNewObj(data);
    this.dataCollection.insertOne(data,function(err,result){
        if(err){
            next(message.genSimpFailedMsg(err.message, err.stack));
        }else{
            if(data.id)
                next(message.genSimpSuccessMsg(null, data.id));
            else
                next(message.genSimpSuccessMsg(null, data.itemId));
        }
    });
};

AbstractDao.prototype.insertMany = function(dataArr,next){
    var array = [];
    dataArr.forEach(function (data) {
        var obj = this.prepareNewObj(data);
        array.push(obj);
    });
    this.dataCollection.insertMany(array,function(err,result){
        if (err) {
            next(message.genSimpFailedMsg(err.message, err.stack));
        } else {
            next(message.genSimpSuccessMsg(null, result));
        }
    });
};


AbstractDao.prototype.deleteOne = function(query, next){
    this.dataCollection.deleteOne(query, {safe: true}, function (err, data) {
        if (err) {
            next(message.genSimpFailedMsg(null, err));
        } else {
            next(message.genSimpSuccessMsg(null, data));
        }
    });
};

AbstractDao.prototype.deleteMany = function(query, next){
    this.dataCollection.deleteMany(query, {safe: true}, function (err, data) {
        if (err) {
            next(message.genSimpFailedMsg(null, err));
        } else {
            next(message.genSimpSuccessMsg(null, data));
        }
    });
};


AbstractDao.prototype.deleteOneField = function (query,filedName,next) {
    var update = { $unset : {} };
    update.$unset[filedName] = "";
    this.dataCollection.updateOne(query,update,function (err, data) {
        if (err) {
            next(message.genSimpFailedMsg(err.message, err.stack));
        } else {
            next(message.genSimpSuccessMsg(null, data.result));
        }
    });
};

AbstractDao.prototype.deleteManyFields = function (query,filedNameArr,next) {
    var update = { $unset : {} };
    filedNameArr.forEach(function (filedName) {
        update.$unset[filedName] = "";
    });
    this.dataCollection.updateOne(query,update,function (err, data) {
        if (err) {
            next(message.genSimpFailedMsg(err.message, err.stack));
        } else {
            next(message.genSimpSuccessMsg(null, data.result));
        }
    });
};

AbstractDao.prototype.updateOne = function(query,update, next) {
    this.dataCollection.updateOne(query, {
        $set: update
    },{upsert:true},function (err, data) {
        if (err) {
            next(message.genSimpFailedMsg(null,err));
        } else {
            next(message.genSimpSuccessMsg(null, data.result));
        }
    });
};

AbstractDao.prototype.updateMany = function(query,update, next) {
    update.lastModify =  moment().format('YYYY-MM-DD HH:mm:ss');
    this.dataCollection.updateMany(query, {
        $set: update
    }, function (err, data) {
        if (err) {
            next(message.genSimpFailedMsg(err.message, err.stack));
        } else {
            next(message.genSimpSuccessMsg(null, data.result));
        }
    });
};


AbstractDao.prototype.findOne = function(query,next){
    this.dataCollection.find(query).limit(1).toArray(function(err,data){
        if(err){
            next(message.genSimpFailedMsg(null,err));
        }else{
            next(message.genSimpSuccessMsg(null, data));
        }
    })
};

AbstractDao.prototype.findMany = function(query,next){
    this.dataCollection.find(query).toArray(function (err, data) {
        if (err) {
            next(message.genSimpFailedMsg(null,err));
        } else {
            next(message.genSimpSuccessMsg(null, data));
        }
    });
};


module.exports = AbstractDao;