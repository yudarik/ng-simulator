/**
 * Created by arikyudin on 21/06/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components')
        .component('exam', {
            /**ngInject*/
            bindings: {
                config: '<'
            },
            template: `<div class="panel question-area col-xs-12"
                            ng-class="{'solution':$ctrl.isSolution}"
                            ng-show="$ctrl.questionInDisplay">
                        <div class="panel-heading" ng-if="$ctrl.config.predefinedExamDisplayName"><h3>{{::$ctrl.config.predefinedExamDisplayName}}</h3></div>
                           <div class="panel-body">
                               <exam-question question="$ctrl.questionInDisplay"></exam-question>
                           </div>
                       </div>
                       <exam-remote practice-id="$ctrl.config.practiceID" remote-map="$ctrl.questions" is-solution="$ctrl.isSolution" class="remote-component" on-switch="$ctrl.switchQuestion(question)" on-prev="$ctrl.move(-1)" on-next="$ctrl.move(1)" on-finish="$ctrl.finishExam()" on-return="$ctrl.return()"></exam-remote>
                       <exam-timeframe timeframe="$ctrl.timeframe" timeprogress="$ctrl.timeprogress"></exam-timeframe>`,
            controller: function ($rootScope, $uibModal, $interval, $state, $translate, examService, simulatorService, baSidebarService, simulator_config) {
                'ngInject';

                var $scope = $rootScope.$new();

                this.timeframe = getTimeFrame(this.config);
                this.isSolution = !(this.timeframe);
                this.questions = (this.config)? this.config.questions : [];
                this.type = (this.config)? this.config.practiceType : undefined;

                var ping;

                var submitExam = () => {

                    var questionIDtoChosenAnswerMapping = {};

                    this.questions.forEach(question => {
                        questionIDtoChosenAnswerMapping[question.questionID] = getUserAnswer(question);
                    });

                    let practiseResult = {
                        practiceType: this.type,
                        originalPracticeId: this.config.originalPracticeId,
                        predefinedExamId: this.config.predefinedExamId || 0,
                        totalTimeSecs: this.totalTimeFrame,
                        elapsedTimeSecs: this.timeprogress, //this.totalTimeFrame - this.timeframe,
                        questionIDtoChosenAnswerMapping: questionIDtoChosenAnswerMapping
                    };

                    return examService.submitExam(practiseResult)
                        .then(()=>{
                            this.keepAlive('cancel');
                            this.deregisterKeyDown();
                        })
                        .catch(err => {
                            if (err.status && err.status === -1) {
                                this.displayLoginForm().then(res => {
                                    submitExam();
                                })
                            }
                        });
                };

                var keydownEventHandler = (event) => {

                    //console.log('Key pressed');

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

                this.deregisterKeyDown = () => {
                    $(document).off('keydown', keydownEventHandler);
                };

                this.init = () => {

                    if (!Array.isArray(this.questions) || !this.questions.length) {
                        alert($translate.instant('EXAMS.TOOLTIPS.PRACTICE_ERROR_NO_QUESTIONS'));

                        if ($rootScope.previousState) {
                            return $state.go(simulator_config.defaultState, {}, {emergencyExit: true});
                        }
                    }

                    if (!baSidebarService.isMenuCollapsed()) {
                        baSidebarService.toggleMenuCollapsed();
                    }

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

                    this.pingErrCounter = 0;

                    this.totalTimeFrame = angular.copy(this.timeframe);
                    this.timeprogress = 0;
                    this.questionInDisplay = this.questions[0];
                    this.questionInDisplay.active = true;

                    this.prevBtn = $('#remote-prev');
                    this.nextBtn = $('#remote-next');

                    $scope.$on('timeOver', this.finishExam);
                    $scope.$on('$destroy', ()=>{
                        this.keepAlive('cancel');
                        this.deregisterKeyDown();
                    });
                    $scope.$on('cancel-practice', () => this.deregisterKeyDown());
                    $scope.$on('resume-keepAlive', () => this.keepAlive());

                    this.keepAlive();
                };

                this.keepAlive = (cancel) => {

                    if (cancel) {
                        return $interval.cancel(ping);
                    }

                    ping = $interval(() => {
                        simulatorService.ping()
                            .then(() => {
                                this.pingErrCounter = 0;
                            })
                            .catch(err => {

                                this.pingErrCounter++;

                                if (this.pingErrCounter > 3 && $state.current.name !== 'signin') {
                                    $interval.cancel(ping);
                                    $scope.$root.$broadcast('pause-exam-timer');
                                    this.deregisterKeyDown();
                                    this.displayLoginForm().then((res) => {
                                        this.resumeExam();
                                        this.pingErrCounter = 0;
                                    });
                                }
                            });
                    }, 15000);
                };

                this.switchQuestion = (question) => {

                    if (!question) {
                        return;
                    }

                    this.questionInDisplay.active = !this.questionInDisplay.active;
                    this.questionInDisplay = question;
                    this.questionInDisplay.active = !this.questionInDisplay.active;
                };

                this.move = (count) => {
                    this.switchQuestion(_.find(this.questions, {index: this.questionInDisplay.index + count}));
                };

                this.finishExam = () => {

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

                this.return = () => {
                    this.keepAlive('cancel');

                    if (this.isSolution) {
                        examService.getPracticeInfo(this.config.practiceID).then(solution => {
                            $state.go('exams.practice-summary', {examSummary: solution});
                        });
                    } else {
                        $state.go(simulator_config.defaultState);
                    }
                };

                this.numPadKeys = (keyNumber) => {
                    $rootScope.$broadcast('numKeyPadSelect', {answer: keyNumber - 48});
                };

                $(document).keydown(keydownEventHandler);

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
                        template: `<div class="panel"><div class="panel-body">
                            <h3 class="text-center">{{::"EXAMS.EXAM_FINISH_ARE_YOU_SURE"|translate}}</h3>
                            <br/>
                            <br/>
                            <p class="text-center ">
                            <button class="btn btn-success btn-space" ng-click="ok()">{{::'GENERAL.OK'|translate}}</button>
                            <button class="btn btn-default" ng-click="cancel()">{{::'GENERAL.CANCEL'|translate}}</button>
                            </p>
                            </div></div>`,
                        controller: ($uibModalInstance, $scope) => {

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

                function getTimeFrame(config) {
                    let questionsLength = config.questions.length;
                    let timeFrame;

                    switch (config.timeFrame) {
                        case 'UNLIMITED':
                            timeFrame = -1; //config.timePerQuestion * questionsLength * 10;
                            break;
                        case 'NORMAL':
                            timeFrame = config.timePerQuestion * questionsLength;
                            break;
                        case 'EXTENDED':
                            timeFrame = config.timeWithExtensionPerQuestion * questionsLength;
                            break;
                        default:
                            timeFrame = config.timePerQuestion * questionsLength;
                    }

                    return timeFrame;
                }

                this.displayLoginForm = () => {
                    let loginModal =  $uibModal.open({
                        animation: true,
                        backdrop  : 'static',
                        keyboard  : false,
                        template: `<exam-login-form on-success="modal.closeModal()"></exam-login-form>`,
                        controller: ($uibModalInstance, $scope) => {

                            $scope.closeModal = () => {
                                $uibModalInstance.close();
                            }
                        },
                        controllerAs: 'modal',
                        bindToController: true,
                        size: 'small',
                        windowClass: 'login-form-modal'
                    });

                    return loginModal.result;
                };

                this.resumeExam = () => {
                    $scope.$root.$broadcast('resume-exam-timer');
                    $(document).keydown(keydownEventHandler);
                    this.keepAlive();
                };

                this.init();
            }
        });

})();