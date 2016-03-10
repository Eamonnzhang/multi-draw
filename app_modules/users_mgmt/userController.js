/**
 * Created by Eamonn on 2015/10/20.
 */
var userService = require('./userService.js');
var message = require('../_utils/messageGenerator.js');

exports.addUser = function (req, res) {
    var user = {
        name : req.body.name,
        password : req.body.password,
        email: req.body.email
    };
    userService.addUser(user, function (data) {
        res.send(data);
    });
};

exports.loadUnParticipantUsers = function (req,res) {
    var keyWords = req.query.keyWords;
    var canvasId = req.query.canvasId;
    if(!keyWords){
        res.send({success:false})
    } else {
        var reg = new RegExp(keyWords);
        console.log('reg',reg);
        userService.loadUnParticipantUsers(reg,canvasId,function (result) {
            res.send(result);
        })
    }
};

exports.addParticipants = function (req,res) {
    var participants = req.body;
    console.log('participants= ',participants);
    userService.addParticipants(participants, function (result) {
        res.send(result);
    })
};
exports.getParticipants = function (req,res) {
    var canvasId = req.query.canvasId;
    userService.getParticipants(canvasId, function (result) {
        if(result.success){
            res.send(result);
        }
    })
};

exports.removeParticipants = function (req,res) {
    var query = {
        canvasId : req.query.canvasId,
        userId : req.query.userId
    };
    console.log('remove',query);
    userService.removeParticipants(query, function (result) {
        res.send(result);
    })
};

exports.updateParticipants = function (req,res) {
    var query = {
        canvasId : req.body.canvasId,
        userId : req.body.userId
    };
    console.log('update',query);
    var updateData = {
        permission : req.body.permission
    };
    console.log('data',updateData);
    userService.updateParticipants(query,updateData, function (result) {
        res.send(result);
    })
};

exports.isExist = function(req,res){
    var query = {
        name : req.body.name,
        password : req.body.password
    };
    userService.isExist(query, function (result) {
        if (result.success === true) {
            req.session.userData = result.data[0];
            delete req.session.userData.password;
        }
        res.send(result);
    });
};

exports.isUserNameExist = function(req,res){
    var query = {
        name : req.body.name
    };
    userService.isExist(query,function (message) {
        if (message.success === true) {
            res.send({valid:false});
        }else{
            res.send({valid:true});
        }
    });
};



