'use strict';

/**
 * Created by arikyudin on 19/06/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components').component('examTimeframe', {
        bindings: {
            timeframe: '='
        },
        /** @ngInject */
        controller: ["$scope", "$interval", function ($scope, $interval) {
            var _this = this;

            var timeInterval;

            this.totalTimeframe = angular.copy(this.timeframe);

            this.progress = 0;

            if (this.totalTimeframe) {
                timeInterval = $interval(function () {

                    if (_this.progress < _this.totalTimeframe) {
                        _this.progress++;
                    }
                    if (_this.timeframe > 0) {
                        _this.timeframe--;
                    } else {
                        $scope.$root.$broadcast('timeOver', {
                            totalTimeSecs: _this.totalTimeframe,
                            elapsedTimeSecs: _this.progress
                        });
                        $interval.cancel(timeInterval);
                    }
                }, 1000);
            }

            $scope.$on('$destroy', function () {
                $interval.cancel(timeInterval);
            });
        }],
        template: ['<div class="exam-timeframe" ng-if="$ctrl.totalTimeframe">', '   <div class="">', '         <uib-progressbar value="$ctrl.totalTimeframe - $ctrl.progress" type="success" max="$ctrl.totalTimeframe"><span class="text-danger">{{$ctrl.timeframe|timeframe}}</span></uib-progressbar>', '   </div>', '</div>'].join('')
    });
})();