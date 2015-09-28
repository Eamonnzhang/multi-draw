/**
 * Created by Eamonn on 2015/9/26.
 */
(function() {
    var _ = function(id){return document.getElementById(id)};
    var doc = $(document);
    var url = 'http://localhost:8080';
    var drawing = false;
    var socket = io.connect(url);
    var canvas = this.__canvas = new fabric.Canvas('c', {
        isDrawingMode: true
    });
    fabric.Object.prototype.transparentCorners = false;
    var drawingModeEl = _('drawing-mode'),
        drawingOptionsEl = _('drawing-mode-options'),
        drawingColorEl = _('drawing-color'),
        drawingShadowColorEl = _('drawing-shadow-color'),
        drawingLineWidthEl = _('drawing-line-width'),
        drawingShadowWidth = _('drawing-shadow-width'),
        drawingShadowOffset = _('drawing-shadow-offset'),
        clearEl = _('clear-selected-canvas'),
        clearE2 = _('clear-all-canvas');

    canvas.on('mousedown',function(e){
        //socket.emit('mousedown',{});
        drawing = true;
    });

    //doc.bind('mouseup',function(){
    //    drawing = false;
    //
    //
    //});

    canvas.on('path:created',function(e){
        //console.log(e.path.getSvgTransform());
        console.log(e);
        socket.emit('objects', e.path);
    });

    clearE2.onclick = function() { canvas.clear() };
    clearEl.onclick = function() {
        if (canvas.getActiveGroup()) {
            canvas.getActiveGroup().forEachObject(function(a) {
                canvas.remove(a);
            });
            canvas.discardActiveGroup();
        }
        if (canvas.getActiveObject()) {
            canvas.remove(canvas.getActiveObject());
        }
    };


    //socket.emit('objects',canvas.getObjects());

    socket.on('message',function(data){
        console.log(data);
        var option = {};
        option.stroke = data.stroke;
        option.strokeWidth = data.strokeWidth;
        option.strokeLineCap = data.strokeLineCap;
        option.strokeLineJoin = data.strokeLineJoin;
        option.originX = data.originX;
        option.originY = data.originY;
        option.fill = data.fill;
        canvas.add(new fabric.Path(data.path,option));
    });

    drawingModeEl.onclick = function() {
        canvas.isDrawingMode = !canvas.isDrawingMode;
        if (canvas.isDrawingMode) {
            drawingModeEl.innerHTML = 'Cancel drawing mode';
            drawingOptionsEl.style.display = '';
        }
        else {
            drawingModeEl.innerHTML = 'Enter drawing mode';
            drawingOptionsEl.style.display = 'none';
        }
    };

    if (fabric.PatternBrush) {
        var vLinePatternBrush = new fabric.PatternBrush(canvas);
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

        var hLinePatternBrush = new fabric.PatternBrush(canvas);
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

        var squarePatternBrush = new fabric.PatternBrush(canvas);
        squarePatternBrush.getPatternSrc = function() {

            var squareWidth = 10, squareDistance = 2;

            var patternCanvas = fabric.document.createElement('canvas');
            patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
            var ctx = patternCanvas.getContext('2d');

            ctx.fillStyle = this.color;
            ctx.fillRect(0, 0, squareWidth, squareWidth);

            return patternCanvas;
        };

        var diamondPatternBrush = new fabric.PatternBrush(canvas);
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

        var texturePatternBrush = new fabric.PatternBrush(canvas);
        texturePatternBrush.source = img;
    }

    $('drawing-mode-selector').onchange = function() {

        if (this.value === 'hline') {
            canvas.freeDrawingBrush = vLinePatternBrush;
        }
        else if (this.value === 'vline') {
            canvas.freeDrawingBrush = hLinePatternBrush;
        }
        else if (this.value === 'square') {
            canvas.freeDrawingBrush = squarePatternBrush;
        }
        else if (this.value === 'diamond') {
            canvas.freeDrawingBrush = diamondPatternBrush;
        }
        else if (this.value === 'texture') {
            canvas.freeDrawingBrush = texturePatternBrush;
        }
        else {
            canvas.freeDrawingBrush = new fabric[this.value + 'Brush'](canvas);
        }

        if (canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush.color = drawingColorEl.value;
            canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
            canvas.freeDrawingBrush.shadowBlur = parseInt(drawingShadowWidth.value, 10) || 0;
        }
    };

    drawingColorEl.onchange = function() {
        canvas.freeDrawingBrush.color = this.value;
    };
    drawingShadowColorEl.onchange = function() {
        canvas.freeDrawingBrush.shadowColor = this.value;
    };
    drawingLineWidthEl.onchange = function() {
        canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
        this.previousSibling.innerHTML = this.value;
    };
    drawingShadowWidth.onchange = function() {
        canvas.freeDrawingBrush.shadowBlur = parseInt(this.value, 10) || 0;
        this.previousSibling.innerHTML = this.value;
    };
    drawingShadowOffset.onchange = function() {
        canvas.freeDrawingBrush.shadowOffsetX =
            canvas.freeDrawingBrush.shadowOffsetY = parseInt(this.value, 10) || 0;
        this.previousSibling.innerHTML = this.value;
    };

    if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = drawingColorEl.value;
        canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
        canvas.freeDrawingBrush.shadowBlur = 0;
    }
})();