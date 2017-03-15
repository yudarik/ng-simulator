"use strict";

/**
 * Created by arikyudin on 25/06/16.
 */

(function () {
    'use strict';

    practiceSummaryCtrl.$inject = ["summary", "simulator_config"];
    function practiceSummaryCtrl(summary, simulator_config) {
        var _this = this;

        this.simulator_config = simulator_config;
        this.passingGrade = this.simulator_config.passingGrade;
        this.summary = summary;
        this.categoriesStats = [];

        this.questionsDistribution = _.groupBy(this.summary.questions, 'category.categoryID');

        this.getCorrectAnswers = function (distribution) {
            var correctAnswers = _.countBy(distribution, function (question) {
                return !_.isNil(question.correctAns) && !_.isNil(question.chosenAns) && question.correctAns === question.chosenAns;
            }).true;

            return correctAnswers || 0;
        };

        _.forEach(this.questionsDistribution, function (questions) {
            var obj = {
                category: {
                    name: questions[0].category.categoryName,
                    id: questions[0].category.categoryID
                },
                totalQuestionsAskedInCategory: questions.length,
                questionIDsCorrectlyAnswered: [],
                questionIDsIncorrectlyAnswered: []
            };

            questions.forEach(function (question) {
                if (question.chosenAns === question.correctAns) {
                    obj.questionIDsCorrectlyAnswered.push(question.questionID);
                } else {
                    obj.questionIDsIncorrectlyAnswered.push(question.questionID);
                }
            });

            _this.categoriesStats.push(obj);
        });

        this.getGradeForDistribution = function (distribution) {
            return _this.getCorrectAnswers(distribution) / distribution.length * 100;
        };

        this.getLabelClass = function (num) {

            var warningArea = (100 - _this.passingGrade) / 2;

            if (num < _this.passingGrade) return 'label-danger';
            if (num <= _this.passingGrade + warningArea) return 'label-warning';
            if (num <= 100) return 'label-success';else return 'label-default';
        };
    }

    angular.module('Simulator.pages.exams.practice-summary').controller('practiceSummaryCtrl', practiceSummaryCtrl);
})();