/**
 * Created by Eamonn on 2015/8/28.
 */

var socket = require('socket.io');
var io=null;

exports.getSocketIo = function(){
    return socket;
};

exports.startSocketIo = function(server){
    io=socket(server);
    io.on('connection', function (socket) {
        socket.on('mousemove', function (data) {
            //监听到客户端发来的mousemove信息后和data后，服务器向所有的客户端
            //广播moving事件但除了当前客户端，这样就实现了其他在线客户端能够
            //收到新加入客户端的data
            socket.broadcast.emit('moving', data);
        });
    });
};
