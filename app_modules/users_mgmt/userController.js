/**
 * Created by Eamonn on 2015/10/20.
 */

var userService = require('./userService.js');
var uuId = require('../_utils/uuidGenerator.js');
var api = [];

exports.addUser = function (user, req, res) {
    userService.addUser(user, function (data) {

    });
};

exports.isExist = function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    //console.log('')
    userService.isExist(username, password, function (message) {
        //console.log(data);
        if (message.success === true) {
            req.session.userData = message.data;
            var userApi = {};
            userApi.apiKey = uuId.generateId(8, 32);
            userApi.userData = req.session.userData;
            api.push(userApi);
            req.session.userData.apiKey = userApi.apiKey;
            delete req.session.userData.password;
            res.redirect('/');
        } else {
            res.redirect('/login');
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


