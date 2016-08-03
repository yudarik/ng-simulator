/**
 * Created by arikyudin on 23/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.pages.stats')
        .component('categoriesCorrectIncorrectLine', {
            template: '<div ng-controller="CorrectIncorrectCtrl as categories">'+
                      '<canvas id="pie" class="chart chart-line"'+
                      'chart-data="categories.chart.data" '+
                      'chart-labels="categories.chart.labels" '+
                      'chart-series="categories.chart.series"'+
                      'chart-options="categories.chart.options">'+
                      '</canvas>'+
                      '</div>'
        })
        .controller('CorrectIncorrectCtrl', CorrectIncorrectCtrl);

    /** @ngInject */
    function CorrectIncorrectCtrl($translate, customerStatsService) {

        var series = [
            'STATS.DASHBOARD.CHARTS.CATEGORIES_LINE.TOTAL_ASKED',
            'STATS.DASHBOARD.CHARTS.CATEGORIES_LINE.CORRECT',
            'STATS.DASHBOARD.CHARTS.CATEGORIES_LINE.INCORRECT'
        ];

        this.chart = {
            labels: [],
            data: [],
            series: [],
            options: {
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        };

        function getCorrectSum(cat) {
            return cat.questionIDsCorrectlyAnswered.length;
        }
        function getIncorrectSum(cat) {
            return cat.questionIDsIncorrectlyAnswered.length
        }

        customerStatsService.getCategories().then(categoriesStats => {

            this.chart.series = _.map(series, $translate.instant);
            this.chart.labels = _.map(categoriesStats, 'category.name');

            this.chart.data.push(_.map(categoriesStats, 'totalQuestionsAskedInCategory'));
            this.chart.data.push(_.map(categoriesStats, getCorrectSum));
            this.chart.data.push(_.map(categoriesStats, getIncorrectSum));
        });
    }

})();
