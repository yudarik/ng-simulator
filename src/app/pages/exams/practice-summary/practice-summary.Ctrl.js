"use strict";

/**
 * Created by arikyudin on 25/06/16.
 */

(function () {
    'use strict';

    practiceSummaryCtrl.$inject = ["$state", "summary", "simulator_config", "userType"];
    function practiceSummaryCtrl($state, summary, simulator_config, userType) {
        var _this = this;

        if (!summary) {
            return $state.go(simulator_config.defaultState);
        }

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

            if (num < _this.passingGrade) return 'text-danger';
            if (num <= _this.passingGrade + warningArea) return 'text-warning';
            if (num <= 100) return 'text-success';else return 'text-default';
        };

        this.repeatePracticeDisabled = function () {
            return _this.summary.practiceType === 'PREDEFINED_EXAM' || userType === 'Candidate';
        };
    }

    angular.module('Simulator.pages.exams.practice-summary').controller('practiceSummaryCtrl', practiceSummaryCtrl);
})();