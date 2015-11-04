/**
 * Created by Eamonn on 2015/8/28.
 */
var socket = require('socket.io');
var io=null;
var pathRoom = {};
//var pathArr = [];
var userRoom = {};
exports.getSocketIo = function(){
    return socket;
};

exports.startSocketIo = function(server){
    io = socket(server);
    io.on('connection', function (socket) {
        //console.log('connection start');
        var room;
        socket.on('room',function(data){
            room=data.roomId;
            if(pathRoom[room]===null||pathRoom[room]===undefined)
                pathRoom[room]=[];
            socket.join(room);
            if(userRoom[room]===null||userRoom[room]===undefined){
                userRoom[room]=[];
            }
            userRoom[room].push(data);
            io.sockets.in(room).emit('userInfo', userRoom[room]);
            //socket.broadcast.to(room).emit('userInfo', userRoom);
        });
        socket.emit('allPath', pathRoom);
        socket.on('clearAll',function(data,fn){
            pathRoom[room] = [];
            socket.broadcast.to(room).emit('clearAll', data);
            fn();
        });
        socket.on('clearSelected',function(data,fn){
            //console.log(data);
            //console.log(pathArr);
            for(var i =0;i<pathRoom[room].length;i++) {
                if (data.indexOf(pathRoom[room][i].id) !== -1) {
                    pathRoom[room].splice(i, 1);
                    i--;
                }
            }
            socket.broadcast.to(room).emit('clearSelected', data);
            fn();
        });
        socket.on('path',function(data){
            console.log('data');
            pathRoom[room].push(data);
            socket.broadcast.to(room).emit('path', data);
        });

        socket.on('stateChange',function(data){
            for(var i =0;i<pathRoom[room].length;i++) {
                if (data.id === pathRoom[room][i].id) {
                    pathRoom[room][i].left = data.left;
                    pathRoom[room][i].top = data.top;
                    pathRoom[room][i].angle = data.angle;
                    pathRoom[room][i].scaleX = data.scaleX;
                    pathRoom[room][i].scaleY = data.scaleY;
                }
            }
            socket.broadcast.to(room).emit('stateChange', data);
        });

        socket.on('groupChange',function(group){
            socket.broadcast.to(room).emit('groupChange', group);
            for(var i =0;i<pathRoom[room].length;i++) {
                    group.objArr.forEach(function(x){
                        if(x.id === pathRoom[room][i].id ){
                            pathRoom[room][i].left = x.left+group.width/2+group.left;
                            pathRoom[room][i].top = x.top+group.height/2+group.top;
                            //pathRoom[room][i].angle = group.angle;
                            //pathRoom[room][i].scaleX = group.scaleX;
                            //pathRoom[room][i].scaleY = group.scaleY;
                        }
                    });
            }
        });
        socket.on('lockState',function(data){
            //console.log(data);
            socket.broadcast.to(room).emit('lockState', data);
        });
        socket.on('unlockState',function(data){
            //console.log(data);
            socket.broadcast.to(room).emit('unlockState', data);
        });
    });
};

