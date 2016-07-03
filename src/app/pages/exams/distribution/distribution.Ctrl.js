/**
 * Created by arikyudin on 31/05/16.
 */

(function () {
    'use strict';

    function distributionCtrl($state, distribution) {
        this.examParams = {
            totalQuestion: distribution.questionsInExam,
            questionDistribution: [],
            difficulty: 'MEDIUM',
            timeFrame: 'NORMAL'
        };

        this.initQuestionDistribution = function() {

            var total = this.examParams.totalQuestion;

            var distMap = _.map(distribution.categories, (category, index)=>{

                if (index < this.examParams.totalQuestion) {
                    category.questionDistribution = 1;
                    total--;
                } else {
                    category.questionDistribution = 0;
                }

                return category;
            });

            while (total > 0) {
                distMap[parseInt(Math.random()*distMap.length)].questionDistribution++;
                total--;
            }

            return distMap;
        };

        this.startExam = function() {

            this.examParams.questionDistribution = _.zipObject(
                _.map(this.config.categories, 'id'),
                _.map(this.config.categories, 'questionDistribution')
            );

            $state.go('exams.general-practice', {examParams: this.examParams});
        };

        this.config = {};
        this.config.categories = this.initQuestionDistribution();


    }



    angular.module('Simulator.pages.exams.distribution')
        .controller('distributionCtrl', distributionCtrl);
})();