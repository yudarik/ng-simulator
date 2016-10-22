/**
 * Created by arikyudin on 21/06/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components')
        .component('exam', {
            /**ngInject*/
            bindings: {
                questions: '=',
                timeframe: '<',
                type: '<'
            },
            template: `<div class="panel question-area col-xs-12" ng-show="$ctrl.questionInDisplay">
                           <div class="panel-body">
                               <exam-question question="$ctrl.questionInDisplay"></exam-question>
                           </div>
                       </div>
                       <exam-remote remote-map="$ctrl.questions" class="remote-component" on-switch="$ctrl.switchQuestion(question)" on-prev="$ctrl.move(-1)" on-next="$ctrl.move(1)" on-finish="$ctrl.finishExam()"></exam-remote>
                       <exam-timeframe timeframe="$ctrl.timeframe"></exam-timeframe>`,
            controller: function ($scope, $uibModal, $interval, examService, simulatorService, simulator_config) {
                'ngInject';

                var ping;

                var submitExam = () => {

                    console.log('Submit Exam clicked');

                    var questionIDtoChosenAnswerMapping = {};

                    this.questions.forEach(question => {
                        questionIDtoChosenAnswerMapping[question.questionID] = getUserAnswer(question);
                    });

                    let practiseResult = {
                        practiceType: this.type,
                        predefinedExamId: "0",
                        totalTimeSecs: this.totalTimeFrame,
                        elapsedTimeSecs: this.totalTimeFrame - this.timeframe,
                        questionIDtoChosenAnswerMapping: questionIDtoChosenAnswerMapping
                    };

                    return examService.submitExam(practiseResult);
                };

                var keydownEventHandler = (event) => {

                    console.log('Key pressed');

                    if (!event) return;

                    event.stopPropagation();
                    switch (event.which) {
                        case 37:
                            this.prevBtn.click();
                            break;
                        case 39:
                            this.nextBtn.click();
                            break;
                        case 49:
                        case 50:
                        case 51:
                        case 52:
                        case 53:
                        case 54:
                            this.numPadKeys(event.which);
                            break;

                        default: return;
                    }
                    event.preventDefault();
                };

                function getUserAnswer(question) {
                    var chosenAns = (typeof question.chosenAns !== 'undefined')? question.chosenAns : getRandomAnswer(question);
                    return parseInt(chosenAns);
                }

                function getRandomAnswer(question) {
                    let random = Math.floor(Math.random() * question.answerOptions.length);
                    return question.answerOptions[random].key;
                }

                function timeframeModal($uibModal) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        template: [ '<div class="panel"><div class="panel-body">',
                            '<h3 class="text-center">{{::"EXAMS.EXAM_FINISH_ARE_YOU_SURE"|translate}}</h3>',
                            '<br/>',
                            '<br/>',
                            '<p class="text-center ">',
                            '<button class="btn btn-success btn-space" ng-click="ok()">אישור</button>',
                            '<button class="btn btn-default" ng-click="cancel()">ביטול</button>',
                            '</p>',
                            '</div></div>'].join(''),
                        controller: function ($uibModalInstance, $scope) {
                            $scope.ok = function () {
                                $uibModalInstance.close();
                            };

                            $scope.cancel = function () {
                                $uibModalInstance.dismiss('cancel');
                            };
                        },
                        size: 'small'
                    });

                    return modalInstance.result;
                }

                this.init = () =>{

                    var answerArray = [];

                    for (var i=1; i <= simulator_config.answersPerQuestionNumber; i++) {
                        answerArray.push(`ans${i}`);
                    }

                    _.forEach(this.questions, (question, index) => {

                        _.assign(question, {
                            index: index,
                            active: false,
                            answerOptions: []
                        });

                        _.forEach(_.pick(question, answerArray), (value, key) => {
                            if (value) {
                                question.answerOptions.push({
                                    key: parseInt(key.replace('ans','')),
                                    value: value
                                });
                            }
                        });
                    });

                    ping = $interval(()=>{
                        simulatorService.ping();
                    }, 10000);
                };

                this.init();

                this.totalTimeFrame = angular.copy(this.timeframe);
                this.questionInDisplay = this.questions[0];
                this.questionInDisplay.active = true;

                this.switchQuestion = (question) => {

                    if (!question) {
                        return;
                    }

                    this.questionInDisplay.active = !this.questionInDisplay.active;
                    this.questionInDisplay = question;
                    this.questionInDisplay.active = !this.questionInDisplay.active;
                };

                this.move = (count) =>{
                    this.switchQuestion(_.find(this.questions, {index: this.questionInDisplay.index + count}));
                };

                this.finishExam = () => {

                    console.log('FinishExam reached');

                    if (this.timeframe > 10) {
                        timeframeModal($uibModal).then(()=>{
                            submitExam();
                        }, ()=> {
                            //dismiss
                        });
                    } else {
                        submitExam();
                    }
                };

                this.prevBtn = $('#remote-prev');
                this.nextBtn = $('#remote-next');
                this.numPadKeys = (keyNumber) => {
                    $scope.$broadcast('numKeyPadSelect', {answer: keyNumber - 48});
                };

                $(document).keydown(keydownEventHandler);

                $scope.$on('timeOver', this.finishExam);
                $scope.$on('$destroy', ()=>{
                    $interval.cancel(ping);
                    $(document).off('keydown', keydownEventHandler)
                });
            }
        });

})();