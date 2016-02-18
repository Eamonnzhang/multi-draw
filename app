#!/usr/bin/env node


var debug = require('debug')('multidraw:server');
var http = require('http');
var socket = require('./socket.js');
var dataSource = require('./app_db/dataSource.js');
var config = require('./config.json');
var Session = require('express-session');
var sessionstore = require('sessionstore');
//var SessionStore = require('session-file-store')(Session);
var aDay = 3600000 * 24;
var session = Session({
    //store: new SessionStore({path: __dirname+'/tmp/sessions'}),
    store: sessionstore.createSessionStore(),
    secret: 'fuck',
    resave: true,
    cookie :{maxAge: 2*aDay,expires:2*aDay},
    saveUninitialized: true
});

dataSource.connectDb(config.dbUrl,function(multidrawDb){
    var app = require('./config'); //获取启动app的基本配置信息，实际上就是express对象
    app.use(session);
    app = require('./routes/root')(app); //把获取的app传到root的参数里，进行对app进行路由的配置,有点儿面向过程的感觉

    var port = normalizePort(process.env.PORT || '4500');
    app.set('port', port);

    /**
     * Create HTTP server.
     */
    var server = http.createServer(app);
    var ios = function(session) {
        return function(socket, next) {
            session(socket.handshake, {}, next);
        };
    };
    var itemDao = new (require('./app_modules/items_mgmt/itemDao.js'))('canvasItems',multidrawDb);
    socket.startSocketIo(server,itemDao,ios(session));
    /**
     * Listen on provided port, on all network interfaces.
     */
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);

    /**
     * Normalize a port into a number, string, or false.
     */

    function normalizePort(val) {
        var port = parseInt(val, 10);

        if (isNaN(port)) {
            // named pipe
            return val;
        }

        if (port >= 0) {
            // port number
            return port;
        }

        return false;
    }

    /**
     * Event listener for HTTP server "error" event.
     */

    function onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        var bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    /**
     * Event listener for HTTP server "listening" event.
     */

    function onListening() {
        var addr = server.address();
        var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        debug('Listening on ' + bind);
    }

});
