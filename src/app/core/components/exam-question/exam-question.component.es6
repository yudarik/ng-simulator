/**
 * Created by arikyudin on 17/06/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components')
        .component('examQuestion', {
            bindings: {
                question: '='
            },
            /** @ngInject */
            controller: function($scope, simulator_config) {

                /**
                 * Exam Question Component Controller
                 */
                this.config = simulator_config;

                this.solvedExamMode = !!(this.question.correctAns > -1);

                this.getClass = (option)=>{
                    if (_.isNil(this.question.correctAns)) {
                        return '';
                    }
                    if (this.getKey(option) === this.question.correctAns) {
                        return 'bg-success';
                    }
                    if (this.getKey(option) === this.question.chosenAns) {
                       if (this.question.chosenAns === this.question.correctAns) {
                           return 'bg-success';
                       } else {
                           return 'bg-danger';
                       }
                    } else {
                        return '';
                    }
                };

                this.getKey = (option) => {
                    return parseInt(option.key);
                };

                this.toggleAnswer = (value) => {

                    if (!this.solvedExamMode) {

                        if (this.question.chosenAns !== value) {
                            this.question.chosenAns = value;
                        } else {
                            this.question.chosenAns = undefined;
                        }
                    }

                    $('.exam-question input[type=checkbox]').each((index,elem) => {
                        elem.checked = (this.question.chosenAns && value === index+1);
                    });
                };

                $scope.$on('numKeyPadSelect', (event, data)=>{

                    if (data && data.answer <= this.question.answerOptions.length) {

                        this.toggleAnswer(data.answer);
                    }

                });
            },
            template: `<div class="exam-question">
                          <div class="row">
                               <div class="col-xs-12">
                                   <div class="text-left category-label" ng-if="$ctrl.config.showQuestionCategoryInAnswersPage && $ctrl.solvedExamMode">
                                        <img src="/assets/img/app/category-icon.png" width="25" height="25"/>
                                        <label>{{$ctrl.question.category.categoryName}}</label>
                                   </div>

                                   <label>{{::'EXAMS.PRACTICE.QUESTION_LABEL'|translate}}:</label>
                                   <h4>{{$ctrl.question.question}}</h4>
                               </div>
                           </div>
                           <div class="row">
                               <div class="col-xs-12">
                                   <label>{{::'EXAMS.PRACTICE.ANSWERS_LABEL'|translate}}:</label>
                                   <form name="$ctrl.options">
                                       <div class="form-group">
                                           <ol>
                                               <li class="col-md-12 question-option" ng-repeat="option in $ctrl.question.answerOptions">
                                                   <label class="checkbox-inline custom-checkbox nowrap">
                                                       <input type="checkbox" name="question{{option.key}}"
                                                                ng-init="$ctrl.toggleAnswer($ctrl.question.chosenAns)"

                                                                ng-click="$ctrl.toggleAnswer(option.key, $event)"
                                                                ng-value="option.key"
                                                                ng-disabled="$ctrl.solvedExamMode">
                                                       <span ng-class="$ctrl.getClass(option)">
                                                            {{option.value}}
                                                       </span>
                                                   </label>
                                               </li>
                                           </ol>
                                            <div class="bs-callout bs-callout-warning col-md-12" ng-if="$ctrl.question.help">
                                            <h4>{{$ctrl.question.help}}</h5>
                                            <p>{{$ctrl.question.detailedHelp}}</p>
                                            </div>
                                       </div>
                                   </form>
                               </div>
                               <span class="pull-left text-left col-sm-4 questionID">{{$ctrl.question.questionID}}</span>
                           </div>
                        </div>`

        });
})();