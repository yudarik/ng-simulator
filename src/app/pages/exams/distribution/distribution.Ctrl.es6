/**
 * Created by arikyudin on 31/05/16.
 */

(function () {
    'use strict';

    function distributionCtrl($state, dist, distributionType, practiceType) {
        this.dist = dist;
        this.distributionType = distributionType;
        this.practiceType = practiceType;
        this.totalLeftQuota = (practiceType === 'POST_CREDIT_PRACTICE')?
            dist.leftPostCreditQuestionsQuota : dist.leftNewQuestionsQuota;

        this.examParams = {
            totalQuestion: (this.totalLeftQuota && this.totalLeftQuota >= getQuestionsInExam(this))? getQuestionsInExam(this) : this.totalLeftQuota,
            questionDistribution: [],
            difficulty: 'MEDIUM',
            timeFrame: 'NORMAL'
        };

        this.maxCategoryDistribution = this.examParams.totalQuestion;

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

            if (currentTotalAmount >= 0 && total >=0 && currentTotalAmount !== total) {
                distMap = adjustAmount(distMap, currentTotalAmount, total);
            }

            return distMap;
        };
        this.adjustCategory = (category, oldVal) => {

            if (_.isNil(category.questionDistribution)) {
                category.questionDistribution = parseInt(oldVal);
            }

            category.userAdjusted = true;

           /* if (category.questionDistribution > this.examParams.totalQuestion) {
                category.questionDistribution = this.examParams.totalQuestion;
            }*/

            if (category.questionDistribution > parseInt(oldVal)) {
                if (this.canRiseTotalBy(category.questionDistribution - parseInt(oldVal))) {
                    this.examParams.totalQuestion += category.questionDistribution - parseInt(oldVal);
                } else {
                    category.questionDistribution = parseInt(oldVal);
                }

            } else if (this.examParams.totalQuestion - Math.abs(parseInt(oldVal) - category.questionDistribution) > 0) {
                this.examParams.totalQuestion -= Math.abs(parseInt(oldVal) - category.questionDistribution);
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

                if (distMap[index]){
                    distMap[index].questionDistribution = (distMap[index].questionDistribution + (currentAmount < neededAmount ? 1 : -1));
                }

                currentAmount += (currentAmount < neededAmount ? 1 : -1);

                currentIndex++;
            }

            return distMap;
        }

        function isPracticeTypeRegular() {
            return (practiceType === 'PRACTICE' || practiceType === 'WEAK_AREAS_PRACTICE' || practiceType === 'DEMO');
        }

        function getQuestionsInExam(that) {
            return (that.practiceType === 'DEMO')? that.dist.questionsInDemo : that.dist.questionsInExam;
        }

        this.startExam = function() {

            this.examParams.questionDistribution = isPracticeTypeRegular()? _.zipObject(
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
            return _.isNil(this.totalLeftQuota) || this.practiceType === "DEMO";
        };
        this.canRiseTotalBy = (amount) => {
            return this.examParams.totalQuestion + amount <= this.getTotalQuota();
        };

        this.config = {};
        this.config.categories = isPracticeTypeRegular()? this.initQuestionDistribution() : [];
    }

    angular.module('Simulator.pages.exams.distribution')
        .controller('distributionCtrl', distributionCtrl);
})();