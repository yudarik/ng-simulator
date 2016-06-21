/**
 * Created by arikyudin on 31/05/16.
 */

(function () {
    'use strict';
    angular.module('Simulator.components')
        .component('examRemote', {
            bindings: {
                remote: '=',
                switch: '&',
                prev: '&',
                next: '&'
            },
            transclude: true,
            controller: examRemoteCtrl,
            template: [
                '<div class="panel exam-remote">',
                    '<div class="panel-body">',
                        '<div class="exam-nav buttons">',
                        '<button class="btn btn-info remote-btn-small"',
                        'ng-class="{active: res.active, answered: res.userAnswer}" ',
                        'ng-repeat="res in $ctrl.remote track by $index"',
                        'ng-click="$ctrl.navigateToQuestion(res)">',
                        '{{res.index}}',
                        '</button>',
                        '</div>',
                        '<div class="arrows">',
                            '<button id="remote-prev" class="btn btn-danger" ng-click="$ctrl.prev()"><i class="fa fa-arrow-left" aria-invisible="true"></i></button>',
                            '<button class="btn btn-warning invisible"><i class="fa fa-arrow-right" aria-invisible="true"></i></button>',
                            '<button id="remote-next" class="btn btn-danger" ng-click="$ctrl.next()"><i class="fa fa-arrow-right" aria-invisible="true"></i></button>',
                        '</div>',
                    '</div>',
                '</div>'].join('')
        });

    function examRemoteCtrl () {

        this.navigateToQuestion = (question) => {
            this.switch({question: question});
        };
    }
})();