/**
 * Created by arikyudin on 19/06/16.
 */

(function () {
    'use strict';
    angular.module('Simulator.components')
        .component('examTimeframe', {
            bindings: {
                timeframe: '=',
                timeprogress: '='
            },
            /** @ngInject */
            controller: function($scope, $interval) {

                var timeInterval;

                this.totalTimeframe = angular.copy(this.timeframe);

                this.timeprogress = 0;

                this.startTimer = () => {
                    timeInterval = $interval(() => {

                        if (this.timeprogress < this.totalTimeframe || this.totalTimeframe < 0) {
                            this.timeprogress++;
                        }
                        if (this.timeframe > 0) {
                            this.timeframe--;
                        } else if (this.totalTimeframe > 0) {
                            $scope.$root.$broadcast('timeOver', {
                                totalTimeSecs: this.totalTimeframe,
                                elapsedTimeSecs: this.timeprogress
                            });
                            $interval.cancel(timeInterval);
                        }
                    } , 1000);
                };

                this.getValue = () => {
                    return 100*(this.totalTimeframe - this.timeprogress)/this.totalTimeframe;
                };

                this.getType = () => {
                    if (this.totalTimeframe < 0) {
                        return 'success'
                    }
                    
                    if (this.getValue() < 25) {
                        return 'danger';
                    } else if (this.getValue() < 50) {
                        return 'warning';
                    } else return 'success';
                };
                
                this.getTimeValue = () => {
                    if (this.totalTimeframe < 0) {
                        return this.timeprogress;
                    }
                    return this.timeframe;
                }

                this.$onInit = () => {

                    if (this.totalTimeframe) {
                        this.startTimer();
                    }
                };

                $scope.$on('$destroy', () => {
                    $interval.cancel(timeInterval);
                });

                $scope.$on('pause-exam-timer', () => {
                    $interval.cancel(timeInterval);
                });

                $scope.$on('resume-exam-timer', () => {
                    this.$onInit();
                });
            },
            template: [
                '<div class="exam-timeframe" ng-if="$ctrl.totalTimeframe">',
                '   <div class="animate">',
                '         <uib-progressbar class="progress-striped active" value="$ctrl.getValue()" type="{{$ctrl.getType()}}"><span class="text-danger">{{$ctrl.getTimeValue()|timeframe}}</span></uib-progressbar>',
                '   </div>',
                '</div>'
            ].join('')
        })
})();