var canvasData = {};
canvasData.pathData = [];
canvasData.textData = [];
canvasData.geometryData = [];
canvasData.imgData=[];
canvasData.usersId = [];

//为文字编辑绑定事件
function setITextFire(iText,$scope){
    iText.on('editing:entered', function (e) {
        console.log('editing:entered');
    });
    iText.on('editing:exited', function (e) {
        console.log('editing:exited');
    });
    iText.on('selection:changed', function () {
        $scope.setText($scope.getText());
        //$scope.$$phase || $scope.$digest();
        canvas.renderAll();
    });
}

//记录进入canvas的所有用户ID
function addUsers(obj){
    if (canvasData.usersId.indexOf(obj.userId) === -1) {
        canvasData.usersId.push(obj.userId);
    }
}

//为当前canvas的对象添加必要的属性
function prepareObj(obj,n_obj){
    obj.id = n_obj.id;
    obj.userId = n_obj.userId;
    obj.userName = n_obj.userName;
    obj.createTime = n_obj.createTime;
    obj.lastModify = n_obj.lastModify;
}

function addGeometryToCanvas(obj){
    canvasData.geometryData.push(obj);
    addUsers(obj);
    if(obj.type === 'circle')
        var gmt = new fabric.Circle(obj);
    if(obj.type === 'triangle')
        var gmt = new fabric.Triangle(obj);
    if(obj.type === 'rect')
        var gmt = new fabric.Rect(obj);
    if(obj.type === 'line')
        var gmt = new fabric.Line([obj.x1,obj.y1,obj.x2,obj.y2],obj);
    canvas.add(gmt);
}

function getActiveStyle(styleName, object) {
    object = object || canvas.getActiveObject();
    if (!object) return '';

    return (object.getSelectionStyles && object.isEditing)
        ? (object.getSelectionStyles()[styleName] || '')
        : (object[styleName] || '');
}

//设置对象样式
function setActiveStyle(styleName, value, object) {
    object = object || canvas.getActiveObject();
    if (!object) return;

    if (object.setSelectionStyles && object.isEditing) {
        //console.log('setSelectionStyles');
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
        obj.styleName = styleName;
        obj.value = value;
        socket.emit('styleChange',obj);
    }
    object.setCoords();
    canvas.renderAll();
}

function getActiveProp(name) {
    var object = canvas.getActiveObject();
    if (!object) return '';//此处有警告4次

    return object[name] || '';
}

