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
            controller: function($interval) {

                this.totalTimeframe = this.timeframe;

                this.progress = 0;

                $interval(()=>{

                    if (this.progress < this.totalTimeframe) {
                        this.progress++;
                    }
                    if (this.timeframe > 0) {
                        this.timeframe--;
                    }
                }, 1000)
            },
            template: [
                '<div class="exam-timeframe">',
                '   <div class="">',
                '         <uib-progressbar value="$ctrl.progress" type="success" max="$ctrl.totalTimeframe"><span class="text-danger">{{$ctrl.timeframe|timeframe}}</span></uib-progressbar>',
                '   </div>',
                '</div>'
            ].join('')
        })
})();