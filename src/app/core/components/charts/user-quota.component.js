/**
 * Created by arikyudin on 23/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components')
        .component('userQuota', {
            template: '<div>'+
                      '<canvas id="pie" class="chart chart-horizontal-bar"'+
                      'chart-data="$ctrl.data" '+
                      'chart-labels="$ctrl.labels" '+
                      'chart-series="$ctrl.series"'+
                      'chart-options="$ctrl.options">'+
                      '</canvas>'+
                      '</div>',
            controller: userQuotaCtrl
        });

    /** @ngInject */
    function userQuotaCtrl($translate, customerStatsService) {

        this.labels = [];
        this.data = [];
        this.series = [];
        this.options = {
            legend: {
                display: false,
                position: 'top'
            }
        };

        customerStatsService.getQuota().then((quota) => {
            _.forEach(quota, (val, key) => {
                if (typeof val === 'number') {
                    this.labels.push($translate.instant('STATS.ACCOUNT.'+key.toUpperCase()));
                    //this.series.push(key);
                    this.data.push(val);
                }
            })
        });
    }

})();