//设置对象属性
function setActiveProp(name, value) {
    //console.log('setActiveProp');
    var object = canvas.getActiveObject();
    if (!object) return;
    if(roomId){
        var obj = {};
        obj.id = object.id;
        obj.name = name;
        obj.value = value;
        socket.emit('propChange',obj);
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
        return capitalize(getActiveProp('textAlign'));
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
        socket.emit('canvasBgColor',value);
        canvas.backgroundColor = value;
        canvas.renderAll();
    };

    $scope.addRect = function() {
        var coord = getRandomLeftTop();
        var rect = new fabric.Rect({
            left: coord.left,
            top: coord.top,
            fill: '#' + getRandomColor(),
            width: 50,
            height: 50
        });
        var sRect = SerializeShapes.serializeRect(rect);
        //rect.id = sRect.id;
        prepareObj(rect,sRect);
        canvas.add(rect);
        if(roomId){
            socket.emit('addGeometry',sRect);
        }
    };

    $scope.addCircle = function() {
        var coord = getRandomLeftTop();
        var circle = new fabric.Circle({
            left: coord.left,
            top: coord.top,
            fill: '#' + getRandomColor(),
            radius: 50
        });
        var sCircle = SerializeShapes.serializeCircle(circle);
        //circle.id = sCircle.id;
        prepareObj(circle,sCircle);
        canvas.add(circle);
        if(roomId){
            socket.emit('addGeometry',sCircle);
        }
    };

    $scope.addTriangle = function() {
        var coord = getRandomLeftTop();
        var triangle = new fabric.Triangle({
            left: coord.left,
            top: coord.top,
            fill: '#' + getRandomColor(),
            width: 50,
            height: 50
        });
        var sTriangle = SerializeShapes.serializeTriangle(triangle);
        //triangle.id = sTriangle.id;
        prepareObj(triangle,sTriangle);
        canvas.add(triangle);
        if(roomId){
            socket.emit('addGeometry',sTriangle);
        }
    };

    $scope.addLine = function() {
        var coord = getRandomLeftTop();
        var line = new fabric.Line([ 50, 100, 200, 200], {
            left: coord.left,
            top: coord.top,
            stroke: '#' + 000000
        });
        var sLine = SerializeShapes.serializeLine(line);
        //line.id = sLine.id;
        prepareObj(line,sLine);
        canvas.add(line);
        if(roomId){
            socket.emit('addGeometry',sLine);
        }
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
        var text = '点击编辑文字';
        var textSample = new fabric.IText(text, {
            left: getRandomInt(0, 200),
            top: getRandomInt(0, 200),
            fontFamily: '微软雅黑',
            fill: '#' + getRandomColor(),
            fontWeight: '',
            originX: 'left',
            hasRotatingPoint: true,
            centerTransform: true
        });
        var sText = SerializeShapes.serializeText(textSample);
        //textSample.id = text.id;
        prepareObj(textSample,sText);
        if(roomId){
            socket.emit('addText',sText);
        }
        setITextFire(textSample,this);
        canvas.add(textSample);
    };

    var addShape = function(shapeName) {
        console.log('adding shape', shapeName);
        var coord = getRandomLeftTop();
        fabric.loadSVGFromURL('../assets/' + shapeName + '.svg', function(objects, options) {
            var loadedObject = fabric.util.groupSVGElements(objects, options);
            loadedObject.set({
                left: coord.left,
                top: coord.top,
                angle: getRandomInt(-10, 10)
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

    //function addImage(imageName, minScale, maxScale) {
    //    var coord = getRandomLeftTop();
    //    fabric.Image.fromURL('../images/' + imageName, function(image) {
    //        image.set({
    //            left: coord.left,
    //            top: coord.top,
    //            angle: getRandomInt(-10, 10)
    //        }).scale(getRandomNum(minScale, maxScale)).setCoords();
    //        canvas.add(image);
    //    });
    //};

    function addImage(imgData, minScale, maxScale) {
        var coord = getRandomLeftTop();
        fabric.Image.fromURL(imgData, function(image) {

            image.set({
                left: coord.left,
                top: coord.top
                //angle: getRandomInt(-10, 10)
            }).scale(getRandomNum(minScale, maxScale)).setCoords();
            var sImage = SerializeShapes.serializeImage(imgData,image);
            prepareObj(image,sImage);
            if(roomId){
                socket.emit('addImage',sImage);
            }
            canvas.add(image);
        });
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
                this.value = '';
                console.log(e.target);
                var type = Utils.getDataUrlType(e.target.result);
                console.log(type);
                if(type === 'image')
                    addImage(e.target.result,0.5,1);
            };
            reader.readAsDataURL(file);
        };
    }, false);

    $scope.addImage1 = function() {
        _('image').click();
    };

    $scope.addVideo1 = function() {
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
                this.value = '';
                //console.log(e.target);
                var type = Utils.getDataUrlType(e.target.result);
                console.log(type);
                if(type === 'video')
                    addVideo(e.target.result);
            };
            reader.readAsDataURL(file);
        };
    }, false);


    function addVideo(url) {
        var parent = document.createElement('div');
        var videoEl = document.createElement('video');
        videoEl.setAttribute('src',url);
        videoEl.setAttribute('style','display:none');
        videoEl.setAttribute('width',"480");
        videoEl.setAttribute('height',"240");
        parent.appendChild(videoEl);
        var video = new fabric.Image(videoEl, {
            left: 100,
            top: 100
        });
        var sVideo = SerializeShapes.serializeVideo(url,video);
        prepareObj(video,sVideo);
        if(roomId){
            socket.emit('addVideo',sVideo);
        }
        canvas.add(video);
        fabric.util.requestAnimFrame(function render() {
            canvas.renderAll();
            fabric.util.requestAnimFrame(render);
        });
    };

    function removeVideoEl(el){

        //el.parentNode.removeChild(el);
        if(el.play){
            el.pause();
        }
        console.log(el);

    }
    //addVideo();

    $scope.confirmClear = function() {
        if(roomId) socket.emit('clearAll','clearAll');
        canvasData.pathData = [];
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
        //console.log(value);
        consoleJSONValue = value;
    };

    $scope.getSelected = function() {
        return canvas.getActiveObject();
    };

    $scope.removeSelected = function() {
        var activeObject = canvas.getActiveObject(),
            activeGroup = canvas.getActiveGroup();
        if(roomId){
            var idArr = [];
            if (activeObject) {
                idArr.push(activeObject.id);
            }
            if (activeGroup) {
                activeGroup.forEachObject(function (a) {
                  idArr.push(a.id);
                });
            }
            socket.emit('clearSelected', idArr);
        }
        if (activeGroup) {
            var objectsInGroup = activeGroup.getObjects();
            canvas.discardActiveGroup();
            objectsInGroup.forEach(function (object) {
                canvas.remove(object);
                if(object._element){
                    var el = object._element;
                    if(el.tagName === 'VIDEO'){
                        removeVideoEl(el);
                    }
                }
            });
        }
        else if (activeObject) {
            if(activeObject._element){
                var el = activeObject._element;
                if(el.tagName === 'VIDEO'){
                    removeVideoEl(el);
                }
            }
            canvas.remove(activeObject);
        }

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
      x2: (getRandomInt(0, 1) ? 0 : obj.width),
      y2: (getRandomInt(0, 1) ? 0 : obj.height),
      colorStops: {
        0: '#' + getRandomColor(),
        1: '#' + getRandomColor()
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

  function addTexts() {
    var iText = new fabric.IText('自由画板\n文字示例\n点我\n编辑', {
      left: 100,
      top: 150,
      fontFamily: 'Helvetica',
      fill: '#333333',
      styles: {
        0: {
          0: { fill: 'red', fontSize: 20 },
          1: { fill: 'red', fontSize: 30 },
          2: { fill: 'red', fontSize: 40 },
          3: { fill: 'red', fontSize: 50 },
          4: { fill: 'red', fontSize: 60 },

          6: { textBackgroundColor: 'yellow' },
          7: { textBackgroundColor: 'yellow' },
          8: { textBackgroundColor: 'yellow' },
          9: { textBackgroundColor: 'yellow' }
        },
        1: {
          0: { textDecoration: 'underline' },
          1: { textDecoration: 'underline' },
          2: { fill: 'green', fontStyle: 'italic', textDecoration: 'underline' },
          3: { fill: 'green', fontStyle: 'italic', textDecoration: 'underline' },
          4: { fill: 'green', fontStyle: 'italic', textDecoration: 'underline' }
        },
        2: {
          0: { fill: 'blue', fontWeight: 'bold' },
          1: { fill: 'blue', fontWeight: 'bold' },
          2: { fill: 'blue', fontWeight: 'bold' },

          4: { fontFamily: 'Courier', textDecoration: 'line-through' },
          5: { fontFamily: 'Courier', textDecoration: 'line-through' },
          6: { fontFamily: 'Courier', textDecoration: 'line-through' },
          7: { fontFamily: 'Courier', textDecoration: 'line-through' }
        },
        3: {
          0: { fontFamily: 'Impact', fill: '#666666', textDecoration: 'line-through' },
          1: { fontFamily: 'Impact', fill: '#666666', textDecoration: 'line-through' },
          2: { fontFamily: 'Impact', fill: '#666666', textDecoration: 'line-through' },
          3: { fontFamily: 'Impact', fill: '#666666', textDecoration: 'line-through' },
          4: { fontFamily: 'Impact', fill: '#666666', textDecoration: 'line-through' }
        }
      }
    });

      iText.on('editing:entered', function (e) {
          console.log('editing:entered');
      });
      iText.on('editing:exited', function (e) {
          console.log('editing:exited');
      });

    canvas.add(iText);
  }

  //addTexts();


  $scope.getFreeDrawingMode = function() {
    return canvas.isDrawingMode;
  };
  $scope.setFreeDrawingMode = function(value) {
    canvas.isDrawingMode = !!value;
    //$scope.$$phase || $scope.$digest();
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
        if($scope.roomId){
            return $scope.roomId;
        }
        else
            return null;
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

function addMyOwnAccessors($scope){
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
}

function watchCanvas($scope) {
    var isMouseDown = false;

    function updateScope() {
        $scope.$$phase || $scope.$digest();
        canvas.renderAll();
    }
    function getObjInfo(){
        //console.log('select');
        updateScope();
        //console.log(e.target);
    }
    function addPath(e){
        if(!ctrlKeyDown){
            updateScope();
            var path = e.path;
            var data = SerializeShapes.serializePath(path);
            //path.id = data.id;
            prepareObj(path,data);
            canvasData.pathData.push(data);
            if(canvasData.usersId.indexOf(data.userId) === -1){
                canvasData.usersId.push(data.userId);
            }
            //console.log(canvasData);
            if(roomId)
            socket.emit('addPath', data);
        }
    }
    function changeState(e){
        panning = false;
            if(isMouseDown){
                isMouseDown = !isMouseDown;
                if(roomId){
                  var obj = e.target;
                  if(obj){
                      if(canvas.getActiveObject()){
                          var data =SerializeShapes.serializeSingleState(obj);
                          socket.emit('stateChange',data);
                      }
                      if(canvas.getActiveGroup()){
                          var group = SerializeShapes.serializeGroupState(canvas.getActiveGroup());
                          socket.emit('groupChange',group);
                      }
                  }
                }
            }
    }
    function listenMouseDown(e){
        if(ctrlKeyDown){
            if(canvas.isDrawingMode){
                console.log('no drag');
            }else{
                panning = true;
                mouseXOnPan = event.clientX;
                mouseYOnPan = event.clientY;
                canvasXOnPan = canvasCtnEl.offsetLeft;
                canvasYOnPan = canvasCtnEl.offsetTop;
            }
        }else {
            var obj = e.target;
            if (obj) {
                    if (obj._objects) {
                        if (obj._objects[0].selectable) {
                            var idArr = [];
                            obj._objects.forEach(function (a) {
                                idArr.push(a.id);
                            });
                            socket.emit('lockState', idArr);
                        }
                    }else if (obj.selectable) {
                        socket.emit('lockState', obj.id);
                    }
                    if(obj._element){
                        if(obj._element.tagName === 'VIDEO'){
                            var myVideo = obj._element;
                            if(myVideo.paused)
                                myVideo.play();
                            else
                                myVideo.pause();
                        }
                    }
                }
            }
        isMouseDown = true;
    }

    function dragCanvas(e){
        if ( panning && ctrlKeyDown) {
            canvasCtnEl.style.left = ( event.clientX - mouseXOnPan + canvasXOnPan ) + 'px';
            canvasCtnEl.style.top = ( event.clientY - mouseYOnPan + canvasYOnPan  )+ 'px';
        }
    }


    canvas
    .on('object:selected', getObjInfo)
    .on('group:selected', updateScope)
    .on('path:created', addPath)
    .on('mouse:up', changeState)
    .on('mouse:down', listenMouseDown)
    .on('mouse:move', dragCanvas)
    .on('selection:cleared', updateScope);

    /*当时用jquerycontextmenu时,可用以下方式控制contextmenu的显示*/
    $('.upper-canvas').bind("contextmenu", function () {
        if(canvas.getActiveObject()||canvas.getActiveGroup())
            return true;
        else
            return false;
    })

    /*原生DOM操作 有问题*/
    //var upperCavasEl = document.getElementsByClassName('upper-canvas');
    //upperCavasEl[0].oncontextmenu = function () {
    //    return false;
    //}
    //upperCavasEl[0].addEventListener('contextmenu', function (e) {
    //    e.preventDefault();
    //},false);

}



function initCanvasSocket($scope){
    if(roomId){
        socket.emit('room', roomId);
        socket.emit('addUser', userName);
    }
    socket.on('allPath',function(data){
      if(data) {
          data.forEach(function (x) {
              canvasData.pathData.push(x);
              addUsers(x);
              canvas.add(new fabric.Path(x.path, x));
          })
      }
    });

    socket.on('allText',function(data){
      if(data) {
          data.forEach(function (x) {
              canvasData.textData.push(x);
              addUsers(x);
              var iText = new fabric.IText(x.text, x);
              setITextFire(iText,$scope);
              canvas.add(iText);
          });
      }
    });

    socket.on('allGeometry',function(data){
      if(data) {
          data.forEach(function (x) {
              addGeometryToCanvas(x);
          });
      }
    });

    socket.on('allImage',function(data){
        if(data){
            data.forEach(function (x) {
                canvasData.imgData.push(x);
                addUsers(x);
                fabric.Image.fromURL(x.url, function (img) {
                    img.set(x).setCoords();
                    canvas.add(img);
                });
            });
        }
    });

    //监听其他用户画完path
    socket.on('addPath',function(data){
        canvasData.pathData.push(data);
        addUsers(data);
        canvas.add(new fabric.Path(data.path,data));
    });

    socket.on('addText',function(data){
        canvasData.textData.push(data);
        addUsers(data);
        var iText = new fabric.IText(data.text,data);
        setITextFire(iText,$scope);
        canvas.add(iText);
    });

    socket.on('addGeometry', function (data) {
        addGeometryToCanvas(data);
    });

    socket.on('addImage', function (data) {
        canvasData.imgData.push(data);
        fabric.Image.fromURL(data.url, function (image) {
            image.set(data).setCoords();
            canvas.add(image);
        });
    });

    socket.on('addVideo', function (data) {
        var parent = document.createElement('div');
        var videoEl = document.createElement('video');
        videoEl.setAttribute('src',data.url);
        videoEl.setAttribute('style','display:none');
        videoEl.setAttribute('width',"480");
        videoEl.setAttribute('height',"240");
        parent.appendChild(videoEl);
        var video = new fabric.Image(videoEl,data);
        canvas.add(video);
        fabric.util.requestAnimFrame(function render() {
            canvas.renderAll();
            fabric.util.requestAnimFrame(render);
        });
    });

    socket.on('userJoined',function(data){
        console.log(data.userName+' has joined in this room');
        console.log('now there\'re '+data.numUsers+' participants')
    });

    socket.on('userLeft', function (data) {
       console.log(data.userName+' has left from this room');
       console.log('now there\'re '+data.numUsers+' participants');
    });
    //监听全部清除操作
    socket.on('clearAll',function(data){
        if(data == 'clearAll'){
            canvasData.pathData = [];
            canvas.clear();
        }
    });
    //监听清除选中操作
    socket.on('clearSelected',function(idArr){
        var myObjArr = Utils.cloneArray(canvas.getObjects());
        myObjArr.forEach(function(a){
            if(idArr.indexOf(a.id)!==-1){
                canvas.remove(a);
                if(a._element){
                    var el = a._element;
                    if(el.tagName === 'VIDEO'){
                        removeVideoEl(el);
                    }
                }
            }
        });
        for(var i =0;i<canvasData.pathData.length;i++) {
            if (idArr.indexOf(canvasData.pathData[i].id) !== -1) {
                canvasData.pathData.splice(i, 1);
                i--;
            }
        }
    });
    //监听单个path状态(旋转、放大、移动)改变操作
    socket.on('stateChange',function(data){
        canvas.deactivateAll();
        var myObjArr = Utils.cloneArray(canvas.getObjects());
        myObjArr.forEach(function(a){
            if(a.id === data.id){
                for(var prop in data){
                    a.set(prop,data[prop]);
                }
                a.selectable = true;
                a.hasControls = true;
                a.setCoords();
                canvas.renderAll();
            }
        });
    });
    //监听angular监控的style变化
    socket.on('styleChange', function (data) {
        var myObjArr = Utils.cloneArray(canvas.getObjects());
        myObjArr.forEach(function (a) {
            if (a.id === data.id) {
                a[data.styleName] = data.value;
                a.setCoords();
                canvas.renderAll();
            }
        });
    });

    //监听angular监控的属性（字体大小、类型等）变化
    socket.on('propChange', function (data) {
        var myObjArr = Utils.cloneArray(canvas.getObjects());
        myObjArr.forEach(function (a) {
            if (a.id === data.id) {
                a.set(data.name,data.value).setCoords();
                //$scope.$digest();
                canvas.renderAll();
            }
        });
    });
    //监听成组obj状态改变操作
    socket.on('groupChange',function(group){
        var myObjArr = Utils.cloneArray(canvas.getObjects());
        var selectObjs = [];
        myObjArr.forEach(function(a){
            if(group.idArr.indexOf(a.id) !== -1){
                a.selectable = true;
                a.hasControls = true;
                a.setCoords();
                //console.log(a.id+' has unlocked');
                selectObjs.push(a);
            }
        });
        var opt ={};
        opt.top = group.top;
        opt.left =group.left;
        opt.angle=group.angle;
        opt.scaleX = group.scaleX;
        opt.scaleY = group.scaleY;
        var objGroup = new fabric.Group(selectObjs,opt);
        canvas.setActiveGroup(objGroup);
        objGroup.setObjectsCoords();
        canvas.renderAll();
        canvas.discardActiveGroup() ;
    });
    //监听其他用户操作对象时锁定该对象
    socket.on('lockState', function (data) {
        var myObjArr = Utils.cloneArray(canvas.getObjects());
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
    socket.on('canvasBgColor', function (value) {
        canvas.backgroundColor = value;
        canvas.renderAll();
    })
}

function httpOpt($scope){
    $scope.saveFile = function () {
        var fileName = _('filename').value;
        canvasData.fileName = fileName;
        var paramArr = Utils.urlParams(window.location.href);
        var id = paramArr['id'];
        if(id){
            canvasData.isSaveNew = false;
        }else{
            canvasData.isSaveNew = true;
        }
        Communication.saveFile(canvasData,function(data){
            console.log(data);
        });
    }
}

var canvasModule = angular.module('CanvasModule', []);
canvasModule.controller('CanvasCtrl', function($scope) {
    if(roomId) $scope.roomId = roomId;
    $scope.canvas = canvas;
    $scope.getActiveStyle = getActiveStyle;
    addAccessors($scope);
    addMyOwnAccessors($scope);
    initCanvasSocket($scope);
    watchCanvas($scope);
    httpOpt($scope);
});