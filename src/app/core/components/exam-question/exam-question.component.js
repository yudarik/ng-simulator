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
            controller: function($scope) {

                /**
                 * Exam Question Component Controller
                 */
            },
            template: [
                    '<div class="exam-question">',
                      '<div class="row">                                                             ',
                      '     <div class="col-md-12">                                                   ',
                      '         <h4>{{$ctrl.question.question}}</h4>                                    ',
                      '         <sup>({{$ctrl.question.category.categoryName}})</sup>                                                           ',
                      '     </div>                                                                    ',
                      ' </div>                                                                        ',
                      ' <div class="row">                                                             ',
                      '     <div class="col-md-12">                                                   ',
                      '         <form name="options">                                                 ',
                      '             <div class="form-group">                                          ',
                      '                 <div class="col-md-12 question-option" ng-repeat="option in $ctrl.question.answerOptions">',
                      '                     <label class="radio-inline custom-radio nowrap">',
                      '                         <input type="radio" name="question"',
                                                        'ng-class="{\'bg-success\': $ctrl.question.correctAnswer > -1 && $ctrl.question.correctAnswer === $ctrl.question.chosenAnswer,',
                                                        '\'bg-danger\': $ctrl.question.correctAnswer > -1 && $ctrl.question.chosenAnswer !== $ctrl.question.correctAnswer}"',
                                                        'ng-model="$ctrl.question.userAnswer"',
                                                        'ng-value="option.key"',
                                                        'ng-disabled="$ctrl.question.correctAnswer > -1"',
                                                        'ng-chosen="option.key === $ctrl.question.chosenAnswer">',
                      '                         <span>{{option.value}}</span>                                  ',
                      '                     </label>                                                  ',
                      '                 </div>                                                        ',
                                        '<div class="bs-callout bs-callout-warning" ng-if="::$ctrl.question.help">',
                                        '<p></p>',
                                        '<h5><i class="fa fa-lightbulb-o help" aria-hidden="true"></i>&nbsp;',
                                        '{{::$ctrl.question.help}}</h5>',
                                        '<p>{{::$ctrl.question.detailedHelp}}</p>',
                                        '</div>',
                      '             </div>                                                            ',
                      '         </form>                                                               ',
                      '     </div>                                                                    ',
                      ' </div>                                                                        ',
                    '</div>',
                    /*'<div class="row"><pre style="direction:ltr">{{$ctrl.question|json}}</pre></div>'*/
                      ].join('').trim()

        });
})();