/**
 * Created by arikyudin on 25/06/16.
 */

(function () {
    'use strict';

    function practiceSummaryCtrl(summary) {
        this.summary = summary;

        this.questionsDistribution = _.groupBy(this.summary.questions, 'category.categoryID');

        this.getCorrectAnswers = (distribution) => {
            return _.countBy(distribution, (question)=>{
                return question.chosenAnswer === question.correctAnswer;
            }).true;
        };

        this.getGradeForDistribution = (distribution) => {
            return '??';
        };
    }

    angular.module('Simulator.pages.exams.practice-summary')
        .controller('practiceSummaryCtrl', practiceSummaryCtrl);

})();