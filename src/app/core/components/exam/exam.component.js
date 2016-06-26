/**
 * Created by arikyudin on 21/06/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components')
        .component('exam', {
            bindings: {
                questions: '=',
                timeframe: '<'
            },
            controller: examCtrl,
            template: [
              ' <div class="row">                                                                                                                                                ',
              '     <div class="panel question-area" ng-show="$ctrl.questionInDisplay">                                                                                       ',
              '         <div class="panel-body">                                                                                                                                 ',
              '             <exam-question question="$ctrl.questionInDisplay"></exam-question>                                                                                ',
              '         </div>                                                                                                                                                   ',
              '     </div>                                                                                                                                                       ',
              '     <exam-remote remote-map="$ctrl.questions" class="col-md-2" on-switch="$ctrl.switchQuestion(question)" on-prev="$ctrl.move(-1)" on-next="$ctrl.move(1)" on-finish="$ctrl.finishExam()"></exam-remote>',
              ' </div>                                                                                                                                                           ',
                //'<pre>{{$ctrl.questions|json}}</pre>',
              ' <exam-timeframe timeframe="$ctrl.timeframe"></exam-timeframe>                                                                                           '
            ].join('').trim()
        });

    function examCtrl($scope, $uibModal, examService) {

        var submitExam = () => {

            var questionIDtoChosenAnswerMapping = {};

            this.questions.forEach(question => {
                questionIDtoChosenAnswerMapping[question.questionID] = getUserAnswer(question);
            });

            let practiseResult = {
                practiceType: "PRACTICE",
                predefinedExamId: "0",
                totalTimeSecs: this.totalTimeFrame,
                elapsedTimeSecs: this.totalTimeFrame - this.timeframe,
                questionIDtoChosenAnswerMapping: questionIDtoChosenAnswerMapping
            };

            return examService.submitExam(practiseResult);
        };

        this.init = () =>{

            _.forEach(this.questions, (question) => {

                question.answerOptions = [];

                _.forEach(_.pick(question, ['ans1', 'ans2', 'ans3', 'ans4', 'ans5', 'ans6']), (value, key) => {
                    if (value) {
                        question.answerOptions.push({
                            key: key,
                            value: value
                        });
                    }
                });
            });
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

        this.finishExam = (e, params) => {

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


        $(document).keydown((e)=>{

            e.stopPropagation();
            switch (e.which) {
                case 37:
                    this.prevBtn.click();
                    break;
                case 39:
                    this.nextBtn.click();
                    break;
                default: return;
            }
            e.preventDefault();
        });

        $scope.$on('timeOver', this.finishExam);
    }

    function getUserAnswer(question) {
        var userAnswer = (typeof question.userAnswer !== 'undefined')? question.userAnswer : getRandomAnswer(question);
        return parseInt(userAnswer.replace('ans',''));
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

})();