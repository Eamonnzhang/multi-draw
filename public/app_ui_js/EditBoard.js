/**
 * Created by Eamonn on 2015/9/26.
 */
var EditBoard = function (){
    var me = this;
    this.__socket = io.connect('http://192.168.1.81:4500');
    var drawingModeEl =this.__drawingModeEl= _('drawing-mode'),
        test = _('test'),
        copy = _('copy-value'),
        customizedCanvas = _('customizedCanvas'),
        consoleInfo = _('console-info');
    this.communication = new Communication();
    var canvasCtner = this.__canvasCtner = _('canvasCtn');
    var zoomIn = _('zoom-in');
    var zoomOut = _('zoom-out');
    var canvas = this.__canvas = new fabric.Canvas('c', {
        backgroundColor :"#ffffff",
        width:750,
        height:530,
        isDrawingMode:true,
        includeDefaultValues:false
    });

    canvas.add();//chrome抽了，= =必须要加一句为了显示空白cavans画板

    var configBoard = new ConfigBoard(this);

    //监听window的缩放事件 使滚动条居中
    window.onresize = mdUtils.bind(configBoard,configBoard.resizeCanvas);
    configBoard.resizeCanvas();

    //获取canvas div 使canvas居中
    var canvasCtns =document.getElementsByClassName('canvas-container');
    this.canvasCtnEl = canvasCtns[0];
    var o_style = this.canvasCtnEl.getAttribute('style');
    var left = (1700-this.__canvas.width)/2;
    var top = (1500-this.__canvas.height)/2;
    this.canvasCtnEl.setAttribute('style',o_style+' position:absolute;left: '+left+'px;top:'+top+'px');

    fabric.Object.prototype.transparentCorners = false;

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
        canvas.getActiveObject()&&console.log(canvas.getActiveObject());
        canvas.getActiveGroup()&&console.log(canvas.getActiveGroup().getObjects());
    };

    test.onclick = function(){
        canvas.getActiveGroup()&&mdCanvas.toObject(canvas.getActiveGroup(), function (sGroup) {
            console.log(sGroup);
        });
        canvas.getActiveObject()&&mdCanvas.toObject(canvas.getActiveObject(), function (sObj) {
            console.log(sObj);
        });
        mdCanvas.toObject(canvas, function (sCanvas) {
            console.log(sCanvas);
        });

    };
};

EditBoard.prototype.resetBoard= function (data) {
    //console.log(data);

    data.pathData.forEach(function(x){
        canvas.add(new fabric.Path(x.path,x));
    });
};
