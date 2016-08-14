/**
 * Created by arikyudin on 23/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components')
        .component('categoriesGradeRadar', {
            bindings: {
                stats: '='
            },
            template: '<div>'+
                      '<canvas id="pie" class="chart chart-radar"'+
                      'chart-data="$ctrl.radar.data" '+
                      'chart-colors="$ctrl.chart.colors" '+
                      'chart-labels="$ctrl.chart.labels" '+
                      'chart-series="$ctrl.radar.series"'+
                      'chart-options="$ctrl.radar.options">'+
                      '</canvas>'+
                      '</div>',
            controller: CategoriesChartsCtrl
        });

    /** @ngInject */
    function CategoriesChartsCtrl($translate, customerStatsService) {

        this.chart = {
            labels: [],
            colors: ['#45b7cd', '#ff6384', '#ff8e72']
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

        if (!this.stats) {

            customerStatsService.getCategories().then(init);
        } else {
            init(this.stats);
        }

        this.$onChanges = (changes) =>  {

            if (changes && changes.stats){
                this.stats = changes.stats.newValue;

                init(this.stats);
            }
        };
    }

})();
