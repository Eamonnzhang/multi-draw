/**
 * Created by Eamonn on 2015/9/26.
 */
var _ = function(id){return document.getElementById(id)};
var roomId = decodeURI(urlParams(window.location.href)['room']);
var DrawBord = function() {
    this.communication = new Communication();
    var canvas = this.__canvas = new fabric.Canvas('c', {
        isDrawingMode: true
    });
    this.socket = io.connect('http://192.168.1.81:4500');
    this.drawingModeEl = _('drawing-mode');
    this.drawingOptionsEl = _('drawing-mode-options');
    this.drawingColorEl = _('drawing-color');
    this.drawingShadowColorEl = _('drawing-shadow-color');
    this.drawingLineWidthEl = _('drawing-line-width');
    this.drawingShadowWidth = _('drawing-shadow-width');
    this.drawingShadowOffset = _('drawing-shadow-offset');
    this.clearEl = _('clear-selected-canvas');
    this.consoleInfo = _('console-info');
    this.test = _('test');
    this.roomDiv = _('roomId');
    this.deleteBtn = _('delete');
    this.saveBtn = _('save');
    this.confirmSaveBtn = _('confirmSave');
    this.clearAllEl = _('clear-all-canvas');
    window.onresize= this.resizeCanvas;
    fabric.Object.prototype.transparentCorners = false;
    if(roomId){
        this.socket.emit('room', roomId);
        this.roomDiv.innerHTML='房间：'+roomId;
    }
    this.consoleInfo.onclick = function(){
        if(canvas.getActiveObject()){
            console.log(canvas.getActiveObject());
        }
        if(canvas.getActiveGroup()){
            canvas.getActiveGroup().forEachObject(function(a) {
                console.log(a);
            });
        }
    };
    this.test.onclick = function(){
        var obj = canvas.getActiveGroup();
        obj.forEachObject(function(x){
            x.selectable  = false;
        });
        //canvas.setActiveObject(canvas.item(0));
        //canvas.setActiveGroup();
    };

    this.registerCanvasEvents(canvas);
    this.listenSocketEvents();
    if(roomId){
        this.socket.on('allPath',function(data){
            if(data[roomId]){
                data[roomId].forEach(function(x){
                    canvas.add(new fabric.Path(x.path,x));
                });
            }
        });
    }
    this.confirmSaveBtn.onclick = function(){
        //prompt('请输入文件名');
        var fileName = _('filename').value;
        var data ={};
        data.fileName =fileName;
        this.communication.savaData(data,function(data){
            console.log(data);
        });
    };

    this.clearEl.onclick = function() {
        var idArr = [];
        if(canvas.getActiveObject()){
            idArr.push(canvas.getActiveObject().id);
        }
        if(canvas.getActiveGroup()){
            canvas.getActiveGroup().forEachObject(function(a) {
                idArr.push(a.id);
            });
        }
        this.socket.emit('clearSelected',idArr,function(){
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

    this.clearAllEl.onclick = function() {
        socket.emit('clearAll','clearAll',function(){
            canvas.clear();
        });
    };

    this.drawingModeEl.onclick = function() {
        canvas.isDrawingMode = !canvas.isDrawingMode;
        if (canvas.isDrawingMode) {
            this.drawingModeEl.innerHTML = '进入编辑模式';
            this.drawingModeEl.setAttribute('class','btn btn-default');
            this.consoleInfo.setAttribute('disabled','disabled');
            //clearE2.setAttribute('disabled','disabled');
            this.clearEl.setAttribute('disabled','disabled');
            this.drawingOptionsEl.style.display = '';
        }
        else {
            this.drawingModeEl.innerHTML = '进入绘画模式';
            this.drawingModeEl.setAttribute('class','btn btn-info');
            this.consoleInfo.removeAttribute('disabled');
            //clearE2.removeAttribute('disabled');
            this.clearEl.removeAttribute('disabled');
            this.drawingOptionsEl.style.display = 'none';
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

    this.drawingColorEl.onchange = function() {
        canvas.freeDrawingBrush.color = this.value;
    };
    this.drawingShadowColorEl.onchange = function() {
        canvas.freeDrawingBrush.shadowColor = this.value;
    };
    this.drawingLineWidthEl.onchange = function() {
        canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
        this.previousSibling.innerHTML = this.value;
    };
    this.drawingShadowWidth.onchange = function() {
        canvas.freeDrawingBrush.shadowBlur = parseInt(this.value, 10) || 0;
        this.previousSibling.innerHTML = this.value;
    };
    this.drawingShadowOffset.onchange = function() {
        canvas.freeDrawingBrush.shadowOffsetX =
            canvas.freeDrawingBrush.shadowOffsetY = parseInt(this.value, 10) || 0;
        this.previousSibling.innerHTML = this.value;
    };

    if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = this.drawingColorEl.value;
        canvas.freeDrawingBrush.width = parseInt(this.drawingLineWidthEl.value, 10) || 1;
        canvas.freeDrawingBrush.shadowBlur = 0;
    }

};

DrawBord.prototype.resizeCanvas = function(){
    if ($(window).width() > 768){
        this.__canvas.setWidth($(window).width()-$("#sidebar-collapse").width()-60);
    }
    else{
        this.__canvas.setWidth($(window).width()-60);
    }
    this.__canvas.setHeight(window.innerHeight-185);
};

DrawBord.prototype.cloneCanvasAllObjs = function () {
    return this.__canvas.getObjects().concat('');
};

DrawBord.prototype.makePathSerializable = function (o_path,id) {
    var s_path={};
    s_path.id=id;
    s_path.path = o_path.path;
    s_path.stroke = o_path.stroke;
    s_path.strokeWidth = o_path.strokeWidth;
    s_path.strokeLineCap = o_path.strokeLineCap;
    s_path.strokeLineJoin = o_path.strokeLineJoin;
    s_path.originX = o_path.originX;
    s_path.originY = o_path.originY;
    s_path.fill = o_path.fill;
    return s_path;
};

DrawBord.prototype.makeGroupSerializable = function(group){
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

DrawBord.prototype.registerCanvasEvents = function (canvas) {
    canvas.on('path:created',function(e){
        var path = e.path;
        var id = generateId(8,32);
        path.id=id;
        var data = this.makePathSerializable(path,id);
        this.socket.emit('path', data);
    });
    var isMouseDown = false;
    canvas.on('mouse:down',function(e){
        isMouseDown = true;
        if(e.target){

        }
    });
    canvas.on('mouse:up',function(e){
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
                    this.socket.emit('stateChange',data);
                    this.socket.emit('unlockStates',obj.id);
                }
                if(canvas.getActiveGroup()){
                    var group = this.makeGroupSerializable(canvas.getActiveGroup());
                    this.socket.emit('groupChange',group);
                    this.socket.emit('unlockState',group.idArr);
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
                this.socket.emit('lockState',idArr);
            }else{
                this.socket.emit('lockState',objs.id);
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

};

DrawBord.prototype.listenSocketEvents = function(){
    this.socket.on('unlockState',function(data){
        var myObjArr = this.cloneCanvasAllObjs();
        myObjArr.forEach(function(x){
            if(data.indexOf(x.id)!==-1 ){
                x.selectable = true;
            }
        })
    });

    this.socket.on('stateChange',function(data){
        this.__canvas.deactivateAll();
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

    this.socket.on('groupChange',function(group){
        var myObjArr = this.cloneCanvasAllObjs();
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
        this.__canvas.setActiveGroup(objGroup);
        //objGroup.setObjectsCoords();
        this.__canvas.renderAll();
    });

    this.socket.on('clearAll',function(data){
        if(data == 'clearAll'){
            this.__canvas.clear();
        }
    });

    this.socket.on('clearSelected',function(idArr){
        var myObjArr = this.cloneCanvasAllObjs();
        myObjArr.forEach(function(a){
            if(idArr.indexOf(a.id)!==-1){
                this.__canvas.remove(a);
            }
        });
    });

    this.socket.on('path',function(data){
        this.__canvas.add(new fabric.Path(data.path,data));
    });
};