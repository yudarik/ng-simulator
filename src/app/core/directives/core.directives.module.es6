/**
 * Created by arikyudin on 21/10/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.core.directives', []);


    angular.module('Simulator.core.directives')

    .directive('imageOnLoad', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                var fn = $parse(attrs.imageOnLoad);
                elem.on('load', function (event) {
                    scope.$apply(function() {
                        fn(scope, { $event: event });
                    });
                });
            }
        };
    }]);


})();