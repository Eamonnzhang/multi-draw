/**
 * Created by Eamonn on 2015/10/22.
 */
var ConfigBoard = function (editBoard) {
    this.editBoard = editBoard;

};

ConfigBoard.prototype.resizeCanvas = function () {
    //reset canvasScroll
    this.resetScroll();

    //reset lefttoolbar
    //console.log(window.innerWidth);
    //if(window.innerWidth < 990){
    //    _('left-toolbar').style.top = '130px';
    //    _('left-toolbar').style.height = '130px';
    //}
    //if(window.innerWidth > 990){
    //    _('left-toolbar').style.top = '90px';
    //}

};

ConfigBoard.prototype.resetCanvas = function () {
    var left = (this.editBoard.__canvasCtner.offsetWidth-this.editBoard.__canvas.width)/2;
    var top = (this.editBoard.__canvasCtner.offsetHeight-this.editBoard.__canvas.height)/2;
    this.editBoard.canvasCtnEl.style.top=top+'px';
    this.editBoard.canvasCtnEl.style.left=left+'px';
    this.resetScroll();
};

ConfigBoard.prototype.resetScroll = function () {
    var canvasCol = document.getElementById('canvas-col');
    var sh= canvasCol.scrollHeight;
    var sfh = canvasCol.offsetHeight;
    var sTop = (sh-sfh)/2;

    var sw= canvasCol.scrollWidth;
    var sfw = canvasCol.offsetWidth;
    var sLeft = (sw-sfw)/2;
    $('#canvas-col').scrollTop(sTop);
    $('#canvas-col').scrollLeft(sLeft);
}

ConfigBoard.prototype.initKeyBoard = function () {
    var ie;
    if (document.all)
        ie = true;
    else
        ie = false; //判断是否IE
    document.onkeydown = KeyPress;
    document.onkeyup = KeyUp;
    var me = this;
    //设置键盘事件函数
    function KeyPress(){
        var key;
        if (ie)
            key = event.keyCode;
        else
            key = KeyPress.arguments[0].keyCode;
        if(key == 27){ //ESC键
            if (!me.editBoard.__canvas.isDrawingMode) {
                me.editBoard.__canvas.isDrawingMode = true;
                me.editBoard.__drawingModeEl.innerHTML = ' <i class="fa fa-mouse-pointer"></i>';
                me.editBoard.__drawingModeEl.setAttribute('class','btn btn-default');
            }
            else {
                me.editBoard.__canvas.isDrawingMode = false;
                me.editBoard.__drawingModeEl.innerHTML = ' <i class="fa fa-paint-brush "></i>';
                me.editBoard.__drawingModeEl.setAttribute('class','btn btn-info');
            }
        }
        if(key === 17){ //实际上为Ctrl键
            if(!ctrlKeyDown){
                ctrlKeyDown = true;
            }
        }
    }
    function KeyUp(event){
        var key = event.keyCode;
        if(key === 17){
            if(ctrlKeyDown)
                ctrlKeyDown = false;
        }
    }
};

ConfigBoard.prototype.initContextMenu = function () {

    /*bootstrap contextmenu*/
    //$('.upper-canvas').contextmenu({
    //    // Demo 3
    //        target: '#context-menu2',
    //        onItem: function (context, e) {
    //            alert($(e.target).text());
    //        }
    //    });
    //
    //$('#context-menu2').on('show.bs.context', function (e) {
    //    console.log('before show event');
    //});
    //
    //$('#context-menu2').on('shown.bs.context', function (e) {
    //    console.log('after show event');
    //});
    //
    //$('#context-menu2').on('hide.bs.context', function (e) {
    //    console.log('before hide event');
    //});
    //
    //$('#context-menu2').on('hidden.bs.context', function (e) {
    //    console.log('after hide event');
    //});

    /* jquery contextmenu */

    $(function(){
        /**************************************************
         * Context-Menu with Sub-Menu
         **************************************************/
        $.contextMenu({
            selector: '.upper-canvas',
            callback: function(key, options) {
                var m = "clicked: " + key;
                window.console && console.log(m) || alert(m);
            },
            items: {
                "edit": {"name": "Edit", "icon": "edit"},
                "cut": {"name": "Cut", "icon": "cut"},
                "sep1": "---------",
                "quit": {"name": "Quit", "icon": "quit"},
                "sep2": "---------",
                "fold1": {
                    "name": "Sub group",
                    "items": {
                        "fold1-key1": {"name": "Foo bar"},
                        "fold2": {
                            "name": "Sub group 2",
                            "items": {
                                "fold2-key1": {"name": "alpha"},
                                "fold2-key2": {"name": "bravo"},
                                "fold2-key3": {"name": "charlie"}
                            }
                        },
                        "fold1-key3": {"name": "delta"}
                    }
                },
                "fold1a": {
                    "name": "Other group",
                    "items": {
                        "fold1a-key1": {"name": "echo"},
                        "fold1a-key2": {"name": "foxtrot"},
                        "fold1a-key3": {"name": "golf"}
                    }
                }
            }
        });
    });
};