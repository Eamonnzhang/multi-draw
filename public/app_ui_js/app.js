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

                var prop = mdUtils.capitalize($attrs.bindValueTo),
                    getter = 'get' + prop,
                    setter = 'set' + prop;

                $element.on('change keyup select', function () {
                    if(this.getAttribute('class')!=='share'&&this.getAttribute('class')!=='room'){
                        $scope[setter] && $scope[setter](this.value);
                        //this.previousSibling.innerHTML = this.value;
                    }
                });

                //初始化每个模型的监听器
                $scope.$watch($scope[getter], function (newVal) {
                //console.log($element[0]);
                    if($element[0].getAttribute('id') =='json-value'){
                        $element[0].innerHTML = newVal;
                    } else if($element[0].getAttribute('id') =='roomId'){
                        if(newVal == null)
                            $element[0].innerHTML = '<span class="glyphicon glyphicon-share"></span>&nbsp;分享画板';
                        else{
                            newVal = decodeURI(newVal);
                            $element[0].innerHTML = '房间：'+newVal;
                        }
                    } else if($element[0].getAttribute('id') =='fill'){
                        $element[0].style.background= newVal;
                    }else{
                        //$element[0].previousSibling.innerHTML = newVal;
                        $element.val(newVal);
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
