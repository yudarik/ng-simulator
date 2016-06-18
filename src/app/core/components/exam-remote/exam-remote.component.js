/**
 * Created by arikyudin on 31/05/16.
 */

(function () {
    'use strict';
    angular.module('Simulator.components')
        .component('examRemote', {
            bindings: {
                exam: '=',
                switch: '&'
            },
            controller: examRemoteCtrl,
            template: [
                '<div class="panel exam-remote">',
                    '<div class="panel-body">',
                        '<span class="circle badge label-default" ',
                        'ng-class="{active: res.active, answered: res.userAnswer}" ',
                        'ng-repeat="res in $ctrl.exam track by $index"',
                        'ng-click="$ctrl.navigateToQuestion(res)">',
                        '{{res.index}}',
                        '</span>',
                    '</div>',
                '</div>'].join('')
        });

    function examRemoteCtrl () {
        this.examRes = this.exam;

        this.navigateToQuestion = (question) => {
            this.switch({question: question});
        };
    }
})();