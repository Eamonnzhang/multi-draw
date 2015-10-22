var SerializeShapes = function(){


};

SerializeShapes.prototype.prepareSerialize = function () {

};

SerializeShapes.prototype.serializePath = function(data){
    var option={};
    option.id = Utils.generateId(8,32);;
    option.userId = userId;
    option.userName = userName;
    option.createTime = new Date();
    option.lastModify = option.createTime;
    option.path = data.path;
    option.stroke = data.stroke;
    option.strokeWidth = data.strokeWidth;
    option.strokeLineCap = data.strokeLineCap;
    option.strokeLineJoin = data.strokeLineJoin;
    option.originX = data.originX;
    option.originY = data.originY;
    option.fill = data.fill;
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

SerializeShapes.prototype.serializeCircle = function(){

};