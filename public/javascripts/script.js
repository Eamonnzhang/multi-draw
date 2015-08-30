$(function(){

	// This demo depends on the canvas element
	if(!('getContext' in document.createElement('canvas'))){
		alert('Sorry, it looks like your browser does not support canvas!');
		return false;
	}

	// The URL of your web server (the port is set in app.js)
	var url = 'http://localhost:8080';

	var doc = $(document),
		win = $(window),
		canvas = $('#paper'),
        //返回一个用于在画布上绘图的环境
		ctx = canvas[0].getContext('2d'),
		instructions = $('#instructions');
	
	// Generate an unique ID
	//var id = Math.round($.now()*Math.random());
    var utils = new Utils();
	var id = utils.getQueryString('username');
    if(!getCookie('name'))
        win.location='/';

	// A flag for drawing activity
	var drawing = false;

	var clients = {};
	var cursors = {};
	var name={};

	//get socket from socket.io.js
	var socket = io.connect(url);

	socket.on('moving', function (data) {
		//当收到来自服务器的moving事件和data时，如果data.id这个属性不在clients
        //添加一个鼠标图标
		if(! (data.id in clients)){
            //其实cusors对象的每一个属性存的是一个div块，这个div是一个鼠标图片
			cursors[data.id] = $('<div class="cursor">').appendTo('#cursors');
			//name[data.id] = $('<div class="cursor">').appendTo('#cursors');
            name[data.id] = $('<div class="username">'+data.id+'</div>').appendTo('#cursors');
		}
        //记录新加入鼠标图片的位置，通过它发给服务器的data来记录
		cursors[data.id].css({
			'left' : data.x,
			'top' : data.y
		});
		name[data.id].css({
			'left' : data.x+5,
			'top' : data.y+17
		});
		if(data.drawing && clients[data.id]){
			// Draw a line on the canvas. clients[data.id] holds
			// the previous position of this user's mouse pointer
			drawLine(clients[data.id].x, clients[data.id].y, data.x, data.y);
		}
		// Saving the current client state
		clients[data.id] = data;
		clients[data.id].updated = $.now();
	});


	var prev = {};
    var me = true;
	//这个on函数是jquery定义的，相当于绑定了mousedown事件
    //为画布绑定mousedown事件，把鼠标按下的坐标，传给prev
	canvas.on('mousedown',function(e){
        e.preventDefault();
		drawing = true;
		prev.x = e.pageX;
		prev.y = e.pageY;
        //把首页的欢迎介绍隐藏
		instructions.fadeOut();
	});
	doc.bind('mouseup mouseleave',function(){
		drawing = false;
	});
    //最后一次向服务器发送事件的时间？
	var lastEmit = $.now();
    //当鼠标移动的时候，每隔30毫秒？向服务器emit一次？
	doc.on('mousemove',function(e){
        if(me){
            $('<p class="myid">'+id+'</p>').appendTo('#cursors');
            me=false;
        }
		if($.now() - lastEmit > 30){
            //向服务器发送的数据是一个data对象
            //含有鼠标移动的坐标，是否drawing和id
			socket.emit('mousemove',{
				'x': e.pageX,
				'y': e.pageY,
				'drawing': drawing,
				'id': id
			});
			lastEmit = $.now();
		}
		if(drawing){
            //参数含义为 当前鼠标按下的点和移动的点
			drawLine(prev.x, prev.y, e.pageX, e.pageY);
            //更新当前点的xy坐标
			prev.x = e.pageX;
			prev.y = e.pageY;
		}
	});
	// 移除不活动鼠标，这个函数会不停地调用，直到clearInterval，
	// 由 setInterval() 返回的 ID 值可用作 clearInterval() 方法的参数。
	setInterval(function(){
		//ident数据是谁传过来的？
		for(ident in clients){
            //超过10秒，删除dom节点，删除属性
			if($.now() - clients[ident].updated > 1000000){
				cursors[ident].remove();
				delete clients[ident];
				delete cursors[ident];
			}
		}
	},10000);

	function drawLine(fromx, fromy, tox, toy){
        //把路径移动到画布中的指定点，不创建线条
		ctx.moveTo(fromx, fromy);
        //添加一个新点，然后在画布中创建从该点到最后指定点的线条
		ctx.lineTo(tox, toy);
        //绘制已定义路径
		ctx.stroke();
	}

});