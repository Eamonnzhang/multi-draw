/**
 * Created by Eamonn on 2015/10/20.
 */

var AbstractDao = require('../AbstractDao.js');
var utils = require('../_utils/utils.js');
var message = require('../_utils/messageGenerator.js');

var userDao = function(collectionName){
  AbstractDao.call(this,collectionName);
};

utils.extend(userDao,AbstractDao);

userDao.prototype.addUser = function (user,next) {
  this.insertOne(user,next);
};

userDao.prototype.loadAll = function (next) {
  this.dataCollection.find().toArray(function (err, data) {
    if (err) {
      next(message.genSimpFailedMsg(null,err));
    } else {
      next(message.genSimpSuccessMsg(null, data));
    }
  });
};

userDao.prototype.addParticipants = function (participants, next) {
    this.insertMany(participants,next);
};

userDao.prototype.getParticipants = function (canvasId, next) {
    var query = {
      canvasId : canvasId
    };
    this.findMany(query,next);
};

module.exports = userDao;