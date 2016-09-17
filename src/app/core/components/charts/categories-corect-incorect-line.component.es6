/**
 * Created by arikyudin on 23/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components')
        .component('categoriesCorrectIncorrectLine', {
            bindings: {
                titleLabel: '<'
            },
            template: '<div>'+
                      '<canvas id="pie" class="chart chart-line"'+
                      'chart-data="$ctrl.chart.data" '+
                      'chart-labels="$ctrl.chart.labels" '+
                      'chart-series="$ctrl.chart.series"'+
                      'chart-options="$ctrl.chart.options">'+
                      '</canvas>'+
                      '</div>',
            controller: function CorrectIncorrectCtrl($translate, customerStatsService) {
                'ngInject';

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
                        title: {
                            display: true,
                            text: this.titleLabel,
                            fontSize: 14
                        },
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
        });




})();
