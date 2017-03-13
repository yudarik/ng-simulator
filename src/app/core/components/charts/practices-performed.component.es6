/**
 * Created by arikyudin on 23/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components.charts')
        .component('practicesPerformed', {
            bindings: {
                titleLabel: '<',
                titleTooltip: '<'
            },
            template: `<h4 class="text-center" 
                            tooltip="{{::$ctrl.titleTooltip}}">{{::$ctrl.titleLabel}}</h4>
                        <div id="practiceTypeGrades" class="amChart"></div>`,
            controller: function practicesPerformedCtrl($translate, baConfig, customerService, examService) {
                'ngInject';

                var layoutColors = baConfig.colors;

                var chartColors = _.values(layoutColors.dashboard);

                var chartConf = {
                    titles: [
                        /*{
                            text: this.titleLabel,
                            size: 15,
                            "color": "#666666"
                        }*/
                    ],
                    type: 'serial',
                    theme: 'default',
                    fontFamily: "'Arimo', sans-serif",
                    color: layoutColors.defaultText,
                    dataProvider: [],
                    valueAxes: [
                        {
                            axisAlpha: 0,
                            position: 'left',
                            title: $translate.instant('STATS.DASHBOARD.CHARTS.PRACTICES_PERFORMED.XAXIS_TITLE'),
                            titleFontSize: 14,
                            gridAlpha: 0.5,
                            gridColor: layoutColors.border,
                        }
                    ],
                    startDuration: 1,
                    graphs: [
                        {
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
                        }
                    ],
                    chartCursor: {
                        categoryBalloonEnabled: true,
                        cursorAlpha: 0,
                        zoomable: false
                    },
                    categoryField: 'type',
                    categoryAxis: {
                        gridPosition: 'start',
                        labelRotation: 39.6,
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
                this.getQuestionsSum = (allPractices) => {
                    return _.sumBy(allPractices, 'questionNumber');
                };

                this.getData = () => {

                    return examService.getStats().then((quota) => {

                        var grouped = _.groupBy(quota, 'practiceType');
                        var practiceTypesPerformed = _.keys(grouped);

                        return practiceTypesPerformed.map((key,index) => {
                            if (grouped[key].length > 0) {
                                return {
                                    type: $translate.instant('EXAMS.TYPES.'+key.toUpperCase()),
                                    questions: this.getQuestionsSum(grouped[key]),
                                    practices: grouped[key].length,
                                    color: chartColors[index]
                                };
                            } else return false;

                        });
                    });
                };

                this.$onInit = ()=>{
                    this.getData().then(data => {
                        chartConf.dataProvider = data;
                        AmCharts.makeChart('practiceTypeGrades',chartConf);
                    })
                };
            }
        });

})();
