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
                      '         <p>{{$ctrl.question.question}}</p>                                    ',
                      '         <sup>({{$ctrl.question.category.categoryName}})</sup>                                                           ',
                      '     </div>                                                                    ',
                      ' </div>                                                                        ',
                      ' <div class="row">                                                             ',
                      '     <div class="col-md-12">                                                   ',
                      '         <form name="options">                                                 ',
                      '             <div class="form-group">                                          ',
                      '                 <div class="col-md-12 question-option" ng-repeat="option in $ctrl.question.answerOptions">',
                      '                     <label class="radio-inline custom-radio nowrap">          ',
                      '                         <input type="radio" name="question" ng-model="$ctrl.question.userAnswer" ng-value="option.key"> ',
                      '                         <span>{{option.value}}</span>                                  ',
                      '                     </label>                                                  ',
                      '                 </div>                                                        ',
                      '             </div>                                                            ',
                      '         </form>                                                               ',
                      '     </div>                                                                    ',
                      ' </div>                                                                        ',
                    '</div>'
                      //'<div class="row"><pre>{{$ctrl.question|json}}</pre></div>'
                      ].join('').trim()

        });
})();