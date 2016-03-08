/**
 * Created by Eamonn on 2015/8/28.
 */
var socket = require('socket.io');

var io = null;

var md = {
    userRoom : {}
};

var utils = {
    isNotValid : function (value) {
        return value === null || value === undefined;
    },
    prepareNewObj : function (obj,user) {
        obj.userId = user.id;
        obj.userName = user.username;
    }
};

var room;

exports.getSocketIo = function(){
    return socket;
};
exports.startSocketIo = function(server,db,configCallback){
    io = socket(server);
    var itemDao = db;
    io.use(configCallback);
    io.on('connection', function (socket) {
        var addedUser = false;
        socket.on('room',function(info){
            room = info.roomId;
            socket.join(room);
            delete info.user.userKey;
            var c_userName = info.user.userName;
            socket.userName = c_userName;
            addedUser = true;
            if(utils.isNotValid(md.userRoom[room])){
                md.userRoom[room] = {};
                md.userRoom[room].numUsers = 1;
                md.userRoom[room].users = [info.user];
            }else{
                md.userRoom[room].users.push(info.user);
                ++md.userRoom[room].numUsers;
            }
            io.sockets.in(room).emit('userJoined', {
                userName: info.user.userName,
                numUsers: md.userRoom[room].numUsers
            });
            var currentRoomData = {
                userData : md.userRoom[room]
            };
            socket.emit('canvas',currentRoomData);
        });

        socket.on('queryUsers', function (data) {
            var users={};
            users.numUsers = md.userRoom[data].numUsers;
            users.userNames = md.userRoom[data].users;
            socket.emit('queryUsers',users);
        });

        socket.on('addUser', function (user) {
            var c_userName = user.userName;
            md.userRoom[room].users.push(user);
            ++md.userRoom[room].numUsers;
            io.sockets.in(room).emit('userJoined', {
                userName: user.userName,
                numUsers: md.userRoom[room].numUsers
            });
            socket.userName = c_userName;
            addedUser = true;
        });

        socket.on('clearAll',function(data){
            socket.broadcast.to(room).emit('clearAll', 'clearAll');
            itemDao.deleteAllItemsInCanvas(data.canvasId, function (data) {
                //console.log('clearAll',data);
                if(data.success){
                    io.sockets.in(room).emit('saveSuccess',{msg:'所有更改已保存'});
                }else{
                    io.sockets.in(room).emit('saveFailed',{msg:'保存失败'});
                }
            })
        });

        socket.on('clearSelected',function(data){
            socket.broadcast.to(room).emit('clearSelected', data);
            var itemsId = data.itemsId,
                cbNum = 0,
                result = [];
            for(var i = 0; i < itemsId.length; i++){
                itemDao.deleteItemInCanvas({itemId : itemsId[i]},data.canvasId, function (data) {
                    cbNum++;
                    if(data){
                        result.push(data);
                        if(cbNum === itemsId.length){
                            io.sockets.in(room).emit('saveSuccess',{msg:'所有更改已保存'});
                        }
                    }
                })
            }
        });

        socket.on('addObject', function (data) {
            utils.prepareNewObj(data,socket.handshake.session.userData);
            socket.broadcast.to(room).emit('addObject',data);
            itemDao.saveItem(data, function (data) {
                //console.log('addObject');
                if(data.success){
                    io.sockets.in(room).emit('saveSuccess',{msg:'所有更改已保存'});
                }else{
                    io.sockets.in(room).emit('saveFailed',{msg:'保存失败'});
                }
            });
        });

        socket.on('statePropChange',function(data){
            socket.broadcast.to(room).emit('statePropChange', data);
            var items = data.items,
                cbNum = 0,
                result = [];
            for(var i = 0; i < items.length; i++){
                var itemId = items[i].itemId;
                delete items[i].itemId;
                itemDao.updateItemInCanvas({itemId : itemId},data.canvasId,items[i], function (data) {
                    cbNum++;
                    if(data){
                        result.push(data);
                        if(cbNum === items.length){
                            io.sockets.in(room).emit('saveSuccess',{msg:'所有更改已保存'});
                        }
                    }
                })
            }
        });

        socket.on('stylePropChange',function(data){
            socket.broadcast.to(room).emit('stylePropChange', data);
            var item = data.items[0],
                itemId = item.itemId;
            delete item.itemId;
            itemDao.updateItemInCanvas({itemId :itemId},data.canvasId,item,function (result) {
                //console.log('stylePropchange');
                if(data.success){
                    io.sockets.in(room).emit('saveSuccess',{msg:'所有更改已保存'});
                }else{
                    io.sockets.in(room).emit('saveFailed',{msg:'保存失败'});
                }
            });
        });

        socket.on('canvasBgColor', function (value) {
            socket.broadcast.to(room).emit('canvasBgColor', value);
        });

        socket.on('canvasPropChange', function (data) {
            socket.broadcast.to(room).emit('canvasPropChange', data);
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

