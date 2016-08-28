/**
 * Created by arikyudin on 23/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components')
        .component('packageQuota', {
            bindings: {
                titleLabel: '<'
            },
            template:
                      `<div class="col-xs-12">
                          <canvas class="chart chart-pie"
                          chart-data="$ctrl.package.data"
                          chart-labels="$ctrl.package.labels"
                          chart-series="$ctrl.package.series"
                          chart-options="$ctrl.options">
                          </canvas>
                      </div>`,
            controller: packageQuotaCtrl
        });

    /** @ngInject */
    function packageQuotaCtrl($translate, $filter,customerStatsService) {
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
        customerStatsService.getQuota().then((quota) => {

            /*var dateOfPurchase = _.uniq(_.map(quota, 'dateOfPurchase'));
            this.package.labels = _.map(dateOfPurchase, date => {
                return moment(date).format('DD/MM/YY').toString();
            });*/

            _.forEach(quota.purchasedProducts, (item, index)=>{
                //this.package.labels.push(moment(item.dateOfPurchase).format('DD/MM/YY').toString());
                this.package.labels.push(item.productDisplayName);
                this.package.data.push(item.questionNumber);
            });
            //this.package.labels = _.uniq(this.package.labels);

        });
    }

})();
