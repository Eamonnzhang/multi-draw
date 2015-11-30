var SerializeShapes = function(){
};

//每个对象序列化都必须的属性
SerializeShapes.prototype.prepareSerialize = function (obj) {
    var option={};
    option.id = Utils.generateId(8,32);
    option.userId = userId;
    option.userName = userName;
    option.createTime = new Date();
    option.lastModify = option.createTime;
    option.fill = obj.fill;
    //option.opacity = obj.opacity;
    return option;
};

//具有位置属性的对象序列化都必须的信息
SerializeShapes.prototype.prepareSerializePosShapes = function (obj) {
    var opt = this.prepareSerialize(obj);
    opt.left = obj.left;
    opt.top = obj.top;
    return opt;
};

//序列化都必需的状态
SerializeShapes.prototype.prepareState = function (obj) {
    var opt = {};
    opt.top = obj.top;
    opt.left = obj.left;
    opt.angle = obj.angle;
    opt.scaleX = obj.scaleX;
    opt.scaleY = obj.scaleY;
    return opt;
};

//序列化单个对象的状态
SerializeShapes.prototype.serializeSingleState = function(obj){
    var opt = this.prepareState(obj);
    opt.id = obj.id;
    return opt;
};

//序列化多个对象（成组）的状态
SerializeShapes.prototype.serializeGroupState = function(group){
    var obj = this.prepareState(group);
    var objArr = [];
    var idArr = [];
    group.forEachObject(function(x){
        var path = {
            id : x.id,
            left : x.left,
            top : x.top
        };
        objArr.push(path);
        idArr.push(x.id);
    });
    obj.objArr = objArr;
    obj.idArr = idArr;
    obj.width = group.width;
    obj.height = group.height;
    return obj;
};

//序列化笔画
SerializeShapes.prototype.serializePath = function(obj){
    var opt = this.prepareSerialize(obj);
    opt.path = obj.path;
    opt.stroke = obj.stroke;
    opt.originX = obj.originX;
    opt.originY = obj.originY;
    opt.strokeWidth = obj.strokeWidth;
    opt.strokeLineCap = obj.strokeLineCap;
    opt.strokeLineJoin = obj.strokeLineJoin;
    return opt;
};

//序列化文字
SerializeShapes.prototype.serializeText = function(obj){
    var opt = this.prepareSerializePosShapes(obj);
    opt.text = obj.text;
    opt.fontFamily = obj.fontFamily;
    opt.fontWeight = obj.fontWeight;
    //opt.hasRotatingPoint = obj.hasRotatingPoint;
    //opt.centerTransform = obj.centerTransform;
    return opt;
};

//序列化圆形
SerializeShapes.prototype.serializeCircle = function(obj){
    var opt = this.prepareSerializePosShapes(obj);
    opt.radius = obj.radius;
    opt.type = "circle";
    return opt;
};

//序列化矩形
SerializeShapes.prototype.serializeRect = function(obj){
    var opt = this.prepareSerializePosShapes(obj);
    opt.width = obj.width;
    opt.height = obj.height;
    opt.type = "rect";
    return opt;
};

//序列化三角形
SerializeShapes.prototype.serializeTriangle = function(obj){
    var opt = this.prepareSerializePosShapes(obj);
    opt.width = obj.width;
    opt.height = obj.height;
    opt.type = "triangle";
    return opt;
};

//序列化直线
SerializeShapes.prototype.serializeLine = function(obj){
    var opt = this.prepareSerializePosShapes(obj);
    opt.x1 = obj.x1;
    opt.x2 = obj.x2;
    opt.y1 = obj.y1;
    opt.y2 = obj.y2;
    opt.stroke = obj.stroke;
    opt.type = "line";
    return opt;
};

//序列化图片
SerializeShapes.prototype.serializeImage = function(url,obj){
    var opt = this.prepareSerializePosShapes(obj);
    opt.scaleX = obj.scaleX;
    opt.scaleY = obj.scaleY;
    opt.url = url;
    return opt;
};

//SerializeShapes.prototype.serializePolygon = function(obj){
//    var opt = this.prepareSerializePosShapes(obj);
//    opt.points = obj.points;
//    return opt;
//};


