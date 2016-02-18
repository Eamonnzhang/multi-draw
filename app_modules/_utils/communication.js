var http = require('http');
var config = require('../../config.json');
exports.syncope = function (postData, method, path, reqType, resType, next) {
    var reqBodyStr, headers, options, internalReq;
    //准备post的数据
    reqBodyStr = JSON.stringify(postData);

    headers = {
        "Content-Type":(reqType) ? reqType : 'application/json;charset=utf-8',
        "Accept": (resType) ? resType : "application/json"
    };
    options = {
        host: (config.UMBHost[config.runMode].split(":"))[0],
        port: (config.UMBHost[config.runMode].split(":"))[1],
        path: path,
        method: (method) ? method : 'get',
        headers: headers
    };
	//fzfz
	console.log(options);
    internalReq = http.request(options, function (newRes) {
        newRes.setEncoding('utf-8');
        var responseString = '';
        newRes.on('data', function (data) {
            responseString += data;
        });
        newRes.on('end', function () {
            try {
                console.log(responseString);
                //res.setHeader("Content-Type", (resType) ? resType : "application/json");
                //res.send(responseString);
                if (next){
                    next(JSON.parse(responseString));
                }
            }catch (e){
                //res.send('error');
                next('error');
            }

        });
    });
    internalReq.on('error', function (e) {
        console.log('e');
    });
    if (method==='post'){
        internalReq.write(reqBodyStr);
    }
    internalReq.end();
};