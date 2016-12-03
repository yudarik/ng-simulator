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
                    "theme": "light",
                    "type": "serial",
                    "depth3D": 100,
                    "angle": 30,
                    "autoMargins": false,
                    "marginBottom": 100,
                    "marginLeft": 350,
                    "marginRight": 300,
                    "dataProvider": [],
                    "valueAxes": [ {
                        "stackType": "100%",
                        "gridAlpha": 0
                    } ],
                    "graphs": [ {
                        "type": "column",
                        "topRadius": 1,
                        "columnWidth": 1,
                        "showOnAxis": true,
                        "lineThickness": 2,
                        "lineAlpha": 0.5,
                        "lineColor": "#FFFFFF",
                        "fillColors": "#8d003b",
                        "fillAlphas": 0.8,
                        "valueField": "value1",
                        "balloonText": "[[category1]]: [[value]]"
                    }, {
                        "type": "column",
                        "topRadius": 1,
                        "columnWidth": 1,
                        "showOnAxis": true,
                        "lineThickness": 2,
                        "lineAlpha": 0.5,
                        "lineColor": "#cdcdcd",
                        "fillColors": "#cdcdcd",
                        "fillAlphas": 0.5,
                        "valueField": "value2",
                        "balloonText": "[[category2]]: [[value]]"
                    } ],

                    "categoryField": "category1",
                    "categoryAxis": {
                        "axisAlpha": 0,
                        "labelOffset": 40,
                        "gridAlpha": 0
                    },
                    "export": {
                        "enabled": false
                    }
                };

                this.$onInit = () => {
                    chartConf.dataProvider.push({
                        category1: $translate.instant('EXAMS.SUMMARY.TIME_ELAPSED'),
                        category2: $translate.instant('EXAMS.SUMMARY.TOTAL_TIME'),
                        value1: this.timeElapsed,
                        value2: this.totalTime - this.timeElapsed
                    });
                    AmCharts.makeChart('timeCylinder', chartConf);
                };

            },
            controllerAs: '$ctrl'
        });



})();
