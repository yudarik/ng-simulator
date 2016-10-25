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
        template: '<div class="col-xs-12">\n                            <div id="practiceTypeGrades" class="amChart"></div>\n                      </div>',
        controller: ["$translate", "baConfig", "customerService", function practicesPerformedCtrl($translate, baConfig, customerService) {
            'ngInject';

            var _this = this;

            var layoutColors = baConfig.colors;

            var chartColors = _.values(layoutColors.dashboard);

            var chartConf = {
                titles: [{ text: this.titleLabel, size: 18 }],
                type: 'serial',
                theme: 'default',
                color: layoutColors.defaultText,
                dataProvider: [],
                valueAxes: [{
                    axisAlpha: 0,
                    position: 'left',
                    title: $translate.instant('STATS.DASHBOARD.CHARTS.PRACTICES_PERFORMED.XAXIS_TITLE'),
                    titleFontSize: 14,
                    gridAlpha: 0.5,
                    gridColor: layoutColors.border
                }],
                startDuration: 1,
                graphs: [{
                    balloonText: '<b>[[category]]: [[value]]</b>',
                    fillColorsField: 'color',
                    fillAlphas: 0.7,
                    lineAlpha: 0.2,
                    type: 'column',
                    valueField: 'questions'
                }],
                chartCursor: {
                    categoryBalloonEnabled: false,
                    cursorAlpha: 0,
                    zoomable: false
                },
                categoryField: 'type',
                categoryAxis: {
                    gridPosition: 'start',
                    labelRotation: 0,
                    gridAlpha: 0.5,
                    gridColor: layoutColors.border,
                    fontSize: 14
                },
                export: {
                    enabled: true
                }
            };

            this.getData = function () {

                return customerService.getQuota().then(function (quota) {

                    return _.compact(['examsPerformed', 'generalPracticesPerformed', 'suggestedPracticesPerformed', 'predefinedExamsPerformed'].map(function (key, index) {
                        if (quota[key] > 0) {
                            return {
                                type: $translate.instant('STATS.ACCOUNT.' + key.toUpperCase()),
                                questions: quota[key],
                                color: chartColors[index]
                            };
                        } else return false;
                    }));
                });
            };

            this.$onInit = function () {
                _this.getData().then(function (data) {
                    chartConf.dataProvider = data;
                    AmCharts.makeChart('practiceTypeGrades', chartConf);
                });
            };
        }]
    });
})();