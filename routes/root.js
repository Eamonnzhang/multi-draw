/**
 * Created by Eamonn on 2015/9/17.
 */
var fileController = require('../app_modules/files_mgmt/fileController.js');
var userController = require('../app_modules/users_mgmt/userController.js');
var itemController = require('../app_modules/items_mgmt/itemController.js');
var message = require('../app_modules/_utils/messageGenerator.js');
var config = require('../config.json');
module.exports = function(app){
    app.get('/board',function(req,res){
        if (req.session.userData) {
            if(req.query.id){
                res.render('canvas', {
                    userName: req.session.userData.name,
                    userId: req.session.userData.id,
                    title:'MultiDraw'
                });
            }
            else{
                res.redirect('/center');
            }
        }else{
            res.redirect(config.loginUrl[config.runMode]);
        }
    });

    app.get('/new',function(req,res){
        if (req.session.userData) {
            res.render('index', {title: 'MultiDraw'});
        }else{
            res.redirect(config.loginUrl[config.runMode]);
        }
    });

    app.get('/', function (req,res) {
       res.redirect('/center');
    });

    app.get('/login',function(req,res){
        res.render('login',{title:'MultiDraw'});
    });

    app.get('/join',function(req,res){
        res.render('join',{title:'MultiDraw'});
    });

    app.get('/center', function (req,res) {
        console.log('center session',req.session.userData);
        if (req.session.userData) {
            res.render('center', {
                userName: req.session.userData.name,
                userId: req.session.userData.id,
                title:'MultiDraw'
            });
        }else{
            res.redirect(config.loginUrl[config.runMode]);
        }
    });

    app.post('/loginHandle',function(req,res){
        userController.isExist(req,res);
    });

    app.post('/signUpHandle',function(req,res){
        userController.addUser(req,res);
    });

    app.post('/userNameExist',function(req,res){
        userController.isUserNameExist(req,res);
    });

    app.get('/logout', function (req, res) {
        delete req.session.userData;
        res.redirect('/');
    });

    app.post('/saveFile',function(req,res){
        fileController.saveFile(req,res);
    });

    app.get('/loadAllFiles',function(req,res){
        fileController.loadAllFiles(req,res);
    });

    app.get('/loadUninvitedUsers',function(req,res){
        userController.loadUnParticipantUsers(req,res);
    });
    app.post('/addParticipants',function(req,res){
        userController.addParticipants(req,res);
    });
    app.get('/getParticipants',function(req,res){
        userController.getParticipants(req,res);
    });
    app.get('/removeParticipants',function(req,res){
        userController.removeParticipants(req,res);
    });
    app.post('/updateParticipants',function(req,res){
        userController.updateParticipants(req,res);
    });
    app.get('/recycleFiles', function (req,res) {
        fileController.recycleFiles(req,res);
    });

    app.get('/restoreFiles', function (req,res) {
        fileController.restoreFiles(req,res);
    });

    app.get('/deleteFiles', function (req,res) {
        fileController.deleteFiles(req,res);
    });

    app.get('/loadFile',function(req,res){
        fileController.loadFile(req,res);
    });

    app.post('/saveItem', function (req,res) {
        itemController.saveItem(req,res);
    });

    app.post('/updateItems', function (req,res) {
        itemController.updateItem(req,res);
    });

    app.post('/deleteItems', function (req,res) {
        itemController.deleteItem(req,res);
    });

    app.get('/renameFile',function(req,res){
        fileController.renameFile(req,res);
    });



    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handlers
    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
    return app;
};