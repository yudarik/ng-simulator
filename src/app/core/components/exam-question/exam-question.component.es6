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
            controller: function($scope, $timeout, simulator_config, examService) {

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

                this.toggleAnswer = (value, event) => {

                    if (!this.solvedExamMode) {

                        if (this.question.chosenAns !== value) {
                            this.question.chosenAns = value;
                        } else if (event && event.type === 'click' && !event.target.checked){
                            this.question.chosenAns = undefined;
                        } else if (event && event.name === "numKeyPadSelect" && $(`.exam-question input:nth-child(${value - 1})[type=checkbox]`)) {
                            this.question.chosenAns = undefined;
                        }
                    }
                    $timeout(()=>{
                        $('.exam-question input[type=checkbox]').each((index,elem) => {
                            elem.checked = (this.question.chosenAns && value === index+1);
                        });
                    });
                };

                this.isChecked = (value) => {
                    return this.question.chosenAns === value;
                };

                this.getImage = () => {
                    return examService.getQuestionImage(this.question.questionID);
                };

                this.onImageLoad = (event) => {
                    this.imageLoading = false;
                };

                this.imageLoading = true;

                $scope.$watch('$ctrl.question.questionID', (newVal,oldVal)=>{
                    if (newVal === oldVal) return;

                    this.imageLoading = true;
                });

                $scope.$on('numKeyPadSelect', (event, data)=>{

                    if (data && data.answer <= this.question.answerOptions.length) {

                        this.toggleAnswer(data.answer, event);
                    }

                });
            },
            template: `<div class="exam-question">
                          <div class="row">
                               <div class="col-xs-12">
                                   <div class="text-left category-label" ng-if="$ctrl.config.showQuestionCategoryInAnswersPage && $ctrl.solvedExamMode">
                                        <img src="assets/img/app/category-icon.png" width="25" height="25"/>
                                        <label>{{$ctrl.question.category.categoryName}}</label>
                                   </div>

                                   <label>{{::'EXAMS.PRACTICE.QUESTION_LABEL'|translate}}:</label>
                                   <h4>{{$ctrl.question.question}}</h4>
                                   <span class="spinner-wrapper" ng-if="$ctrl.question.hasImage">
                                        <span ng-if="$ctrl.imageLoading" class="text-left align-left"><i class="fa fa-spinner fa-spin"  style="font-size:24px"></i></span>
                                        <img ng-src="{{$ctrl.getImage()}}" image-on-load="$ctrl.onImageLoad($event)"/>
                                   </span>
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
                                                                ng-checked="$ctrl.isChecked(option.key)"
                                                                ng-click="$ctrl.toggleAnswer(option.key, $event)"
                                                                ng-value="option.key"
                                                                ng-disabled="$ctrl.solvedExamMode">
                                                       <span ng-class="$ctrl.getClass(option)">
                                                            {{option.value}}
                                                       </span>
                                                   </label>
                                               </li>
                                           </ol>
                                            <div class="bs-callout bs-callout-warning col-md-12" ng-if="$ctrl.question.help && $ctrl.question.help.trim() !== ''">
                                                <h4>{{$ctrl.question.help}}</h5>
                                                <p>{{$ctrl.question.detailedHelp}}</p>
                                            </div>
                                       </div>
                                   </form>
                               </div>
                               <span class="pull-right text-right col-sm-4 questionID">{{$ctrl.question.questionID}}</span>
                           </div>
                        </div>`

        });
})();