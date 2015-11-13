var SerializeShapes = function(){
};

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

SerializeShapes.prototype.prepareSerializePosShapes = function (obj) {
    var opt = this.prepareSerialize(obj);
    opt.left = obj.left;
    opt.top = obj.top;
    return opt;
};

SerializeShapes.prototype.prepareState = function (obj) {
    var opt = {};
    opt.top = obj.top;
    opt.left = obj.left;
    opt.angle = obj.angle;
    opt.scaleX = obj.scaleX;
    opt.scaleY = obj.scaleY;
    return opt;
};

SerializeShapes.prototype.serializeSingleState = function(obj){
    var opt = this.prepareState(obj);
    opt.id = obj.id;
    return opt;
};

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

SerializeShapes.prototype.serializeText = function(obj){
    var opt = this.prepareSerializePosShapes(obj);
    opt.text = obj.text;
    opt.fontFamily = obj.fontFamily;
    opt.fontWeight = obj.fontWeight;
    //opt.hasRotatingPoint = obj.hasRotatingPoint;
    //opt.centerTransform = obj.centerTransform;
    return opt;
};

SerializeShapes.prototype.serializeCircle = function(obj){
    var opt = this.prepareSerializePosShapes(obj);
    opt.radius = obj.radius;
    opt.type = "circle";
    return opt;
};

SerializeShapes.prototype.serializeRect = function(obj){
    var opt = this.prepareSerializePosShapes(obj);
    opt.width = obj.width;
    opt.height = obj.height;
    opt.type = "rect";
    return opt;
};

SerializeShapes.prototype.serializeTriangle = function(obj){
    var opt = this.prepareSerializePosShapes(obj);
    opt.width = obj.width;
    opt.height = obj.height;
    opt.type = "triangle";
    return opt;
};

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

//SerializeShapes.prototype.serializePolygon = function(obj){
//    var opt = this.prepareSerializePosShapes(obj);
//    opt.points = obj.points;
//    return opt;
//};

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
