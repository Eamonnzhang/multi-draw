/**
 * Created by Eamonn on 2015/10/22.
 */
var ConfigBoard = function (editBoard) {
    this.editBoard = editBoard;
    if (fabric.PatternBrush) {
        var vLinePatternBrush = new fabric.PatternBrush(this.editBoard.__canvas);
        vLinePatternBrush.getPatternSrc = function() {

            var patternCanvas = fabric.document.createElement('canvas');
            patternCanvas.width = patternCanvas.height = 10;
            var ctx = patternCanvas.getContext('2d');

            ctx.strokeStyle = this.color;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(0, 5);
            ctx.lineTo(10, 5);
            ctx.closePath();
            ctx.stroke();

            return patternCanvas;
        };

        var hLinePatternBrush = new fabric.PatternBrush(this.editBoard.__canvas);
        hLinePatternBrush.getPatternSrc = function() {

            var patternCanvas = fabric.document.createElement('canvas');
            patternCanvas.width = patternCanvas.height = 10;
            var ctx = patternCanvas.getContext('2d');

            ctx.strokeStyle = this.color;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(5, 0);
            ctx.lineTo(5, 10);
            ctx.closePath();
            ctx.stroke();

            return patternCanvas;
        };

        var squarePatternBrush = new fabric.PatternBrush(this.editBoard.__canvas);
        squarePatternBrush.getPatternSrc = function() {

            var squareWidth = 10, squareDistance = 2;

            var patternCanvas = fabric.document.createElement('canvas');
            patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
            var ctx = patternCanvas.getContext('2d');

            ctx.fillStyle = this.color;
            ctx.fillRect(0, 0, squareWidth, squareWidth);

            return patternCanvas;
        };

        var diamondPatternBrush = new fabric.PatternBrush(this.editBoard.__canvas);
        diamondPatternBrush.getPatternSrc = function() {

            var squareWidth = 10, squareDistance = 5;
            var patternCanvas = fabric.document.createElement('canvas');
            var rect = new fabric.Rect({
                width: squareWidth,
                height: squareWidth,
                angle: 45,
                fill: this.color
            });

            var canvasWidth = rect.getBoundingRectWidth();

            patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
            rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 });

            var ctx = patternCanvas.getContext('2d');
            rect.render(ctx);

            return patternCanvas;
        };

        var img = new Image();
        img.src = '/images/bg.png';

        var texturePatternBrush = new fabric.PatternBrush(this.editBoard.__canvas);
        texturePatternBrush.source = img;
    }

    _('drawing-mode-selector').onchange = function() {

        if (this.value === 'hline') {
            editBoard.__canvas.freeDrawingBrush = vLinePatternBrush;
        }
        else if (this.value === 'vline') {
            editBoard.__canvas.freeDrawingBrush = hLinePatternBrush;
        }
        else if (this.value === 'square') {
            editBoard.__canvas.freeDrawingBrush = squarePatternBrush;
        }
        else if (this.value === 'diamond') {
            editBoard.__canvas.freeDrawingBrush = diamondPatternBrush;
        }
        else if (this.value === 'texture') {
            editBoard.__canvas.freeDrawingBrush = texturePatternBrush;
        }
        else {
            editBoard.__canvas.freeDrawingBrush = new fabric[this.value + 'Brush'](editBoard.__canvas);
        }

        if (editBoard.__canvas.freeDrawingBrush) {
            editBoard.__canvas.freeDrawingBrush.color = editBoard.__drawingColorEl.value;
            editBoard.__canvas.freeDrawingBrush.width = parseInt(editBoard.__drawingLineWidthEl.value, 10) || 1;
            editBoard.__canvas.freeDrawingBrush.shadowBlur = parseInt(editBoard.__drawingShadowWidth.value, 10) || 0;
        }
    };

    this.editBoard.__drawingColorEl.onchange = function() {
        var me = this;
        editBoard.__canvas.freeDrawingBrush.color = me.value;
    };
    this.editBoard.__drawingShadowColorEl.onchange = function() {
        editBoard.__canvas.freeDrawingBrush.shadowColor = this.value;
    };
    this.editBoard.__drawingLineWidthEl.onchange = function() {
        editBoard.__canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
        this.previousSibling.innerHTML = this.value;
    };
    this.editBoard.__drawingShadowWidth.onchange = function() {
        editBoard.__canvas.freeDrawingBrush.shadowBlur = parseInt(this.value, 10) || 0;
        this.previousSibling.innerHTML = this.value;
    };
    this.editBoard.__drawingShadowOffset.onchange = function() {
        editBoard.__canvas.freeDrawingBrush.shadowOffsetX =
            editBoard.__canvas.freeDrawingBrush.shadowOffsetY = parseInt(this.value, 10) || 0;
        this.previousSibling.innerHTML = this.value;
    };

    if (this.editBoard.__canvas.freeDrawingBrush) {
        this.editBoard.__canvas.freeDrawingBrush.color = this.editBoard.__drawingColorEl.value;
        this.editBoard.__canvas.freeDrawingBrush.width = parseInt(this.editBoard.__drawingLineWidthEl.value, 10) || 1;
        this.editBoard.__canvas.freeDrawingBrush.shadowBlur = 0;
    }
};

ConfigBoard.prototype.resizeCanvas = function () {
    if ($(window).width() > 768){
        this.editBoard.__canvas.setWidth($(window).width()-$("#sidebar-collapse").width()-60);
    }
    else{
        this.editBoard.__canvas.setWidth($(window).width()-60);
    }
    this.editBoard.__canvas.setHeight(window.innerHeight-210);
};