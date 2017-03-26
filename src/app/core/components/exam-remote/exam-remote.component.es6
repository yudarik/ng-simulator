/**
 * Created by arikyudin on 31/05/16.
 */

(function () {
    'use strict';
    angular.module('Simulator.components')
        .component('examRemote', {
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
            template: `<div class="panel exam-remote" ng-class="{'solution':$ctrl.isSolution}">
                            <div class="panel-body">
                                <div class="exam-nav buttons">
                                    <button class="btn btn-info remote-btn-small"
                                    ng-repeat="question in $ctrl.remoteMap track by $index"
                                    ng-class="{'active': question.active, 'answered': question.chosenAns,
                                    'incorrect': question.correctAns > -1 && question.chosenAns !== question.correctAns}"
                                    ng-click="$ctrl.navigateToQuestion(question)">
                                    {{question.index + 1}}
                                    </button>
                                </div>
                                <div class="arrows">
                                    <div class="nav">
                                        <button id="remote-prev" class="btn btn-default pull-right" ng-click="$ctrl.onPrev()"><i class="fa fa-arrow-left" aria-invisible="true"></i></button>
                                        <button class="btn btn-warning invisible"><i class="fa fa-arrow-right" aria-invisible="true"></i></button>
                                        <button id="remote-next" class="btn btn-default pull-left" ng-click="$ctrl.onNext()"><i class="fa fa-arrow-right" aria-invisible="true"></i></button>
                                    </div>
                                    <div class="finish">
                                        <button class="btn btn-success col-md-12 finishExam" ng-if="!$ctrl.isSolution" ng-disabled="!$ctrl.isFinishEnabled()" ng-click="$ctrl.submit()">{{::'EXAMS.BUTTONS.FINISH'|translate}}</button>
                                        <button class="btn btn-success col-md-12" ng-click="$ctrl.onReturn()">{{::'EXAMS.BUTTONS.RETURN'|translate}}</button>
                                        <a class="btn btn-success col-md-12 pull-left xs-hiden export" ng-if="$ctrl.showSavePracticeButton()" target="_blank"
                                            ng-href="DownloadPracticeHTMLFile?practiceID={{$ctrl.practiceId}}""
                                            tooltip="{{::'EXAMS.BUTTONS.DOWNLOAD'|translate}}" tooltip-placement="top">
                                            <i class="fa fa-download" aria-hidden="true"></i>&nbsp;{{::'EXAMS.BUTTONS.DOWNLOAD'|translate}}
                                        </a>
                                    </div>
                                </div>

                            </div>
                        </div>`,
            controller: function ($scope, simulator_config) {
                'ngInject';

                    this.config = simulator_config;

                    this.navigateToQuestion = (question) => {
                        this.onSwitch({question: question});
                    };

                    this.isFinishEnabled = () => {
                        return _.every(this.remoteMap, item => {
                            return (typeof item.chosenAns !== 'undefined') && (item.chosenAns !== null) && (item.chosenAns !== '');
                        });
                    };

                    this.submit = () => {

                        console.log('Finish clicked');
                        return this.onFinish();
                        //$scope.$emit('finish-exam');
                    };

                    this.showSavePracticeButton = () => {
                        return this.isSolution && this.config.showSavePracticeButton;
                    };
                }

        });
})();