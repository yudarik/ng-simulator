/**
 * Created by arikyudin on 23/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components')
        .component('categoriesGradeRadar', {
            bindings: {
                categoriesStats: '='
            },
            template: '<div ng-controller="CategoriesChartsCtrl as categories">'+
                      '<canvas id="pie" class="chart chart-radar"'+
                      'chart-data="categories.radar.data" '+
                      'chart-labels="categories.chart.labels" '+
                      'chart-series="categories.radar.series"'+
                      'chart-options="categories.radar.options">'+
                      '</canvas>'+
                      '</div>'
        })
        .controller('CategoriesChartsCtrl', CategoriesChartsCtrl);

    /** @ngInject */
    function CategoriesChartsCtrl($scope, $translate, customerStatsService) {

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

        var init = (categoriesStats) => {
            this.chart.labels = _.map(categoriesStats, 'category.name');
            this.radar.series[0] = $translate.instant('STATS.DASHBOARD.CHARTS.GRADES_RADAR.GRADE');
            this.radar.data.push(_.map(categoriesStats, getGrade4Category));
        };

        function getGrade4Category(cat) {
            return ((cat.questionIDsCorrectlyAnswered.length / cat.totalQuestionsAskedInCategory) * 100);
        }

        if (!this.categoriesStats) {

            customerStatsService.getCategories().then(init);
        } else {
            init(this.categoriesStats);
        }

        $scope.$watch(()=>{
            return this.categoriesStats;
        }, (oldVal, newVal) =>{
            if (oldVal === newVal) return;

            init(this.categoriesStats);
        })
    }

})();
