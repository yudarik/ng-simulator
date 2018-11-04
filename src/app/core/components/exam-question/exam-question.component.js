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
        controller: ["$scope", "$timeout", "simulator_config", "examService", function ($scope, $timeout, simulator_config, examService) {
            var _this = this;

            /**
             * Exam Question Component Controller
             */
            this.config = simulator_config;

            this.solvedExamMode = !!(this.question.correctAns > -1);

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

            this.toggleAnswer = function (value, event) {

                if (!_this.solvedExamMode) {

                    if (_this.question.chosenAns !== value) {
                        _this.question.chosenAns = value;
                    } else if (event && event.type === 'click' && !event.target.checked) {
                        _this.question.chosenAns = undefined;
                    } else if (event && event.name === "numKeyPadSelect" && $('.exam-question input:nth-child(' + (value - 1) + ')[type=checkbox]')) {
                        _this.question.chosenAns = undefined;
                    }
                }
                $timeout(function () {
                    $('.exam-question input[type=checkbox]').each(function (index, elem) {
                        elem.checked = _this.question.chosenAns && value === index + 1;
                    });
                });
            };

            this.isChecked = function (value) {
                return _this.question.chosenAns === value;
            };

            this.getImage = function () {
                return examService.getQuestionImage(_this.question.questionID);
            };

            this.getHelpImage = function () {
                return examService.getHelpImage(_this.question.questionID);
            };

            this.onImageLoad = function (event) {
                _this.imageLoading = false;
            };

            this.imageLoading = true;

            $scope.$watch('$ctrl.question.questionID', function (newVal, oldVal) {
                if (newVal === oldVal) return;

                _this.imageLoading = true;
            });

            var numKeyPadSelectDeregister = $scope.$on('numKeyPadSelect', function (event, data) {

                if (data && data.answer <= _this.question.answerOptions.length) {

                    _this.toggleAnswer(data.answer, event);
                }
            });

            $scope.$on('$destroy', function () {
                return numKeyPadSelectDeregister();
            });
            $scope.$on('cancel-practice', function () {
                return numKeyPadSelectDeregister();
            });
        }],
        template: '<div class="exam-question">\n                          <div class="row">\n                               <div class="col-xs-12">\n                                   <p class="text-right category-label" ng-if="$ctrl.config.showQuestionCategoryInAnswersPage && $ctrl.solvedExamMode">\n                                        <img src="assets/img/app/category-icon.png" width="25" height="25"/>\n                                        <label>{{$ctrl.question.category.categoryName}}</label>\n                                   </p>\n\n                                   <label>{{::\'EXAMS.PRACTICE.QUESTION_LABEL\'|translate}}:</label>\n                                   <h4>{{$ctrl.question.question}}</h4>\n                                   <span class="spinner-wrapper" ng-if="$ctrl.question.hasImage">\n                                        <span ng-if="$ctrl.imageLoading" class="text-left align-left"><i class="fa fa-spinner fa-spin"  style="font-size:24px"></i></span>\n                                        <img ng-src="{{$ctrl.getImage()}}" image-on-load="$ctrl.onImageLoad($event)"/>\n                                   </span>\n                               </div>\n                           </div>\n                           <div class="row">\n                               <div class="col-xs-12">\n                                   <label>{{::\'EXAMS.PRACTICE.ANSWERS_LABEL\'|translate}}:</label>\n                                   <form name="$ctrl.options">\n                                       <div class="form-group">\n                                           <ol>\n                                               <li class="col-md-12 question-option" ng-repeat="option in $ctrl.question.answerOptions">\n                                                   <label class="checkbox-inline custom-checkbox nowrap">\n                                                       <input type="checkbox" name="question{{option.key}}"\n                                                                ng-checked="$ctrl.isChecked(option.key)"\n                                                                ng-click="$ctrl.toggleAnswer(option.key, $event)"\n                                                                ng-value="option.key"\n                                                                ng-disabled="$ctrl.solvedExamMode">\n                                                       <span ng-class="$ctrl.getClass(option)">\n                                                            {{option.value}}\n                                                       </span>\n                                                   </label>\n                                               </li>\n                                           </ol>\n                                            <div class="bs-callout bs-callout-warning col-md-12" ng-if="$ctrl.question.help && $ctrl.question.help.trim() !== \'\'">\n                                                <h4>{{$ctrl.question.help}}</h5>\n                                                <p>{{$ctrl.question.detailedHelp}}</p>\n                                                <span class="spinner-wrapper" ng-if="$ctrl.question.hasHelpImage">\n                                                    <span ng-if="$ctrl.imageLoading" class="text-left align-left"><i class="fa fa-spinner fa-spin"  style="font-size:24px"></i></span>\n                                                    <img ng-src="{{$ctrl.getHelpImage()}}" image-on-load="$ctrl.onImageLoad($event)"/>\n                                                </span>\n                                            </div>\n                                       </div>\n                                   </form>\n                               </div>\n                               <span class="pull-right text-right col-sm-4 questionID">{{$ctrl.question.questionID}}</span>\n                           </div>\n                        </div>'

    });
})();