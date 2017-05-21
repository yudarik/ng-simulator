/**
 * Created by arikyudin on 23/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components.charts')
        .component('timeCylinder', {
            bindings: {
                timeElapsed: '<',
                totalTime: '<'
            },
            template: `<div id="timeCylinder" class="amChart"></div>`,
            controller: function timeCylinderCtrl($translate, $filter) {
                'ngInject';

                var timeframe = $filter('timeframe');

                var chartConf = {
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
                            "balloonText": "[[title]]: [[value]]",
                            /*"balloonFunction": (graphDataItem) => {
                                return `${graphDataItem.dataContext.category}: ${this.toTimeString(graphDataItem.dataContext["column-1"])}`;
                            },*/
                            "columnWidth": 0.6,
                            "fillAlphas": 1,
                            "fillColors": "#008000",
                            "id": "AmGraph-1",
                            "lineThickness": 0,
                            "title": $translate.instant('EXAMS.SUMMARY.TIME_ELAPSED'),
                            "type": "column",
                            "valueField": "column-1"
                        },
                        {
                            "balloonText": "[[title]]: [[value]]",
                            /*"balloonFunction": (graphDataItem) => {
                                return `${graphDataItem.dataContext.category}: ${this.toTimeString(graphDataItem.dataContext["column-2"])}`;
                            },*/
                            "columnWidth": 0.6,
                            "fillAlphas": 1,
                            "fillColors": "#AAB3B3",
                            "id": "AmGraph-2",
                            "lineThickness": 0,
                            "title": $translate.instant('EXAMS.SUMMARY.TOTAL_TIME'),
                            "type": "column",
                            "valueField": "column-2"
                        }
                    ],
                    "guides": [],
                    "valueAxes": [
                        {
                            "duration": "ss",
                            "id": "ValueAxis-1",
                            "stackType": "3d",
                            "title": $translate.instant('EXAMS.SUMMARY.TIME')
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
                    chartConf.dataProvider.push({
                        category: $translate.instant('EXAMS.SUMMARY.TIME_ELAPSED'),
                        //category2: $translate.instant('EXAMS.SUMMARY.TOTAL_TIME'),
                        "column-1": this.timeElapsed,
                        "column-2": this.totalTime - this.timeElapsed
                    });
                    AmCharts.makeChart('timeCylinder', chartConf);
                };

                this.toTimeString = (seconds) => {
                    return moment("1900-01-01 00:00:00").add(parseInt(seconds), 'seconds').format("HH:mm:ss");
                }

            },
            controllerAs: '$ctrl'
        });



})();
