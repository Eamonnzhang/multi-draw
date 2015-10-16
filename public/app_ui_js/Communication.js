/**
 * Created by Eamonn on 2015/10/15.
 */

var Communication = function(){

};

Communication.prototype.genQueryStrFromObj = function (obj, isWithQuestMark) {
    var parts = [], queryStr = "";
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
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

Communication.prototype.savaData = function(data,next){
    console.log(data);
  new mxXmlRequest('/save',this.genQueryStrFromObj(data,false),'post',true).send(function(req){
      //console.log(req);
      next();
  })
};

Communication.prototype.deleteData = function(){

};