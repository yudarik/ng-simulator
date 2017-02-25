'use strict';

/**
 * Created by arikyudin on 23/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components.charts').component('packageQuota', {
        bindings: {
            titleLabel: '<'
        },
        template: '<div id="packageQuota" class="col-xs-12">\n                          <canvas class="chart chart-pie"\n                          chart-data="$ctrl.package.data"\n                          chart-labels="$ctrl.package.labels"\n                          chart-series="$ctrl.package.series"\n                          chart-options="$ctrl.options">\n                          </canvas>\n                      </div>',
        controller: /** @ngInject */
        ["$translate", "$filter", "customerService", function packageQuotaCtrl($translate, $filter, customerService) {
            var _this = this;

            this.options = {
                title: {
                    display: true,
                    text: this.titleLabel,
                    fontSize: 14
                },
                legend: {
                    display: true,
                    position: 'right'
                }
            };

            this.package = {
                series: [],
                labels: [],
                data: []
            };
            customerService.getQuota().then(function (quota) {

                _.forEach(quota.purchasedProducts, function (item, index) {
                    //this.package.labels.push(moment(item.dateOfPurchase).format('DD/MM/YY').toString());
                    _this.package.labels.push(item.productDisplayName);

                    //this.package.data[index] = [];
                    _this.package.data.push(item.questionNumber);
                });
                //this.package.labels = _.uniq(this.package.labels);
            });
        }]
    });
})();