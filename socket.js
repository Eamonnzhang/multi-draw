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
var drawStore = new Array();

var addClick = function(x,y,name){
    clickX.push(x);
    clickY.push(y);
};

exports.getSocketIo = function(){
    return socket;
};

exports.startSocketIo = function(server){
    io=socket(server);
    io.on('connection', function (socket) {
        console.log('connection start');

        socket.on('mousemove', function (data) {
            socket.broadcast.emit('moving', data);
        });
        socket.on('mouserecord', function (data) {
            addClick(data.x,data.y);
        });
        socket.on('mouseup',function(){
            if(s_data.x.length>0){
                drawStore.push(s_data);
                socket.emit('addStroke',s_data);
            }
            clickX=new Array();
            clickY=new Array();
            s_data={};
            s_data.x=clickX;
            s_data.y=clickY;
            console.log(drawStore);
        });
        socket.on('mousedown',function(){
        });
        socket.on('clearAll',function(data,fn){
            //console.log(data);
            drawStore.length=0;
            console.log(drawStore);
            fn();
        });

        socket.on('clear',function(data,fn){
            //console.log(data);
            //drawStore.length=0;
            //console.log(drawStore);
            drawStore.splice(0,1);
            console.log(drawStore.length);
            fn();
        });
        socket.emit('resume',drawStore);
    });
};

