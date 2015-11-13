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
        width:1024,
        height:700
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
            //var flashcopier = 'flashcopier';
            //if(!document.getElementById(flashcopier))
            //{
            //    var divholder = document.createElement('div');
            //    divholder.id = flashcopier;
            //    document.body.appendChild(divholder);
            //}
            //document.getElementById(flashcopier).innerHTML = '';
            //var divinfo = '<embed src="app_util_js/_clipboard.swf" FlashVars="clipboard='+encodeURIComponent(_('json-value').value)+'" width="0" height="0" type="application/x-shockwave-flash"></embed>';
            //document.getElementById(flashcopier).innerHTML = divinfo;
            $('#myUnsptModal').modal({
                keyboard:false
            });
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

    test.onclick = function(){
        var obj = canvas.getActiveGroup();
        obj.forEachObject(function(x){
            x.selectable  = false;
        });
    };
};

EditBoard.prototype.resetBoard= function (data) {
    //console.log(data);
    data.pathData.forEach(function(x){
        canvas.add(new fabric.Path(x.path,x));
    });
};
