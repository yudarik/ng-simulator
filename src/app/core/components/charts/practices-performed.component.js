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
        template: '<div id="practiceTypeGrades" class="amChart"></div>',
        controller: ["$translate", "baConfig", "customerService", "examService", function practicesPerformedCtrl($translate, baConfig, customerService, examService) {
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
                    "accessibleLabel": "[[category]] [[value]]",
                    "balloonText": "[[category]]\n שאלות:[[value]], תרגולים:[[practices]]",
                    "columnWidth": 0.6,
                    "dashLength": 70,
                    "fillAlphas": 1,
                    "fillColors": "#008000",
                    "fillColorsField": "color",
                    "fixedColumnWidth": 80,
                    "id": "AmGraph-1",
                    "legendValueText": "",
                    "lineAlpha": 0,
                    "lineColor": "#008000",
                    "lineThickness": 0,
                    "title": "graph 1",
                    "type": "column",
                    "valueField": "questions",
                    "visibleInLegend": false
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
                "legend": {
                    "enabled": false,
                    "useGraphSettings": true
                },
                export: {
                    enabled: true
                }
            };
            this.getQuestionsSum = function (allPractices) {
                return _.sumBy(allPractices, 'questionNumber');
            };

            this.getData = function () {

                return examService.getStats().then(function (quota) {

                    var grouped = _.groupBy(quota, 'practiceType');
                    var practiceTypesPerformed = _.keys(grouped);

                    return practiceTypesPerformed.map(function (key, index) {
                        if (grouped[key].length > 0) {
                            return {
                                type: $translate.instant('STATS.ACCOUNT.' + key.toUpperCase()),
                                questions: _this.getQuestionsSum(grouped[key]),
                                practices: grouped[key].length,
                                color: chartColors[index]
                            };
                        } else return false;
                    });
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