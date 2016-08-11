/**
 * Created by arikyudin on 23/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components')
        .component('userQuota', {
            template: '<div class="col-xs-6">'+
                          '<canvas class="chart chart-pie"'+
                          'chart-data="$ctrl.questionsQuota.data" '+
                          'chart-labels="$ctrl.questionsQuota.labels" '+
                          'chart-series="$ctrl.questionsQuota.series"'+

                          'chart-options="$ctrl.options">'+
                          '</canvas>'+
                      '</div>'+
                        '<div class="col-xs-6">'+
                        '<canvas class="chart chart-pie"'+
                        'chart-data="$ctrl.practicesPerformed.data" '+
                        'chart-labels="$ctrl.practicesPerformed.labels" '+
                        'chart-options="$ctrl.options">'+
                        '</canvas>'+
                        '</div>',
            controller: userQuotaCtrl
        });

    /** @ngInject */
    function userQuotaCtrl($translate, customerStatsService) {
        this.options = {
            legend: {
                display: true,
                position: 'bottom'
            }
        };

        this.questionsQuota = {
            labels: [],
            data: []
        };
        this.practicesPerformed = {
            labels: [],
            data: []
        };

        customerStatsService.getQuota().then((quota) => {

            this.questionsQuota.data = [
                quota['totalNewQuestionsQuota'] - quota['leftNewQuestionsQuota'],
                quota['leftNewQuestionsQuota']
            ];
            this.questionsQuota.labels[0] = $translate.instant('STATS.ACCOUNT.SPENTNEWQUESTIONSQUOTA');
            this.questionsQuota.labels[1] = $translate.instant('STATS.ACCOUNT.LEFTNEWQUESTIONSQUOTA');

            this.practicesPerformed.data = [
                quota['totalPostCreditQuestionsQuota'] - quota['leftPostCreditQuestionsQuota'],
                quota['leftPostCreditQuestionsQuota']
            ];
            this.practicesPerformed.labels[0] = $translate.instant('STATS.ACCOUNT.SPENTPOSTCREDITQUESTIONSQUOTA');
            this.practicesPerformed.labels[1] = $translate.instant('STATS.ACCOUNT.LEFTPOSTCREDITQUESTIONSQUOTA');


        });
    }

})();
