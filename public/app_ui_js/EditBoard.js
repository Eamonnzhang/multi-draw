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
    var canvas = this.__canvas = new fabric.Canvas('c', {
        backgroundColor :"#ffffff",
        width:800,
        height:600,
        allowTouchScrolling:true
    });
    var configBoard = new ConfigBoard(this);

    window.onresize = configBoard.resizeCanvas;
    configBoard.initKeyBoard();
    configBoard.resizeCanvas();

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

    consoleInfo.onclick = function(){
        //if(canvas.getActiveObject()){
        //    console.log(canvas.getActiveObject());
        //}
        //if(canvas.getActiveGroup()){
        //    canvas.getActiveGroup().forEachObject(function(a) {
        //        console.log(a);
        //    });
        //}
        console.log(canvas.getZoom());
    };

    test.onclick = function(){
        canvas.setZoom(canvas.getZoom()*1.2);
        canvas.setWidth(canvas.getWidth()*1.2);
        canvas.setHeight(canvas.getHeight()*1.2);
    };
};

EditBoard.prototype.resetBoard= function (data) {
    //console.log(data);
    data.pathData.forEach(function(x){
        canvas.add(new fabric.Path(x.path,x));
    });
};
