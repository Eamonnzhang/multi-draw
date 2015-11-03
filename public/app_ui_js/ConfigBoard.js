/**
 * Created by Eamonn on 2015/10/22.
 */
var ConfigBoard = function (editBoard) {
    this.editBoard = editBoard;
};

ConfigBoard.prototype.resizeCanvas = function () {
    this.editBoard.__canvas.setHeight(680);
    if($(window).width() > 1550){
        this.editBoard.__canvas.setWidth($(window).width()-$("#controls").width()-150);
        _('canvas-col').setAttribute('class','col-lg-8 col-md-8  col-sm-8 col-xs-8 col-lg-pull-1');
        _('canvas-col').setAttribute('style','margin-left:55px;margin-top:80px;');
    }else{
            if ($(window).width() <= 1550 &&$(window).width() >=1200){
                this.editBoard.__canvas.setWidth($(window).width()-$("#controls").width()-150);
                _('canvas-col').setAttribute('class','col-lg-8 col-md-8  col-sm-8 col-xs-8');
            } else{
                if($(window).width() <340 ){
                    this.editBoard.__canvas.setWidth($(window).width()-35);
                }else{
                    this.editBoard.__canvas.setWidth($(window).width()+85-$("#controls").width()-150);
                }
            }
            _('canvas-col').setAttribute('style','margin-top:80px;');
    }
    var sideBarHeight= $(window).height()-150;
    if($(window).height()<790&&$(window).width()>740){
        _('optionDiv').setAttribute('style','height:'+sideBarHeight+'px;overflow-y:auto;position:fixed;');
    }else if($(window).height()>=790&&$(window).width()<=740){
            _('optionDiv').setAttribute('style','width:100px;overflow-x:auto;position:fixed;');
        }else if($(window).height()<790&&$(window).width()<=740){
                _('optionDiv').setAttribute('style','height:'+sideBarHeight+'px;width:100px;overflow-x:auto;overflow-y:auto;position:fixed;');
        }else
             _('optionDiv').setAttribute('style','position:fixed');
};