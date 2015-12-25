/**
 * Created by Eamonn on 2015/9/26.
 * you can get every related Objects in EditBoard
 * and if you don't know where to put your code,put them here temporarily
 */
var EditBoard = function (){
    this.socket = io.connect('http://192.168.1.81:4500');
    this.communication = new Communication();
    var canvas = this.canvas = new fabric.Canvas('c', {
        backgroundColor :"#ffffff",
        width:750,
        height:530,
        isDrawingMode:true,
    });
    var configBoard = this.configBord =  new ConfigBoard(this);
    fabric.Object.prototype.transparentCorners = false;
    canvas.add();//chrome抽了，= =必须要加一句为了显示空白canvas

    //监听window的缩放事件 使滚动条始终居中
    window.onresize = mdUtils.bind(configBoard,configBoard.resetScroll);
    //初始化canvas和滚动条位置，使二者均居中
    configBoard.initCanvasPos();

    $(function () { $("[data-toggle='tooltip']").tooltip(); });
    $('#zoom-in').on('click',mdUtils.bind(configBoard,configBoard.zoomInCanvas));
    $('#zoom-out').on('click',mdUtils.bind(configBoard,configBoard.zoomOutCanvas));
    $('#customizedCanvas').on('click', mdUtils.bind(configBoard,configBoard.customizedCanvas));

    $('#console-info').on('click', function () {
        canvas.getActiveObject()&&console.log(canvas.getActiveObject());
        canvas.getActiveGroup()&&console.log(canvas.getActiveGroup().getObjects());
    });
    $('#test').on('click', function () {
        canvas.getActiveGroup()&&mdCanvas.toObject(canvas.getActiveGroup(), function (sGroup) {
            console.log(sGroup);
        });
        canvas.getActiveObject()&&mdCanvas.toObject(canvas.getActiveObject(), function (sObj) {
            console.log(sObj);
        });
        mdCanvas.toObject(canvas, function (sCanvas) {
            console.log(sCanvas);
        });
    })
};

EditBoard.prototype.resetBoard= function (data) {
    data.pathData.forEach(function(x){
        canvas.add(new fabric.Path(x.path,x));
    });
};
