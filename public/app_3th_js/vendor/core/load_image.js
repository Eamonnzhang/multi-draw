;(function($, undefined){
  'use strict';

  // Provides this syntax:
  //
  //   $(img).loadImage(someUrl);
  //
  $.fn.loadImage = function(newSrc) {
    var img = this,
        promise = $.Deferred();

    var successCallback = function(){
      img.unbind('load',  successCallback);
      img.unbind('error', failureCallback);
      promise.resolve(img);
    }

    var failureCallback = function(){
      img.unbind('load',  successCallback);
      img.unbind('error', failureCallback);
      promise.reject(img);
    }

    img.bind('error', failureCallback);
    img.bind('load',  successCallback);

    img.attr('src', newSrc);

    // If the url is is cached and loaded,
    // call the callback by hand.
    //
    if (img[0].complete || img[0].readyState) {
      successCallback();
    }

    // Return the promise
    //
    return promise;
  }

  // Provides two additional syntaxes:
  //
  //   $.loadImage(imgEl, someUrl);
  //   $.loadImage(someUrl);
  //
  $.loadImage = function(img, newSrc) {
    if ($.type(newSrc) == 'undefined') {
      var newSrc = img,
          img = $('<img />');
    } else {
      var img = $(img);
    }
    return img.loadImage(newSrc);
  }

}(jQuery));
