/**
 * Created by arikyudin on 23/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.pages.stats')
        .component('categoriesGradeRadar', {
            template: '<div ng-controller="CategoriesChartsCtrl as categories">'+
                      '<canvas id="pie" class="chart chart-radar"'+
                      'chart-data="categories.radar.data" '+
                      'chart-labels="categories.chart.labels" '+
                      'chart-series="categories.radar.series"'+
                      'chart-options="categories.radar.options">'+
                      '</canvas>'+
                      '<canvas id="pie" class="chart chart-polar-area"'+
                      'chart-data="categories.polar.dataSets.data" '+
                      'chart-labels="categories.chart.labels" '+
                      'chart-dataset-override="categories.polar.dataSets"'+
                      'chart-options="categories.polar.options">'+
                      '</canvas>'+
                      '</div>'
        })
        .controller('CategoriesChartsCtrl', CategoriesChartsCtrl);

    /** @ngInject */
    function CategoriesChartsCtrl($translate, customerStatsService) {

        this.chart = {
            labels: []
        };
        this.radar = {
            data: [],
            series: [],
            options: {
                legend: {
                    display: true,
                    position: 'bottom'
                }
            }
        };
        this.polar = {
            dataSets: {
                data: [],
                label: 'totalQuestionsAskedInCategory'
            },
            options: {
                legend: {
                    display: false,
                    position: 'bottom'
                }
            }
        };

        function getGrade4Category(cat) {
            return ((cat.questionIDsCorrectlyAnswered.length / cat.totalQuestionsAskedInCategory) * 100);
        }

        customerStatsService.getCategories().then(categoriesStats => {

            this.chart.labels = _.map(categoriesStats, 'category.name');
            this.radar.series[0] = $translate.instant('STATS.DASHBOARD.CHARTS.GRADES_RADAR.GRADE');

            this.radar.data.push(_.map(categoriesStats, getGrade4Category));
            this.polar.dataSets.data.push(_.map(categoriesStats, 'totalQuestionsAskedInCategory'));
        });
    }

})();
