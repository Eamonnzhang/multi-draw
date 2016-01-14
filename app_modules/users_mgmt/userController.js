/**
 * Created by Eamonn on 2015/10/20.
 */

var userService = require('./userService.js');
var uuId = require('../_utils/uuidGenerator.js');
var message = require('../_utils/messageGenerator.js');
var api = [];

exports.addUser = function (req, res) {
    var user = {
        username : req.body.username,
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        password : req.body.password
    };
    userService.addUser(user, function (data) {
        res.send(data);
    });
};

exports.isExist = function(req,res){
    var query = {
        username : req.body.username,
        password : req.body.password
    };
    userService.isExist(query, function (result) {
        if (result.success === true) {
            req.session.userData = result.data[0];
            //console.log('userCtrl',req.session);
            var userApi = {};
            userApi.apiKey = uuId.generateId(8, 32);
            userApi.userData = req.session.userData;
            api.push(userApi);
            req.session.userData.apiKey = userApi.apiKey;
            delete req.session.userData.password;
        }
        res.send(result);
    });
};

exports.isUserNameExist = function(req,res){
    var query = {
        username : req.body.username
    };
    userService.isExist(query,function (message) {
        if (message.success === true) {
            res.send({valid:false});
        }else{
            res.send({valid:true});
        }
    });
};

exports.getUserApi = function () {
    return api;
};

exports.removeUserApi = function (req) {
    var apiKey = req.param('apiKey');
    console.log(apiKey);
    var index = -1;
    for (var i = 0; i < api.length; i++) {
        if (api[i].apiKey === apiKey) {
            index = i;
            break;
        }
    }
    for (var j = index; j < api.length - 1; j++) {
        api[j] = api[j + 1];
    }
    api.pop();
};


