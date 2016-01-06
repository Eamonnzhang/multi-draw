var canvasData = {};
canvasData.usersId = [];

var SINGLE_LINE = false;

// custom input area
if (SINGLE_LINE) {
    var $itext = $('<input/>').attr('type', 'text').addClass('itext');
}
else {
    var $itext = $('<textarea/>').addClass('itext');
}

//暂时用此方法来,解决输入中文的BUG
function editorEnterFire(e){
    var obj = this;
    if (SINGLE_LINE) {
        var keyDownCode = 0;
    }
    canvas.remove(obj);
    // show input area
    $itext.css({
        left: (1700-canvas.width)/2+obj.left,
        top: (1500-canvas.height)/2+obj.top,
        'line-height': obj.lineHeight,
        'font-family': obj.fontFamily,
        'font-size': Math.floor(obj.fontSize * Math.min(obj.scaleX, obj.scaleY)) + 'px',
        'font-weight': obj.fontWeight,
        'font-style': obj.fontStyle,
        color: obj.fill
    })
        .val(obj.text)
        .appendTo($(canvas.wrapperEl).closest('#canvasCtn'));
    // text submit event
    if (SINGLE_LINE) {
        // submit text by ENTER key
        $itext.on('keydown', function(e) {
            // save the key code of a pressed key while kanji conversion (it differs from the code for keyup)
            keyDownCode = e.which;
        })
            .on('keyup', function(e) {
                if (e.keyCode == 13 && e.which == keyDownCode) {
                    obj.exitEditing();
                    obj.set('text', $(this).val());
                    $(this).remove();
                    canvas.add(obj);
                    canvas.renderAll();
                }
            });
    }
    else {
        // submit text by focusout
        $itext.on('focusout', function(e) {
            obj.exitEditing();
            obj.set('text', $(this).val());
            if(roomId){
                var data = {};
                data.id = obj.id;
                data.name = 'text';
                data.value = $(this).val();
                socket.emit('stylePropChange',data);
            }
            $(this).remove();
            canvas.add(obj);
            canvas.renderAll();
        });
        $itext.on("input propertychange",function(){
            if(roomId){
                var data = {};
                data.id = obj.id;
                data.name = 'text';
                data.value = $(this).val();
                socket.emit('stylePropChange',data);
            }
        })
    }

    // focus on text
    setTimeout(function() {
        $itext.select();
    }, 1);
}

function getActiveStyle(styleName, object) {
    object = object || canvas.getActiveObject();
    if (!object) return '';

    return (object.getSelectionStyles && object.isEditing)
        ? (object.getSelectionStyles()[styleName] || '')
        : (object[styleName] || '');
}

//设置所有对象样式
function setActiveStyle(styleName, value, object) {
    object = object || canvas.getActiveObject();
    if (!object) return;

    if (object.setSelectionStyles && object.isEditing) {
        var style = { };
        style[styleName] = value;
        object.setSelectionStyles(style);
        object.setCoords();
    }
    else {
        object[styleName] = value;
    }
    if(roomId){
        var obj = {};
        obj.id = object.id;
        obj.name = styleName;
        obj.value = value;
        socket.emit('stylePropChange',obj);
    }
    object.setCoords();
    canvas.renderAll();
}

function getActiveProp(name) {
    var object = canvas.getActiveObject();
    if (!object) return '';//此处有警告4次

    return object[name] || '';
}

//设置对象属性,基本上只针对text对象
function setActiveProp(name, value) {
    //console.log('setActiveProp');
    var object = canvas.getActiveObject();
    if (!object) return;
    if(roomId){
        var obj = {};
        obj.id = object.id;
        obj.name = name;
        obj.value = value;
        socket.emit('stylePropChange',obj);
    }
    object.set(name, value).setCoords();
    canvas.renderAll();
}

