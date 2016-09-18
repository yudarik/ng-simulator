/**
 * Created by arikyudin on 23/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components')
        .component('userQuota', {
            bindings: {
                titleLabel: '<'
            },
            template:
                      '<div class="col-xs-12">'+
                          '<canvas class="chart chart-pie"'+
                          'chart-data="$ctrl.newQuestionsQuota.data" '+
                          'chart-labels="$ctrl.newQuestionsQuota.labels" '+
                          'chart-options="$ctrl.options">'+
                          '</canvas>'+
                      '</div>'+
                      '<div class="chartBottomMargin"></div>'+
                      '<div class="col-xs-12">'+
                        '<canvas class="chart chart-pie"'+
                        'chart-data="$ctrl.postCreditQuestionQuota.data" '+
                        'chart-labels="$ctrl.postCreditQuestionQuota.labels" '+
                        'chart-options="$ctrl.options">'+
                        '</canvas>'+
                      '</div>',
            controller: function userQuotaCtrl($translate, customerStatsService) {
                'ngInject';

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

                this.newQuestionsQuota = {
                    labels: [],
                    data: []
                };
                this.postCreditQuestionQuota = {
                    labels: [],
                    data: []
                };
                customerStatsService.getQuota().then((quota) => {

                    this.newQuestionsQuota.data = [
                        quota['totalNewQuestionsQuota'] - quota['leftNewQuestionsQuota'],
                        quota['leftNewQuestionsQuota']
                    ];
                    this.newQuestionsQuota.labels[0] = $translate.instant('STATS.ACCOUNT.SPENTNEWQUESTIONSQUOTA');
                    this.newQuestionsQuota.labels[1] = $translate.instant('STATS.ACCOUNT.LEFTNEWQUESTIONSQUOTA');

                    this.postCreditQuestionQuota.data = [
                        quota['totalPostCreditQuestionsQuota'] - quota['leftPostCreditQuestionsQuota'],
                        quota['leftPostCreditQuestionsQuota']
                    ];
                    this.postCreditQuestionQuota.labels[0] = $translate.instant('STATS.ACCOUNT.SPENTPOSTCREDITQUESTIONSQUOTA');
                    this.postCreditQuestionQuota.labels[1] = $translate.instant('STATS.ACCOUNT.LEFTPOSTCREDITQUESTIONSQUOTA');
                });
            }
        });



})();
