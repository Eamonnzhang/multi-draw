/**
 * Created by Eamonn on 2015/8/28.
 */
var socket = require('socket.io');

var io = null;

var md = {
    objectsRoom : {},
    userRoom : {}
};

var utils = {
    isNotValid : function (value) {
        return value === null || value === undefined;
    },
    spliceArray : function (array,data) {
        for(var i =0;i<array.length;i++) {
            if (data.indexOf(array[i].id) !== -1) {
                array.splice(i, 1);
                i--;
            }
        }
    },
    setPropsInArray : function (array,data){
        for(var i =0;i<array.length;i++) {
            if (data.id === array[i].id) {
                for(var p in data){
                    array[i][p] = data[p];
                }
            }
        }
    },
    setPropInArray : function (array,data) {
        for(var i =0;i<array.length;i++) {
            if (data.id === array[i].id) {
                array[i][data.name] = data.value;
            }
        }
    },
};

var room;

exports.getSocketIo = function(){
    return socket;
};
exports.startSocketIo = function(server){
    io = socket(server);
    io.on('connection', function (socket) {
        var addedUser = false;
        socket.on('room',function(roomId){
            room = roomId;
            socket.join(room);
            if(utils.isNotValid(md.userRoom[room])){
                md.userRoom[room]=[];
                md.userRoom[room].numUsers = 0;
                md.userRoom[room].users = [];
            }
            if(utils.isNotValid(md.objectsRoom[room])){
                md.objectsRoom[room]=[];
            }
            socket.emit('canvas',md);
        });

        socket.on('queryUsers', function (data) {
            var users={};
            users.numUsers = md.userRoom[data].numUsers;
            users.userNames = md.userRoom[data].users;
            socket.emit('queryUsers',users);
        });

        socket.on('addUser', function (userName) {
            io.sockets.in(room).emit('userJoined', {
                userName:socket.userName,
                numUsers:md.userRoom[room].numUsers
            });
            socket.userName = userName;
            md.userRoom[room].users.push(userName);
            ++md.userRoom[room].numUsers;
            addedUser = true;
        });

        socket.on('clearAll',function(data){
            socket.broadcast.to(room).emit('clearAll', data);
            md.objectsRoom[room] = [];
        });

        socket.on('clearSelected',function(data){
            socket.broadcast.to(room).emit('clearSelected', data);
            utils.spliceArray(md.objectsRoom[room],data);
        });

        socket.on('addObject', function (data) {
            socket.broadcast.to(room).emit('addObject',data);
            md.objectsRoom[room].push(data);
        });

        socket.on('restoreAll', function (data) {
            if(data&&data.objects){
                data.objects.forEach(function (obj) {
                    utils.setPropsInArray(md.objectsRoom[room],obj);
                })
            }
        });
        socket.on('statePropChange',function(data){
            socket.broadcast.to(room).emit('statePropChange', data);
            utils.setPropsInArray(md.objectsRoom[room],data);
        });

        socket.on('stylePropChange',function(data){
            socket.broadcast.to(room).emit('stylePropChange', data);
            utils.setPropInArray(md.objectsRoom[room],data);
        });

        socket.on('canvasBgColor', function (value) {
            socket.broadcast.to(room).emit('canvasBgColor', value);
        });

        socket.on('groupStateChange',function(group){
            socket.broadcast.to(room).emit('groupStateChange', group);
        });

        socket.on('lockState',function(data){
            socket.broadcast.to(room).emit('lockState', data);
        });

        socket.on('discard',function(data){
            socket.broadcast.to(room).emit('discard', data);
        });

        socket.on('disconnect',function(){
            if(room){
                if(addedUser){
                    md.userRoom[room].users.splice(md.userRoom[room].users.indexOf(socket.userName),1);
                    --md.userRoom[room].numUsers;
                    console.log(md.userRoom[room]);
                }
                io.sockets.in(room).emit('userLeft', {
                    userName:socket.userName,
                    numUsers:md.userRoom[room].numUsers
                });
            }
        })
    });
};

