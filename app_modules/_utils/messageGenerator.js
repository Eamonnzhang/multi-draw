/**
 * Created by DISI on 17.07.2015.
 */


var messageType = {
    SYS_ERR: 'sys_err'
};

var BasicMessage =   function (isSuccess, type, message, data) {
    this.success = isSuccess;
    this.type = type;
    this.msg = message;
    this.data = data;
};

exports.genSimpSuccessMsg = function(message, value){
    return new BasicMessage(true, null, message, value);
};
exports.genSimpFailedMsg = function(message, value){
    return new BasicMessage(false, null, message, value);
};

exports.genSysErrMsg = function(errMsg){
    return new BasicMessage(false, messageType.SYS_ERR, errMsg.message, null);
};

