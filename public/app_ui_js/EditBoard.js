/**
 * Created by Eamonn on 2015/9/26.
 */
var EditBoard = function (){
    this.__socket = io.connect('http://192.168.1.81:4500');
    var drawingModeEl = _('drawing-mode'),
        test = _('test'),
        confirmSaveBtn = _('confirmSave'),
        saveBtn = _('save'),
        test = _('test'),
        consoleInfo = _('console-info');
    this.communication = new Communication();
    this.serializeShapes = new SerializeShapes();
    var canvas = this.__canvas = new fabric.Canvas('c', {
        backgroundColor :"#ffffff"
    });
    //console.log(canvas);
    $('#test').on('closed.bs.alert', function () {
        // do something…
    })
    var configBoard = new ConfigBoard(this);

    window.onresize = configBoard.resizeCanvas;

    configBoard.resizeCanvas();

    fabric.Object.prototype.transparentCorners = false;

    saveBtn.onclick = function () {

    };

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

    //test.onclick = function(){
    //    var obj = canvas.getActiveGroup();
    //    obj.forEachObject(function(x){
    //        x.selectable  = false;
    //    });
    //};
};

EditBoard.prototype.resetBoard= function (data) {
    //console.log(data);
    data.pathData.forEach(function(x){
        canvas.add(new fabric.Path(x.path,x));
    });
};
