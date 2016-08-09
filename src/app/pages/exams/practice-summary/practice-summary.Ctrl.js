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

        this.getLabelClass = (num) => {
            if (num <= 50) return 'label-danger';
            if (num <= 75) return 'label-warning';
            if (num <= 100) return 'label-success';
            else return 'label-default';
        }
    }

    angular.module('Simulator.pages.exams.practice-summary')
        .controller('practiceSummaryCtrl', practiceSummaryCtrl);

})();