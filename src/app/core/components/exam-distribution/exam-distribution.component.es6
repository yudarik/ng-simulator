/**
 * Created by arikyudin on 26/06/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components')
        .component('examDistribution', {
            bindings: {
                categories: '@',
                distribution: '@'
            },
            templateUrl: 'app/pages/exams/distribution/distribution.html',
            controller: /** @ngInject */
                function distributionCtrl($state) {
                this.examParams = {
                    totalQuestion: this.distribution.questionsInExam,
                    questionDistribution: [],
                    difficulty: 'MEDIUM',
                    timeFrame: 'NORMAL'
                };

                this.initQuestionDistribution = function() {

                    /**
                     * 1. foreach category, multiply total on categoryPercentage
                     * 2. If user changes manulaly distribution of one of the spinnerer, add/subtract from total
                     * without changing others.
                     * If user changes total, calculate all spinners again, without touching the manual changed categories
                     */

                    var total = this.examParams.totalQuestion;

                    var distMap = _.map(this.categories, (category, index)=>{

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

                    $state.go('exams.full-exam', {examParams: this.examParams})
                };

                this.config = {};
                this.config.categories = this.initQuestionDistribution();
            }
        });

})();