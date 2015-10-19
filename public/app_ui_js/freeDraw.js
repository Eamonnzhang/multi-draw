/**
 * Created by Eamonn on 2015/9/26.
 */
(function() {
    var _ = function(id){return document.getElementById(id)};
    var doc = $(document);
    var url = 'http://192.168.1.81:4500';
    var drawing = false;
    var isFirstMove = true;
    var socket = io.connect(url);
    var roomId = decodeURI(urlParams(window.location.href)['room']);
    var drawingModeEl = _('drawing-mode'),
        drawingOptionsEl = _('drawing-mode-options'),
        drawingColorEl = _('drawing-color'),
        drawingShadowColorEl = _('drawing-shadow-color'),
        drawingLineWidthEl = _('drawing-line-width'),
        drawingShadowWidth = _('drawing-shadow-width'),
        drawingShadowOffset = _('drawing-shadow-offset'),
        clearEl = _('clear-selected-canvas'),
        consoleInfo = _('console-info'),
        test = _('test'),
        roomDiv = _('roomId'),
        deleteBtn = _('delete'),
        saveBtn = _('save'),
        confirmSaveBtn = _('confirmSave'),
        clearAllEl = _('clear-all-canvas');
    var communication = new Communication();
    var canvas = this.__canvas = new fabric.Canvas('c', {
        isDrawingMode: true
    });
    window.onresize=resizeCanvas;
    function resizeCanvas(){
        if ($(window).width() > 768){
            canvas.setWidth($(window).width()-$("#sidebar-collapse").width()-60);
        }
        else{
            canvas.setWidth($(window).width()-60);
        }
        canvas.setHeight(window.innerHeight-300);
    }
    resizeCanvas();
    fabric.Object.prototype.transparentCorners = false;
    var pathToSerializable = function(data,id){
        var option={};
        option.id=id;
        option.path = data.path;
        option.stroke = data.stroke;
        option.strokeWidth = data.strokeWidth;
        option.strokeLineCap = data.strokeLineCap;
        option.strokeLineJoin = data.strokeLineJoin;
        option.originX = data.originX;
        option.originY = data.originY;
        option.fill = data.fill;
        return option;
    };
    var groupToSerializable = function(group){
        var obj={};
        var objArr = [];
        var idArr = [];
        group.forEachObject(function(x){
            var path = {
                id : x.id,
                left : x.left,
                top : x.top
            };
            objArr.push(path);
            idArr.push(x.id);
        });
        obj.objArr = objArr;
        obj.idArr = idArr;
        obj.top = group.top;
        obj.left = group.left;
        obj.angle= group.angle;
        obj.scaleX = group.scaleX;
        obj.scaleY = group.scaleY;
        obj.width = group.width;
        obj.height = group.height;
        return obj;
    };
    var getMyObjArr = function(o_arr){
        return o_arr.concat('');
    };

    if(roomId){
        socket.emit('room', roomId);
        roomDiv.innerHTML='房间：'+roomId;
    }

    consoleInfo.onclick = function(){
        if(canvas.getActiveObject()){
            console.log(canvas.getActiveObject());
        }
        if(canvas.getActiveGroup()){
            canvas.getActiveGroup().forEachObject(function(a) {
                console.log(a);
            });
        }
    };
//testbutton
    test.onclick = function(){
        //if(canvas.getActiveObject()){
        //    console.log(canvas.getActiveObject().toObject());
        //    //canvas.add(canvas.getActiveObject().toObject());
        //}
        var obj = canvas.getActiveGroup();
        //var obj = canvas.getObjects();
        //console.log(obj);
        obj.forEachObject(function(x){
            //x.selectable=false;
            x.selectable  = false;
        });
        //canvas.setActiveObject(canvas.item(0));
        //canvas.setActiveGroup();

    };

    if(roomId){
        socket.on('allPath',function(data){
            if(data[roomId]){
                data[roomId].forEach(function(x){
                    canvas.add(new fabric.Path(x.path,x));
                });
            }
        });
    }
    canvas.on('path:created',function(e){
        //console.log(e.path);
        var path = e.path;
        var id = generateId(8,32);
        path.id=id;
        var data = pathToSerializable(path,id);
        socket.emit('path', data);
    });
    var isMouseDown = false;
    canvas.on('mouse:down',function(e){
        //console.log(e);
        isMouseDown = true;
        if(e.target){

        }
    });

    canvas.on('mouse:up',function(e){
        //console.log(e);
        if(isMouseDown){
            isMouseDown = !isMouseDown;
            var obj = e.target;
            if(obj){
                if(canvas.getActiveObject()){
                    //console.log(obj.top+','+obj.left);
                    var data = {
                        id : obj.id,
                        top: obj.top,
                        left:obj.left,
                        angle:obj.angle,
                        scaleX:obj.scaleX,
                        scaleY:obj.scaleY
                    };
                    socket.emit('stateChange',data);
                    socket.emit('unlockStates',obj.id);
                }
                if(canvas.getActiveGroup()){
                    var group = groupToSerializable(canvas.getActiveGroup());
                    socket.emit('groupChange',group);
                    socket.emit('unlockState',group.idArr);
                }
            }else{
                //socket.emit('deActive','deActive');
            }
        }

    });

    canvas.on('mouse:move',function(e){
        if(isMouseDown&&canvas.getActiveObject()){
            //console.log(e);
        }
        if(e.target){

        }
    });


    //选中
    canvas.on('object:selected',function(e){
        //console.log(e);
        var objs = e.target;
        var idArr = [];
        if(objs){
            if(objs._objects){
                objs._objects.forEach(function(x){
                    idArr.push(x.id);
                });
                //console.log(idArr);
                socket.emit('lockState',idArr);
            }else{
                socket.emit('lockState',objs.id);
            }
        }
        //isObjSelected = !isObjSelected;
    });

    //移动
    canvas.on('object:moving',function(e){

    });

    //缩放
    canvas.on('object:scaling',function(e){
        //console.log(e);
    });

    //旋转
    canvas.on('object:rotating',function(e){

    });

    canvas.on('after:render',function(e){
        //console.log(e);
    });

    socket.on('lockState',function(data){
        var myObjArr = getMyObjArr(canvas.getObjects());
        myObjArr.forEach(function(x){
            if(data.indexOf(x.id)!==-1 ){
                x.selectable = false;
            }
        })
    });

    socket.on('unlockState',function(data){
        var myObjArr = getMyObjArr(canvas.getObjects());
        myObjArr.forEach(function(x){
            if(data.indexOf(x.id)!==-1 ){
                x.selectable = true;
            }
        })
    });

    socket.on('stateChange',function(data){
        canvas.deactivateAll();
        var myObjArr = getMyObjArr(canvas.getObjects());
        myObjArr.forEach(function(a){
            if(a.id === data.id){
                //console.log(data);
                a.setTop(data.top);
                a.setLeft(data.left);
                a.setAngle(data.angle);
                a.setScaleX(data.scaleX);
                a.setScaleY(data.scaleY);
                //a.setCoords();
                canvas.renderAll();
            }
        });
    });

    socket.on('groupChange',function(group){
        var myObjArr = getMyObjArr(canvas.getObjects());
        var selectObjs = [];
        myObjArr.forEach(function(a){
            if(group.idArr.indexOf(a.id) !== -1){
                selectObjs.push(a);
            }
        });
        var opt ={};
        opt.top = group.top;
        opt.left =group.left;
        opt.angle=group.angle;
        opt.scaleX = group.scaleX;
        opt.scaleY = group.scaleY;
        var objGroup = new fabric.Group(selectObjs,opt);
        canvas.setActiveGroup(objGroup);
        //objGroup.setObjectsCoords();
        canvas.deactivateAll();
        canvas.renderAll();
    });

    socket.on('clearAll',function(data){
        if(data == 'clearAll'){
            canvas.clear();
        }
    });

    socket.on('clearSelected',function(idArr){
        var myObjArr = getMyObjArr(canvas.getObjects());
        myObjArr.forEach(function(a){
            if(idArr.indexOf(a.id)!==-1){
                canvas.remove(a);
            }
        });
    });

    confirmSaveBtn.onclick = function(){
        //prompt('请输入文件名');
        var fileName = _('filename').value;
        var data ={};
        data.fileName =fileName;
        //console.log(data);
        communication.savaData(data,function(){
        });
    };

    socket.on('path',function(data){
        canvas.add(new fabric.Path(data.path,data));
    });

    clearEl.onclick = function() {
        var idArr = [];
        if(canvas.getActiveObject()){
            idArr.push(canvas.getActiveObject().id);
        }
        if(canvas.getActiveGroup()){
            canvas.getActiveGroup().forEachObject(function(a) {
                idArr.push(a.id);
            });
        }
        //var id = canvas.getActiveObject().id;
        //console.log(idArr);
        socket.emit('clearSelected',idArr,function(){
            if (canvas.getActiveGroup()) {
                canvas.getActiveGroup().forEachObject(function(a) {
                    canvas.remove(a);
                });
                canvas.discardActiveGroup();
            }
            if (canvas.getActiveObject()) {
                canvas.remove(canvas.getActiveObject());
            }
        });
    };

    clearAllEl.onclick = function() {
        socket.emit('clearAll','clearAll',function(){
            canvas.clear();
        });
    };

    drawingModeEl.onclick = function() {
        canvas.isDrawingMode = !canvas.isDrawingMode;
        if (canvas.isDrawingMode) {
            drawingModeEl.innerHTML = '进入编辑模式';
            drawingModeEl.setAttribute('class','btn btn-default');
            consoleInfo.setAttribute('disabled','disabled');
            //clearE2.setAttribute('disabled','disabled');
            clearEl.setAttribute('disabled','disabled');
            drawingOptionsEl.style.display = '';
        }
        else {
            drawingModeEl.innerHTML = '进入绘画模式';
            drawingModeEl.setAttribute('class','btn btn-info');
            consoleInfo.removeAttribute('disabled');
            //clearE2.removeAttribute('disabled');
            clearEl.removeAttribute('disabled');
            drawingOptionsEl.style.display = 'none';
        }
    };

    if (fabric.PatternBrush) {
        var vLinePatternBrush = new fabric.PatternBrush(canvas);
        vLinePatternBrush.getPatternSrc = function() {

            var patternCanvas = fabric.document.createElement('canvas');
            patternCanvas.width = patternCanvas.height = 10;
            var ctx = patternCanvas.getContext('2d');

            ctx.strokeStyle = this.color;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(0, 5);
            ctx.lineTo(10, 5);
            ctx.closePath();
            ctx.stroke();

            return patternCanvas;
        };

        var hLinePatternBrush = new fabric.PatternBrush(canvas);
        hLinePatternBrush.getPatternSrc = function() {

            var patternCanvas = fabric.document.createElement('canvas');
            patternCanvas.width = patternCanvas.height = 10;
            var ctx = patternCanvas.getContext('2d');

            ctx.strokeStyle = this.color;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(5, 0);
            ctx.lineTo(5, 10);
            ctx.closePath();
            ctx.stroke();

            return patternCanvas;
        };

        var squarePatternBrush = new fabric.PatternBrush(canvas);
        squarePatternBrush.getPatternSrc = function() {

            var squareWidth = 10, squareDistance = 2;

            var patternCanvas = fabric.document.createElement('canvas');
            patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
            var ctx = patternCanvas.getContext('2d');

            ctx.fillStyle = this.color;
            ctx.fillRect(0, 0, squareWidth, squareWidth);

            return patternCanvas;
        };

        var diamondPatternBrush = new fabric.PatternBrush(canvas);
        diamondPatternBrush.getPatternSrc = function() {

            var squareWidth = 10, squareDistance = 5;
            var patternCanvas = fabric.document.createElement('canvas');
            var rect = new fabric.Rect({
                width: squareWidth,
                height: squareWidth,
                angle: 45,
                fill: this.color
            });

            var canvasWidth = rect.getBoundingRectWidth();

            patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
            rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 });

            var ctx = patternCanvas.getContext('2d');
            rect.render(ctx);

            return patternCanvas;
        };

        var img = new Image();
        img.src = '/images/bg.png';

        var texturePatternBrush = new fabric.PatternBrush(canvas);
        texturePatternBrush.source = img;
    }

    $('drawing-mode-selector').onchange = function() {

        if (this.value === 'hline') {
            canvas.freeDrawingBrush = vLinePatternBrush;
        }
        else if (this.value === 'vline') {
            canvas.freeDrawingBrush = hLinePatternBrush;
        }
        else if (this.value === 'square') {
            canvas.freeDrawingBrush = squarePatternBrush;
        }
        else if (this.value === 'diamond') {
            canvas.freeDrawingBrush = diamondPatternBrush;
        }
        else if (this.value === 'texture') {
            canvas.freeDrawingBrush = texturePatternBrush;
        }
        else {
            canvas.freeDrawingBrush = new fabric[this.value + 'Brush'](canvas);
        }

        if (canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush.color = drawingColorEl.value;
            canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
            canvas.freeDrawingBrush.shadowBlur = parseInt(drawingShadowWidth.value, 10) || 0;
        }
    };

    drawingColorEl.onchange = function() {
        canvas.freeDrawingBrush.color = this.value;
    };
    drawingShadowColorEl.onchange = function() {
        canvas.freeDrawingBrush.shadowColor = this.value;
    };
    drawingLineWidthEl.onchange = function() {
        canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
        this.previousSibling.innerHTML = this.value;
    };
    drawingShadowWidth.onchange = function() {
        canvas.freeDrawingBrush.shadowBlur = parseInt(this.value, 10) || 0;
        this.previousSibling.innerHTML = this.value;
    };
    drawingShadowOffset.onchange = function() {
        canvas.freeDrawingBrush.shadowOffsetX =
            canvas.freeDrawingBrush.shadowOffsetY = parseInt(this.value, 10) || 0;
        this.previousSibling.innerHTML = this.value;
    };

    if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = drawingColorEl.value;
        canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
        canvas.freeDrawingBrush.shadowBlur = 0;
    }

})();