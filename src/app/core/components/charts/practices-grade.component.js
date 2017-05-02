'use strict';

/**
 * Created by arikyudin on 23/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components.charts').component('practicesGrade', {
        bindings: {
            titleLabel: '<',
            titleTooltip: '<',
            userType: '<'
        },
        template: '<h4 class="text-center" uib-tooltip="{{::$ctrl.titleTooltip}}">{{::$ctrl.titleLabel}}</h4>\n                       <h6 class="text-center" style="color:#0000FF">{{::$ctrl.translate.clickActionLabel}}</h6>\n                        <div id="practicesGradeChart" class="amChart flip float-left"></div>',
        controller: /** @ngInject */
        ["$translate", "$filter", "$state", "examService", "simulator_config", "baConfig", function practicesGradeCtrl($translate, $filter, $state, examService, simulator_config, baConfig) {
            var _this = this;

            var translate = {
                grade: $translate.instant('STATS.DASHBOARD.CHARTS.GENERAL.GRADE'),
                type: $translate.instant('STATS.DASHBOARD.CHARTS.GENERAL.TYPE'),
                timeSpent: $translate.instant('STATS.DASHBOARD.CHARTS.GENERAL.TIME_SPENT'),
                date: $translate.instant('STATS.DASHBOARD.CHARTS.GENERAL.DATE'),
                practiceID: $translate.instant('STATS.DASHBOARD.CHARTS.GENERAL.PRACTICEID'),
                minimumPassingGrade: $translate.instant('STATS.DASHBOARD.CHARTS.GENERAL.MINIMUM_PASSING_GRADE'),
                clickActionLabel: $translate.instant('STATS.DASHBOARD.CHARTS.PRACTICES_GRADE.CLICK_ON_CHART_TITLE'),
                generalPractice: $translate.instant('EXAMS.TYPES.GENERAL_PRACTICE'),
                repeatedGeneralPractice: $translate.instant('EXAMS.TYPES.REPEATED_GENERAL_PRACTICE'),
                exam: $translate.instant('EXAMS.TYPES.EXAM'),
                repeatedExam: $translate.instant('EXAMS.TYPES.REPEATED_EXAM'),
                suggestedPractice: $translate.instant('EXAMS.TYPES.SUGGESTED_PRACTICE'),
                repeatedSuggestedPractice: $translate.instant('EXAMS.TYPES.REPEATED_SUGGESTED_PRACTICE'),
                predefinedExam: $translate.instant('EXAMS.TYPES.PREDEFINED_EXAM'),
                repeatedPredefinedExam: $translate.instant('EXAMS.TYPES.REPEATED_PREDEFINED_EXAM'),
                postCreditPractice: $translate.instant('EXAMS.TYPES.POST_CREDIT_PRACTICE'),
                repeatedPostCreditPractice: $translate.instant('EXAMS.TYPES.REPEATED_POST_CREDIT_PRACTICE'),
                weakAreasPractice: $translate.instant('EXAMS.TYPES.WEAK_AREAS_PRACTICE'),
                repeatedWeakAreasPractice: $translate.instant('EXAMS.TYPES.REPEATED_WEAK_AREAS_PRACTICE'),
                demoPractice: $translate.instant('EXAMS.TYPES.DEMO'),
                demoPredefinedPractice: $translate.instant('EXAMS.TYPES.DEMO_PREDEFINED_EXAM')
            };
            this.translate = translate;

            var layoutColors = baConfig.colors;

            var chartColors = layoutColors.dashboard;

            var practiceTypesToDisplay = {
                Customer: [{
                    "clustered": false,
                    "id": "General Practice [for legend]",
                    "fillColors": chartColors.PRACTICE,
                    "legendColor": chartColors.PRACTICE,
                    "stackable": false,
                    "title": translate.generalPractice
                }, {
                    "fillColors": chartColors.REPEATED_PRACTICE,
                    "id": "Repeated General Practice [for legend]",
                    "legendAlpha": 1,
                    "legendColor": chartColors.REPEATED_PRACTICE,
                    "legendPeriodValueText": "",
                    "legendValueText": "",
                    "lineColor": chartColors.REPEATED_PRACTICE,
                    "markerType": "square",
                    "title": translate.repeatedGeneralPractice
                }, {
                    "id": "Exam [for legend]",
                    "fillColors": chartColors.EXAM,
                    "legendColor": chartColors.EXAM,
                    "title": translate.exam
                }, {
                    "id": "Repeated Exam [for legend]",
                    "legendColor": chartColors.REPEATED_EXAM,
                    "fillColors": chartColors.REPEATED_EXAM,
                    "lineColor": chartColors.REPEATED_EXAM,
                    "title": translate.repeatedExam
                }, {

                    "fixedColumnWidth": -1,
                    "id": "Predefined Exam [for legend]",
                    "fillColors": chartColors.PREDEFINED_EXAM,
                    "legendColor": chartColors.PREDEFINED_EXAM,
                    "lineColor": chartColors.PREDEFINED_EXAM,
                    "lineThickness": 0,
                    "title": translate.predefinedExam
                },
                /*{
                 "fillColors": chartColors.REPEATED_PREDEFINED_EXAM,
                 "id": "Repeated Predefined Exam [for legend]",
                 "legendColor": chartColors.REPEATED_PREDEFINED_EXAM,
                 "title": translate.repeatedPredefinedExam
                 },*/
                {
                    "fillColors": chartColors.POST_CREDIT_PRACTICE,
                    "legendColor": chartColors.POST_CREDIT_PRACTICE,
                    "id": "Post Credit Practice [for legend]",
                    "title": translate.postCreditPractice
                }, {
                    "fillColors": chartColors.REPEATED_POST_CREDIT_PRACTICE,
                    "fixedColumnWidth": -1,
                    "id": "Repeated Post Credit Practice [for legend]",
                    "legendColor": chartColors.REPEATED_POST_CREDIT_PRACTICE,
                    "title": translate.repeatedPostCreditPractice
                }, {
                    "fillColors": chartColors.WEAK_AREAS_PRACTICE,
                    "fixedColumnWidth": -1,
                    "id": "Weak Areas Practice [for legend]",
                    "legendColor": chartColors.WEAK_AREAS_PRACTICE,
                    "title": translate.weakAreasPractice
                }, {
                    "id": "Repeated Suggested Practice [for legend]",
                    "legendColor": chartColors.REPEATED_WEAK_AREAS_PRACTICE,
                    "fillColors": chartColors.REPEATED_WEAK_AREAS_PRACTICE,
                    "lineColor": chartColors.REPEATED_WEAK_AREAS_PRACTICE,
                    "title": translate.repeatedWeakAreasPractice
                }],
                Candidate: [{
                    "id": "Demo Practice [for legend]",
                    "legendColor": chartColors.DEMO,
                    "fillColors": chartColors.DEMO,
                    "lineColor": chartColors.DEMO,
                    "title": translate.demoPractice
                }, {
                    "id": "Demo Predefined Practice [for legend]",
                    "legendColor": chartColors.DEMO_PREDEFINED_EXAM,
                    "fillColors": chartColors.DEMO_PREDEFINED_EXAM,
                    "lineColor": chartColors.DEMO_PREDEFINED_EXAM,
                    "title": translate.demoPredefinedPractice
                }]
            };

            var chartConf = {
                "type": "serial",
                "zoomOutText": '',
                "zoomOutButtonAlpha": 0,
                "depth3D": 2,
                "angle": 30,
                "fontFamily": "'Arimo', sans-serif",
                "fontSize": 14,
                "categoryField": "Practice Date",
                "dataDateFormat": "DD/MM/YYYY HH:NN:SS",
                "maxSelectedSeries": 20,
                //"maxZoomFactor": 10,
                "startDuration": 1,
                "theme": "default",
                "categoryAxis": {
                    "autoRotateAngle": 39.6,
                    "autoRotateCount": 1,
                    "dateFormats": [{
                        "period": "fff",
                        "format": "HH:NN:SS"
                    }, {
                        "period": "ss",
                        "format": "HH:NN:SS"
                    }, {
                        "period": "mm",
                        "format": "HH:NN"
                    }, {
                        "period": "hh",
                        "format": "HH:NN"
                    }, {
                        "period": "DD",
                        "format": "MMM DD"
                    }, {
                        "period": "WW",
                        "format": "MMM DD"
                    }, {
                        "period": "MM",
                        "format": "MMM"
                    }, {
                        "period": "YYYY",
                        "format": "YYYY"
                    }],
                    "equalSpacing": true,
                    "gridPosition": "start",
                    "labelColorField": "",
                    "minPeriod": "mm",
                    "parseDates": true,
                    "twoLineMode": true,
                    "firstDayOfWeek": 0,
                    "labelRotation": 50.4,
                    "markPeriodChange": false,
                    "title": translate.date,
                    "titleRotation": 0
                },
                "chartCursor": {
                    "enabled": true,
                    "categoryBalloonDateFormat": "DD/MM/YY, HH:NN",
                    "cursorAlpha": 0,
                    "oneBalloonOnly": true,
                    "zoomable": true
                },
                "trendLines": [],
                "graphs": [{
                    "animationPlayed": true,
                    "balloonText": "[[Practice Type]]: [[value]]",
                    "colorField": "Practice Color",
                    "customMarker": "",
                    "fillAlphas": 1,
                    "id": "The actual graph",
                    "legendAlpha": 1,
                    "legendColor": "#FF0000",
                    "legendPeriodValueText": "",
                    "legendValueText": "",
                    "lineColorField": "Practice Type",
                    "markerType": "square",
                    "showHandOnHover": true,
                    "stackable": false,
                    "switchable": false,
                    "tabIndex": 1,
                    "title": translate.type,
                    "type": "column",
                    "valueAxis": "ValueAxis-2",
                    "valueField": "Practice Grade",
                    "visibleInLegend": false,
                    "xAxis": "ValueAxis-2"
                }, {
                    "animationPlayed": true,
                    "balloonColor": "#FF0000",
                    "balloonText": translate.minimumPassingGrade + ": [[value]]",
                    "color": "#FF0000",
                    "cornerRadiusTop": 1,
                    "dashLength": 8,
                    "fillToAxis": "ValueAxis-2",
                    "gapPeriod": 0,
                    "id": "minimum passing grade",
                    "includeInMinMax": false,
                    "labelText": "",
                    "legendPeriodValueText": "",
                    "legendValueText": "",
                    "lineColor": "#FF0000",
                    "markerType": "line",
                    "minDistance": 0,
                    "periodSpan": -1,
                    "pointPosition": "",
                    "showBalloon": false,
                    "showOnAxis": true,
                    "stackable": false,
                    "title": translate.minimumPassingGrade + ': 60',
                    "type": "smoothedLine",
                    "valueField": "Minimum Passing Grade"
                }],
                "guides": [],
                "valueAxes": [{
                    "id": "ValueAxis-2",
                    "maximum": 100,
                    "minimum": 0,
                    "autoGridCount": false,
                    "title": translate.grade
                }],
                "allLabels": [],
                "balloon": {
                    "animationDuration": 0,
                    "fadeOutDuration": 0
                },
                "legend": {
                    "enabled": true,
                    "maxColumns": 5,
                    "switchable": false,
                    "tabIndex": 4,
                    "valueText": ""
                },
                "titles": [
                    /*{
                        "id": "Title-1",
                        "size": 15,
                        "text": this.titleLabel,
                    },
                    {
                        "bold": false,
                        "color": "#0000FF",
                        "id": "Title-3",
                        "text": translate.clickActionLabel
                    }*/
                ],
                "listeners": [{
                    "event": "clickGraphItem",
                    "method": function method(event) {
                        _this.onClick(event);
                    }
                }],
                "dataProvider": []
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

                    chartConf.graphs = chartConf.graphs.concat(practiceTypesToDisplay[_this.userType]);

                    chartConf.maxSelectedSeries = practices.length;
                    chartConf.dataProvider = practices.map(function (practice) {

                        return {
                            "Practice Date": moment.unix(practice.date / 1000).format("DD/MM/YYYY HH:mm:ss"),
                            "Practice Type": $translate.instant('EXAMS.TYPES.' + practice.practiceType),
                            "Practice Color": chartColors[practice.practiceType],
                            "Practice Grade": _this.numberFilter(practice.grade, 1),
                            "Minimum Passing Grade": simulator_config.passingGrade,
                            "Practice ID": practice.practiceID
                        };
                    });

                    var chart = AmCharts.makeChart('practicesGradeChart', chartConf);

                    if (!practices.length) {
                        chart.addLabel("50%", "50%", $translate.instant('STATS.DASHBOARD.CHARTS.GENERAL.NO_DATA_TO_DISPLAY'), "middle", 15);
                        chart.validateNow();
                    }
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