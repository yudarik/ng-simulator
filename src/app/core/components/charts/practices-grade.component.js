'use strict';

/**
 * Created by arikyudin on 23/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components.charts').component('practicesGrade', {
        bindings: {
            titleLabel: '<'
        },
        template: '<div id="practicesGradeChart" class="amChart" style="height:300px;"></div>',
        controller: /** @ngInject */
        ["$translate", "$filter", "$state", "examService", "simulator_config", function practicesGradeCtrl($translate, $filter, $state, examService, simulator_config) {
            var _this = this;

            var translate = {
                grade: $translate.instant('STATS.DASHBOARD.CHARTS.GENERAL.GRADE'),
                type: $translate.instant('STATS.DASHBOARD.CHARTS.GENERAL.TYPE'),
                timeSpent: $translate.instant('STATS.DASHBOARD.CHARTS.GENERAL.TIME_SPENT'),
                date: $translate.instant('STATS.DASHBOARD.CHARTS.GENERAL.DATE'),
                practiceID: $translate.instant('STATS.DASHBOARD.CHARTS.GENERAL.PRACTICEID')
            };

            var colors = {
                "PRACTICE": "Purple",
                "EXAM": "Red",
                "SUGGESTED_PRACTICE": "Cyan",
                "PREDEFINED_EXAM": "Green",
                "REPEATED_PRACTICE": "Orange",
                "POST_CREDIT_PRACTICE": "Blue",
                "WEAK_AREAS_PRACTICE": "Yellow"
            };

            var chartConf = {
                "type": "serial",
                "categoryField": "Practice Date",
                "dataDateFormat": "DD/MM/YYYY HH:NN:SS",
                "maxSelectedSeries": 20,
                "maxZoomFactor": 10,
                "startDuration": 1,
                "categoryAxis": {
                    "autoRotateAngle": 39.6,
                    "autoRotateCount": 1,
                    "gridPosition": "start",
                    "labelColorField": "",
                    "twoLineMode": true,
                    "labelRotation": 50.4,
                    "title": translate.date,
                    "titleRotation": 0
                },
                "chartCursor": {
                    "enabled": false,
                    "cursorAlpha": 0,
                    "oneBalloonOnly": true,
                    "zoomable": false
                },
                "trendLines": [],
                "graphs": [{
                    "animationPlayed": true,
                    "balloonText": "[[Practice Type]]: [[value]]",
                    "colorField": "Practice Color",
                    "fillAlphas": 1,
                    "id": "AmGraph-1",
                    "legendAlpha": 1,
                    "legendValueText": "",
                    "lineColorField": "Practice Type",
                    "markerType": "square",
                    "stackable": false,
                    "title": translate.type,
                    "type": "column",
                    "valueField": "Practice Grade",
                    "visibleInLegend": false,
                    "xAxis": "ValueAxis-1"
                }, {
                    "balloonColor": "#FF0000",
                    "balloonText": "Minimum Passing Grade [[value]]",
                    "color": "#FF0000",
                    "id": "AmGraph-2",
                    "labelText": "",
                    "lineColor": "#FF0000",
                    "lineThickness": 2,
                    "title": "graph 2",
                    "type": "smoothedLine",
                    "valueField": "Minimum Passing Grade",
                    "visibleInLegend": false
                }],
                "guides": [],
                "valueAxes": [{
                    "id": "ValueAxis-1",
                    "title": translate.grade
                }],
                "allLabels": [],
                "balloon": {},
                "legend": {
                    "enabled": false,
                    "accessibleLabel": "",
                    "labelText": "Practice Type",
                    "valueText": "[[Practice Type]]"
                },
                "titles": [{
                    "id": "Title-1",
                    "size": 15,
                    "text": this.titleLabel,
                    "color": "#666666"
                }],
                "dataProvider": [],
                "listeners": [{
                    "event": "clickGraphItem",
                    "method": function method(event) {
                        _this.onClick(event);
                    }
                }]
            };

            this.numberFilter = $filter('number');
            this.allPractices = [];

            this.onClick = function (data) {

                var item = getItem(data.item);
                var practice = _.find(_this.allPractices, { practiceID: item["Practice ID"] });

                examService.getPracticeInfo(item["Practice ID"]).then(function (solution) {
                    $state.go('exams.practice-summary', { examSummary: _.assign({}, practice, { questions: solution.questions }) });
                });
            };

            this.$onInit = function () {
                examService.getStats().then(function (practices) {

                    _this.allPractices = practices;

                    chartConf.dataProvider = practices.map(function (practice) {

                        return {
                            "Practice Date": moment(practice.date).format("hh:mm DD/MM/YYYY"),
                            "Practice Type": $translate.instant('EXAMS.TYPES.' + practice.practiceType),
                            "Practice Color": colors[practice.practiceType],
                            "Practice Grade": _this.numberFilter(practice.grade, 1),
                            "Minimum Passing Grade": simulator_config.passingGrade,
                            "Practice ID": practice.practiceID
                        };
                    });

                    AmCharts.makeChart('practicesGradeChart', chartConf);
                });
            };

            function getItem(item) {

                if (!item || !item.dataContext) {
                    return;
                }

                return item.dataContext;
            }
        }]

    });
})();