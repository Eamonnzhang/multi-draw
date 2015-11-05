/**
 * Created by Eamonn on 2015/10/22.
 */
var ConfigBoard = function (editBoard) {
    this.editBoard = editBoard;
};

ConfigBoard.prototype.resizeCanvas = function () {

    //resize canvas
    this.editBoard.__canvas.setHeight(680);
    if($(window).width() > 1550){                                      // width > 1550
        this.editBoard.__canvas.setWidth($(window).width()-$("#controls").width()-150);
        _('canvas-col').setAttribute('class','col-lg-8 col-md-8  col-sm-8 col-xs-8 col-lg-pull-1');
        _('canvas-col').setAttribute('style','margin-left:55px;margin-top:80px;');
    }else if ($(window).width() <= 1550 &&$(window).width() >=1200){   // 1200 <= width <= 1550
        this.editBoard.__canvas.setWidth($(window).width()-$("#controls").width()-150);
        _('canvas-col').setAttribute('class','col-lg-8 col-md-8  col-sm-8 col-xs-8');
    }else if($(window).width() <340 ){                                 // width < 340
        this.editBoard.__canvas.setWidth($(window).width()-35);
    }else                                                              // 340 <= width <= 1550
        this.editBoard.__canvas.setWidth($(window).width()+85-$("#controls").width()-150);
    _('canvas-col').setAttribute('style','margin-top:80px;');

    //resize sideBar
    var sideBarHeight= $(window).height()-150;
    if($(window).height()<870&&$(window).width()>740){ //less height
        _('optionDiv').setAttribute('style','height:'+sideBarHeight+'px;width:160px;overflow-y:auto;overflow-x:hidden;position:fixed;margin-top:20px;');
    }else if($(window).height()>=870&&$(window).width()<=740){ //less width
        _('optionDiv').setAttribute('style','width:100px;overflow-x:auto;overflow-y:hidden;position:fixed;');
    }else if($(window).height()<870&&$(window).width()<=740){ //both less
        _('optionDiv').setAttribute('style','height:'+sideBarHeight+'px;width:100px;overflow-x:auto;overflow-y:auto;position:fixed;margin-top:20px;');
    }else //normal
        _('optionDiv').setAttribute('style','position:fixed');
};