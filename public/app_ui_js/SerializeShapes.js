var SerializeShapes = function(){


};

SerializeShapes.prototype.prepareSerialize = function (obj) {
    var option={};
    option.id = Utils.generateId(8,32);
    option.userId = userId;
    option.userName = userName;
    option.createTime = new Date();
    option.lastModify = option.createTime;
    option.opacity = obj.opacity;
    option.fill = obj.fill;
    option.originX = obj.originX;
    option.originY = obj.originY;
    return option;
};

SerializeShapes.prototype.serializePath = function(obj){
    var opt=this.prepareSerialize(obj);
    opt.path = obj.path;
    opt.stroke = obj.stroke;
    opt.strokeWidth = obj.strokeWidth;
    opt.strokeLineCap = obj.strokeLineCap;
    opt.strokeLineJoin = obj.strokeLineJoin;
    return opt;
};

SerializeShapes.prototype.serializeText = function(obj){
    var opt = this.prepareSerialize(obj);
    opt.text = obj.text;
    opt.left = obj.left;
    opt.top = obj.top;
    opt.fontFamily = obj.fontFamily;
    opt.fontWeight = obj.fontWeight;
    opt.hasRotatingPoint = obj.hasRotatingPoint;
    opt.centerTransform = obj.centerTransform;
    return opt;
};

SerializeShapes.prototype.serializePathState = function(obj){
    var option={
        id : obj.id,
        top: obj.top,
        left:obj.left,
        angle:obj.angle,
        scaleX:obj.scaleX,
        scaleY:obj.scaleY
    };
    return option;
};

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
