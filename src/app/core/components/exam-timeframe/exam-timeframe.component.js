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

                this.progress = this.timeframe / 100;
                $interval(()=>{

                    this.progress += this.progress;

                    this.timeframe--;
                }, 1000)
            },
            template: [
                '<div class="panel exam-timeframe">',
                '   <div class="panel-body">',
                '       <div class="row">',
                '           <div class="col-md-12">',
                '               <div class="progress">',
                '                   <div class="progress-bar progress-bar-success progress-bar-striped active" role="progressbar"',
                '                        aria-valuenow="{{$ctrl.progress}}" aria-valuemin="0" aria-valuemax="100" style="width:70%">',
                '                       <span class="">{{$ctrl.timeframe|date:"HH:mm:ss"}}</span>',
                '                   </div>',
                '               </div>',
                '           </div>',
                '       </div>',
                '   </div>',
                '</div>'
            ].join('')
        })
})();