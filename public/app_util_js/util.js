/**
 * Created by Eamonn on 2015/8/28.
 */

var Utils = {

    addCookie : function (name, value, expiresHours) {
        var cookieString = name + "=" + escape(value);
        if (expiresHours > 0) {
            var date = new Date();
            date.setTime(date.getTime + expiresHours * 3600 * 1000);
            cookieString = cookieString + "; expires=" + date.toGMTString();
        }
        document.cookie = cookieString;
    },
    getCookie : function (name) {
        var strCookie = document.cookie;
        var arrCookie = strCookie.split("; ");
        for (var i = 0; i < arrCookie.length; i++) {
            var arr = arrCookie[i].split("=");
            if (arr[0] == name) {
                return arr[1];
            }
        }
        return "";

    },

    deleteCookie : function (name) {
        var date = new Date();
        date.setTime(date.getTime() - 10000);
        document.cookie = name + "=v; expires=" + date.toGMTString();
    },

    urlParams : function (url) {
        var result = new Object();
        var idx = url.lastIndexOf('?');
        if (idx > 0) {
            var params = url.substring(idx + 1).split('&');
            for (var i = 0; i < params.length; i++) {
                idx = params[i].indexOf('=');
                if (idx > 0) {
                    result[params[i].substring(0, idx)] = params[i].substring(idx + 1);
                }
            }
        }
        return result;
    },

    generateId : function (len, radix) {
        var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        Math.uuid = function (len, radix) {
            var chars = CHARS, uuid = [], i;
            radix = radix || chars.length;
            if (len) {
                for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
            } else {
                var r;
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                uuid[14] = '4';
                for (i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                        r = 0 | Math.random() * 16;
                        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }
            return uuid.join('');
        };
        return Math.uuid(len, radix);
    },

    bind:function(scope, funct) {
        return function()
        {
            return funct.apply(scope, arguments);
        };
    },

    cloneArray : function(o_arr){
        return o_arr.slice(0);
    },

    convertJSONToQueryStr: function (obj, isWithQuestMark) {
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
    },

    getDataUrlType : function (url) {
        return url.substring(5,url.indexOf('/'));
    }
};
