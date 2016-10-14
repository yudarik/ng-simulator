'use strict';

/**
 * Created by arikyudin on 23/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components.charts').component('practicesPerformed', {
        bindings: {
            titleLabel: '<'
        },
        template: '<div class="col-xs-12">' + '<canvas class="chart chart-horizontal-bar"' + 'chart-data="$ctrl.practicesPerformed.data" ' + 'chart-labels="$ctrl.practicesPerformed.labels" ' + 'chart-series="$ctrl.practicesPerformed.series" ' + 'chart-options="$ctrl.practicesPerformed.options">' + '</canvas>' + '</div>',
        controller: /** @ngInject */
        ["$translate", "customerService", function practicesPerformedCtrl($translate, customerService) {
            var _this = this;

            this.practicesPerformed = {
                series: [],
                labels: [],
                data: [],
                options: {
                    title: {
                        display: true,
                        text: this.titleLabel,
                        fontSize: 14
                    },
                    legend: {
                        display: false,
                        position: 'top'
                    }
                }
            };

            customerService.getQuota().then(function (quota) {

                _this.practicesPerformed.labels = ['examsPerformed', 'generalPracticesPerformed', 'suggestedPracticesPerformed', 'predefinedExamsPerformed'].map(function (key) {
                    return $translate.instant('STATS.ACCOUNT.' + key.toUpperCase());
                });

                _this.practicesPerformed.data = ['examsPerformed', 'generalPracticesPerformed', 'suggestedPracticesPerformed', 'predefinedExamsPerformed'].map(function (key) {
                    return quota[key];
                });
            });
        }]
    });
})();