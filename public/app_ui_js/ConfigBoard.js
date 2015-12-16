/**
 * Created by Eamonn on 2015/10/22.
 */
var ConfigBoard = function (editBoard) {
    this.editBoard = editBoard;
};

ConfigBoard.prototype.resizeCanvas = function () {
    //reset canvasScroll
    this.resetScroll();
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
};
