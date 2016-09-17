'use strict';

/**
 * Created by arikyudin on 23/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components').component('categoriesGradeRadar', {
        bindings: {
            stats: '=',
            titleLabel: '<'
        },
        template: '<div>' + '<canvas id="pie" class="chart chart-radar"' + 'chart-data="$ctrl.radar.data" ' + 'chart-colors="$ctrl.chart.colors" ' + 'chart-labels="$ctrl.chart.labels" ' + 'chart-series="$ctrl.radar.series"' + 'chart-options="$ctrl.radar.options">' + '</canvas>' + '</div>',
        controller: /** @ngInject */
        ["$translate", "customerStatsService", function CategoriesChartsCtrl($translate, customerStatsService) {
            var _this = this;

            this.chart = {
                labels: [],
                colors: ['#45b7cd', '#ff6384', '#ff8e72']
            };
            this.radar = {
                data: [],
                series: [],
                options: {
                    title: {
                        display: this.titleLabel,
                        text: this.titleLabel,
                        fontSize: 14
                    },
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                }
            };

            var init = function init(categoriesStats) {
                _this.chart.labels = _.map(categoriesStats, 'category.name');
                _this.radar.series[0] = $translate.instant('STATS.DASHBOARD.CHARTS.GRADES_RADAR.GRADE');
                _this.radar.data.push(_.map(categoriesStats, getGrade4Category));
            };

            function getGrade4Category(cat) {
                return cat.questionIDsCorrectlyAnswered.length / cat.totalQuestionsAskedInCategory * 100;
            }

            if (!this.stats) {

                customerStatsService.getCategories().then(init);
            } else {
                init(this.stats);
            }

            this.$onChanges = function (changes) {

                if (changes && changes.stats) {
                    _this.stats = changes.stats.newValue;

                    init(_this.stats);
                }
            };
        }]
    });
})();