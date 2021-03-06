'use strict';

/**
 * Created by arikyudin on 21/06/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components').component('exam', {
        /**ngInject*/
        bindings: {
            config: '<'
        },
        template: '<div class="panel question-area col-xs-12"\n                            ng-class="{\'solution\':$ctrl.isSolution}"\n                            ng-show="$ctrl.questionInDisplay">\n                        <div class="panel-heading" ng-if="$ctrl.config.predefinedExamDisplayName"><h3>{{::$ctrl.config.predefinedExamDisplayName}}</h3></div>\n                           <div class="panel-body">\n                               <exam-question question="$ctrl.questionInDisplay"></exam-question>\n                           </div>\n                       </div>\n                       <exam-remote practice-id="$ctrl.config.practiceID" remote-map="$ctrl.questions" is-solution="$ctrl.isSolution" class="remote-component" on-switch="$ctrl.switchQuestion(question)" on-prev="$ctrl.move(-1)" on-next="$ctrl.move(1)" on-finish="$ctrl.finishExam()" on-return="$ctrl.return()"></exam-remote>\n                       <exam-timeframe timeframe="$ctrl.timeframe" timeprogress="$ctrl.timeprogress"></exam-timeframe>',
        controller: ["$rootScope", "$uibModal", "$interval", "$state", "$translate", "examService", "simulatorService", "baSidebarService", "simulator_config", function ($rootScope, $uibModal, $interval, $state, $translate, examService, simulatorService, baSidebarService, simulator_config) {
            'ngInject';

            var _this = this;

            var $scope = $rootScope.$new();

            this.timeframe = getTimeFrame(this.config);
            this.isSolution = !this.timeframe;
            this.questions = this.config ? this.config.questions : [];
            this.type = this.config ? this.config.practiceType : undefined;

            var ping;

            var submitExam = function submitExam() {

                var questionIDtoChosenAnswerMapping = {};
                var orderedQuestionsArray = [];

                var indexCount = 0;
                _this.questions.forEach(function (question) {
                    questionIDtoChosenAnswerMapping[question.questionID] = getUserAnswer(question);
                    orderedQuestionsArray[indexCount++] = question.questionID;
                });

                var practiseResult = {
                    practiceType: _this.type,
                    originalPracticeId: _this.config.originalPracticeId,
                    predefinedExamId: _this.config.predefinedExamId || 0,
                    totalTimeSecs: _this.totalTimeFrame,
                    elapsedTimeSecs: _this.timeprogress, //this.totalTimeFrame - this.timeframe,
                    questionIDtoChosenAnswerMapping: questionIDtoChosenAnswerMapping,
                    orderedQuestions: orderedQuestionsArray
                };

                return examService.submitExam(practiseResult).then(function () {
                    _this.keepAlive('cancel');
                    _this.deregisterKeyDown();
                }).catch(function (err) {
                    if (err.status && err.status === -1) {
                        _this.displayLoginForm().then(function (res) {
                            submitExam();
                        });
                    }
                });
            };

            var keydownEventHandler = function keydownEventHandler(event) {

                //console.log('Key pressed');

                if (!event) return;

                event.stopPropagation();
                switch (event.which) {
                    case 37:
                        _this.prevBtn.click();
                        break;
                    case 39:
                        _this.nextBtn.click();
                        break;
                    case 49:
                    case 50:
                    case 51:
                    case 52:
                    case 53:
                    case 54:
                        _this.numPadKeys(event.which);
                        break;

                    default:
                        return;
                }
                event.preventDefault();
            };

            this.deregisterKeyDown = function () {
                $(document).off('keydown', keydownEventHandler);
            };

            this.init = function () {

                if (!Array.isArray(_this.questions) || !_this.questions.length) {
                    alert($translate.instant('EXAMS.TOOLTIPS.PRACTICE_ERROR_NO_QUESTIONS'));

                    if ($rootScope.previousState) {
                        return $state.go(simulator_config.defaultState, {}, { emergencyExit: true });
                    }
                }

                if (!baSidebarService.isMenuCollapsed()) {
                    baSidebarService.toggleMenuCollapsed();
                }

                var answerArray = [];

                for (var i = 1; i <= simulator_config.answersPerQuestionNumber; i++) {
                    answerArray.push('ans' + i);
                }

                _.forEach(_this.questions, function (question, index) {

                    _.assign(question, {
                        index: index,
                        active: false,
                        answerOptions: []
                    });

                    _.forEach(_.pick(question, answerArray), function (value, key) {
                        if (value) {
                            question.answerOptions.push({
                                key: parseInt(key.replace('ans', '')),
                                value: value
                            });
                        }
                    });
                });

                _this.pingErrCounter = 0;

                _this.totalTimeFrame = angular.copy(_this.timeframe);
                _this.timeprogress = 0;
                _this.questionInDisplay = _this.questions[0];
                _this.questionInDisplay.active = true;

                _this.prevBtn = $('#remote-prev');
                _this.nextBtn = $('#remote-next');

                $scope.$on('timeOver', _this.finishExam);
                $scope.$on('$destroy', function () {
                    _this.keepAlive('cancel');
                    _this.deregisterKeyDown();
                });
                $scope.$on('cancel-practice', function () {
                    return _this.deregisterKeyDown();
                });
                $scope.$on('resume-keepAlive', function () {
                    return _this.keepAlive();
                });

                _this.keepAlive();
            };

            this.keepAlive = function (cancel) {

                if (cancel) {
                    return $interval.cancel(ping);
                }

                if (ping && _.get(ping, '$$state.value') !== 'canceled') return;

                ping = $interval(function () {
                    simulatorService.ping().then(function () {
                        _this.pingErrCounter = 0;
                    }).catch(function (err) {

                        _this.pingErrCounter++;

                        if (_this.pingErrCounter > 3 && $state.current.name !== 'signin') {
                            $interval.cancel(ping);
                            $scope.$root.$broadcast('pause-exam-timer');
                            _this.deregisterKeyDown();
                            _this.displayLoginForm().then(function (res) {
                                _this.resumeExam();
                                _this.pingErrCounter = 0;
                            });
                        }
                    });
                }, 15000);
            };

            this.switchQuestion = function (question) {

                if (!question) {
                    return;
                }

                _this.questionInDisplay.active = !_this.questionInDisplay.active;
                _this.questionInDisplay = question;
                _this.questionInDisplay.active = !_this.questionInDisplay.active;
            };

            this.move = function (count) {
                _this.switchQuestion(_.find(_this.questions, { index: _this.questionInDisplay.index + count }));
            };

            this.finishExam = function () {

                if (_this.timeframe > 10) {
                    timeframeModal($uibModal).then(function () {
                        submitExam();
                    }, function () {
                        //dismiss
                    });
                } else {
                    submitExam();
                }
            };

            this.return = function () {
                _this.keepAlive('cancel');

                if (_this.isSolution) {
                    examService.getPracticeInfo(_this.config.practiceID).then(function (solution) {
                        $state.go('exams.practice-summary', { examSummary: solution });
                    });
                } else {
                    $state.go(simulator_config.defaultState);
                }
            };

            this.numPadKeys = function (keyNumber) {
                $rootScope.$broadcast('numKeyPadSelect', { answer: keyNumber - 48 });
            };

            $(document).keydown(keydownEventHandler);

            function getUserAnswer(question) {
                var chosenAns = typeof question.chosenAns !== 'undefined' ? question.chosenAns : getRandomAnswer(question);
                return parseInt(chosenAns);
            }

            function getRandomAnswer(question) {
                var random = Math.floor(Math.random() * question.answerOptions.length);
                return question.answerOptions[random].key;
            }

            function timeframeModal($uibModal) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    template: '<div class="panel"><div class="panel-body">\n                            <h3 class="text-center">{{::"EXAMS.EXAM_FINISH_ARE_YOU_SURE"|translate}}</h3>\n                            <br/>\n                            <br/>\n                            <p class="text-center ">\n                            <button class="btn btn-success btn-space" ng-click="ok()">{{::\'GENERAL.OK\'|translate}}</button>\n                            <button class="btn btn-default" ng-click="cancel()">{{::\'GENERAL.CANCEL\'|translate}}</button>\n                            </p>\n                            </div></div>',
                    controller: function controller($uibModalInstance, $scope) {

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
                var questionsLength = config.questions.length;
                var timeFrame = void 0;

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

            this.displayLoginForm = function () {
                var loginModal = $uibModal.open({
                    animation: true,
                    backdrop: 'static',
                    keyboard: false,
                    template: '<exam-login-form on-success="modal.closeModal()"></exam-login-form>',
                    controller: function controller($uibModalInstance, $scope) {

                        $scope.closeModal = function () {
                            $uibModalInstance.close();
                        };
                    },
                    controllerAs: 'modal',
                    bindToController: true,
                    size: 'small',
                    windowClass: 'login-form-modal'
                });

                return loginModal.result;
            };

            this.resumeExam = function () {
                $scope.$root.$broadcast('resume-exam-timer');
                $(document).keydown(keydownEventHandler);
                _this.keepAlive();
            };

            this.init();
        }]
    });
})();