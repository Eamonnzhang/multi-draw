/**
 * Created by Eamonn on 2015/8/28.
 */
var socket = require('socket.io');
var io=null;
var pathRoom = {};
var textRoom = {};
var geometryRoom = {};
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
            if(geometryRoom[room]===null||geometryRoom[room]===undefined)
                geometryRoom[room]=[];
            socket.emit('allPath', pathRoom[room]);
            socket.emit('allText', textRoom[room]);
            socket.emit('allGeometry', geometryRoom[room]);
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

        socket.on('clearAll',function(data){
            pathRoom[room] = [];
            textRoom[room] = [];
            geometryRoom[room] = [];
            socket.broadcast.to(room).emit('clearAll', data);
        });
        socket.on('clearSelected',function(data){
            for(var i =0;i<pathRoom[room].length;i++) {
                if (data.indexOf(pathRoom[room][i].id) !== -1) {
                    pathRoom[room].splice(i, 1);
                    i--;
                }
            }
            for(var i =0;i<textRoom[room].length;i++) {
                if (data.indexOf(textRoom[room][i].id) !== -1) {
                    textRoom[room].splice(i, 1);
                    i--;
                }
            }
            for(var i =0;i<geometryRoom[room].length;i++) {
                if (data.indexOf(geometryRoom[room][i].id) !== -1) {
                    geometryRoom[room].splice(i, 1);
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

        socket.on('addGeometry',function(data){
            geometryRoom[room].push(data);
            socket.broadcast.to(room).emit('addGeometry', data);
        });

        socket.on('stateChange',function(data){
            for(var i =0;i<pathRoom[room].length;i++) {
                if (data.id === pathRoom[room][i].id) {
                    for(var p in data){
                        pathRoom[room][i][p] = data[p];
                    }
                }
            }
            for(var i =0;i<textRoom[room].length;i++) {
                if (data.id === textRoom[room][i].id) {
                    for(var p in data){
                        textRoom[room][i][p] = data[p];
                    }
                }
            }
            for(var i =0;i<geometryRoom[room].length;i++) {
                if (data.id === geometryRoom[room][i].id) {
                    for(var p in data){
                        geometryRoom[room][i][p] = data[p];
                    }
                }
            }
            socket.broadcast.to(room).emit('stateChange', data);
        });

        socket.on('styleChange', function (data) {
            for(var i =0;i<pathRoom[room].length;i++) {
                if (data.id === pathRoom[room][i].id) {
                    pathRoom[room][i][data.styleName] = data.value;
                }
            }
            for(var i =0;i<textRoom[room].length;i++) {
                if (data.id === textRoom[room][i].id) {
                    textRoom[room][i][data.styleName] = data.value;
                }
            }
            for(var i =0;i<geometryRoom[room].length;i++) {
                if (data.id === geometryRoom[room][i].id) {
                    geometryRoom[room][i][data.styleName] = data.value;
                }
            }
            socket.broadcast.to(room).emit('styleChange', data);
        });

        socket.on('propChange', function (data) {
            for(var i =0;i<textRoom[room].length;i++) {
                if (data.id === textRoom[room][i].id) {
                    textRoom[room][i][data.name] = data.value;
                }
            }
            socket.broadcast.to(room).emit('propChange', data);
        });

        socket.on('canvasBgColor', function (value) {
            socket.broadcast.to(room).emit('canvasBgColor', value);
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
            socket.broadcast.to(room).emit('lockState', data);
        });
        socket.on('unlockState',function(data){
            socket.broadcast.to(room).emit('unlockState', data);
        });
        socket.on('disconnect',function(){
            if(room){
                if(addedUser){
                    userRoom[room].users.splice(userRoom[room].users.indexOf(socket.userName),1);
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

