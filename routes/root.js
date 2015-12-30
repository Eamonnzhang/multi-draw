/**
 * Created by Eamonn on 2015/9/17.
 */
var fileController = require('../app_modules/files_mgmt/fileController.js');
var userController = require('../app_modules/users_mgmt/userController.js');
var message = require('../app_modules/_utils/messageGenerator.js');
var uuId = require('../app_modules/_utils/uuidGenerator.js');
module.exports = function(app){

    app.get('/board',function(req,res){
        if(req.query.userName&&req.query.userId){
            res.render('app', {
                userName: req.query.userName,
                userId: req.query.userId,
                apiKey: uuId.generateId(8, 32),
                title:'MultiDraw'
            });
        }else{
            if (req.session.userData) {
                res.render('app', {
                    userName: req.session.userData.name.firstName + ' ' + req.session.userData.name.lastName,
                    userId: req.session.userData.id,
                    apiKey: req.session.userData.apiKey,title:'MultiDraw'
                });
            }else{
                res.redirect('/login');
            }
        }
    });

    app.get('/new',function(req,res){
        if (req.session.userData) {
            res.render('index', {title: 'MultiDraw'});
        }else{
            res.redirect('/login');
        }
    });

    app.get('/', function (req,res) {
        res.redirect('/center');
    });

    app.get('/login',function(req,res){
        res.render('login',{title:'MultiDraw'});
    });

    app.get('/filelist',function(req,res){
        res.render('file_list');
    });

    app.get('/center', function (req,res) {
        if (req.session.userData) {
            res.render('center', {
                userName: req.session.userData.name.firstName + ' ' + req.session.userData.name.lastName,
                userId: req.session.userData.id,
                apiKey: req.session.userData.apiKey,title:'MultiDraw'
            });
        }else{
            res.redirect('/login');
        }
    })

    app.post('/loginHandle',function(req,res){
        userController.isExist(req,res);
    });

    app.get('/logout', function (req, res) {
        delete req.session.userData;
        userController.removeUserApi(req);
        res.redirect('/board');
    });

    app.get('/users',function(req,res){

    });

    app.get('/admin/users/autoadd', function (req, res) {
        for (var i = 1; i <= 20; i++) {
            var user = {
                username: 'user' + i,
                password: '123',
                name: {
                    firstName: 'Developer',
                    lastName: i.toString()
                }
            };
            userController.addUser(user, req, res);
        }
        res.send(new message.genSimpSuccessMsg('Command has been sent.'));

    });

    app.post('/saveFile',function(req,res){
        fileController.save(req,res);
    });

    app.get('/loadAllFiles',function(req,res){
        fileController.loadAllFiles(req,res);
    });

    app.get('/loadFile',function(req,res){
        var userApi = userController.getUserApi();
        fileController.loadFile(userApi,req,res);
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