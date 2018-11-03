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
            template: `<div ng-show="!$ctrl.showDistribution" class="panel col-md-12" dir="ltr">
                            <div class="panel-body">
                                <div id="weakAreasChart" class="amCharts" style="height:500px;width:100%; background-color: #FFFFFF;"></div>
                                <div class="col-md-12">
                                    <a class="btn btn-default" ng-click="$ctrl.showDistribution = true;">{{::\'EXAMS.BUTTONS.CONTINUE\'|translate}}</a>
                                </div>
                            </div>
                        </div>
                        <distribution ng-if="$ctrl.showDistribution" dist="$ctrl.config" 
                                      distribution-type="'general-practice'"
                                      practice-type="'WEAK_AREAS_PRACTICE'"></distribution>`,
            controller: function($translate) {

                //let chartColors = ['#FFFF00', '#a52a2a', '#00ffff', '#ff0000', '#808080', '#FFD700', '#008000', '#ffa500', '#0000ff', '#FF00FF'];
                //let chartColors = ['#14ff5b', '#33ff33', '#1aff1a', '#00ff00', '#00e600', '#00cc00', '#00b300', '#009900', '#008000', '#006600', '#004d00', '#003300'];
                //let chartColors = ['#1ECB64', '#17C95F', '#0FC85A', '#08C655', '#08C052', '#08BA50', '#07B44D', '#07AE4B', '#07A848', '#07A246', '#069C43', '#069641', '#06913E', '#068B3B', '#058539', '#057F36', '#057934', '#057331', '#046D2F', '#04672C', '#04612A', '#045B27', '#035525', '#034F22', '#03491F', '#03431D', '#023D1A', '#023718', '#023215', '#022C13', '#022610', '#01200E', '#011A0B', '#011408', '#010E06'];

                let chart = {
                    "type": "serial",
                    "categoryField": "category",
                    "rotate": true,
                    "fontSize": 14,
                    "fontFamily": "'Arimo', 'sans-serif'",
                    "angle": 30,
                    "depth3D": 30,
                    "startDuration": 0,
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
                            "title": $translate.instant("STATS.DASHBOARD.CHARTS.WEAK_AREAS.X_AXIS_LABEL"),
                            "titleFontSize": 14
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
                            "size": 14,
                            "text": this.titleLabel
                        }
                    ],
                    "dataProvider": [],
                    "listeners": [{
                        "event": "rendered",
                        "method": handleRender
                    }],
                };

                this.showDistribution = false;

                this.$onInit = () => {

                    chart.dataProvider = _.orderBy(_.map(this.config.categories, (item, index)=> {
                        return {
                            "category": item.name,
                            "Expertise Level": this.getLevelById(item.id),
                            "Color": this.getColorHex(this.getLevelById(item.id)),
                            //"Color": chartColors[item.index % chartColors.length]
                        }
                    }), "Expertise Level", "desc");

                    let amChart = AmCharts.makeChart('weakAreasChart', chart);
                };

                this.getColorHex = (percent) => {
                    //0% == 00 GREEN COLOR in HEX
                    //100% == FF (255) GREEN COLOR in HEX

                    //e.g. for 60%...
                    //100% --> 255
                    //60% --> ?
                    //255 * 60 / 100 = 153

                    let greenDecimal = parseInt(255 * percent / 100);
                    let hexString = greenDecimal.toString(16);
                    return '#00'+hexString+'00' //adding 00 for RED and BLUE
                };

                this.getLevelById = (id) => {
                    return parseInt((1 - this.config.questionsPercentagePerCategoryId[id]) * 100);
                };

                this.getMax = () => {
                    return _.max(_.values(this.config.questionsPercentagePerCategoryId)) * 100;
                };

                function handleRender() {
                    /*$('#weakAreasChart svg g [fill*="N"]').each((index, node) =>{
                        node.attributes.fill.nodeValue = "#ffffff";
                    });*/
                }
            },
        })

})();