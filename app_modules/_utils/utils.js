/**
 * Created by Eamonn on 2015/10/16.
 */
exports.extend = function(sub,sup){
    var f = function(){};
    f.prototype = sup.prototype;
    sub.prototype = new f();
    sub.prototype.constructor = sub;
};