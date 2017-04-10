/**
 * Created by arikyudin on 23/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components.charts')
        .component('examGradeGauge', {
            bindings: {
                titleLabel: '<',
                examGrade: '<'
            },
            template: `<div id="examGradeGauge" class="amChart" style="width:100%;height:300px"></div>`,
            controller: function examGradeGaugeCtrl($filter, simulator_config) {
                'ngInject';

                let passingGrade = simulator_config.passingGrade;
                let warningArea = (100 - passingGrade)/2;

                let chartConf = {
                    "type": "gauge",
                    "theme": "light",
                    "fontFamily": "'Arimo', sans-serif",
                    "fontSize": 14,
                    "axes": [ {
                        "axisThickness": 1,
                        "axisAlpha": 0.2,
                        "tickAlpha": 0.2,
                        "valueInterval": 20,
                        "bands": [ {
                            "balloonText": "Failed",
                            "color": "#FF0000",
                            "endValue": passingGrade - 0.1,
                            "startValue": 0
                        }, {
                            "balloonText": "Passed",
                            "color": "#fdd400",
                            "endValue": passingGrade + warningArea,
                            "startValue": passingGrade
                        }, {
                            "balloonText": "Succeeded",
                            "color": "#00CC00",
                            "endValue": 100,
                            "innerRadius": "95%",
                            "startValue": 100 - warningArea + 0.1
                        } ],
                        "bottomText": "0 %",
                        "bottomTextYOffset": -20,
                        "endValue": 100
                    } ],
                    "arrows": [ {} ],
                    "export": {
                        "enabled": false
                    },
                    "titles": [
                        {
                            "text": this.titleLabel,
                            "size": 15
                        }
                    ]
                };

                this.$onInit = ()=>{
                    let gaugeChart = AmCharts.makeChart('examGradeGauge',chartConf);

                    if ( gaugeChart ) {
                        if ( gaugeChart.arrows ) {
                            if ( gaugeChart.arrows[ 0 ] ) {
                                if ( gaugeChart.arrows[ 0 ].setValue ) {
                                    gaugeChart.arrows[ 0 ].setValue( $filter('number')(this.examGrade) );
                                    gaugeChart.axes[ 0 ].setBottomText( $filter('number')(this.examGrade, 0) + '%' );
                                }
                            }
                        }
                    }

                };
            }
        });

})();
