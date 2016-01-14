/**
 * Created by Eamonn on 2016/1/11.
 */

var itemDao = new (require('./itemDao.js'))('canvasItems');
var message = require('./../_utils/messageGenerator.js');

exports.saveItem = function (data,user,next) {
    data.createUserId = user.id;
    data.createUserName = user.name.firstName+' '+user.name.lastName;
    itemDao.saveItem(data,next);
};

/**
 * @param data
 * data = {
 *  canvasId: canvasId,
 *  items :  [{itemId:itemId,prop:propValue,...},{},{}]
 * }
 * @param next
 */
exports.updateItemInCanvas = function (data,next) {
    if(Array.isArray(data.items)){
        data.items.forEach(function (obj) {
            var itemId = obj.itemId;
            delete obj.itemId;
            itemDao.updateItemInCanvas({itemId :itemId},data.canvasId,obj,next);
        })
    }
};

exports.findItemsInCanvas = function (data,next) {
    itemDao.findItemsInCanvas(data.canvasId,next);
};

/**
 * @param data
 * data = {
 *   canvasId : canvasId,
 *   itemsId : [id1,id2,...]
 *  }
 * @param next
 */

exports.deleteItemInCanvas = function (data,next) {
    if(Array.isArray(data.itemsId)){
        data.itemsId.forEach(function (id) {
            itemDao.deleteItemInCanvas({itemId : id},data.canvasId,next);
        })
    }
};

