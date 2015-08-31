$(function(){

	// This demo depends on the canvas element
	if(!('getContext' in document.createElement('canvas'))){
		alert('Sorry, it looks like your browser does not support canvas!');
		return false;
	}

	var url = 'http://localhost:8080';

	var doc = $(document),
		win = $(window),
		canvas = $('#paper'),
        clear1=$('#clear1'),
		ctx = canvas[0].getContext('2d'),
		instructions = $('#instructions');

    var utils = new Utils();
	var id = utils.getQueryString('username');
    if(!getCookie('name'))
        win.location='/';

	var drawing = false;

	var clients = {};
	var cursors = {};
	var name={};

	var socket = io.connect(url);

	$('#clear').on('click', function () {
		socket.emit('clearAll','clear',function(){
            console.log('clear me');
            clearAll();
        });
	});


    $('#clear1').on('click', function () {
        //var strokeLenth = strokeArray[0].x.length;
        socket.emit('clear','clear1',function(){
            location.reload();
        });
	});

    socket.on('resume',function(data){
        if(data.length>0){
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
    var strokeArray = new Array();
    socket.on('addStroke',function(data){
        console.log(data);
        strokeArray.push(data);
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
        socket.emit('mouseup',{});
	});
    doc.bind('mouseleave', function () {
        drawing = false;
    });
	var lastEmit = $.now();
	doc.on('mousemove',function(e){
        if(me){
            $('<p class="myid">'+id+'</p>').appendTo('#cursors');
            me=false;
        }
		if($.now() - lastEmit > 0){
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
            socket.emit('mouserecord', {
                'x': e.pageX,
                'y': e.pageY,
                'id': id
            });

		}
	});

	setInterval(function(){
		for(ident in clients){
			if($.now() - clients[ident].updated > 1000000){
				cursors[ident].remove();
				delete clients[ident];
				delete cursors[ident];
			}
		}
	},10000);

	function drawLine(fromx, fromy, tox, toy){
		ctx.moveTo(fromx, fromy);
		ctx.lineTo(tox, toy);
		ctx.stroke();
	}

    function clearAll(){
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.beginPath();
    }
});