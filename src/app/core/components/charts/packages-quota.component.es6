/**
 * Created by arikyudin on 23/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components.charts')
        .component('packageQuota', {
            bindings: {
                titleLabel: '<'
            },
            template:
                      `<div id="packageQuota" class="col-xs-12">
                          <canvas class="chart chart-pie"
                          chart-data="$ctrl.package.data"
                          chart-labels="$ctrl.package.labels"
                          chart-series="$ctrl.package.series"
                          chart-options="$ctrl.options">
                          </canvas>
                      </div>`,
            controller: /** @ngInject */
                function packageQuotaCtrl($translate, $filter,customerService) {
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
                customerService.getQuota().then((quota) => {

                    _.forEach(quota.purchasedProducts, (item, index)=>{
                        //this.package.labels.push(moment(item.dateOfPurchase).format('DD/MM/YY').toString());
                        this.package.labels.push(item.productDisplayName);

                        //this.package.data[index] = [];
                        this.package.data.push(item.questionNumber);
                    });
                    //this.package.labels = _.uniq(this.package.labels);
                });
            }
        });



})();
