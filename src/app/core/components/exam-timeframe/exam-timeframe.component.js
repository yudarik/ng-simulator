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

            this.startTimer = function () {
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
            };

            this.getValue = function () {
                return 100 * (_this.totalTimeframe - _this.progress) / _this.totalTimeframe;
            };

            this.getType = function () {
                if (_this.getValue() < 25) {
                    return 'danger';
                } else if (_this.getValue() < 50) {
                    return 'warning';
                } else return 'success';
            };

            this.$onInit = function () {

                if (_this.totalTimeframe) {
                    _this.startTimer();
                }
            };

            $scope.$on('$destroy', function () {
                $interval.cancel(timeInterval);
            });

            $scope.$on('pause-exam-timer', function () {
                $interval.cancel(timeInterval);
            });

            $scope.$on('resume-exam-timer', function () {
                _this.$onInit();
            });
        }],
        template: ['<div class="exam-timeframe" ng-if="$ctrl.totalTimeframe">', '   <div class="animate">', '         <uib-progressbar class="progress-striped active" value="$ctrl.getValue()" type="{{$ctrl.getType()}}"><span class="text-danger">{{$ctrl.timeframe|timeframe}}</span></uib-progressbar>', '   </div>', '</div>'].join('')
    });
})();