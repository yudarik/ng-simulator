/**
 * Created by arikyudin on 25/06/16.
 */

(function () {
    'use strict';

    function practiceSummaryCtrl(summary) {
        this.summary = summary;
        this.categoriesStats = [];

        this.questionsDistribution = _.groupBy(this.summary.questions, 'category.categoryID');

        this.getCorrectAnswers = (distribution) => {
            var correctAnswers = _.countBy(distribution, (question)=>{
                return !_.isNil(question.correctAns) && !_.isNil(question.chosenAns) &&
                    question.correctAns === question.chosenAns;
            }).true;

            return correctAnswers || 0;
        };

        _.forEach(this.questionsDistribution, (questions)=>{
            var obj = {
                category: {
                    name: questions[0].category.categoryName,
                    id: questions[0].category.categoryID
                },
                totalQuestionsAskedInCategory: questions.length,
                questionIDsCorrectlyAnswered: [],
                questionIDsIncorrectlyAnswered: []
            };

            questions.forEach(question => {
                if (question.chosenAns === question.correctAns) {
                    obj.questionIDsCorrectlyAnswered.push(question.questionID);
                } else {
                    obj.questionIDsIncorrectlyAnswered.push(question.questionID);
                }
            });

            this.categoriesStats.push(obj);
        });

        this.getGradeForDistribution = (distribution) => {
            return this.getCorrectAnswers(distribution) / distribution.length * 100;
        };

        this.getLabelClass = (num) => {
            if (num <= 55) return 'label-danger';
            if (num <= 75) return 'label-warning';
            if (num <= 100) return 'label-success';
            else return 'label-default';
        }
    }

    angular.module('Simulator.pages.exams.practice-summary')
        .controller('practiceSummaryCtrl', practiceSummaryCtrl);

})();