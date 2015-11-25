(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./lib/layout/js/main.js":[function(require,module,exports){
require('./_breakpoints.js');
require('./_gridalicious.js');
require('./_scrollable.js');
require('./_skins');
require('./_isotope');
require('./_parallax');

// Sidebar Percentage Sizes Demo
require('./_sidebar-pc');
},{"./_breakpoints.js":"/Code/html/themes/learning-1.1.0/lib/layout/js/_breakpoints.js","./_gridalicious.js":"/Code/html/themes/learning-1.1.0/lib/layout/js/_gridalicious.js","./_isotope":"/Code/html/themes/learning-1.1.0/lib/layout/js/_isotope.js","./_parallax":"/Code/html/themes/learning-1.1.0/lib/layout/js/_parallax.js","./_scrollable.js":"/Code/html/themes/learning-1.1.0/lib/layout/js/_scrollable.js","./_sidebar-pc":"/Code/html/themes/learning-1.1.0/lib/layout/js/_sidebar-pc.js","./_skins":"/Code/html/themes/learning-1.1.0/lib/layout/js/_skins.js"}],"/Code/html/themes/learning-1.1.0/lib/layout/js/_async.js":[function(require,module,exports){
function contentLoaded(win, fn) {

    var done = false, top = true,

        doc = win.document,
        root = doc.documentElement,
        modern = doc.addEventListener,

        add = modern ? 'addEventListener' : 'attachEvent',
        rem = modern ? 'removeEventListener' : 'detachEvent',
        pre = modern ? '' : 'on',

        init = function (e) {
            if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
            (e.type == 'load' ? win : doc)[ rem ](pre + e.type, init, false);
            if (! done && (done = true)) fn.call(win, e.type || e);
        },

        poll = function () {
            try {
                root.doScroll('left');
            } catch (e) {
                setTimeout(poll, 50);
                return;
            }
            init('poll');
        };

    if (doc.readyState == 'complete') fn.call(win, 'lazy');
    else {
        if (! modern && root.doScroll) {
            try {
                top = ! win.frameElement;
            } catch (e) {
            }
            if (top) poll();
        }
        doc[ add ](pre + 'DOMContentLoaded', init, false);
        doc[ add ](pre + 'readystatechange', init, false);
        win[ add ](pre + 'load', init, false);
    }
}

module.exports = function(urls, callback) {

    var asyncLoader = function (urls, callback) {

        urls.foreach(function (i, file) {
            loadCss(file);
        });

        // checking for a callback function
        if (typeof callback == 'function') {
            // calling the callback
            contentLoaded(window, callback);
        }
    };

    var loadCss = function (url) {
        var link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = url;
        document.getElementsByTagName('head')[ 0 ].appendChild(link);
    };

    // simple foreach implementation
    Array.prototype.foreach = function (callback) {
        for (var i = 0; i < this.length; i ++) {
            callback(i, this[ i ]);
        }
    };

    asyncLoader(urls, callback);

};
},{}],"/Code/html/themes/learning-1.1.0/lib/layout/js/_breakpoints.js":[function(require,module,exports){
(function ($) {

    $(window).setBreakpoints({
        distinct: true,
        breakpoints: [ 320, 480, 768, 1024 ]
    });

})(jQuery);
},{}],"/Code/html/themes/learning-1.1.0/lib/layout/js/_gridalicious.js":[function(require,module,exports){
(function ($) {
    "use strict";

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkGridalicious = function () {

        if (! this.length) return;

        this.gridalicious({
            gutter: this.data('gutter') || 15,
            width: this.data('width') || 370,
            selector: '> div',
            animationOptions: {
                complete: function () {
                    $(window).trigger('resize');
                }
            }
        });

    };

    $('[data-toggle*="gridalicious"]').each(function () {
        $(this).tkGridalicious();
    });

})(jQuery);
},{}],"/Code/html/themes/learning-1.1.0/lib/layout/js/_isotope.js":[function(require,module,exports){
(function ($) {
    "use strict";

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkIsotope = function () {

        if (! this.length) return;

        this.isotope({
            layoutMode: this.data('layoutMode') || "packery",
            itemSelector: '.item'
        });

        /*
        this.isotope('on', 'layoutComplete', function(){
            $(window).trigger('resize');
        });
        */

    };

    $(function(){

        setTimeout(function () {
            $('[data-toggle="isotope"]').each(function () {
                $(this).tkIsotope();
            });
        }, 300);

        $(document).on('domChanged', function(){
            $('[data-toggle="isotope"]').each(function(){
                $(this).isotope();
            });
        });

    });

})(jQuery);

},{}],"/Code/html/themes/learning-1.1.0/lib/layout/js/_parallax.js":[function(require,module,exports){
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license
(function () {
    var lastTime = 0;
    var vendors = [ 'ms', 'moz', 'webkit', 'o' ];
    for (var x = 0; x < vendors.length && ! window.requestAnimationFrame; ++ x) {
        window.requestAnimationFrame = window[ vendors[ x ] + 'RequestAnimationFrame' ];
        window.cancelAnimationFrame = window[ vendors[ x ] + 'CancelAnimationFrame' ] || window[ vendors[ x ] + 'CancelRequestAnimationFrame' ];
    }

    if (! window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (! window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());

(function ($, window) {
    "use strict";

    $.fn.tkParallax = function () {

        if (Modernizr.touch) return;

        var getOptions = function (e) {
            return {
                speed: e.data('speed') || 4,
                translate: e.data('speed') || true,
                translateWhen: e.data('translateWhen') || 'inViewportTop',
                autoOffset: e.data('autoOffset'),
                offset: e.data('offset') || 0,
                opacity: e.data('opacity')
            };
        };

        var $window = $(window),
            $windowContent = $('.st-content-inner'),
            $element = this;

        var ticking = false,
            $scrollable = null,
            lastScrollTop = 0;

        var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

        var requestTick = function (e) {
            if (! ticking) {
                $scrollable = $(e.currentTarget);
                // although Safari has support for requestAnimationFrame,
                // the animation in this case is choppy so we'll just run it directly
                if (isSafari) {
                    animate();
                } else {
                    window.requestAnimationFrame(animate);
                    ticking = true;
                }
            }
        };

        // Translates an element on the Y axis using translate3d to ensure
        // that the rendering is done by the GPU
        var translateY = function (elm, value) {
            var translate = 'translate3d(0px,' + value + 'px, 0px)';
            elm.style[ '-webkit-transform' ] = translate;
            elm.style[ '-moz-transform' ] = translate;
            elm.style[ '-ms-transform' ] = translate;
            elm.style[ '-o-transform' ] = translate;
            elm.style.transform = translate;
        };

        var layers = $element.find('.parallax-layer');

        var init = function () {
            layers.each(function () {

                var layer = $(this),
                    layerOptions = getOptions(layer),
                    height = $element.outerHeight(true);

                if (layerOptions.translate) {
                    if (layer.is('img') && layerOptions.autoOffset) {
                        $.loadImage(layer.attr('src')).done(function () {
                            layer.removeAttr('style');
                            var layerHeight = layer.height();
                            var offset = layerHeight * 0.33;
                            if ((offset + height) > layerHeight) {
                                offset = layerHeight - height;
                            }
                            offset = offset * - 1;
                            layer.attr('data-offset', offset);
                            translateY(layer.get(0), offset);
                        });
                    }
                }

            });
        };

        init();
        $(window).on("debouncedresize", init);

        var animate = function () {
            var scrollTop = parseInt($scrollable.scrollTop());
            var scrollableTop = $scrollable.is($window) ? 0 : $scrollable.offset().top;
            var height = $element.outerHeight(true);
            var bodyPadding = {
                top: parseInt($(document.body).css('padding-top')),
                bottom: parseInt($(document.body).css('padding-bottom'))
            };
            var windowHeight = $scrollable.innerHeight();
            var windowBottom = scrollTop + windowHeight - (bodyPadding.bottom + bodyPadding.top);
            var top = $element.offset().top - scrollableTop - bodyPadding.top;
            var bottom = top + height;
            var topAbs = Math.abs(top);
            var pos = top / windowHeight * 100;
            var opacityKey = height * 0.5;
            var when = {};

            /*
             * ONLY when the scrollable element IS NOT the window
             */

            // when the element is anywhere in viewport
            when.inViewport = (bottom > 0) && (top < windowHeight);

            // when the top of the viewport is crossing the element
            when.inViewportTop = (bottom > 0) && (top < 0);

            // when the bottom of the viewport is crossing the element
            when.inViewportBottom = (bottom > 0) && (top < windowHeight) && (bottom > windowHeight);

            /*
             * ONLY when the scrollable element IS the window
             */

            if ($scrollable.is($window)) {

                // when the window is scrollable and the element is completely in the viewport
                when.inWindowViewportFull = (top >= scrollTop) && (bottom <= windowBottom);

                when.inWindowViewport2 = (top >= scrollTop) && (top <= windowBottom);

                when.inWindowViewport3 = (bottom >= scrollTop) && (bottom <= windowBottom);

                when.inWindowViewport4 = (bottom >= scrollTop) && (bottom >= windowHeight) && (height > windowHeight);

                // when the window is scrollable and the top of the viewport is crossing the element
                when.inWindowViewportTop = ! when.inWindowViewport2 && (when.inWindowViewport3 || when.inWindowViewport4);

                // when the window is scrollable and the bottom of the viewport is crossing the element
                when.inWindowViewportBottom = when.inWindowViewport2 && ! when.inWindowViewport3;

                // when the window is scrollable and the element is anywhere in viewport
                when.inWindowViewport = when.inWindowViewportTop || when.inWindowViewportBottom || when.inWindowViewportFull;

                when.inViewport = when.inWindowViewport;
                when.inViewportTop = when.inWindowViewportTop;
                when.inViewportBottom = when.inWindowViewportBottom;

                pos = (top - scrollTop) / windowHeight * 100;
            }

            if (when.inViewportTop && when.inViewportBottom) {
                when.inViewportBottom = false;
            }

            if (! isNaN(scrollTop)) {
                layers.each(function () {

                    var layer = $(this);
                    var layerOptions = getOptions(layer);

                    var ty = (windowHeight + height) - bottom;

                    if ($scrollable.is($window)) {
                        ty = windowBottom - top;
                    }

                    if (layerOptions.translate) {

                        var layerPos = (- 1 * pos * layerOptions.speed) + layerOptions.offset;
                        var layerHeight = layer.height();

                        if (when.inViewport && ! when.inViewportTop && ! when.inViewportBottom) {
                            if (layer.is('img') && layerHeight > height) {
                                if ((Math.abs(layerPos) + height) > layerHeight) {
                                    layerPos = (layerHeight - height) * - 1;
                                }
                            }
                            if (! layer.is('img')) {
                                layerPos = 0;
                            }
                        }

                        if (when.inViewportTop && ((layer.is('img') && layerHeight == height) || ! layer.is('img') )) {
                            layerPos = Math.abs(layerPos);
                        }

                        if (when.inViewportBottom && ! layer.is('img')) {
                            layerPos = height - ty;

                            // scrolling up
                            if (scrollTop < lastScrollTop) {
                                layerPos = layerPos * - 1;
                            }
                        }

                        if (when.inViewport) {
                            layerPos = (layerPos).toFixed(5);
                            if (layerHeight > $window.height() && scrollTop <= 0) {
                                layerPos = 0;
                            }
                            translateY(layer.get(0), layerPos);
                        }

                    }

                    if (layerOptions.opacity) {

                        // fade in
                        if (when.inViewportBottom) {

                            var y, yP;

                            if ($scrollable.is($window)) {

                                y = ty;
                                yP = (y / height).toFixed(5);

                                if (y > opacityKey) {
                                    layer.css({opacity: yP});
                                }
                                else {
                                    layer.css({opacity: 0});
                                }
                            }
                            else {
                                if (bottom < (windowHeight + opacityKey)) {

                                    y = (windowHeight + opacityKey) - bottom;
                                    yP = (y / opacityKey).toFixed(5);

                                    layer.css({opacity: yP});
                                } else {
                                    layer.css({opacity: 0});
                                }
                            }
                        }

                        // fade out
                        else if (when.inViewportTop) {
                            var topOrigin = $scrollable.is($window) ? scrollTop - top : topAbs;
                            if (topOrigin > opacityKey) {
                                layer.css({
                                    'opacity': (1 - (topOrigin / height)).toFixed(5)
                                });
                            } else {
                                layer.css({'opacity': 1});
                            }
                        }

                        // reset
                        else {
                            layer.css({'opacity': 1});
                        }

                        if (when.inViewportBottom && scrollTop <= 0) {
                            layer.css({'opacity': 1});
                        }

                    }

                });

                lastScrollTop = scrollTop;
            }

            ticking = false;
        };

        if ($windowContent.length) {
            $windowContent.scroll(requestTick);
        } else {
            $window.scroll(requestTick);
        }

    };

    $('.parallax').each(function () {
        $(this).tkParallax();
    });

})(jQuery, window);
},{}],"/Code/html/themes/learning-1.1.0/lib/layout/js/_scrollable.js":[function(require,module,exports){
(function ($) {
    "use strict";

    var skin = require('./_skin')();

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkScrollable = function (options) {

        if (! this.length) return;

        var settings = $.extend({
            horizontal: false
        }, options);

        var nice = this.niceScroll({
            cursorborder: 0,
            cursorcolor: config.skins[ skin ][ 'primary-color' ],
            horizrailenabled: settings.horizontal
        });

        if (! settings.horizontal) return;

        var _super = nice.getContentSize;

        nice.getContentSize = function () {
            var page = _super.call(nice);
            page.h = nice.win.height();
            return page;
        };

    };

    $('[data-scrollable]').tkScrollable();

    $('[data-scrollable-h]').each(function () {

       $(this).tkScrollable({ horizontal: true });

    });

    var t;
    $(window).on('debouncedresize', function () {
        clearTimeout(t);
        t = setTimeout(function () {
            $('[data-scrollable], [data-scrollable-h]').getNiceScroll().resize();
        }, 100);
    });

}(jQuery));
},{"./_skin":"/Code/html/themes/learning-1.1.0/lib/layout/js/_skin.js"}],"/Code/html/themes/learning-1.1.0/lib/layout/js/_sidebar-pc.js":[function(require,module,exports){
(function ($) {
    "use strict";

    $.fn.tkSidebarSizePcDemo = function(){

        var t, spc_demo = this;

        if (! spc_demo.length) return;

        $(document)
            .on('sidebar.show', function(){
                $('#pc-open').prop('disabled', true);
            })
            .on('sidebar.hidden', function(){
                $('#pc-open').prop('disabled', false);
            });

        spc_demo.on('submit', function (e) {
            e.preventDefault();
            var s = $('.sidebar'), ve = $('#pc-value'), v = ve.val();
            ve.blur();
            if (! v.length || v < 25) {
                v = 25;
                ve.val(v);
            }
            s[ 0 ].className = s[ 0 ].className.replace(/sidebar-size-([\d]+)pc/ig, 'sidebar-size-' + v + 'pc');
            sidebar.open('sidebar-menu');
            clearTimeout(t);
            t = setTimeout(function () {
                sidebar.close('sidebar-menu');
            }, 5000);
        });

    };

    $('[data-toggle="sidebar-size-pc-demo"]').tkSidebarSizePcDemo();

})(jQuery);
},{}],"/Code/html/themes/learning-1.1.0/lib/layout/js/_skin.js":[function(require,module,exports){
module.exports = (function () {
    var skin = $.cookie('skin');

    if (typeof skin == 'undefined') {
        skin = 'default';
    }
    return skin;
});
},{}],"/Code/html/themes/learning-1.1.0/lib/layout/js/_skins.js":[function(require,module,exports){
var asyncLoader = require('./_async');

(function ($) {

    var changeSkin = function () {
        var skin = $.cookie("skin"),
            file = $.cookie("skin-file");
        if (typeof skin != 'undefined') {
            asyncLoader([ 'css/' + file + '.min.css' ], function () {
                $('[data-skin]').removeProp('disabled').parent().removeClass('loading');
            });
        }
    };

    $('[data-skin]').on('click', function () {

        if ($(this).prop('disabled')) return;

        $('[data-skin]').prop('disabled', true);

        $(this).parent().addClass('loading');

        $.cookie("skin", $(this).data('skin'));

        $.cookie("skin-file", $(this).data('file'));

        changeSkin();

    });

    var skin = $.cookie("skin");

    if (typeof skin != 'undefined' && skin != 'default') {
        changeSkin();
    }

})(jQuery);
},{"./_async":"/Code/html/themes/learning-1.1.0/lib/layout/js/_async.js"}]},{},["./lib/layout/js/main.js"]);
