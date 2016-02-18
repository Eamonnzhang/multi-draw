/**
 * Created by Eamonn on 2015/9/17.
 */
var fileController = require('../app_modules/files_mgmt/fileController.js');
var userController = require('../app_modules/users_mgmt/userController.js');
var itemController = require('../app_modules/items_mgmt/itemController.js');
var message = require('../app_modules/_utils/messageGenerator.js');
var serverCommunication = require('../app_modules/_utils/communication.js');
var uuId = require('../app_modules/_utils/uuidGenerator.js');

module.exports = function(app){
    app.get('/board',function(req,res){
        if(req.query.userName&&req.query.userId){
            res.render('canvas', {
                userName: req.query.userName,
                userId: req.query.userId,
                apiKey: uuId.generateId(8, 32),
                title:'MultiDraw'
            });
        }else{
           checkLogin(req,res,function(msg){
			   if(msg.success){
					if(req.query.id){
						res.render('canvas', {
							userName: req.session.userData.name.firstName + ' ' + req.session.userData.name.lastName,
							userId: req.session.userData.id,
							apiKey: req.session.userData.apiKey,
							title:'MultiDraw'
						});
					}
					else{
						res.redirect('/center');
					}
				}else{
					res.redirect('http://www.xuezuowang.com/login');
				}
		   })   
        }
    });
    app.get('/new',function(req,res){
		checkLogin(req,res,function(msg){
			   if(msg.success){
					 res.render('index', {title: 'MultiDraw'});
				}else{
					res.redirect('http://www.xuezuowang.com/login');
				}
		   }) 
    });
    app.get('/', function (req,res) {
        res.redirect('/center');
    });
	
	 var checkLogin = function (req, res, next) {
        if (req.session.userData) {
            if(!req.cookies.userAuth || req.cookies.userAuth === 'undefined'){
                //设置cookie
                res.cookie('sysCookieId', req.session.sysCookieId);
                res.cookie('userAuth', req.session.auth);
            }
            console.log('session登入成功');
            if (next){
                next(message.genSimpSuccessMsg('has session', null));
            }
        } else if (req.cookies.userAuth && req.cookies.userAuth != 'undefined'){
            console.log('cookie登入。userAuth: ' + req.cookies.userAuth);
            getUserSelfInfo(req.cookies.userAuth, function (userData) {
                req.session.userData = userData;
                console.log('cookie登入成功');
                if (next){
                    next(message.genSimpSuccessMsg('has session', null));
                }
            });
        } else {
            console.log('没有session或cookie');
            res.cookie('lastModify',new Date());
            if (next){
                next(message.genSimpFailedMsg('no session', null));
            }
        }
    };
	var getUserSelfInfo = function (userAuth, next) {
        var path = '/user/checkUser?auth=' + userAuth;
        serverCommunication.syncope(null, 'get', path, null, "application/json", function (data) {
            var result;
            if(data.success){
                var userData = {
                    id: data.data.id2,
                    username: data.data.username,
                    password: data.data.password,
                    name: {
                        firstName: data.data.username,
                        lastName: ''
                    }
                };
                next(userData);
            }
        });
    };
	
	app.get('/setSysCookie', function (req, res) {
        res.cookie('lastModify',new Date());
        res.send(true);
    });
	
	app.get('/UMB/logOut', function (req, res) {
        delete req.session.userData;
        res.clearCookie('sysCookieId');
        res.clearCookie('userAuth');
        res.send('true');
    });


    app.get('/login',function(req,res){
        res.render('login',{title:'MultiDraw'});
    });

    app.get('/join',function(req,res){
        res.render('join',{title:'MultiDraw'});
    });

    app.get('/filelist',function(req,res){
        res.render('file_list');
    });

    app.get('/center', function (req,res) {
		checkLogin(req,res,function(msg){
			   if(msg.success){
					res.render('center', {
						userName: req.session.userData.name.firstName + ' ' + req.session.userData.name.lastName,
						userId: req.session.userData.id,
						apiKey: req.session.userData.apiKey,title:'MultiDraw'
					});
				}else{
					res.redirect('http://www.xuezuowang.com/login');
				}
		   }) 
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
        //delete req.session.userData;
        //userController.removeUserApi(req);
        //res.redirect('/board');
        var sysCookieId=req.cookies.sysCookieId;
        var path = '/session/logOut?sysCookieId='+sysCookieId;
        serverCommunication.syncope(null, 'get', path, null, "application/json", function (data) {
            if (data.success) {
                delete req.session.userData;
                res.clearCookie('sysCookieId');
                res.clearCookie('userAuth');
                console.log('log out');
                res.redirect('/');
            } else {
                if (data.msg === 'not found'){
                    delete req.session.userData;
                    res.clearCookie('sysCookieId');
                    res.clearCookie('userAuth');
                    console.log('no user info');
                    res.redirect('/');
                } else {
                    res.send(data);
                }
            }
		});
    });

    app.post('/saveFile',function(req,res){
        fileController.saveFile(req,res);
    });

    app.get('/loadAllFiles',function(req,res){
        fileController.loadAllFiles(req,res);
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
        var userApi = userController.getUserApi();
        fileController.loadFile(userApi,req,res);
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