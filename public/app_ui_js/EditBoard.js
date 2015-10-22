/**
 * Created by Eamonn on 2015/9/26.
 */
var EditBoard = function (callback){
    var socket = io.connect('http://192.168.1.81:4500');
    var roomId = decodeURI(Utils.urlParams(window.location.href)['room']);
    var drawingModeEl = _('drawing-mode'),
        clearEl = _('clear-selected-canvas'),
        clearAllEl = _('clear-all-canvas'),
        test = _('test'),
        roomDiv = _('roomId'),
        deleteBtn= _('delete'),
        confirmSaveBtn = _('confirmSave'),
        saveBtn = _('save'),
        consoleInfo = _('console-info'),
        drawingOptionsEl= _('drawing-mode-options');
    this.__drawingColorEl= _('drawing-color');
    this.__drawingShadowColorEl= _('drawing-shadow-color');
    this.__drawingLineWidthEl= _('drawing-line-width');
    this.__drawingShadowWidth= _('drawing-shadow-width');
    this.__drawingShadowOffset= _('drawing-shadow-offset');
    this.communication = new Communication();
    this.serializeShapes = new SerializeShapes();
    var canvas = this.__canvas = new fabric.Canvas('c', {
        isDrawingMode: true
    });
    var configBoard = new ConfigBoard(this);
    window.onresize = configBoard.resizeCanvas;
    configBoard.resizeCanvas();
    fabric.Object.prototype.transparentCorners = false;
    if(roomId){
        var userInfo = {};
        userInfo.roomId = roomId;
        userInfo.userId = apiKey;
        userInfo.userName = userName;
        socket.emit('room', userInfo);
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
        var obj = canvas.getActiveGroup();
        obj.forEachObject(function(x){
            x.selectable  = false;
        });
        //canvas.setActiveObject(canvas.item(0));
        //canvas.setActiveGroup();
    };
    var canvasData = {};
    canvasData.pathData = [];
    canvasData.usersId = [];
    if(roomId){
        socket.on('allPath',function(data){
            if(data[roomId]){
                data[roomId].forEach(function(x){
                    canvasData.pathData.push(x);
                    if(canvasData.usersId.indexOf(x.userId) === -1){
                        canvasData.usersId.push(x.userId);
                    }
                    canvas.add(new fabric.Path(x.path,x));
                });
                console.log(canvasData);
            }
        });
    }
    canvas.on('path:created',Utils.bind(this,function(e){
        var path = e.path;
        var data = this.serializeShapes.serializePath(path);
        path.id = data.id;
        canvasData.pathData.push(data);
        if(canvasData.usersId.indexOf(data.userId) === -1){
            canvasData.usersId.push(data.userId);
        }
        //console.log(canvasData);
        socket.emit('path', data);
    }));
    var isMouseDown = false;
    canvas.on('mouse:down',function(e){
        //console.log(e);
        isMouseDown = true;
        if(e.target){

        }
    });

    canvas.on('mouse:up',Utils.bind(this,function(e){
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
                    var group = this.serializeShapes.serializeGroupOfPath(canvas.getActiveGroup());
                    socket.emit('groupChange',group);
                    socket.emit('unlockState',group.idArr);
                }
            }else{
                //socket.emit('deActive','deActive');
            }
        }

    }));

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

    //socket.on('lockState',function(data){
    //    var myObjArr = getMyObjArr(canvas.getObjects());
    //    myObjArr.forEach(function(x){
    //        if(data.indexOf(x.id)!==-1 ){
    //            x.selectable = false;
    //        }
    //    })
    //});

    socket.on('unlockState',function(data){
        var myObjArr = Utils.cloneArray(canvas.getObjects());
        myObjArr.forEach(function(x){
            if(data.indexOf(x.id)!==-1 ){
                x.selectable = true;
            }
        })
    });

    socket.on('userInfo',function(data){
        if(data){
                //console.log(data);
        }
    });

    socket.on('stateChange',function(data){
        canvas.deactivateAll();
        var myObjArr = Utils.cloneArray(canvas.getObjects());
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
        var myObjArr = Utils.cloneArray(canvas.getObjects());
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
        canvas.renderAll();
    });

    socket.on('clearAll',function(data){
        if(data == 'clearAll'){
            canvasData.pathData = [];
            canvas.clear();
        }
    });

    socket.on('clearSelected',function(idArr){
        var myObjArr = Utils.cloneArray(canvas.getObjects());
        myObjArr.forEach(function(a){
            if(idArr.indexOf(a.id)!==-1){
                canvas.remove(a);
            }
        });
        for(var i =0;i<canvasData.pathData.length;i++) {
            if (idArr.indexOf(canvasData.pathData[i].id) !== -1) {
                canvasData.pathData.splice(i, 1);
                i--;
            }
        }
    });

    socket.on('path',function(data){
        canvasData.pathData.push(data);
        if(canvasData.usersId.indexOf(data.userId) === -1){
            canvasData.usersId.push(data.userId);
        }
        console.log(canvasData);
        canvas.add(new fabric.Path(data.path,data));
    });

    saveBtn.onclick = function () {

    };

    confirmSaveBtn.onclick = function(){
        //prompt('请输入文件名');
        var fileName = _('filename').value;
        canvasData.fileName = fileName;
        if(canvasData.id){
            canvasData.isSaveNew = false;
        }else{
            canvasData.isSaveNew = true;
        }
        this.communication.savaData(canvasData,function(data){
            console.log(data);
        });
    };



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
            for(var i =0;i<canvasData.pathData.length;i++) {
                if (idArr.indexOf(canvasData.pathData[i].id) !== -1) {
                    canvasData.pathData.splice(i, 1);
                    i--;
                }
            }
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
            canvasData.pathData = [];
            canvas.clear();
        });
    };

    drawingModeEl.onclick =  function() {
        canvas.isDrawingMode = !canvas.isDrawingMode;
        if (canvas.isDrawingMode) {
            drawingModeEl.innerHTML = '进入编辑模式';
            drawingModeEl.setAttribute('class','btn btn-default');
            consoleInfo.setAttribute('disabled','disabled');
            clearEl.setAttribute('disabled','disabled');
            drawingOptionsEl.setAttribute('style','display: ');
        }
        else {
            drawingModeEl.innerHTML = '进入绘画模式';
            drawingModeEl.setAttribute('class','btn btn-info');
            consoleInfo.removeAttribute('disabled');
            clearEl.removeAttribute('disabled');
            drawingOptionsEl.setAttribute('style','display:none');
        }
    };
};
