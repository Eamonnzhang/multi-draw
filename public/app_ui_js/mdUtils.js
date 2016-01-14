/**
 * Created by Eamonn on 2015/8/28.
 */
var mdUtils = {
    getRandomInt : function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    getRandomColor :function () {
        return (
            this.pad(this.getRandomInt(0, 255).toString(16), 2) +
            this.pad(this.getRandomInt(0, 255).toString(16), 2) +
            this.pad(this.getRandomInt(0, 255).toString(16), 2)
        );
    },

    getRandomNum: function (min, max) {
        return Math.random() * (max - min) + min;
    },

    getRandomLeftTop: function () {
        return {
            left: this.getRandomInt(200, 500),
            top:  this.getRandomInt(150 , 300)
        };
    },

    capitalize:  function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    pad: function (str, length) {
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    },

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
    },

    getKeyPressValue : function (KeyPressCb,KeyUpCb) {
        var ie;
        document.all ? ie=true : ie=false;
        document.onkeydown = KeyPress;
        document.onkeyup = KeyUp;
        var keyValue = "";

        function KeyPress(){
            var key;
            if (ie)
                key = event.keyCode;
            else
                key = KeyPress.arguments[0].keyCode;
            switch (key) {
                case 17 :
                    keyValue = 'ctrl';
                    break;
                default :
                    keyValue = 'null';
            }
            KeyPressCb(keyValue);
        }

        function KeyUp(event){
            var key;
            if (ie)
                key = event.keyCode;
            else
                key = KeyUp.arguments[0].keyCode;
            switch (key) {
                case 17 :
                    keyValue = 'ctrl';
                    break;
                default :
                    keyValue = 'null';
            }
            KeyUpCb(keyValue);
        }
    },

    showAlert: function(message,size,type,showWay){
        var alertDialog = $('#alertModal');
        alertDialog.find('p').html(message);
        alertDialog.find('#size').removeClass();
        alertDialog.find('#size').addClass('modal-dialog modal-'+size);
        alertDialog.find('#type').removeClass();
        alertDialog.find('#type').addClass('alert alert-'+type);
        alertDialog.modal(showWay);
    },

    closeAlert: function(){
        $('#alertModal').modal('hide');
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
    toObject : function (obj,includeDefaultValues,propsInclude) {
        obj.hasOwnProperty('isDrawingMode') ?  obj.includeDefaultValues = false : obj.set('includeDefaultValues',includeDefaultValues);
        var base = ['itemId','canvasId','skewX','skewY'];
        var propsArray = propsInclude ? propsInclude.concat(base) : base;
        return obj.toObject(propsArray);
    },

    /**
     * get an Object or a group of objects 's state prop
     * @param obj
     * @returns {[]}
     */
    toState : function (obj) {
        var state= {};
        var items = [];
        state.top = obj.top;
        state.left = obj.left;
        state.angle = obj.angle;
        state.scaleX = obj.scaleX;
        state.scaleY = obj.scaleY;
        state.skewX = obj.skewX;
        state.skewY = obj.skewY;
        if(obj._objects){
            var objs = obj._objects;
            objs.forEach(function(obj){
                var matrix = obj.calcTransformMatrix(),
                    options = fabric.util.qrDecompose(matrix);
                var item = {
                    itemId : obj.itemId,
                    left : options.translateX,
                    top : options.translateY,
                    scaleX : options.scaleX,
                    scaleY : options.scaleY,
                    skewX : options.skewX,
                    skewY : options.skewY,
                    angle : options.angle
                };
                items.push(item);
            })
        }else{
            state.itemId = obj.itemId;
            items.push(state);
        }
        return items;
    },

    /**
     * packageObj the new object that make it be the same with the transport object
     * @param c_obj
     * @param s_obj
     */
    packageObj : function (c_obj) {
        c_obj.canvasId = canvas.id;
        c_obj.itemId = mdUtils.generateId(8,32);
    },

    /**
     * get object by id,maybe I will improve this function in future that can get Object by more conditions
     * @param canvas
     * @param id
     * @param callback
     */
    getObject : function (canvas,id,callback) {
        canvas.getObjects().forEach(function (x) {
            if(x.itemId === itemId){
                callback&&callback(x);
            }
        });
    },

    /**
     * add an object to the assign canvas;
     * @param canvas
     * @param obj is the return of toObject();
     */
    add : function (canvas,obj,callback) {
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
                this.addUrl(canvas, url, function (urlObj) {
                    urlObj.set(obj).setCoords();
                });
                break;
            default :
                alert('当前canvas不支持添加此对象！');
        }
        if(fObj){
            callback&&callback(fObj);
            canvas.add(fObj);
        }
    },

    /**
     * add url to the assign canvas and return the added obj for transport
     * @param canvas
     * @param url
     * @returns {*}
     */
    addUrl : function (canvas,url,callback) {
        var urlType = mdUtils.getDataUrlType(url);
        if(urlType === 'image'){
            fabric.Image.fromURL(url, mdUtils.bind(this,function(image) {
                callback(image);
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
            var video = new fabric.Image(videoEl);
            callback(video);
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
     */
    remove : function (canvas,activeObj) {
        var idArr = [];
        if(activeObj._objects){
            activeObj.forEachObject(function (a) {
                idArr.push(a.itemId);
            });
            var objectsInGroup = activeObj.getObjects();
            canvas.discardActiveGroup();
            objectsInGroup.forEach(function (object) {
                if(object._element&&object._element.tagName === 'VIDEO'){
                    if(!object._element.paused) object._element.pause();
                    console.log('delete video in group');
                }
                canvas.remove(object);
            });
        }else{
            idArr.push(activeObj.itemId);
            if(activeObj._element&&activeObj._element.tagName === 'VIDEO'){
                if(!activeObj._element.paused) activeObj._element.pause();
                console.log('delete a video');
            }
            canvas.remove(activeObj);
        }
        return idArr;
    },

    activeAll : function (canvas) {
        canvas.setActiveGroup(new fabric.Group(canvas.getObjects()));
    },

    isActiveObjectExist : function (canvas) {
        return canvas.getActiveObject()||canvas.getActiveGroup();
    },

    getSelectedItemId : function (canvas,objs) {
        var ids = [];
        if(objs._objects){
            objs._objects.forEach(function (obj) {
                ids.push(obj.itemId);
            })
        }else{
            ids.push(objs.itemId);
        }
        return ids;
    }

}

