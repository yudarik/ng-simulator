/**
 * Created by arikyudin on 25/06/16.
 */

(function () {
    'use strict';

    function practiceSummaryCtrl($state, summary, simulator_config, userType) {

        if (!summary) {
            return $state.go(simulator_config.defaultState);
        }

        this.simulator_config = simulator_config;
        this.passingGrade = this.simulator_config.passingGrade;
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

            var warningArea = (100 - this.passingGrade)/2;

            if (num < this.passingGrade) return 'text-danger';
            if (num <= this.passingGrade + warningArea) return 'text-warning';
            if (num <= 100) return 'text-success';
            else return 'text-default';
        };

        this.repeatePracticeDisabled = () => {
            return this.summary.practiceType === 'PREDEFINED_EXAM' || userType === 'Candidate';
        }
    }

    angular.module('Simulator.pages.exams.practice-summary')
        .controller('practiceSummaryCtrl', practiceSummaryCtrl);

})();