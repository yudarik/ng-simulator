'use strict';

/**
 * Created by arikyudin on 31/05/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components').component('examRemote', {
        /**ngInject*/
        bindings: {
            remoteMap: '=',
            isSolution: '=',
            onSwitch: '&',
            onPrev: '&',
            onNext: '&',
            onFinish: '&',
            onReturn: '&',
            practiceId: '='
        },
        template: '<div class="panel exam-remote" ng-class="{\'solution\':$ctrl.isSolution}">\n                            <div class="panel-body">\n                                <div class="exam-nav buttons">\n                                    <button class="btn btn-info remote-btn-small"\n                                    ng-repeat="question in $ctrl.remoteMap track by $index"\n                                    ng-class="{\'active\': question.active, \'answered\': question.chosenAns,\n                                    \'incorrect\': question.correctAns > -1 && question.chosenAns !== question.correctAns}"\n                                    ng-click="$ctrl.navigateToQuestion(question)">\n                                    {{question.index + 1}}\n                                    </button>\n                                </div>\n                                <div class="arrows">\n                                    <div class="nav">\n                                        <button id="remote-prev" class="btn btn-default pull-right" ng-click="$ctrl.onPrev()"><i class="fa fa-arrow-left" aria-invisible="true"></i></button>\n                                        <button class="btn btn-warning invisible"><i class="fa fa-arrow-right" aria-invisible="true"></i></button>\n                                        <button id="remote-next" class="btn btn-default pull-left" ng-click="$ctrl.onNext()"><i class="fa fa-arrow-right" aria-invisible="true"></i></button>\n                                    </div>\n                                    <div class="finish">\n                                        <button class="btn btn-success col-md-12 finishExam" ng-if="!$ctrl.isSolution" ng-disabled="!$ctrl.isFinishEnabled()" ng-click="$ctrl.submit()">{{::\'EXAMS.BUTTONS.FINISH\'|translate}}</button>\n                                        <button class="btn btn-success col-md-12" ng-click="$ctrl.onReturn()" style="font-size: 14px">{{::\'EXAMS.BUTTONS.RETURN\'|translate}}</button>\n                                        <a class="btn btn-success col-md-12 pull-left xs-hiden export" ng-if="$ctrl.showSavePracticeButton()" target="_blank"\n                                            ng-href="DownloadPracticeHTMLFile?practiceID={{$ctrl.practiceId}}""\n                                            tooltip="{{::\'EXAMS.BUTTONS.DOWNLOAD\'|translate}}" tooltip-placement="top">\n                                            <i class="fa fa-download" aria-hidden="true"></i>&nbsp;{{::\'EXAMS.BUTTONS.DOWNLOAD\'|translate}}\n                                        </a>\n                                    </div>\n                                </div>\n\n                            </div>\n                        </div>',
        controller: ["$scope", "simulator_config", function ($scope, simulator_config) {
            'ngInject';

            var _this = this;

            this.config = simulator_config;

            this.navigateToQuestion = function (question) {
                _this.onSwitch({ question: question });
            };

            this.isFinishEnabled = function () {
                return _.every(_this.remoteMap, function (item) {
                    return typeof item.chosenAns !== 'undefined' && item.chosenAns !== null && item.chosenAns !== '';
                });
            };

            this.submit = function () {

                console.log('Finish clicked');
                return _this.onFinish();
                //$scope.$emit('finish-exam');
            };

            this.showSavePracticeButton = function () {
                return _this.isSolution && _this.config.showSavePracticeButton;
            };
        }]

    });
})();