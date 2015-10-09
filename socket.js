/**
 * Created by Eamonn on 2015/8/28.
 */


//var clickX=new Array();
//var clickY=new Array();
//var s_data={};
//s_data.x=clickX;
//s_data.y=clickY;
//var addClick = function(x,y,name){
//    clickX.push(x);
//    clickY.push(y);
//};
var socket = require('socket.io');
var io=null;
var pathRoom = {};
var pathArr = [];
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
            if(pathRoom[room]===null||pathRoom[room]===undefined)
                pathRoom[room]=[];
            socket.join(room);
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
            //for(var i =0;i<pathRoom[room].length;i++) {
            //    if (group.idArr.indexOf(pathRoom[room][i].id) !== -1) {
            //        //pathRoom[room][i].left = group.left;
            //        //pathRoom[room][i].top = group.top;
            //        //pathRoom[room][i].angle = group.angle;
            //        //pathRoom[room][i].scaleX = group.scaleX;
            //        //pathRoom[room][i].scaleY = group.scaleY;
            //    }
            //}
            socket.broadcast.to(room).emit('groupChange', group);
        });
        //socket.emit('resume',drawStore);
        //socket.on('mousemove', function (data) {
        //    socket.broadcast.to(room).emit('moving', data);
        //});
        //socket.on('mouserecord', function (data) {
        //    addClick(data.x,data.y);
        //});
        //socket.on('mouseup',function(){
        //    if(s_data.x.length>0){
        //        drawStore[room].push(s_data);
        //        socket.broadcast.to(room).emit('addStroke',s_data);
        //    }
        //    clickX=new Array();
        //    clickY=new Array();
        //    s_data={};
        //    s_data.x=clickX;
        //    s_data.y=clickY;
        //});
        //socket.on('mousedown',function(){
        //});
    });
};

