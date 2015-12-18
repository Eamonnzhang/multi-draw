/**
 * Created by Eamonn on 2015/8/28.
 */

(function(global) {

    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function pad(str, length) {
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    }

    var getRandomInt = fabric.util.getRandomInt;
    function getRandomColor() {
        return (
            pad(getRandomInt(0, 255).toString(16), 2) +
            pad(getRandomInt(0, 255).toString(16), 2) +
            pad(getRandomInt(0, 255).toString(16), 2)
        );
    }

    function getRandomNum(min, max) {
        return Math.random() * (max - min) + min;
    }

    function getRandomLeftTop() {
        //var offset = 50;
        return {
            left: fabric.util.getRandomInt(0, 200),
            top: fabric.util.getRandomInt(0 , 200)
        };
    }

    var supportsInputOfType = function(type) {
        return function() {
            var el = document.createElement('input');
            try {
                el.type = type;
            }
            catch(err) { }
            return el.type === type;
        };
    };

    var supportsSlider = supportsInputOfType('range'),
        supportsColorpicker = supportsInputOfType('color');

    global.getRandomNum = getRandomNum;
    global.getRandomInt = getRandomInt;
    global.getRandomColor = getRandomColor;
    global.getRandomLeftTop = getRandomLeftTop;
    global.supportsSlider = supportsSlider;
    global.supportsColorpicker = supportsColorpicker;
    global.capitalize = capitalize;

})(this);

var mdUtils = {

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

}

var mdCanvas = {
    /**
     * clone an Array deeply
     * @param o_arr
     * @returns {Blob|ArrayBuffer|Array.<T>|string|*}
     */
    clone : function(o_arr){
        return o_arr.slice(0);
    },

    /**
     * serialize an Object to transport
     * @param obj
     * @returns {*}
     */
    toObject : function (obj) {
        var s_obj = obj.toObject();
        if(s_obj.type === 'group'){
            obj.type = 'group';
            return obj;
        }
        s_obj.id = mdUtils.generateId(8,32);
        s_obj.userId = userId;
        s_obj.userName = userName;
        s_obj.createTime = new Date();
        s_obj.lastModify = s_obj.createTime;
        return s_obj;
    },

    /**
     * get an Object or a group of objects 's state to transport
     * @param obj
     * @returns {{}}
     */
    toState : function (obj) {
        var state= {};
        state.top = obj.top;
        state.left = obj.left;
        state.angle = obj.angle;
        state.scaleX = obj.scaleX;
        state.scaleY = obj.scaleY;
        if(obj.type === 'group'){
            var objArr = [];
            var idArr = [];
            obj._objects.forEach(function(x){
                var o = {
                    id : x.id,
                    left : x.left,
                    top : x.top
                };
                objArr.push(o);
                idArr.push(x.id);
            });
            state.objArr = objArr;
            state.idArr = idArr;
            state.width = obj.width;
            state.height = obj.height;
        }else{
            state.id = obj.id;
        }
        return state;
    },

    /**
     * packageObj the new object that make it be the same with the transport object
     * @param c_obj
     * @param s_obj
     */
    packageObj : function (c_obj,s_obj) {
        c_obj.id = s_obj.id;
        c_obj.userId = s_obj.userId;
        c_obj.userName = s_obj.userName;
        c_obj.createTime = s_obj.createTime;
        c_obj.lastModify = s_obj.lastModify;
    },

    /**
     * add an object to the assign canvas;
     * @param canvas
     * @param obj is the return of toObject();
     */
    add : function (canvas,obj,isNew,callback) {
        var fObj;
        switch (obj.type){
            case 'circle':
                fObj = new fabric.Circle(obj);
                break;
            case 'triangle':
                fObj = new fabric.Triangle(obj);
                break;
            case 'rect':
                fObj = new fabric.Rect(obj);
                break;
            case 'line':
                fObj = new fabric.Line([obj.x1,obj.y1,obj.x2,obj.y2],obj);
                break;
            case 'path':
                fObj = new fabric.Path(obj.path, obj);
                break;
            case 'i-text':
                fObj =  new fabric.IText(obj.text, obj);
                break;
            case 'image':
                var url = obj.src;
                this.addUrl(canvas,url,obj);
                break;
            default :
                alert('当前canvas不支持添加此对象！');
        }
        if(isNew){
            var sObj = this.toObject(fObj);
            this.packageObj(fObj,sObj);
            callback&&callback(sObj,fObj);
            canvas.add(fObj);
            return;
        }
        fObj&&canvas.add(fObj)&&callback&&callback(fObj);
    },

    /**
     * add url to the assign canvas and return the added obj for transport
     * @param canvas
     * @param url
     * @returns {*}
     */
    addUrl : function (canvas,url,props,isNew,callback) {
        var urlType = mdUtils.getDataUrlType(url);
        var sObj ;
        if(urlType === 'image'){
            fabric.Image.fromURL(url, mdUtils.bind(this,function(image) {
                image.set(props).setCoords();
                if(isNew){
                    sObj = this.toObject(image);
                    this.packageObj(image,sObj);
                    callback&&callback(sObj);
                }
                canvas.add(image);
            }));
        }
        if(urlType === 'video'){
            var parent = document.createElement('div');
            var videoEl = document.createElement('video');
            videoEl.setAttribute('src',url);
            videoEl.setAttribute('style','display:none');
            videoEl.setAttribute('width',"480");
            videoEl.setAttribute('height',"240");
            parent.appendChild(videoEl);
            var video = new fabric.Image(videoEl,props);
            if(isNew){
                sObj = this.toObject(video);
                this.packageObj(video,sObj);
                callback&&callback(sObj);
            }
            canvas.add(video);
            fabric.util.requestAnimFrame(function render() {
                canvas.renderAll();
                fabric.util.requestAnimFrame(render);
            });
        }

    },

    /**
     * remove the active(selected) objects
     * @param canvas
     * @param activeObj
     * @param callback
     */
    remove : function (canvas,activeObj,callback) {
        var idArr = [];
        if(activeObj._objects){
            activeObj.forEachObject(function (a) {
                idArr.push(a.id);
            });
            var objectsInGroup = activeObj.getObjects();
            canvas.discardActiveGroup();
            objectsInGroup.forEach(function (object) {
                canvas.remove(object);
            });
        }else{
            idArr.push(activeObj.id);
            canvas.remove(activeObj);
        }
        callback&&callback(idArr);
    }

}
