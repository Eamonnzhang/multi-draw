var app = angular.module('app', ['CanvasModule']);

app.config(function($interpolateProvider) {
  $interpolateProvider
    .startSymbol('{[')
    .endSymbol(']}');
});

app.directive('bindValueTo', function() {
  return {
    restrict: 'A',

    link: function ($scope, $element, $attrs) {

      var prop = capitalize($attrs.bindValueTo),
          getter = 'get' + prop,
          setter = 'set' + prop;

      $element.on('change keyup select', function() {
         if(this.getAttribute('class')!=='share'&&this.getAttribute('class')!=='room'){
            $scope[setter] && $scope[setter](this.value);
            this.previousSibling.innerHTML = this.value;
         }
      });

      $scope.$watch($scope[getter], function(newVal) {
        if ($element[0].type === 'radio') {
          var radioGroup = document.getElementsByName($element[0].name);
          for (var i = 0, len = radioGroup.length; i < len; i++) {
            radioGroup[i].checked = radioGroup[i].value === newVal;
          }
        } else{
          if(newVal == null){
              $element[0].innerHTML = '<span class="glyphicon glyphicon-share"></span>&nbsp;分享画板';
              $element[0].setAttribute('class','share');
              //$element[0].setAttribute('data-target','#collapseShareRoom');
              $('#roomId').popover({
                  //title:"起一个房间名让大家更容易找到你哦~",
                  content:"正在紧急修复中呢~",
                  //template:'<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>',
                  placement:"bottom",
                  trigger:'focus'
              });
              $('#roomId').collapse();
          }else if(!$element[0].type&&newVal){
              $element[0].innerHTML = '房间：'+newVal;
              $element[0].setAttribute('class','room');
              $element[0].onclick = function () {

              };
              $('#roomId').popover({
                  //title:"房间用户",
                  content:"正在紧急修复中呢~",
                  placement:"bottom",
                  trigger:'focus'
              });

          } else{
              $element[0].previousSibling.innerHTML = newVal;
              $element.val(newVal);
          }
        }
      });
    }
  };
});


app.directive('objectButtonsEnabled', function() {
  return {
    restrict: 'A',

    link: function ($scope, $element, $attrs) {
      $scope.$watch($attrs.objectButtonsEnabled, function(newVal) {
        $($element).find('.btn-object-action')
          .prop('disabled', !newVal);
      });
    }
  };
});