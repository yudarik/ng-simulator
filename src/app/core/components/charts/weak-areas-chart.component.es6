/**
 * Created by yudarik on 3/15/17.
 */
(function () {
    'use strict';

    angular.module('Simulator.components.charts')
        .component('weakAreasChart', {
            bindings: {
                config: '<',
                titleLabel: '<'
            },
            template: `<div class="panel col-md-12" dir="ltr">
                                <div class="panel-body">
                                    <div id="weakAreasChart" class="amCharts" style="height:500px;width:100%; background-color: #FFFFFF;"></div>
                                    <div class="col-md-12">
                                        <a class="btn btn-default" ui-sref="exams.distribution-general({distribution: weakAreas.practiceConfig, practiceType: 'WEAK_AREAS_PRACTICE'})">{{::\'EXAMS.BUTTONS.CONTINUE\'|translate}}</a>
                                    </div>
                                </div>
                            </div>`,
            controller: function() {

                let chartColors = ['Yellow', 'Brown', 'Cyan', 'Red', 'Grey', 'Gold', 'Green', 'Orange', 'Blue', 'Pink'];

                let chart = {
                    "type": "serial",
                    "categoryField": "category",
                    "rotate": true,
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
                            "balloonText": "[[title]] [[category]]:[[value]]%",
                            "colorField": "Color",
                            "fillAlphas": 1,
                            "fillColorsField": "Color",
                            "id": "AmGraph-1",
                            "title": "",
                            "type": "column",
                            "valueField": "Expertise Level",
                            "visibleInLegend": false
                        }
                    ],
                    "guides": [],
                    "valueAxes": [
                        {
                            "id": "ValueAxis-1",
                            "maximum": 100,
                            "minimum": 0,
                            "totalText": "",
                            "unit": "%",
                            "title": "Expertise Level",
                            "titleFontSize": 1
                        }
                    ],
                    "allLabels": [],
                    "balloon": {},
                    "legend": {
                        "enabled": true,
                        "useGraphSettings": true
                    },
                    "titles": [
                        {
                            "id": "Title-1",
                            "size": 15,
                            "text": this.titleLabel
                        }
                    ],
                    "dataProvider": []
                };

                this.$onInit = () => {

                    chart.dataProvider = _.orderBy(_.map(this.config.categories, (item, index)=> {
                        return {
                            "category": item.name,
                            "Expertise Level": this.getLevelById(item.id),
                            "Color": chartColors[index % chartColors.length]
                        }
                    }), "Expertise Level", "desc");

                    AmCharts.makeChart('weakAreasChart', chart);
                };

                this.getLevelById = (id) => {
                    return parseInt(this.config.questionsPercentagePerCategoryId[id] * 1000);
                };
            },
        })

})();