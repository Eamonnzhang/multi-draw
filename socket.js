/**
 * Created by Eamonn on 2015/8/28.
 */
var socket = require('socket.io');
var io=null;
var pathRoom = {};
var textRoom = {};
var userRoom = {};
exports.getSocketIo = function(){
    return socket;
};
var room;
//var numUsers = 0;
exports.startSocketIo = function(server){
    io = socket(server);
    io.on('connection', function (socket) {
        var addedUser = false;
        socket.on('room',function(roomId){
            room = roomId;
            socket.join(room);
            if(userRoom[room]===null||userRoom[room]===undefined){
                userRoom[room]=[];
                userRoom[room].numUsers = 0;
                userRoom[room].users = [];
            }
            if(pathRoom[room]===null||pathRoom[room]===undefined)
                pathRoom[room]=[];
            if(textRoom[room]===null||textRoom[room]===undefined)
                textRoom[room]=[];
            socket.emit('allPath', pathRoom[room]);
            socket.emit('allText', textRoom[room]);
        });

        socket.on('queryUsers', function (data) {
            var users={};
            users.numUsers = userRoom[data].numUsers;
            users.userNames = userRoom[data].users;
            //console.log(users);
            socket.emit('queryUsers',users);
        });
        socket.on('addUser', function (userName) {
            socket.userName = userName;
            userRoom[room].users.push(userName);
            ++userRoom[room].numUsers;
            addedUser = true;
            io.sockets.in(room).emit('userJoined', {
                userName:socket.userName,
                numUsers:userRoom[room].numUsers
            });
        });

        socket.on('clearAll',function(data,fn){
            pathRoom[room] = [];
            textRoom[room] = [];
            socket.broadcast.to(room).emit('clearAll', data);
        });
        socket.on('clearSelected',function(data,fn){
            for(var i =0;i<pathRoom[room].length;i++) {
                if (data.indexOf(pathRoom[room][i].id) !== -1) {
                    pathRoom[room].splice(i, 1);
                    i--;
                }
            }
            socket.broadcast.to(room).emit('clearSelected', data);
        });
        socket.on('addPath',function(data){
            pathRoom[room].push(data);
            socket.broadcast.to(room).emit('addPath', data);
        });

        socket.on('addText',function(data){
            textRoom[room].push(data);
            socket.broadcast.to(room).emit('addText', data);
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
            for(var i =0;i<textRoom[room].length;i++) {
                if (data.id === textRoom[room][i].id) {
                    textRoom[room][i].left = data.left;
                    textRoom[room][i].top = data.top;
                    textRoom[room][i].angle = data.angle;
                    textRoom[room][i].scaleX = data.scaleX;
                    textRoom[room][i].scaleY = data.scaleY;
                }
            }
            socket.broadcast.to(room).emit('stateChange', data);
        });

        socket.on('styleChange', function (data,fn) {
            for(var i =0;i<pathRoom[room].length;i++) {
                if (data.id === pathRoom[room][i].id) {
                    pathRoom[room][i][data.styleName] = data.value;
                }
            }
            socket.broadcast.to(room).emit('styleChange', data);
        });

        socket.on('propChange', function (data,fn) {
            for(var i =0;i<textRoom[room].length;i++) {
                if (data.id === textRoom[room][i].id) {
                    textRoom[room][i][data.name] = data.value;
                }
            }
            socket.broadcast.to(room).emit('propChange', data);
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
        socket.on('disconnect',function(){
            //pathRoom[socket.userId] = [];
            if(room){
                if(addedUser){
                    //delete userRoom[room][socket.userName];
                    userRoom[room].users.splice(userRoom[room].users.indexOf(socket.userName,1));
                    --userRoom[room].numUsers;
                    console.log(userRoom[room]);
                }
                io.sockets.in(room).emit('userLeft', {
                    userName:socket.userName,
                    numUsers:userRoom[room].numUsers
                });
            }
        })
    });
};

