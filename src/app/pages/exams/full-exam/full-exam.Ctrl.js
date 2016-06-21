/**
 * Created by arikyudin on 31/05/16.
 */

(function () {
    'use strict';

    function fullExamCtrl($timeout, examConfig) {
        this.timeframe = examConfig.timePerQuestion * examConfig.questions.length;

        this.exam = _.map(examConfig.questions, (question, index)=>{
            return _.assign({}, question, {
                index: index,
                active: false,
                answered: false
            });
        });
    }

    angular.module('Simulator.pages.exams.full-exam')
        .controller('fullExamCtrl', fullExamCtrl);
})();