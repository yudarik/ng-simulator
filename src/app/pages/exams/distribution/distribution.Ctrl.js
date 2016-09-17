"use strict";

/**
 * Created by arikyudin on 31/05/16.
 */

(function () {
    'use strict';

    distributionCtrl.$inject = ["$state", "dist", "distributionType", "practiceType"];
    function distributionCtrl($state, dist, distributionType, practiceType) {

        this.distributionType = distributionType;

        this.examParams = {
            totalQuestion: dist.questionsInExam,
            questionDistribution: [],
            difficulty: 'MEDIUM',
            timeFrame: 'NORMAL'
        };

        this.initQuestionDistribution = function () {
            var _this = this;

            var total = this.examParams.totalQuestion;

            var distMap = _.map(dist.categories, function (category, index) {

                if (index < _this.examParams.totalQuestion) {
                    category.questionDistribution = 1;
                    total--;
                } else {
                    category.questionDistribution = 0;
                }

                return category;
            });

            while (total > 0) {
                distMap[parseInt(Math.random() * distMap.length)].questionDistribution++;
                total--;
            }

            return distMap;
        };

        this.startExam = function () {

            this.examParams.questionDistribution = practiceType === 'PRACTICE' ? _.zipObject(_.map(this.config.categories, 'id'), _.map(this.config.categories, 'questionDistribution')) : [];

            if (practiceType === 'POST_CREDIT_PRACTICE') {
                this.examParams.questionNumber = this.examParams.totalQuestion;

                delete this.examParams.difficulty;
                delete this.examParams.questionDistribution;
                delete this.examParams.totalQuestion;
            }

            $state.go('exams.practice', { examParams: this.examParams, practiceType: practiceType });
        };

        this.config = {};
        this.config.categories = practiceType === 'PRACTICE' ? this.initQuestionDistribution() : [];
    }

    angular.module('Simulator.pages.exams.distribution').controller('distributionCtrl', distributionCtrl);
})();