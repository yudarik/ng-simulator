/**
 * Created by arikyudin on 31/05/16.
 */

(function () {
    'use strict';

    function distributionCtrl($state, dist, distributionType, practiceType) {

        this.distributionType = distributionType;
        this.practiceType = practiceType;
        this.totalLeftQuota = (practiceType === 'POST_CREDIT_PRACTICE')?
            dist.leftPostCreditQuestionsQuota : dist.leftNewQuestionsQuota;

        this.examParams = {
            totalQuestion: (this.totalLeftQuota && this.totalLeftQuota >= dist.questionsInExam)? dist.questionsInExam : this.totalLeftQuota,
            questionDistribution: [],
            difficulty: 'MEDIUM',
            timeFrame: 'NORMAL'
        };

        this.initQuestionDistribution = function() {

            var total = this.examParams.totalQuestion;
            var currentTotalAmount = 0;

            var distMap = _.map(dist.categories, (category, index) => {

                if (category.userAdjusted) {
                    return category;
                }

                var amount = Math.floor(total * dist.questionsPercentagePerCategoryId[category.id]);

                currentTotalAmount += amount;

                category.questionDistribution = amount;

                return category;
            });

            if (currentTotalAmount !== total) {
                distMap = adjustAmount(distMap, currentTotalAmount, total);
            }

            return distMap;
        };
        this.adjustCategory = (category, oldVal) => {

            category.userAdjusted = true;

            if (category.questionDistribution > oldVal) {
                this.examParams.totalQuestion++;
            } else if (this.examParams.totalQuestion > 0) {
                this.examParams.totalQuestion--;
            }
        };

        function adjustAmount(distMap, currentAmount, neededAmount) {
            var initialIndex = Math.round(Math.random() * (distMap.length - 1));
            var currentIndex = 0,
                index = 0;
            var lookingForStartingIndex = true;

            while (currentAmount != neededAmount) {
                if (index === distMap.length) {
                    //reached the end of the map, start from the beginning
                    index = 0
                }
                if (lookingForStartingIndex && initialIndex != currentIndex) {
                    currentIndex++;
                    continue;
                } else {
                    lookingForStartingIndex = false;
                }

                index++;

                if (distMap[index] && distMap[index].questionDistribution === 0 && currentAmount > neededAmount) {
                    continue;
                    //we can't substract more from 0 questions...
                }
                if (distMap[index] && distMap[index].userAdjusted) {
                    continue;
                    //we don't touch user defined adjustment for category
                }

                distMap[index].questionDistribution = (distMap[index].questionDistribution + (currentAmount < neededAmount ? 1 : -1));

                currentAmount += (currentAmount < neededAmount ? 1 : -1);

                currentIndex++;
            }

            return distMap;
        }

        this.startExam = function() {

            this.examParams.questionDistribution = (practiceType === 'PRACTICE' || practiceType === 'WEAK_AREAS_PRACTICE')? _.zipObject(
                _.map(this.config.categories, 'id'),
                _.map(this.config.categories, 'questionDistribution')
            ) : [];

            if (practiceType === 'POST_CREDIT_PRACTICE') {
                this.examParams.questionNumber = this.examParams.totalQuestion;

                delete this.examParams.difficulty;
                delete this.examParams.questionDistribution;
                delete this.examParams.totalQuestion;
            }

            $state.go('exams.practice', {examParams: this.examParams, practiceType: practiceType});
        };

        this.getTotalQuota = function () {
            return (this.totalLeftQuota)? this.totalLeftQuota : 0;
        };
        this.isReadOnly = function() {
            return _.isNil(this.totalLeftQuota);
        };

        this.config = {};
        this.config.categories = (practiceType === 'PRACTICE' || practiceType === 'WEAK_AREAS_PRACTICE')? this.initQuestionDistribution() : [];
    }

    angular.module('Simulator.pages.exams.distribution')
        .controller('distributionCtrl', distributionCtrl);
})();