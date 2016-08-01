/**
 * Created by arikyudin on 25/06/16.
 */

(function () {
    'use strict';

    function practiceSummaryCtrl(summary) {
        this.summary = summary;

        this.questionsDistribution = _.groupBy(this.summary.questions, 'category.categoryID');

        this.getCorrectAnswers = (distribution) => {
            var correctAnswers = _.countBy(distribution, (question)=>{
                return !_.isNil(question.correctAns) && !_.isNil(question.chosenAns) &&
                    question.correctAns === question.chosenAns;
            }).true;

            return correctAnswers || 0;
        };

        this.getGradeForDistribution = (distribution) => {
            return this.getCorrectAnswers(distribution) / distribution.length * 100;
        };
    }

    angular.module('Simulator.pages.exams.practice-summary')
        .controller('practiceSummaryCtrl', practiceSummaryCtrl);

})();