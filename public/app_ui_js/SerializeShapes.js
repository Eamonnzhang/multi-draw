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

SerializeShapes.prototype.serializeState = function(obj){
    var opt={};
    opt.id = obj.id;
    opt.top= obj.top;
    opt.left = obj.left;
    opt.angle = obj.angle;
    opt.scaleX = obj.scaleX;
    opt.scaleY = obj.scaleY;
    return opt;
};

SerializeShapes.prototype.serializePath = function(obj){
    var opt=this.prepareSerialize(obj);
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
    opt.stroke = obj.stroke;
    opt.type = "line";
    return opt;
};

//SerializeShapes.prototype.serializePolygon = function(obj){
//    var opt = this.prepareSerializePosShapes(obj);
//    opt.points = obj.points;
//    return opt;
//};



SerializeShapes.prototype.serializeGroupOfPath = function(group){
    var obj={};
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
    obj.top = group.top;
    obj.left = group.left;
    obj.angle= group.angle;
    obj.scaleX = group.scaleX;
    obj.scaleY = group.scaleY;
    obj.width = group.width;
    obj.height = group.height;
    return obj;
};
