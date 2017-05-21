/**
 * Created by arikyudin on 23/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components.charts')
        .component('userQuota', {
            bindings: {
                titleLabel: '<',
                titleTooltip: '<'
            },
            template: `<h4 class="text-center" tooltip="{{::$ctrl.titleTooltip}}" tooltip-placement="bottom">{{::$ctrl.titleLabel}}</h4>
                        <div id="questionsQuotaChart" class="amChart"></div>
                       `,
            controller: function userQuotaCtrl($rootScope, $translate, customerService, simulator_config) {
                'ngInject';

               var chartConfig = {
                   "type": "serial",
                   "categoryField": "category",
                   "fontSize": 14,
                   "fontFamily": "'Arimo', sans-serif",
                   "angle": 30,
                   "depth3D": 30,
                   "startDuration": 1,
                   "categoryAxis": {
                       "gridPosition": "start"
                   },
                   "trendLines": [],
                   "graphs": [
                       {
                           "balloonText": "[[title]] [[category]]:[[value]]",
                           "fillAlphas": 1,
                           "fillColors": "#008000",
                           "id": "AmGraph-1",
                           "lineThickness": 0,
                           "title": $translate.instant("STATS.ACCOUNT.QUOTA_LEFT"),
                           "type": "column",
                           "valueField": "column-1"
                       },
                       {
                           "balloonText": "[[title]] [[category]]:[[value]]",
                           "fillAlphas": 1,
                           "fillColors": "#AAB3B3",
                           "id": "AmGraph-2",
                           "lineThickness": 0,
                           "title": $translate.instant("STATS.ACCOUNT.TOTAL_ELIGIBLE"),
                           "type": "column",
                           "valueField": "column-2"
                       }
                   ],
                   "guides": [],
                   "valueAxes": [
                       {
                           "id": "ValueAxis-1",
                           "stackType": "3d",
                           "title": $translate.instant("STATS.ACCOUNT.QUESTIONS_AMOUNT")
                       }
                   ],
                   "allLabels": [],
                   "balloon": {},
                   "legend": {
                       "enabled": true,
                       "useGraphSettings": true
                   },
                   "titles": [],
                   "dataProvider": []
               };

                this.$onInit = () => {

                    var chart = AmCharts.makeChart('questionsQuotaChart', chartConfig);

                    customerService.getQuota().then((quota) => {

                        if (simulator_config.postCreditModeEnabled) {
                            chartConfig.dataProvider.push({
                                "category": $translate.instant('STATS.ACCOUNT.POST_CREDIT_QUESTIONS'),
                                //category2: $translate.instant('STATS.ACCOUNT.TOTALPOSTCREDITQUESTIONSQUOTA'),
                                "column-1": quota['leftPostCreditQuestionsQuota'],
                                "column-2": quota['totalPostCreditQuestionsQuota']// - quota['leftPostCreditQuestionsQuota']
                            });
                        }

                        chartConfig.dataProvider.push({
                            "category": $translate.instant('STATS.ACCOUNT.NEW_QUESTIONS'),
                            //category2: $translate.instant('STATS.ACCOUNT.TOTALNEWQUESTIONSQUOTA'),
                            "column-1": quota['leftNewQuestionsQuota'],
                            "column-2": quota['totalNewQuestionsQuota']// - quota['leftNewQuestionsQuota']
                        });

                        chart.validateData();

                        $rootScope.$broadcast('rebuildStateBasedMenuItems', {quota});
                    });
                };

            },
            controllerAs: '$ctrl'
        });



})();
