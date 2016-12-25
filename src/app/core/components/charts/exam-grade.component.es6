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
            controller: function examGradeGaugeCtrl() {
                'ngInject';

                let chartConf = {
                    "type": "gauge",
                    "theme": "light",
                    "axes": [ {
                        "axisThickness": 1,
                        "axisAlpha": 0.2,
                        "tickAlpha": 0.2,
                        "valueInterval": 20,
                        "bands": [ {
                            "color": "#cc4748",
                            "endValue": 60,
                            "startValue": 0
                        }, {
                            "color": "#fdd400",
                            "endValue": 80,
                            "startValue": 61
                        }, {
                            "color": "#84b761",
                            "endValue": 100,
                            "innerRadius": "95%",
                            "startValue": 81
                        } ],
                        "bottomText": "0 %",
                        "bottomTextYOffset": -20,
                        "endValue": 100
                    } ],
                    "arrows": [ {} ],
                    "export": {
                        "enabled": true
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
                                    gaugeChart.arrows[ 0 ].setValue( this.examGrade );
                                    gaugeChart.axes[ 0 ].setBottomText( this.examGrade );
                                }
                            }
                        }
                    }

                };
            }
        });

})();
