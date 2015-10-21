/**
 * Created by Eamonn on 2015/10/20.
 */

var userDao = new (require('./userDao.js'))('users');
var uuId = require('../_utils/uuidGenerator.js');
var message = require('../_utils/messageGenerator.js');

exports.isExist = function(username,password,next){
    var query = {
        username : username,
        password : password
    };
    userDao.findOne(query,function(result){
        if(result.data){
           next(result);
        }else{
            next(message.genSimpFailedMsg('not exist', null));
        }
    });
};

exports.addUser = function (user,next) {
    var user = {
        id: uuId.generateId(8, 32),
        username: user.username,
        password: user.password,
        name: {
            firstName: user.name.firstName,
            lastName: user.name.lastName
        }
    };
    userDao.addUser(user,next);
};