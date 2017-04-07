/**
 * Created by arikyudin on 23/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components.charts')
        .component('categoriesGrade', {
            bindings: {
                stats: '=',
                titleLabel: '<',
                titleTooltip: '<'
            },
            template: `<h4 class="text-center" uib-tooltip="{{::$ctrl.titleTooltip}}">{{::$ctrl.titleLabel}}</h4>
                        <div id="categoriesGradeChart" class="amChart"></div>`,
            controller: /** @ngInject */
                function CategoriesChartsCtrl($translate, $filter, statsService, simulator_config) {

                var numberFilter = $filter('number');

                var chartColors = ['Yellow', 'Brown', 'Cyan', 'Red', 'Grey', 'Gold', 'Green', 'Orange', 'Blue', 'Pink'];

                var translations = {
                    passing: $translate.instant('STATS.DASHBOARD.CHARTS.GRADES_RADAR.PASSING_GRADE'),
                    grade: $translate.instant('STATS.DASHBOARD.CHARTS.GRADES_RADAR.GRADE'),
                    category: $translate.instant('STATS.DASHBOARD.CHARTS.GRADES_RADAR.CATEGORY'),
                    title: $translate.instant('STATS.DASHBOARD.CHARTS.GRADES_RADAR.TITLE')
                };

                var chartConf = {
                    "type": "serial",
                    "categoryField": "Category",
                    "dataDateFormat": "DD/MM/YYYY HH:NN:SS",
                    "maxSelectedSeries": 20,
                    "maxZoomFactor": 10,
                    "startDuration": 1,
                    "fontFamily": "'Arimo', sans-serif",
                    "categoryAxis": {
                        "autoRotateAngle": 45,
                        "autoRotateCount": 1,
                        "gridPosition": "start",
                        "labelColorField": "",
                        "twoLineMode": true,
                        "labelRotation": 39.6,
                        "minHorizontalGap": 82,
                        "title": translations.category,
                        "titleRotation": 0
                    },
                    "chartCursor": {
                        "enabled": true,
                        "animationDuration": 0,
                        "bulletSize": 7,
                        "categoryBalloonEnabled": false,
                        "cursorAlpha": 0,
                        "graphBulletSize": 0,
                        "oneBalloonOnly": true,
                        "zoomable": false
                    },
                    "trendLines": [],
                    "graphs": [
                        {
                            "animationPlayed": true,
                            "balloonText": "[[Category]]: [[value]]",
                            "bulletHitAreaSize": 3,
                            "colorField": "Practice Color",
                            "fillAlphas": 1,
                            "id": "AmGraph-1",
                            "labelText": "",
                            "legendAlpha": 1,
                            "legendValueText": "[[value]]",
                            "lineColorField": "Practice Type",
                            "lineThickness": 0,
                            "markerType": "square",
                            "negativeBase": 5,
                            "showAllValueLabels": true,
                            "stackable": false,
                            "title": "",
                            "type": "column",
                            "valueAxis": "ValueAxis-1",
                            "valueField": "Category Grade",
                            "visibleInLegend": false,
                            "xAxis": "ValueAxis-1",
                            "yAxis": "ValueAxis-1"
                        },
                        {
                            "animationPlayed": true,
                            "balloonColor": "#FF0000",
                            "balloonText": translations.passing+" : [[value]]",
                            "color": "#FF0000",
                            "columnWidth": 0,
                            "dashLength": 8,
                            "gapPeriod": 0,
                            "id": "Minimum Passing Grade",
                            "lineColor": "#FF0000",
                            "markerType": "line",
                            "minDistance": 0,
                            "showBalloon": false,
                            "stackable": false,
                            "switchable": false,
                            "tabIndex": 0,
                            "title": `${translations.passing}: 60`,
                            "topRadius": 0,
                            "type": "smoothedLine",
                            "valueField": "Passing Grade"
                        }
                    ],
                    "guides": [],
                    "valueAxes": [
                        {
                            "id": "ValueAxis-1",
                            "maximum": 100,
                            "title": translations.grade
                        }
                    ],
                    "allLabels": [],
                    "balloon": {},
                    "legend": {
                        "enabled": true,
                        "accessibleLabel": "",
                        "combineLegend": true,
                        "valueText": ""
                    },
                    "titles": [
                        /*{
                            "id": "Title-1",
                            "size": 15,
                            "text": translations.title,
                        }*/
                    ],
                    "dataProvider": []
                };

                this.init = (categoriesStats) => {

                    chartConf.dataProvider = categoriesStats.map((categoryStat,index)=>{

                        return {
                            "Practice Color": chartColors[index % chartColors.length],
                            "Category Grade": numberFilter(getGrade4Category(categoryStat), 0),
                            "Category": _.get(categoryStat, 'category.name'),
                            "Passing Grade": simulator_config.passingGrade
                        };
                    });

                    AmCharts.makeChart('categoriesGradeChart', chartConf);
                };

                function getGrade4Category(cat) {
                    return ((cat.questionIDsCorrectlyAnswered.length / cat.totalQuestionsAskedInCategory) * 100);
                }

                this.$onInit = () => {
                    if (!this.stats) {

                        statsService.getCategories().then(this.init);
                    } else {
                        this.init(this.stats);
                    }
                };

                this.$onChanges = (changes) =>  {

                    if (changes && changes.stats){
                        this.stats = changes.stats.newValue;

                        init(this.stats);
                    }
                };
            }
        });



})();
