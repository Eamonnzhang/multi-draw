/**
 * Created by Eamonn on 2015/9/26.
 */
var EditBoard = function (){
    this.__socket = io.connect('http://192.168.1.81:4500');
    var drawingModeEl =this.__drawingModeEl= _('drawing-mode'),
        test = _('test'),
        copy = _('copy-value'),
        //canvasEl = this.__canvasEl= _('c'),
        consoleInfo = _('console-info');
    this.communication = new Communication();
    this.serializeShapes = new SerializeShapes();
    var zoomIn = _('zoom-in');
    var zoomOut = _('zoom-out');
    var canvas = this.__canvas = new fabric.Canvas('c', {
        backgroundColor :"#ffffff",
        width:680,
        height:460,
        allowTouchScrolling:true
    });
    var configBoard = new ConfigBoard(this);

    //监听window的缩放事件 使滚动条居中
    window.onresize = configBoard.resizeCanvas;
    configBoard.initKeyBoard();
    configBoard.resizeCanvas();

    //获取canvas div 使canvas居中
    var canvasCtns =document.getElementsByClassName('canvas-container');
    this.canvasCtnEl = canvasCtns[0];
    var o_style = this.canvasCtnEl.getAttribute('style');
    var left = (2000-this.__canvas.width)/2;
    var top = (2000-this.__canvas.height)/2;
    this.canvasCtnEl.setAttribute('style',o_style+' position:absolute;left: '+left+'px;top:'+top+'px');

    fabric.Object.prototype.transparentCorners = false;

    drawingModeEl.onclick =  function() {
        if (!canvas.isDrawingMode) {
            drawingModeEl.innerHTML = ' <i class="fa fa-mouse-pointer"></i>&nbsp;选中';
            drawingModeEl.setAttribute('class','btn btn-default');
        }
        else {
            drawingModeEl.innerHTML = ' <i class="fa fa-paint-brush "></i>&nbsp;绘画';
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
        configBoard.resetCanvas();
    };

    zoomIn.onclick = function(){
        canvas.setZoom(canvas.getZoom()*1.2);
        canvas.setWidth(canvas.getWidth()*1.2);
        canvas.setHeight(canvas.getHeight()*1.2);
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
        canvas.setZoom(canvas.getZoom()*1.2);
        canvas.setWidth(canvas.getWidth()*1.2);
        canvas.setHeight(canvas.getHeight()*1.2);
        configBoard.resetCanvas();
    };
};

EditBoard.prototype.resetBoard= function (data) {
    //console.log(data);
    data.pathData.forEach(function(x){
        canvas.add(new fabric.Path(x.path,x));
    });
};
