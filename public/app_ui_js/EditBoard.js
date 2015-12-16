/**
 * Created by Eamonn on 2015/9/26.
 */
var EditBoard = function (){
    var me = this;
    this.__socket = io.connect('http://localhost:4500');
    var drawingModeEl =this.__drawingModeEl= _('drawing-mode'),
        test = _('test'),
        copy = _('copy-value'),
        customizedCanvas = _('customizedCanvas'),
        consoleInfo = _('console-info');
    this.communication = new Communication();
    this.serializeShapes = new SerializeShapes();
    var canvasCtner = this.__canvasCtner = _('canvasCtn');
    var zoomIn = _('zoom-in');
    var zoomOut = _('zoom-out');
    var canvas = this.__canvas = new fabric.Canvas('c', {
        backgroundColor :"#ffffff",
        width:750,
        height:530,
        isDrawingMode:true
        //allowTouchScrolling:true
    });

    canvas.add();//chrome抽了，= =必须要加一句为了显示空白cavans画板

    var configBoard = new ConfigBoard(this);

    //初始化取色器
    $('#picker').colpick({
        layout:'hex',
        onSubmit: function(hsb,hex,rgb,el) {
            canvas.backgroundColor = '#'+hex;
            if(hex =='ffffff')
                $(el).css('color', '#777777');
            else
                $(el).css('color', '#'+hex);
            $(el).colpickHide();
            canvas.renderAll();
        }
    });


    //监听window的缩放事件 使滚动条居中
    window.onresize = Utils.bind(configBoard,configBoard.resizeCanvas);
    configBoard.resizeCanvas();

    //获取canvas div 使canvas居中
    var canvasCtns =document.getElementsByClassName('canvas-container');
    this.canvasCtnEl = canvasCtns[0];
    var o_style = this.canvasCtnEl.getAttribute('style');
    var left = (1700-this.__canvas.width)/2;
    var top = (1500-this.__canvas.height)/2;
    this.canvasCtnEl.setAttribute('style',o_style+' position:absolute;left: '+left+'px;top:'+top+'px');

    fabric.Object.prototype.transparentCorners = false;

    drawingModeEl.onclick =  function() {
        if (!canvas.isDrawingMode) {
            drawingModeEl.innerHTML = ' <i class="fa fa-mouse-pointer"></i>';
            drawingModeEl.setAttribute('class','btn btn-default');
        }
        else {
            drawingModeEl.innerHTML = ' <i class="fa fa-paint-brush "></i>';
            drawingModeEl.setAttribute('class','btn btn-info');
        }
    };

    copy.onclick = function () {
        if (window.clipboardData)
        {
            window.clipboardData.setData("Text", _('json-value').value)
        }
        else
        {
            $('#myUnsptModal').modal({
                keyboard:false
            });
        }
    };

    zoomOut.onclick = function(){
        canvas.setZoom(canvas.getZoom()/1.2);
        canvas.setWidth(canvas.getWidth()/1.2);
        canvas.setHeight(canvas.getHeight()/1.2);
        canvasCtner.style.width = (canvasCtner.offsetWidth)/1.2+'px';
        canvasCtner.style.height = (canvasCtner.offsetHeight)/1.2+'px';
        configBoard.resetCanvas();
    };

    zoomIn.onclick = function(){
        canvas.setZoom(canvas.getZoom()*1.2);
        canvas.setWidth(canvas.getWidth()*1.2);
        canvas.setHeight(canvas.getHeight()*1.2);
        canvasCtner.style.width = (canvasCtner.offsetWidth)*1.2+'px';
        canvasCtner.style.height = (canvasCtner.offsetHeight)*1.2+'px';
        configBoard.resetCanvas();
    };

    customizedCanvas.onclick = function () {
        canvas.setWidth(_('canvas-width').value);
        canvas.setHeight(_('canvas-height').value);
        configBoard.resetCanvas();
    };


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

    test.onclick = function(){
        console.log(JSON.stringify(canvas.getActiveObject()));
        console.log(canvas.getActiveObject().toObject());
    };
};

EditBoard.prototype.resetBoard= function (data) {
    //console.log(data);

    data.pathData.forEach(function(x){
        canvas.add(new fabric.Path(x.path,x));
    });
};