//添加访问器
function addAccessors($scope) {

    $scope.getOpacity = function() {
        return getActiveStyle('opacity') * 100;
    };

    $scope.setOpacity = function(value) {
        setActiveStyle('opacity', parseInt(value, 10) / 100);
    };

    $scope.getFill = function() {
        return getActiveStyle('fill');
    };
    $scope.setFill = function(value) {
        //console.log('setFill');
        setActiveStyle('fill', value);
    };

    $scope.isBold = function() {
        return getActiveStyle('fontWeight') === 'bold';
    };
    $scope.toggleBold = function() {
        setActiveStyle('fontWeight',
            getActiveStyle('fontWeight') === 'bold' ? '' : 'bold');
    };
    $scope.isItalic = function() {
        return getActiveStyle('fontStyle') === 'italic';
    };
    $scope.toggleItalic = function() {
        setActiveStyle('fontStyle',
            getActiveStyle('fontStyle') === 'italic' ? '' : 'italic');
    };

    $scope.isUnderline = function() {
        return getActiveStyle('textDecoration').indexOf('underline') > -1;
    };
    $scope.toggleUnderline = function() {
        var value = $scope.isUnderline()
          ? getActiveStyle('textDecoration').replace('underline', '')
          : (getActiveStyle('textDecoration') + ' underline');

        setActiveStyle('textDecoration', value);
    };

    $scope.isLinethrough = function() {
        return getActiveStyle('textDecoration').indexOf('line-through') > -1;
    };
    $scope.toggleLinethrough = function() {
        var value = $scope.isLinethrough()
          ? getActiveStyle('textDecoration').replace('line-through', '')
          : (getActiveStyle('textDecoration') + ' line-through');

        setActiveStyle('textDecoration', value);
    };
    $scope.isOverline = function() {
        return getActiveStyle('textDecoration').indexOf('overline') > -1;
    };
    $scope.toggleOverline = function() {
        var value = $scope.isOverline()
          ? getActiveStyle('textDecoration').replace('overline', '')
          : (getActiveStyle('textDecoration') + ' overline');

        setActiveStyle('textDecoration', value);
    };

    $scope.getText = function() {
        return getActiveProp('text');
    };
    $scope.setText = function(value) {
        //console.log('setText');
        setActiveProp('text', value);
    };

    $scope.getTextAlign = function() {
        return mdUtils.capitalize(getActiveProp('textAlign'));
    };
    $scope.setTextAlign = function(value) {
        setActiveProp('textAlign', value.toLowerCase());
    };

    $scope.getFontFamily = function() {
        return getActiveProp('fontFamily').toLowerCase();
    };
    $scope.setFontFamily = function(value) {
        console.log('setFontFamily');
        setActiveProp('fontFamily', value.toLowerCase());
    };

    $scope.getBgColor = function() {
        return getActiveProp('backgroundColor');
    };
    $scope.setBgColor = function(value) {
        setActiveProp('backgroundColor', value);
    };

    $scope.getTextBgColor = function() {
        return getActiveProp('textBackgroundColor');
    };
    $scope.setTextBgColor = function(value) {
        setActiveProp('textBackgroundColor', value);
    };

    $scope.getStrokeColor = function() {
        return getActiveStyle('stroke');
    };

    $scope.setStrokeColor = function(value) {
        setActiveStyle('stroke', value);
    };

    $scope.getStrokeWidth = function() {
        return getActiveStyle('strokeWidth');
    };
    $scope.setStrokeWidth = function(value) {
        setActiveStyle('strokeWidth', parseInt(value, 10));
    };

    $scope.getFontSize = function() {
        return getActiveStyle('fontSize');
    };
    $scope.setFontSize = function(value) {
        setActiveStyle('fontSize', parseInt(value, 10));
    };

    $scope.getLineHeight = function() {
        return getActiveStyle('lineHeight');
    };
    $scope.setLineHeight = function(value) {
        setActiveStyle('lineHeight', parseFloat(value, 10));
    };

    $scope.getBold = function() {
        return getActiveStyle('fontWeight');
    };
    $scope.setBold = function(value) {
        setActiveStyle('fontWeight', value ? 'bold' : '');
    };

    $scope.getCanvasBgColor = function() {
        return canvas.backgroundColor;
    };
    $scope.setCanvasBgColor = function(value) {
        roomId&&socket.emit('canvasBgColor',value);
        canvas.backgroundColor = value;
        canvas.renderAll();
    };

    $scope.confirmClear = function() {
        roomId&&socket.emit('clearAll','clearAll');
        canvas.clear();
    };

    $scope.rasterize = function() {
        if (!fabric.Canvas.supports('toDataURL')) {
            alert('This browser doesn\'t provide means to serialize canvas to an image');
        }
        else {
            window.open(canvas.toDataURL('png'));
        }
    };

    $scope.rasterizeSVG = function() {
        window.open(
          'data:image/svg+xml;utf8,' +
          encodeURIComponent(canvas.toSVG()));
    };
    var consoleJSONValue;
    $scope.rasterizeJSON = function() {
        $scope.setConsoleJSON(JSON.stringify(canvas));
    };
    $scope.getConsoleJSON = function() {
        return consoleJSONValue;
    };
    $scope.setConsoleJSON = function(value) {
        consoleJSONValue = value;
    };

    $scope.getSelected = function() {
        return canvas.getActiveObject();
    };

    $scope.removeSelected = function() {
        var activeObject = canvas.getActiveObject(),
            activeGroup = canvas.getActiveGroup();
        activeObject&&mdCanvas.remove(canvas,activeObject,function (idArr) {
            roomId&&socket.emit('clearSelected', idArr);
        });
        activeGroup&&mdCanvas.remove(canvas,activeGroup,function (idArr) {
            roomId&&socket.emit('clearSelected', idArr);
        });
    };

    $scope.getHorizontalLock = function() {
        return getActiveProp('lockMovementX');
    };
    $scope.setHorizontalLock = function(value) {
        setActiveProp('lockMovementX', value);
    };

    $scope.getVerticalLock = function() {
        return getActiveProp('lockMovementY');
    };
    $scope.setVerticalLock = function(value) {
        setActiveProp('lockMovementY', value);
    };

    $scope.getScaleLockX = function() {
        return getActiveProp('lockScalingX');
    },
    $scope.setScaleLockX = function(value) {
        setActiveProp('lockScalingX', value);
    };

    $scope.getScaleLockY = function() {
        return getActiveProp('lockScalingY');
    };
    $scope.setScaleLockY = function(value) {
        setActiveProp('lockScalingY', value);
    };

    $scope.getRotationLock = function() {
        return getActiveProp('lockRotation');
    };
    $scope.setRotationLock = function(value) {
        setActiveProp('lockRotation', value);
    };

    $scope.getOriginX = function() {
        return getActiveProp('originX');
    };
    $scope.setOriginX = function(value) {
        setActiveProp('originX', value);
    };

    $scope.getOriginY = function() {
        return getActiveProp('originY');
    };
    $scope.setOriginY = function(value) {
        setActiveProp('originY', value);
    };

    $scope.sendBackwards = function() {
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.sendBackwards(activeObject);
        }
    };

    $scope.sendToBack = function() {
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.sendToBack(activeObject);
        }
    };

    $scope.bringForward = function() {
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.bringForward(activeObject);
        }
    };

    $scope.bringToFront = function() {
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.bringToFront(activeObject);
        }
    };

    var pattern = new fabric.Pattern({
        source: 'images/logo.png',
        repeat: 'repeat'
    });

    $scope.patternify = function() {
        var obj = canvas.getActiveObject();

        if (!obj) return;

        if (obj.fill instanceof fabric.Pattern) {
            obj.fill = null;
        }
        else {
            if (obj instanceof fabric.PathGroup) {
                obj.getObjects().forEach(function(o) { o.fill = pattern; });
            }
            else {
                obj.fill = pattern;
            }
        }
        canvas.renderAll();
    };

    $scope.clip = function() {
        var obj = canvas.getActiveObject();
        if (!obj) return;

        if (obj.clipTo) {
            obj.clipTo = null;
        }
        else {
            var radius = obj.width < obj.height ? (obj.width / 2) : (obj.height / 2);
            obj.clipTo = function (ctx) {
                ctx.arc(0, 0, radius, 0, Math.PI * 2, true);
            };
        }
        canvas.renderAll();
    };

    $scope.shadowify = function() {
        var obj = canvas.getActiveObject();
        if (!obj) return;

        if (obj.shadow) {
            obj.shadow = null;
        }
        else {
            obj.setShadow({
                color: 'rgba(0,0,0,0.3)',
                blur: 10,
                offsetX: 10,
                offsetY: 10
            });
        }
        canvas.renderAll();
    };

    $scope.gradientify = function() {
        var obj = canvas.getActiveObject();
        if (!obj) return;
        obj.setGradient('fill', {
            x1: 0,
            y1: 0,
            x2: (mdUtils.getRandomInt(0, 1) ? 0 : obj.width),
            y2: (mdUtils.getRandomInt(0, 1) ? 0 : obj.height),
            colorStops: {
                0: '#' + mdUtils.getRandomColor(),
                1: '#' + mdUtils.getRandomColor()
            }
        });
        canvas.renderAll();
    };

    function initCustomization() {
        if (typeof Cufon !== 'undefined' && Cufon.fonts.delicious) {
            Cufon.fonts.delicious.offsetLeft = 75;
            Cufon.fonts.delicious.offsetTop = 25;
        }

        if (/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) {
            fabric.Object.prototype.cornerSize = 30;
        }

        fabric.Object.prototype.transparentCorners = false;

        if (document.location.search.indexOf('guidelines') > -1) {
            initCenteringGuidelines(canvas);
            initAligningGuidelines(canvas);
        }
    }

    initCustomization();

    $scope.getFreeDrawingMode = function() {
        return canvas.isDrawingMode;
    };

    $scope.setFreeDrawingMode = function(value) {
        if (!value) {
            _('drawing-mode').innerHTML = ' <i class="fa fa-mouse-pointer"></i>';
            _('drawing-mode').setAttribute('class','btn btn-default');
        }
        else {
            _('drawing-mode').innerHTML = ' <i class="fa fa-paint-brush "></i>';
            _('drawing-mode').setAttribute('class','btn btn-info');
        }
        canvas.isDrawingMode = !!value;
    };

    $scope.freeDrawingMode = 'Pencil';

    $scope.getDrawingMode = function() {
        return $scope.freeDrawingMode;
    };

    $scope.setDrawingMode = function(type) {

    $scope.freeDrawingMode = type;

    if (type === 'hline') {
      canvas.freeDrawingBrush = $scope.vLinePatternBrush;
    }
    else if (type === 'vline') {
      canvas.freeDrawingBrush = $scope.hLinePatternBrush;
    }
    else if (type === 'square') {
      canvas.freeDrawingBrush = $scope.squarePatternBrush;
    }
    else if (type === 'diamond') {
      canvas.freeDrawingBrush = $scope.diamondPatternBrush;
    }
    else if (type === 'texture') {
      canvas.freeDrawingBrush = $scope.texturePatternBrush;
    }
    else {
      canvas.freeDrawingBrush = new fabric[type + 'Brush'](canvas);
    }

    $scope.$$phase || $scope.$digest();
    };
    canvas.freeDrawingBrush.width = 3;

    $scope.getDrawingLineWidth = function() {
        if (canvas.freeDrawingBrush) {
          return canvas.freeDrawingBrush.width;
        }
    };

    $scope.setDrawingLineWidth = function(value) {
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.width = parseInt(value, 10)||1;
        }
    };

    $scope.getDrawingLineColor = function() {
        if (canvas.freeDrawingBrush) {
          return canvas.freeDrawingBrush.color;
        }
    };
    $scope.setDrawingLineColor = function(value) {
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = value;
        }
    };

    $scope.getDrawingLineShadowWidth = function() {
        if (canvas.freeDrawingBrush && canvas.freeDrawingBrush.shadow) {
          return canvas.freeDrawingBrush.shadow.blur || 1;
        }
        else {
          return 0
        }
    };
    $scope.setDrawingLineShadowWidth = function(value) {
        if (canvas.freeDrawingBrush) {
            var blur = parseInt(value, 10) || 1;
            if (blur > 0) {
                canvas.freeDrawingBrush.shadow = new fabric.Shadow({blur: blur, offsetX: 10, offsetY: 10}) ;
            }
            else {
                canvas.freeDrawingBrush.shadow = null;
            }
        }
    };
    $scope.getDrawingLineShadowColor = function(){
        if (canvas.freeDrawingBrush && canvas.freeDrawingBrush.shadow) {
            return canvas.freeDrawingBrush.shadow.color || 1;
        }
        else {
            return 0
        }
    };
    $scope.setDrawingLineShadowColor = function(value){
        if (canvas.freeDrawingBrush && canvas.freeDrawingBrush.shadow) {
            canvas.freeDrawingBrush.shadow.color = value;
        }
    };
    $scope.getRoomId = function(){
        return $scope.roomId;
    };

    function initBrushes() {
        if (!fabric.PatternBrush) return;

        initVLinePatternBrush();
        initHLinePatternBrush();
        initSquarePatternBrush();
        initDiamondPatternBrush();
        initImagePatternBrush();
    }
    initBrushes();

    function initImagePatternBrush() {
        var img = new Image();
        img.src = '/images/logo.png';

        $scope.texturePatternBrush = new fabric.PatternBrush(canvas);
        $scope.texturePatternBrush.source = img;
    }

    function initDiamondPatternBrush() {
        $scope.diamondPatternBrush = new fabric.PatternBrush(canvas);
        $scope.diamondPatternBrush.getPatternSrc = function() {

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
    }

    function initSquarePatternBrush() {
        $scope.squarePatternBrush = new fabric.PatternBrush(canvas);
        $scope.squarePatternBrush.getPatternSrc = function() {

            var squareWidth = 10, squareDistance = 2;

            var patternCanvas = fabric.document.createElement('canvas');
            patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
            var ctx = patternCanvas.getContext('2d');

            ctx.fillStyle = this.color;
            ctx.fillRect(0, 0, squareWidth, squareWidth);

            return patternCanvas;
        };
    }

    function initVLinePatternBrush() {
        $scope.vLinePatternBrush = new fabric.PatternBrush(canvas);
        $scope.vLinePatternBrush.getPatternSrc = function() {

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
    }

    function initHLinePatternBrush() {
        $scope.hLinePatternBrush = new fabric.PatternBrush(canvas);
        $scope.hLinePatternBrush.getPatternSrc = function() {

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
    }
}

function addObject($scope){
    $scope.addRect = function() {
        var coord = mdUtils.getRandomLeftTop();
        var props = {
            left: coord.left,
            top: coord.top,
            fill: '#ffffff',
            stroke:'#000000',
            width: 50,
            height: 50
        };
        var rect = new fabric.Rect(props);
        mdCanvas.add(canvas,rect.toObject(),function (fRect) {
            $scope.setFreeDrawingMode(false);
            mdCanvas.packageObj(fRect);
            roomId&&socket.emit('addObject',mdCanvas.toObject(fRect,false))
        });

    };

    $scope.addCircle = function() {
        var coord = mdUtils.getRandomLeftTop();
        var props = {
            left: coord.left,
            top: coord.top,
            fill: '#ffffff',
            stroke:'#000000',
            radius: 50
        };
        var circle = new fabric.Circle(props);
        mdCanvas.add(canvas,circle.toObject(),function (fCircle) {
            $scope.setFreeDrawingMode(false);
            mdCanvas.packageObj(fCircle);
            roomId&&socket.emit('addObject',mdCanvas.toObject(fCircle,false))
        });
    };

    $scope.addTriangle = function() {
        var coord = mdUtils.getRandomLeftTop();
        var props = {
            left: coord.left,
            top: coord.top,
            fill: '#ffffff',
            stroke:'#000000',
            width: 50,
            height: 50
        };
        var triangle = new fabric.Triangle(props);
        mdCanvas.add(canvas,triangle.toObject(),function (fTriangle) {
            $scope.setFreeDrawingMode(false);
            mdCanvas.packageObj(fTriangle);
            roomId&&socket.emit('addObject',mdCanvas.toObject(fTriangle,false))
        });
    };

    $scope.addLine = function() {
        var coord = mdUtils.getRandomLeftTop();
        var props = {
            x1:50,
            y1:100,
            x2:200,
            y2:200,
            left: coord.left,
            top: coord.top,
            stroke: '#000000'
        };
        var line = new fabric.Line([props.x1,props.y1,props.x2,props.y2],props);
        mdCanvas.add(canvas,line.toObject(), function (fLine) {
            $scope.setFreeDrawingMode(false);
            mdCanvas.packageObj(fLine);
            roomId&&socket.emit('addObject',mdCanvas.toObject(fLine,false))
        });
    };

    //$scope.addPolygon = function() {  //多边形
    //    var coord = getRandomLeftTop();
    //
    //    canvas.add(new fabric.Polygon([
    //      {x: 185, y: 0},
    //      {x: 250, y: 20},
    //      {x: 385, y: 170},
    //      {x: 0, y: 245} ], {
    //        left: coord.left,
    //        top: coord.top,
    //        fill: '#' + getRandomColor()
    //      }));
    //};

    $scope.addText = function() {
        var coord = mdUtils.getRandomLeftTop();
        var props = {
            text : '点击编辑文字',
            left: coord.left,
            top: coord.top,
            fontFamily: '微软雅黑',
            fill: '#000000',
            fontWeight: '',
            originX: 'left',
            hasRotatingPoint: true,
            centerTransform: true

        }
        var iText = new fabric.IText(props.text, props);

        mdCanvas.add(canvas, iText.toObject(),function (fIText) {
            $scope.setFreeDrawingMode(false);
            mdCanvas.packageObj(fIText);
            roomId&&socket.emit('addObject',mdCanvas.toObject(fIText,false));
            fIText.on('editing:entered', editorEnterFire);
            fIText.on('editing:exited', function () {
                console.log('退出编辑');
            });
            fIText.on('selection:changed', function () {
                $scope.setText($scope.getText());
                canvas.renderAll();
            });
        });
    };

    var addShape = function(shapeName) {
        console.log('adding shape', shapeName);
        var coord = mdUtils.getRandomLeftTop();
        fabric.loadSVGFromURL('../assets/' + shapeName + '.svg', function(objects, options) {
            var loadedObject = fabric.util.groupSVGElements(objects, options);
            loadedObject.set({
                left: coord.left,
                top: coord.top,
                angle: mdUtils.getRandomInt(-10, 10)
            }).setCoords();
            canvas.add(loadedObject);
        });
    };

    $scope.maybeLoadShape = function(e) {
        var $el = $(e.target).closest('button.shape');
        if (!$el[0]) return;

        var id = $el.prop('id'), match;
        if (match = /\d+$/.exec(id)) {
            addShape(match[0]);
        }
    };

    $scope.addImage = function() {
        _('image').click();
    };

    _('image').addEventListener('change', function() {
        if (this.files.length != 0) {
            var file = this.files[0],
                reader = new FileReader();
            if (!reader) {
                alert('your browser doesn\'t support fileReader');
                this.value = '';
                return;
            };
            reader.onload = function(e) {
                mdCanvas.addUrl(canvas, e.target.result, function (fImage) {
                    $scope.setFreeDrawingMode(false);
                    mdCanvas.packageObj(fImage);
                    var prop = {};
                    if(fImage.width >= (canvas.width-100))
                        prop.width = canvas.width-200;
                    if(fImage.height >= (canvas.height-100))
                        prop.height = canvas.height-200;
                    var lt = mdUtils.getRandomLeftTop();
                    prop.left = lt.left;
                    prop.top = lt.top;
                    fImage.set(prop).setCoords();
                    roomId&&socket.emit('addObject',mdCanvas.toObject(fImage,false));
                });
                //重置input，防止不能连续两次上传同一张图片
                $('input[type=file]').wrap('<form>').closest('form').get(0).reset();
            };
            reader.readAsDataURL(file);
        };
    }, false);

    $scope.addVideo = function() {
        _('video').click();
    };

    _('video').addEventListener('change', function() {
        if (this.files.length != 0) {
            var file = this.files[0],
                reader = new FileReader();
            if (!reader) {
                alert('your browser doesn\'t support fileReader');
                this.value = '';
                return;
            };
            reader.onload = function(e) {
                mdCanvas.addUrl(canvas, e.target.result,function (fVideo) {
                    $scope.setFreeDrawingMode(false);
                    mdCanvas.packageObj(fVideo);
                    fVideo.set(mdUtils.getRandomLeftTop()).setCoords();
                    roomId&&socket.emit('addObject',mdCanvas.toObject(fVideo,false));
                });
                //重置input，防止不能连续两次上传同一张图片
                $('input[type=file]').wrap('<form>').closest('form').get(1).reset();
            };
            reader.readAsDataURL(file);
        };
    }, false);
}

function addMyOwnAccessors($scope,$http){

    $('.brand-title').colpick({
        layout:'hex',
        onSubmit: function(hsb,hex,rgb,el) {
            $scope.setCanvasBgColor('#'+hex);
            //canvas.backgroundColor = '#'+hex;
            if(hex =='ffffff')
                $(el).css('color', '#777777');
            else
                $(el).css('color', '#'+hex);
            $(el).colpickHide();
            canvas.renderAll();
        }
    });

    $('.fill-color-box').colpick({
        colorScheme:'light',
        layout:'rgbhex',
        onSubmit:function(hsb,hex,rgb,el) {
            $scope.setFill('#'+hex);
            console.log($(el).children());
            $($(el).children()[1]).css('background-color','#'+hex);
            $(el).colpickHide();
        }
    });

    $('.stroke-color-box').colpick({
        colorScheme:'light',
        layout:'rgbhex',
        onSubmit:function(hsb,hex,rgb,el) {
            $scope.setStrokeColor('#'+hex);
            console.log($(el).children());
            $($(el).children()[1]).css('background-color','#'+hex);
            $(el).colpickHide();
        }
    });

    $('.text-background-color-box').colpick({
        colorScheme:'light',
        layout:'rgbhex',
        onSubmit:function(hsb,hex,rgb,el) {
            $scope.setTextBgColor('#'+hex);
            console.log($(el).children());
            $($(el).children()[1]).css('background-color','#'+hex);
            $(el).colpickHide();
        }
    });

    $('.drawing-color-box').colpick({
        colorScheme:'light',
        layout:'rgbhex',
        onSubmit:function(hsb,hex,rgb,el) {
            $scope.setDrawingLineColor('#'+hex);
            console.log($(el).children());
            $($(el).children()[1]).css('background-color','#'+hex);
            $(el).colpickHide();
        }
    });

    $('.shadow-color-box').colpick({
        colorScheme:'light',
        layout:'rgbhex',
        onSubmit:function(hsb,hex,rgb,el) {
            $scope.setDrawingLineShadowColor('#'+hex);
            console.log($(el).children());
            $($(el).children()[1]).css('background-color','#'+hex);
            $(el).colpickHide();
        }
    });
    
    $scope.copySelf = function () {
        var activeObject = canvas.getActiveObject(),
            activeGroup = canvas.getActiveGroup();
        if(activeObject){
            mdCanvas.add(canvas,activeObject.toObject(),function (fObj) {
                mdCanvas.packageObj(fObj);
                roomId&&socket.emit('addObject',mdCanvas.toObject(fObj,false));
            });
        }
        if(activeGroup){
            console.log(activeGroup);
            //mdCanvas.toState(activeGroup.toObject(), function (state) {
            //    var objects = activeGroup._objects;
            //    var newObjects = mdCanvas.clone(objects);
            //    newObjects.forEach(function (obj) {
            //        mdCanvas.packageObj(obj);
            //    });
            //    var group = new fabric.Group(newObjects,state);
            //    canvas.add(group);
            //});
        }
    };

    $scope.activeAll = function(){
        mdCanvas.activeAll(canvas);
    };
    
    $scope.setFileName = function ($event) {
        var me = $($event.target);
        var txt = me.text();
        var input = $("<input type='text' class='form-control' value='" + txt + "'/>");
        input.css('width','200');
        input.css('height','25');
        me.html(input);
        input.click(function () {
            return false;
        });
        input.trigger("focus");
        input.hover(function () {
            input.css('background-color','#ffffff')
        }, function () {
            
        })
        input.blur(function () {
            var newtxt = $(this).val();
            me.html(newtxt);
            if (newtxt != txt) {
                $scope.canvas.fileName = newtxt;
                var queryObj = {
                    fileName : newtxt,
                    id : $scope.canvas.id
                };
                $http.get("/renameFile"+mdUtils.convertJSONToQueryStr(queryObj))
                    .success(function (res) {
                        console.log(res);
                    });
            }
        })
    }
}

var isMouseDown = false,
    ctrlKeyDown = false,
    isDisGroup = false,
    mouseXOnPan = 0,
    mouseYOnPan = 0,
    canvasXOnPan = 0,
    canvasYOnPan = 0;

function addCanvasListener($scope,$http) {

    function updateScope() {
        $scope.$$phase || $scope.$digest();
        canvas.renderAll();
    }

    canvas
        .on('object:selected', objectSelectedLtn)
        .on('object:modified', objectModifiedLtn)
        .on('object:added', objectAddedLtn)
        .on('path:created', pathCreatedLtn)
        .on('mouse:up', mouseUpLtn)
        .on('mouse:down', mouseDownLtn)
        .on('mouse:move', mouseMoveLtn)
        .on('object:scaling', objectScalingLtn)
        .on('selection:created', selectCreatedLtn)
        .on('before:selection:cleared', beforeSelectClearedLtn)
        .on('selection:cleared', selectClearedLtn);


    function selectClearedLtn(){
        updateScope();
    }

    function objectSelectedLtn(){
        updateScope();
    }

    function pathCreatedLtn(e){
        if(ctrlKeyDown) return;
        updateScope();
        var fPath = e.path;
        mdCanvas.packageObj(fPath);
        roomId && socket.emit('addObject', mdCanvas.toObject(fPath,false));
    }

    function mouseUpLtn(e){
        isMouseDown = false;
        if(!roomId) return;
        var obj = e.target;
        if(!obj) return;
        if(canvas.getActiveObject()){
            socket.emit('statePropChange',mdCanvas.toState(obj));
        }
        if(canvas.getActiveGroup()){
            var sGroup = mdCanvas.toObject(canvas.getActiveGroup(),true);
            socket.emit('groupStateChange',mdCanvas.toState(sGroup));
        }
    }


    function mouseDownLtn(e){
        isMouseDown = true;
        if(ctrlKeyDown){
            mouseXOnPan = event.clientX;
            mouseYOnPan = event.clientY;
            canvasXOnPan = canvasCtnEl.offsetLeft;
            canvasYOnPan = canvasCtnEl.offsetTop;
        } else {
            var obj = e.target;
            if(!obj && !canvas.isDrawingMode && isDisGroup) {
                if(roomId){
                    socket.emit('restoreAll',mdCanvas.toObject(canvas,false));
                    socket.emit('discard','discard');
                }
                else{
                    $scope.saveFile();
                }
                isDisGroup = false;
                return;
            }
            if(!obj) return;
            if (obj._objects){
                if (obj._objects[0].selectable) {
                    var idArr = [];
                    obj._objects.forEach(function (a) {
                        idArr.push(a.id);
                    });
                    socket.emit('lockState', idArr);
                }
            } else {
                obj.selectable&&socket.emit('lockState', obj.id);
                if (obj._element&&obj._element.tagName === 'VIDEO') {
                    var myVideo = obj._element;
                    myVideo.paused ? myVideo.play() : myVideo.pause();
                }
            }
        }
    }

    function mouseMoveLtn(e){
        if (isMouseDown && ctrlKeyDown) {
            canvasCtnEl.style.left = ( event.clientX - mouseXOnPan + canvasXOnPan ) + 'px';
            canvasCtnEl.style.top = ( event.clientY - mouseYOnPan + canvasYOnPan  )+ 'px';
        }
    }

    function objectModifiedLtn(e){
        var modifiedObj = e.target;
        if(modifiedObj._objects){ //成组modify
            var modify = moment().format('YYYY-MM-DD HH:mm:ss');
            modifiedObj._objects.forEach(function(obj){
                obj.lastModify = modify;
            })
        }else{ //单个modify
            modifiedObj.lastModify = moment().format('YYYY-MM-DD HH:mm:ss');
            $scope.saveFile();
        }
    }
    function beforeSelectClearedLtn(e){
        if(e.target&& e.target._objects){
            isDisGroup = true;
        }
    }

    function objectAddedLtn(){

    }

    function objectScalingLtn(){

    }

    function selectCreatedLtn(){

    }

}

function initContextMenu($scope){
    document.oncontextmenu = function (e) {
        return false;
    };
    $('.upper-canvas').contextmenu({
        target: '#context-menu',
        before: function (e) {
            if(canvas.isDrawingMode){
                e.preventDefault();
                this.closemenu();
                return false;
            }
        },
        onItem: function (context, e) {
        }
    });

    $('#context-menu').on('show.bs.context', function (e) {
        if(!mdCanvas.isActiveObjectExist(canvas)){
            _('clear-context').setAttribute('class','disabled');
            _('copy-context').setAttribute('class','disabled');
            _('btf-context').setAttribute('class','disabled');
            _('stb-context').setAttribute('class','disabled');
        }else{
            $('#context-ul').children('.disabled').removeAttr('class');
        }
    });

    $('#context-menu').on('shown.bs.context', function (e) {
        //console.log('after show event');
    });

    $('#context-menu').on('hide.bs.context', function (e) {
        //console.log('before hide event');
    });

    $('#context-menu').on('hidden.bs.context', function (e) {
        //console.log('after hide event');
    });
}

function initCanvasSocket($scope){
    socket.emit('room', {roomId : roomId, user : user});
    socket.on('canvas', function (canvasData) {
        canvasData.objectsRoom[roomId].forEach(function (sObject) {
            if(sObject.type === 'i-text'){
                mdCanvas.add(canvas,sObject,function (fIText) {
                    fIText.on('editing:entered', editorEnterFire);
                    fIText.on('editing:exited', function (e) {
                        console.log('退出编辑');
                    });
                    fIText.on('selection:changed', function () {
                        $scope.setText($scope.getText());
                        canvas.renderAll();
                    });
                });
            }else
                mdCanvas.add(canvas,sObject);
        });
        console.log(canvasData.userRoom[roomId]);
    });

    socket.on('addObject', function (sObject) {
        if(sObject.type === 'i-text'){
            mdCanvas.add(canvas, sObject,function (fIText) {
                fIText.on('editing:entered', editorEnterFire);
                fIText.on('editing:exited', function (e) {
                    console.log('退出编辑');
                });
                fIText.on('selection:changed', function () {
                    $scope.setText($scope.getText());
                    canvas.renderAll();
                });
            });
        }else
            mdCanvas.add(canvas,sObject);
    });

    socket.on('userJoined',function(user){
        console.log(user.userName+' has joined in this room');
        console.log('now there\'re '+user.numUsers+' participants')
    });

    socket.on('userLeft', function (user) {
       console.log(user.userName+' has left from this room');
       console.log('now there\'re '+user.numUsers+' participants');
    });

    socket.on('clearAll',function(msg){
        if(msg == 'clearAll'){
            canvas.clear();
        }
    });

    socket.on('clearSelected',function(idArr){
        var myObjArr = mdCanvas.clone(canvas.getObjects());
        myObjArr.forEach(function(a){
            if(idArr.indexOf(a.id)!==-1){
                mdCanvas.remove(canvas,a);
            }
        });
    });

    socket.on('statePropChange',function(state){
        var myObjArr = mdCanvas.clone(canvas.getObjects());
        myObjArr.forEach(function(obj){
            if(obj.id === state.id){
                for(var prop in state){
                    obj.set(prop,state[prop]);
                }
                //unlockState
                obj.selectable = true;
                obj.hasControls = true;
                obj.setCoords();
                canvas.renderAll();
            }
        });
    });

    socket.on('stylePropChange', function (style) {
        var myObjArr = mdCanvas.clone(canvas.getObjects());
        myObjArr.forEach(function (obj) {
            if (obj.id === style.id) {
                obj.set(style.name,style.value).setCoords();
                canvas.renderAll();
            }
        });
    });

    socket.on('groupStateChange',function(group){
        var myObjArr = mdCanvas.clone(canvas.getObjects());
        var selectObjs = [];
        myObjArr.forEach(function(obj){
            if(group.idArr.indexOf(obj.id) !== -1){
                obj.selectable = true;
                obj.hasControls = true;
                obj.setCoords();
                selectObjs.push(obj);
            }
        });
        var opt ={};
        opt.top = group.top;
        opt.left = group.left;
        opt.angle = group.angle;
        opt.scaleX = group.scaleX;
        opt.scaleY = group.scaleY;
        if(canvas.getActiveGroup()){
            var actGroup = canvas.getActiveGroup();
            actGroup.set(opt);
        }else{
            var objGroup = new fabric.Group(selectObjs,opt);
            canvas.setActiveGroup(objGroup);
            objGroup.setObjectsCoords();
        }
        canvas.renderAll();
    });

    socket.on('lockState', function (data) {
        var myObjArr = mdCanvas.clone(canvas.getObjects());
        if(typeof data === 'string'){
            myObjArr.forEach(function (a) {
                if(a.id === data){
                    a.selectable = false;
                    a.hasControls = false;
                    a.setCoords();
                }
            });
        }else{
           myObjArr.forEach(function (a) {
                if(data.indexOf(a.id)!== -1){
                    a.selectable = false;
                    a.hasControls = false;
                    a.setCoords();
                }
            });
        }
        canvas.renderAll();
    });

    socket.on('discard', function (data) {
       data&&canvas.discardActiveGroup();
    });

    socket.on('canvasBgColor', function (value) {
        canvas.backgroundColor = value;
        if(value.substring(1) =='ffffff')
            $('#picker').css('color', '#777777');
        else
            $('#picker').css('color',value);
        canvas.renderAll();
    });
}

function initKeyBoard($scope){
    var ie;
    var free;
    if (document.all)
        ie = true;
    else
        ie = false; //判断是否IE
    document.onkeydown = KeyPress;
    document.onkeyup = KeyUp;
    function KeyPress(){
        var key;
        if (ie)
            key = event.keyCode;
        else
            key = KeyPress.arguments[0].keyCode;
        if(key == 27){ //ESC键
            $scope.setFreeDrawingMode(!$scope.getFreeDrawingMode());
            $scope.$$phase || $scope.$digest();
            if (!$scope.getFreeDrawingMode()) {
                _('drawing-mode').innerHTML = ' <i class="fa fa-mouse-pointer"></i>';
                _('drawing-mode').setAttribute('class','btn btn-default');
            }
            else {
                _('drawing-mode').innerHTML = ' <i class="fa fa-paint-brush "></i>';
                _('drawing-mode').setAttribute('class','btn btn-info');
            }
        }
        if(key === 17){ //Ctrl键
            if(!isMouseDown&&$scope.getFreeDrawingMode()){
                free = true;
                $scope.setFreeDrawingMode(false);
                ctrlKeyDown = true;
            }
            if(!$scope.getFreeDrawingMode()){
                ctrlKeyDown = true;
            }
        }
    }
    function KeyUp(event){
        var key = event.keyCode;
        if(key === 17){
            if(free){
                free = false;
                $scope.setFreeDrawingMode(true);
            }
            ctrlKeyDown = false;
        }
    }
}

function httpOpt($scope){
    $scope.save = function () {
        if(!this.canvas.id){
            $('#myModal').modal();
        }else{
            this.saveFile();
        }
    };
    $scope.saveFile = function () {
        if(!canvas.fileName) canvas.fileName = _('fileName').value;
        var data = JSON.stringify(mdCanvas.toObject(canvas,false,['fileName','width','height','id']));
        $('#modifyText').html('正在保存...');
        $('#modifyText').css('color','#A9A9A9');
        Communication.saveFile([data], function (data) {
            if(data.success){
                $('#modifyText').html('所有更改已保存');
            }
        })
    };
}

var canvasModule = angular.module('CanvasModule', []);
canvasModule.controller('CanvasCtrl', function($scope,$http) {
    $scope.roomId = roomId ? roomId : null;
    var id = urlParams['id'];
    if(id) canvas.id = id;
    $scope.canvas = canvas;
    $scope.getActiveStyle = getActiveStyle;
    addAccessors($scope);
    addMyOwnAccessors($scope,$http);
    addObject($scope);
    initContextMenu($scope);
    initKeyBoard($scope);
    roomId&&initCanvasSocket($scope);
    addCanvasListener($scope,$http);
    httpOpt($scope);
});