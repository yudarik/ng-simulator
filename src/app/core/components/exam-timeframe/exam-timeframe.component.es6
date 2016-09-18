/**
 * Created by arikyudin on 19/06/16.
 */

(function () {
    'use strict';
    angular.module('Simulator.components')
        .component('examTimeframe', {
            bindings: {
                timeframe: '='
            },
            /** @ngInject */
            controller: function($scope, $interval) {

                var timeInterval;

                this.totalTimeframe = angular.copy(this.timeframe);

                this.progress = 0;

                if (this.totalTimeframe) {
                    timeInterval = $interval(()=>{

                        if (this.progress < this.totalTimeframe) {
                            this.progress++;
                        }
                        if (this.timeframe > 0) {
                            this.timeframe--;
                        } else {
                            $scope.$root.$broadcast('timeOver', {
                                totalTimeSecs: this.totalTimeframe,
                                elapsedTimeSecs: this.progress
                            });
                            $interval.cancel(timeInterval);
                        }
                    }, 1000);
                }

                $scope.$on('$destroy', function(){
                    $interval.cancel(timeInterval);
                })
            },
            template: [
                '<div class="exam-timeframe" ng-if="$ctrl.totalTimeframe">',
                '   <div class="">',
                '         <uib-progressbar value="$ctrl.progress" type="success" max="$ctrl.totalTimeframe"><span class="text-danger">{{$ctrl.timeframe|timeframe}}</span></uib-progressbar>',
                '   </div>',
                '</div>'
            ].join('')
        })
})();