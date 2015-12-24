/**
 * Created by Eamonn on 2015/10/22.
 * some options for how to show canvas
 */
var ConfigBoard = function (editBoard) {
    this.editBoard = editBoard;
    this.canvasCtner = _('canvasCtn');
    this.canvasCtnEl = document.getElementsByClassName('canvas-container')[0];
};

ConfigBoard.prototype.initCanvasPos = function () {
    var o_style =  this.canvasCtnEl.getAttribute('style');
    var left = (1700-this.editBoard.canvas.width)/2;
    var top = (1500-this.editBoard.canvas.height)/2;
    this.canvasCtnEl.setAttribute('style',o_style+' position:absolute;left: '+left+'px;top:'+top+'px');
    this.resetScroll();
};

ConfigBoard.prototype.resetCanvas = function () {
    var left = (this.canvasCtner.offsetWidth-this.editBoard.canvas.width)/2;
    var top = (this.canvasCtner.offsetHeight-this.editBoard.canvas.height)/2;
    this.canvasCtnEl.style.top=top+'px';
    this.canvasCtnEl.style.left=left+'px';
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
};

ConfigBoard.prototype.zoomOutCanvas = function () {
    this.editBoard.canvas.setZoom(this.editBoard.canvas.getZoom()/1.2);
    this.editBoard.canvas.setWidth(this.editBoard.canvas.getWidth()/1.2);
    this.editBoard.canvas.setHeight(this.editBoard.canvas.getHeight()/1.2);
    this.canvasCtner.style.width = (this.canvasCtner.offsetWidth)/1.2+'px';
    this.canvasCtner.style.height = (this.canvasCtner.offsetHeight)/1.2+'px';
    this.resetCanvas();
};

ConfigBoard.prototype.zoomInCanvas = function () {
    this.editBoard.canvas.setZoom(this.editBoard.canvas.getZoom()*1.2);
    this.editBoard.canvas.setWidth(this.editBoard.canvas.getWidth()*1.2);
    this.editBoard.canvas.setHeight(this.editBoard.canvas.getHeight()*1.2);
    this.canvasCtner.style.width = (this.canvasCtner.offsetWidth)*1.2+'px';
    this.canvasCtner.style.height = (this.canvasCtner.offsetHeight)*1.2+'px';
    this.resetCanvas();
};

ConfigBoard.prototype.customizedCanvas = function () {
    this.editBoard.canvas.setWidth(_('canvas-width').value);
    this.editBoard.canvas.setHeight(_('canvas-height').value);
    this.resetCanvas();
};