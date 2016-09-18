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
            controller: function() {

                /**
                 * Exam Question Component Controller
                 */
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
            },
            template: `<div class="exam-question">
                          <div class="row">
                               <div class="col-xs-12">
                                   <h4>{{$ctrl.question.question}}</h4>
                                   <sup>({{$ctrl.question.category.categoryName}})</sup>
                               </div>
                           </div>
                           <div class="row">
                               <div class="col-xs-12">
                                   <form name="options">
                                       <div class="form-group">
                                           <div class="col-md-12 question-option" ng-repeat="option in $ctrl.question.answerOptions">
                                               <label class="radio-inline custom-radio nowrap">
                                                   <input type="radio" name="question"
                                                            ng-model="$ctrl.question.chosenAns"
                                                            ng-value="option.key"
                                                            ng-disabled="$ctrl.question.correctAns > -1">
                                                   <span ng-class="$ctrl.getClass(option)">{{option.value}}</span>
                                               </label>
                                           </div>
                                            <div class="bs-callout bs-callout-warning col-md-12" ng-if="$ctrl.question.help">
                                            <h4>{{$ctrl.question.help}}</h5>
                                            <p>{{$ctrl.question.detailedHelp}}</p>
                                            </div>
                                       </div>
                                   </form>
                               </div>
                           </div>
                        </div>`

        });
})();