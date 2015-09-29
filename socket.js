/**
 * Created by Eamonn on 2015/8/28.
 */

var socket = require('socket.io');
var io=null;
var clickX=new Array();
var clickY=new Array();
var s_data={};
s_data.x=clickX;
s_data.y=clickY;
var drawStore = {};
var pathArr = [];

var addClick = function(x,y,name){
    clickX.push(x);
    clickY.push(y);
};

var generateId = function (len, radix) {
    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    Math.uuid = function (len, radix) {
        var chars = CHARS, uuid = [], i;
        radix = radix || chars.length;
        if (len) {
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            var r;
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    };
    return Math.uuid(len, radix);
};

exports.getSocketIo = function(){
    return socket;
};

exports.startSocketIo = function(server){
    io = socket(server);
    io.on('connection', function (socket) {
        //console.log('connection start');
        var room;
        socket.on('room',function(data){
            room=data;
            if(drawStore[room]==null||drawStore[room]==undefined)
                drawStore[room]=[];
            socket.join(room);
        });
        socket.emit('resume',drawStore);
        socket.on('mousemove', function (data) {
            socket.broadcast.to(room).emit('moving', data);
        });
        socket.on('mouserecord', function (data) {
            addClick(data.x,data.y);
        });
        socket.on('mouseup',function(){
            if(s_data.x.length>0){
                drawStore[room].push(s_data);
                socket.broadcast.to(room).emit('addStroke',s_data);
            }
            clickX=new Array();
            clickY=new Array();
            s_data={};
            s_data.x=clickX;
            s_data.y=clickY;
        });
        socket.on('mousedown',function(){
        });
        socket.on('clearAll',function(data,fn){
            pathArr = [];
            socket.broadcast.emit('clearAll', data);
            fn();
        });
        socket.on('clearSelected',function(data,fn){
            //console.log(data);
            socket.broadcast.emit('clearSelected', data);
            fn();
        });
        socket.on('path',function(data){
            //console.log(data.path.id);
            //data.id = generateId(8,32);
            pathArr.push(data);
            socket.broadcast.emit('message', data);
        });
        socket.emit('allPath', pathArr);
    });
};

