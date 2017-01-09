"use strict";

/**
 * Created by arikyudin on 31/05/16.
 */

(function () {
    'use strict';

    distributionCtrl.$inject = ["$state", "dist", "distributionType", "practiceType", "totalQuota"];
    function distributionCtrl($state, dist, distributionType, practiceType, totalQuota) {

        this.distributionType = distributionType;
        this.practiceType = practiceType;
        this.totalQuota = totalQuota;

        this.examParams = {
            totalQuestion: totalQuota ? dist.questionsInExam : 10,
            questionDistribution: [],
            difficulty: 'MEDIUM',
            timeFrame: 'NORMAL'
        };

        this.initQuestionDistribution = function () {

            var total = this.examParams.totalQuestion;

            var distMap = _.map(dist.categories, function (category, index) {

                if (index < total) {
                    category.questionDistribution = 1;
                    total--;
                } else {
                    category.questionDistribution = 0;
                }

                //category.questionDistribution = Math.floor(total * dist.questionsPercentagePerCategoryId[category.id]);

                return category;
            });
            while (total > 0) {
                distMap[parseInt(Math.random() * distMap.length)].questionDistribution++;
                total--;
            }

            return distMap;
        };

        this.startExam = function () {

            this.examParams.questionDistribution = practiceType === 'PRACTICE' || practiceType === 'WEAK_AREAS_PRACTICE' ? _.zipObject(_.map(this.config.categories, 'id'), _.map(this.config.categories, 'questionDistribution')) : [];

            if (practiceType === 'POST_CREDIT_PRACTICE') {
                this.examParams.questionNumber = this.examParams.totalQuestion;

                delete this.examParams.difficulty;
                delete this.examParams.questionDistribution;
                delete this.examParams.totalQuestion;
            }

            $state.go('exams.practice', { examParams: this.examParams, practiceType: practiceType });
        };

        this.getTotalQuota = function () {
            return this.totalQuota ? this.totalQuota : 10;
        };
        this.isReadOnly = function () {
            return _.isNil(totalQuota);
        };

        this.config = {};
        this.config.categories = practiceType === 'PRACTICE' || practiceType === 'WEAK_AREAS_PRACTICE' ? this.initQuestionDistribution() : [];
    }

    angular.module('Simulator.pages.exams.distribution').controller('distributionCtrl', distributionCtrl);
})();