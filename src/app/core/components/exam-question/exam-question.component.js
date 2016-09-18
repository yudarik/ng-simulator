'use strict';

/**
 * Created by arikyudin on 17/06/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components').component('examQuestion', {
        bindings: {
            question: '='
        },
        /** @ngInject */
        controller: function controller() {
            var _this = this;

            /**
             * Exam Question Component Controller
             */
            this.getClass = function (option) {
                if (_.isNil(_this.question.correctAns)) {
                    return '';
                }
                if (_this.getKey(option) === _this.question.correctAns) {
                    return 'bg-success';
                }
                if (_this.getKey(option) === _this.question.chosenAns) {
                    if (_this.question.chosenAns === _this.question.correctAns) {
                        return 'bg-success';
                    } else {
                        return 'bg-danger';
                    }
                } else {
                    return '';
                }
            };

            this.getKey = function (option) {
                return parseInt(option.key);
            };
        },
        template: '<div class="exam-question">\n                          <div class="row">\n                               <div class="col-xs-12">\n                                   <h4>{{$ctrl.question.question}}</h4>\n                                   <sup>({{$ctrl.question.category.categoryName}})</sup>\n                               </div>\n                           </div>\n                           <div class="row">\n                               <div class="col-xs-12">\n                                   <form name="options">\n                                       <div class="form-group">\n                                           <div class="col-md-12 question-option" ng-repeat="option in $ctrl.question.answerOptions">\n                                               <label class="radio-inline custom-radio nowrap">\n                                                   <input type="radio" name="question"\n                                                            ng-model="$ctrl.question.chosenAns"\n                                                            ng-value="option.key"\n                                                            ng-disabled="$ctrl.question.correctAns > -1">\n                                                   <span ng-class="$ctrl.getClass(option)">{{option.value}}</span>\n                                               </label>\n                                           </div>\n                                            <div class="bs-callout bs-callout-warning col-md-12" ng-if="$ctrl.question.help">\n                                            <h4>{{$ctrl.question.help}}</h5>\n                                            <p>{{$ctrl.question.detailedHelp}}</p>\n                                            </div>\n                                       </div>\n                                   </form>\n                               </div>\n                           </div>\n                        </div>'

    });
})();