/**
 * Created by Eamonn on 2015/10/16.
 */
var AbstractFileDao = require('./AbstractFileDao.js');
var utils = require('./_utils/utils.js');

var FileDao = function(collectionName){
    AbstractFileDao.call(this,collectionName);
};

utils.extend(FileDao,AbstractFileDao);

module.exports = FileDao;