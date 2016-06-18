/**
 * Created by arikyudin on 31/05/16.
 */

(function () {
    'use strict';

    function fullExamCtrl($timeout, examConfig) {

        this.examConfig = examConfig;
        this.timeframeConfig = examConfig.timePerQuestion * examConfig.questions.length;

        this.exam = _.map(examConfig.questions, (question, index)=>{
            return _.assign({}, question, {
                index: index,
                active: false,
                answered: false
            });
        });

        this.questionInDisplay = this.exam[0];
        this.questionInDisplay.active = true;

        this.switchQuestion = (question) => {
            this.questionInDisplay.active = !this.questionInDisplay.active;
            this.questionInDisplay = question;
            this.questionInDisplay.active = !this.questionInDisplay.active;
        };
    }

    angular.module('Simulator.pages.exams.full-exam')
        .controller('fullExamCtrl', fullExamCtrl);
})();