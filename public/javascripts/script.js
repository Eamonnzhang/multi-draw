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
    var button = document.createElement('button');
    button.innerText='ClearAll';
    button.setAttribute('id','clear');
    button.addEventListener('click', function () {
        console.log('click');
    },false);
    $('#clear').appendTo(canvas);
	//var id = Math.round($.now()*Math.random());
    var utils = new Utils();
	var id = utils.getQueryString('username');
    if(!getCookie('name'))
        win.location='/';

	var drawing = false;

	var clients = {};
	var cursors = {};
	var name={};

	var socket = io.connect(url);

    socket.on('resume',function(data){
        console.log(data);
        for(var i=0;i<data.length;i++){
            for(var j=0;j<data[i].x.length;j++){
                ctx.lineTo(data[i].x[j], data[i].y[j]);
                ctx.stroke();
            }
            if((data[i+1]!=null)&&(data[i+1]!=undefined)){
                ctx.moveTo(data[i+1].x[0],data[i+1].y[0]);
            }
        }
    });

	socket.on('moving', function (data) {
		if(! (data.id in clients)){
			cursors[data.id] = $('<div class="cursor">').appendTo('#cursors');
            name[data.id] = $('<div class="username">'+data.id+'</div>').appendTo('#cursors');
		}
		cursors[data.id].css({
			'left' : data.x,
			'top' : data.y
		});
		name[data.id].css({
			'left' : data.x+5,
			'top' : data.y+17
		});
		if(data.drawing && clients[data.id]){
			drawLine(clients[data.id].x, clients[data.id].y, data.x, data.y);
		}
		// Saving the current client state
		clients[data.id] = data;
		clients[data.id].updated = $.now();
	});


	var prev = {};
    var me = true;
	canvas.on('mousedown',function(e){
        socket.emit('mousedown',{});
        e.preventDefault();
		drawing = true;
		prev.x = e.pageX;
		prev.y = e.pageY;
		instructions.fadeOut();
	});
	doc.bind('mouseup',function(){
		drawing = false;
        socket.emit('newdraw',{});
	});
    doc.bind('mouseleave', function () {
        drawing = false;
    });
	var lastEmit = $.now();
	doc.on('mousemove',function(e){
        if(me){
            $('<p class="myid">'+id+'</p>').appendTo('#cursors');
            //$('<button id="clear">ClearAll</button>').appendTo('#cursors');
            me=false;
        }
		if($.now() - lastEmit > 30){
			socket.emit('mousemove',{
				'x': e.pageX,
				'y': e.pageY,
				'drawing': drawing,
				'id': id
			});
			lastEmit = $.now();
		}
		if(drawing){
			drawLine(prev.x, prev.y, e.pageX, e.pageY);
            prev.x = e.pageX;
            prev.y = e.pageY;
            socket.emit('mouserecord',{
                'x': e.pageX,
                'y': e.pageY,
                'id': id
            });
		}
	});

    //var clearAll = $('div#clear');
    //console.log(clearAll);
    //clearAll.click(function(){
    //    console.log('click');
    //});

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