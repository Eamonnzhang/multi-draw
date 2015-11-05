var canvasData = {};
canvasData.pathData = [];
canvasData.usersId = [];

function getActiveStyle(styleName, object) {
  object = object || canvas.getActiveObject();
  if (!object) return '';

  return (object.getSelectionStyles && object.isEditing)
    ? (object.getSelectionStyles()[styleName] || '')
    : (object[styleName] || '');
}

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

  object.setCoords();
  canvas.renderAll();
}

function getActiveProp(name) {
  var object = canvas.getActiveObject();
  if (!object) return '';

  return object[name] || '';
}

function setActiveProp(name, value) {
  var object = canvas.getActiveObject();
  if (!object) return;

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
      console.log('setFill');
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
    canvas.backgroundColor = value;
    canvas.renderAll();
  };

  $scope.addRect = function() {
    var coord = getRandomLeftTop();

    canvas.add(new fabric.Rect({
      left: coord.left,
      top: coord.top,
      fill: '#' + getRandomColor(),
      width: 50,
      height: 50,
      opacity: 0.8
    }));
  };

  $scope.addCircle = function() {
    var coord = getRandomLeftTop();

    canvas.add(new fabric.Circle({
      left: coord.left,
      top: coord.top,
      fill: '#' + getRandomColor(),
      radius: 50,
      opacity: 0.8
    }));
  };

  $scope.addTriangle = function() {
    var coord = getRandomLeftTop();

    canvas.add(new fabric.Triangle({
      left: coord.left,
      top: coord.top,
      fill: '#' + getRandomColor(),
      width: 50,
      height: 50,
      opacity: 0.8
    }));
  };

  $scope.addLine = function() {
    var coord = getRandomLeftTop();

    canvas.add(new fabric.Line([ 50, 100, 200, 200], {
      left: coord.left,
      top: coord.top,
      stroke: '#' + 000000
    }));
  };

  $scope.addPolygon = function() {
    var coord = getRandomLeftTop();

    this.canvas.add(new fabric.Polygon([
      {x: 185, y: 0},
      {x: 250, y: 100},
      {x: 385, y: 170},
      {x: 0, y: 245} ], {
        left: coord.left,
        top: coord.top,
        fill: '#' + getRandomColor()
      }));
  };

  $scope.addText = function() {
    var text = '点击编辑文字';

    var textSample = new fabric.Text(text, {
      left: getRandomInt(0, 200),
      top: getRandomInt(0, 200),
      fontFamily: 'helvetica',
      angle: getRandomInt(0, 0),
      fill: '#' + getRandomColor(),
      scaleX: 0.5,
      scaleY: 0.5,
      fontWeight: '',
      originX: 'left',
      hasRotatingPoint: true,
      centerTransform: true
    });

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
      })
      .setCoords();

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

  function addImage(imageName, minScale, maxScale) {
    var coord = getRandomLeftTop();

    fabric.Image.fromURL('../images/' + imageName, function(image) {

      image.set({
        left: coord.left,
        top: coord.top,
        angle: getRandomInt(-10, 10)
      })
      .scale(getRandomNum(minScale, maxScale))
      .setCoords();

      canvas.add(image);
    });
  };

  $scope.addImage1 = function() {
    addImage('logo.png', 1, 0.5);
  };

  //$scope.addImage2 = function() {
  //  addImage('logo.png', 0.1, 1);
  //};
  //
  //$scope.addImage3 = function() {
  //  addImage('printio.png', 0.5, 0.75);
  //};

  $scope.confirmClear = function() {
    if (confirm('Are you sure?')) {
      socket.emit('clearAll','clearAll',function(){
        canvasData.pathData = [];
        canvas.clear();
      });
    }
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

  //$scope.rasterizeJSON = function() {
  //  $scope.setConsoleJSON(JSON.stringify(canvas));
  //};

  $scope.getSelected = function() {
    return canvas.getActiveObject();
  };

  $scope.removeSelected = function() {
      var activeObject = canvas.getActiveObject(),
          activeGroup = canvas.getActiveGroup();
      var idArr = [];
      if (activeObject) {
          idArr.push(activeObject.id);
      }
      if (activeGroup) {
          activeGroup.forEachObject(function (a) {
              idArr.push(a.id);
          });
      }
      socket.emit('clearSelected', idArr, function () {
          if (activeGroup) {
              var objectsInGroup = activeGroup.getObjects();
              canvas.discardActiveGroup();
              objectsInGroup.forEach(function (object) {
                  canvas.remove(object);
              });
          }
          else if (activeObject) {
              canvas.remove(activeObject);
          }
      });
  }

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

    var iText2 = new fabric.IText('These are\nEnglish\nwords', {
      left: 400,
      top: 150,
      fontFamily: 'Helvetica',
      fill: '#333333',
      styles: {
        0: {
          0: { fill: 'red' },
          1: { fill: 'red' },
          2: { fill: 'red' }
        },
        2: {
          0: { fill: 'blue' },
          1: { fill: 'blue' },
          2: { fill: 'blue' },
          3: { fill: 'blue' }
        }
      }
    });

    canvas.add(iText, iText2);
  }

  //addTexts();


  $scope.getFreeDrawingMode = function() {
    return canvas.isDrawingMode;
  };
  $scope.setFreeDrawingMode = function(value) {
    canvas.isDrawingMode = !!value;
    $scope.$$phase || $scope.$digest();
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

function watchCanvas($scope) {
    var isMouseDown = false;

    function updateScope() {
        $scope.$$phase || $scope.$digest();
        canvas.renderAll();
    }

    function addPath(e){
        updateScope();
        var path = e.path;
        var data = SerializeShapes.serializePath(path);
        path.id = data.id;
        canvasData.pathData.push(data);
        if(canvasData.usersId.indexOf(data.userId) === -1){
            canvasData.usersId.push(data.userId);
        }
        //console.log(canvasData);
        socket.emit('path', data);

    }
    function changeState(e){
        if(isMouseDown){
            isMouseDown = !isMouseDown;
            var obj = e.target;
            if(obj){
                if(canvas.getActiveObject()){
                    //console.log(obj.top+','+obj.left);
                    var data =SerializeShapes.serializePathState(obj);
                    socket.emit('stateChange',data);
                    //socket.emit('unlockState',obj.id);
                }
                if(canvas.getActiveGroup()){
                    var group = SerializeShapes.serializeGroupOfPath(canvas.getActiveGroup());
                    socket.emit('groupChange',group);
                    //socket.emit('unlockState',group.idArr);
                }
            }
        }
    }
    function listenMouseDown(e){
        console.log(e);
        var obj = e.target;
        if(obj){
            if(obj._objects){
                if(obj._objects[0].selectable){
                    var idArr = [];
                    obj._objects.forEach(function (a) {
                        idArr.push(a.id);
                    });
                    console.log('send group lock');
                    socket.emit('lockState',idArr);
                }
            }else if(obj.selectable){
                console.log('send lock');
                socket.emit('lockState',obj.id);
            }
        }
        isMouseDown = true;
    }

    canvas
    .on('object:selected', updateScope)
    .on('group:selected', updateScope)
    .on('path:created', addPath)
    .on('mouse:up', changeState)
    .on('mouse:down', listenMouseDown)
    .on('selection:cleared', updateScope);
}



function initCanvasSocket(){
    var userInfo = {};
    userInfo.roomId = roomId;
    userInfo.userId = apiKey;
    userInfo.userName = userName;
    socket.emit('room', userInfo);
    //监听在后台已经存在的path
    socket.on('allPath',function(data){
    if(data[roomId]){
        data[roomId].forEach(function(x){
            canvasData.pathData.push(x);
            if(canvasData.usersId.indexOf(x.userId) === -1){
                canvasData.usersId.push(x.userId);
            }
            canvas.add(new fabric.Path(x.path,x));
          });
        }
    });
    //监听其他用户画完path
    socket.on('path',function(data){
        canvasData.pathData.push(data);
        if(canvasData.usersId.indexOf(data.userId) === -1){
            canvasData.usersId.push(data.userId);
        }
        console.log(canvasData);
        canvas.add(new fabric.Path(data.path,data));
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
            }
        });
        for(var i =0;i<canvasData.pathData.length;i++) {
            if (idArr.indexOf(canvasData.pathData[i].id) !== -1) {
                canvasData.pathData.splice(i, 1);
                i--;
            }
        }
    });
    //监听单个path状态改变操作
    socket.on('stateChange',function(data){
        canvas.deactivateAll();
        var myObjArr = Utils.cloneArray(canvas.getObjects());
        myObjArr.forEach(function(a){
            if(a.id === data.id){
                a.setTop(data.top);
                a.setLeft(data.left);
                a.setAngle(data.angle);
                a.setScaleX(data.scaleX);
                a.setScaleY(data.scaleY);
                a.selectable = true;
                a.hasControls = true;
                a.setCoords();
                console.log(a.id+'has unlocked');
                canvas.renderAll();
            }
        });
    });
    //监听成组path状态改变操作
    socket.on('groupChange',function(group){
        var myObjArr = Utils.cloneArray(canvas.getObjects());
        var selectObjs = [];
        myObjArr.forEach(function(a){
            if(group.idArr.indexOf(a.id) !== -1){
                a.selectable = true;
                a.hasControls = true;
                a.setCoords();
                console.log(a.id+' has unlocked');
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
                    console.log(a);
                    console.log('locked');
                }
            });
        }else{
           myObjArr.forEach(function (a) {
                //canvas.remove(object);
                if(data.indexOf(a.id)!== -1){
                    a.selectable = false;
                    a.hasControls = false;
                    a.setCoords();
                    console.log(a.id+'locked');
                }
            });
        }
        canvas.renderAll();
    });
}

function httpOpt($scope){
    $scope.saveFile = function () {
        var fileName = _('filename').value;
        canvasData.fileName = fileName;
        //canvasData.ceateUserName = userName;
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
    $scope.roomId = roomId;
    $scope.canvas = canvas;
    $scope.getActiveStyle = getActiveStyle;
    addAccessors($scope);
    initCanvasSocket();
    watchCanvas($scope);
    httpOpt($scope);
});