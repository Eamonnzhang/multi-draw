/**
 * Created by Eamonn on 2015/10/15.
 */

var Communication = function(){

};

Communication.prototype.sendAjaxRequest = function(requestType,url,data,dataType,suc_callback){
    $.ajax({
        type: requestType,
        url: url,
        data: data,
        dataType: dataType,
        success: suc_callback
    });
};

Communication.prototype.genQueryStrFromObj = function (obj, isWithQuestMark) {
    var parts = [], queryStr = "";
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if(obj[key] instanceof Array){
                if(obj[key][0] instanceof Object){
                    var objString = JSON.stringify(obj[key]);
                    obj[key] = objString;
                }
            }
            parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
        }
    }
    queryStr = parts.join('&');
    if (isWithQuestMark === undefined || isWithQuestMark) {
        queryStr = '?' + queryStr;
    }
    return queryStr;
};

Communication.prototype.genQueryStrFromObjs = function (obj, isWithQuestMark) {
    var parts = [], queryStr = "";
    for (var i = 0; i < obj.length; i++) {
        for (var key in obj[i]) {
            if (obj[i].hasOwnProperty(key)) {
                parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[i][key]));
            }
        }
        queryStr = parts.join('&');
    }
    if (isWithQuestMark === undefined || isWithQuestMark) {
        queryStr = '?' + queryStr;
    }
    return queryStr;
};

Communication.prototype.saveFile = function(data,next){
    this.sendAjaxRequest('POST','/saveFile',this.genQueryStrFromObj(data,false),'json',function(res){
        if(res.success)
            next(res);
    });
};


Communication.prototype.loadFile = function(data,next){
    this.sendAjaxRequest('GET','/loadFile'+ this.genQueryStrFromObj(data),null,'json',function(res){
            next(res);
    });
};