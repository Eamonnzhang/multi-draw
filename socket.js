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

var addClick = function(x,y,name){
    clickX.push(x);
    clickY.push(y);
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
            drawStore[room].length=0;
            fn();
        });

        socket.on('clear',function(data,fn){
            var arr = drawStore[room];
            console.log(room);
            arr.shift();
            console.log(arr);
            fn();
        });

    });
};

