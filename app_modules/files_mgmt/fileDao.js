/**
 * Created by Eamonn on 2015/10/16.
 */
var AbstractFileDao = require('./../AbstractDao.js');
var utils = require('./../_utils/utils.js');

var fileDao = function(collectionName){
    AbstractFileDao.call(this,collectionName);
};

utils.extend(fileDao,AbstractFileDao);

module.exports = fileDao;