'use strict';

/**
 * Created by arikyudin on 21/06/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components').component('exam', {
        /**ngInject*/
        bindings: {
            questions: '=',
            timeframe: '<',
            type: '<'
        },
        template: '<div class="row">\n                           <div class="panel question-area col-xs-12 col-md-10" ng-show="$ctrl.questionInDisplay">\n                               <div class="panel-body">\n                                   <exam-question question="$ctrl.questionInDisplay"></exam-question>\n                               </div>\n                           </div>\n                           <exam-remote remote-map="$ctrl.questions" class="col-xs-12 col-md-2" on-switch="$ctrl.switchQuestion(question)" on-prev="$ctrl.move(-1)" on-next="$ctrl.move(1)" on-finish="$ctrl.finishExam()"></exam-remote>,\n                       </div>\n                       <exam-timeframe timeframe="$ctrl.timeframe"></exam-timeframe>',
        controller: ["$scope", "$uibModal", "$interval", "examService", "simulatorService", "simulator_config", function ($scope, $uibModal, $interval, examService, simulatorService, simulator_config) {
            'ngInject';

            var _this = this;

            var ping;

            var submitExam = function submitExam() {

                console.log('Submit Exam clicked');

                var questionIDtoChosenAnswerMapping = {};

                _this.questions.forEach(function (question) {
                    questionIDtoChosenAnswerMapping[question.questionID] = getUserAnswer(question);
                });

                var practiseResult = {
                    practiceType: _this.type,
                    predefinedExamId: "0",
                    totalTimeSecs: _this.totalTimeFrame,
                    elapsedTimeSecs: _this.totalTimeFrame - _this.timeframe,
                    questionIDtoChosenAnswerMapping: questionIDtoChosenAnswerMapping
                };

                return examService.submitExam(practiseResult);
            };

            var keydownEventHandler = function keydownEventHandler(event) {

                console.log('Key pressed');

                if (!event) return;

                event.stopPropagation();
                switch (event.which) {
                    case 37:
                        _this.prevBtn.click();
                        break;
                    case 39:
                        _this.nextBtn.click();
                        break;
                    default:
                        return;
                }
                event.preventDefault();
            };

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
                    template: ['<div class="panel"><div class="panel-body">', '<h3 class="text-center">{{::"EXAMS.EXAM_FINISH_ARE_YOU_SURE"|translate}}</h3>', '<br/>', '<br/>', '<p class="text-center ">', '<button class="btn btn-success btn-space" ng-click="ok()">אישור</button>', '<button class="btn btn-default" ng-click="cancel()">ביטול</button>', '</p>', '</div></div>'].join(''),
                    controller: ["$uibModalInstance", "$scope", function ($uibModalInstance, $scope) {
                        $scope.ok = function () {
                            $uibModalInstance.close();
                        };

                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                    }],
                    size: 'small'
                });

                return modalInstance.result;
            }

            this.init = function () {

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

                ping = $interval(function () {
                    simulatorService.ping();
                }, 10000);
            };

            this.init();

            this.totalTimeFrame = angular.copy(this.timeframe);
            this.questionInDisplay = this.questions[0];
            this.questionInDisplay.active = true;

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

                console.log('FinishExam reached');

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

            this.prevBtn = $('#remote-prev');
            this.nextBtn = $('#remote-next');

            $(document).keydown(keydownEventHandler);

            $scope.$on('timeOver', this.finishExam);
            $scope.$on('$destroy', function () {
                $interval.cancel(ping);
                $(document).off('keydown', keydownEventHandler);
            });
        }]
    });
})();