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
        $scope[setter] && $scope[setter](this.value);
        this.previousSibling.innerHTML = this.value;
      });

      $scope.$watch($scope[getter], function(newVal) {
        if ($element[0].type === 'radio') {
          var radioGroup = document.getElementsByName($element[0].name);
          for (var i = 0, len = radioGroup.length; i < len; i++) {
            radioGroup[i].checked = radioGroup[i].value === newVal;
          }
        } else{
          if(newVal == null){
              $element[0].innerHTML = '<span class="glyphicon glyphicon-share"></span>&nbsp;分享';
              $element[0].setAttribute('class','share');
              //console.log($element[0]);
          }else if(!$element[0].type&&newVal){
              $element[0].innerHTML = '房间：'+newVal;
              $element[0].setAttribute('class','room');
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