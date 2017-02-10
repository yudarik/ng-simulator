/**
 * Created by arikyudin on 23/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components.charts')
        .component('practicesGrade', {
            bindings: {
                titleLabel: '<'
            },
            template: `<div id="practicesGradeChart" class="amChart flip float-left"></div>`,
            controller: /** @ngInject */
                function practicesGradeCtrl($translate, $filter, $state, examService, simulator_config) {

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
                };

                var colors = {
                    "EXAM":  "#FF0000",
                    "REPEATED_EXAM": "#F08080",
                    "PREDEFINED_EXAM": "#FFFF00",
                    "REPEATED_PREDEFINED_EXAM":  "#FFF69C",
                    "SUGGESTED_PRACTICE": "#0000FF",
                    "REPEATED_SUGGESTED_PRACTICE": "#ADD8E6",
                    "PRACTICE":  "#008000",
                    "REPEATED_PRACTICE": "#90EE90",
                    "POST_CREDIT_PRACTICE":  "#FF00FF",
                    "REPEATED_POST_CREDIT_PRACTICE": "#EE82EE",
                    "WEAK_AREAS_PRACTICE": "Brown",
                    "REPEATED_WEAK_AREAS_PRACTICE": "Black",
                };

                var chartConf = {
                    "type": "serial",
                    "categoryField": "Practice Date",
                    "dataDateFormat": "DD/MM/YYYY HH:NN:SS",
                    "maxSelectedSeries": 20,
                    "maxZoomFactor": 10,
                    "startDuration": 1,
                    "theme": "default",
                    "categoryAxis": {
                        "autoRotateAngle": 39.6,
                        "autoRotateCount": 1,
                        "dateFormats": [
                            {
                                "period": "fff",
                                "format": "HH:NN:SS"
                            },
                            {
                                "period": "ss",
                                "format": "HH:NN:SS"
                            },
                            {
                                "period": "mm",
                                "format": "HH:NN"
                            },
                            {
                                "period": "hh",
                                "format": "HH:NN"
                            },
                            {
                                "period": "DD",
                                "format": "MMM DD"
                            },
                            {
                                "period": "WW",
                                "format": "MMM DD"
                            },
                            {
                                "period": "MM",
                                "format": "MMM"
                            },
                            {
                                "period": "YYYY",
                                "format": "YYYY"
                            }
                        ],
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
                        "zoomable": false
                    },
                    "trendLines": [],
                    "graphs": [
                        {
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
                        },
                        {
                            "animationPlayed": true,
                            "balloonColor": "#FF0000",
                            "balloonText": translate.minimumPassingGrade+": [[value]]",
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
                            "title": `${translate.minimumPassingGrade}: 60`,
                            "type": "smoothedLine",
                            "valueField": "Minimum Passing Grade"
                        },
                        {
                            "clustered": false,
                            "id": "General Practice [for legend]",
                            "fillColors": colors.PRACTICE,
                            "legendColor": colors.PRACTICE,
                            "stackable": false,
                            "title": translate.generalPractice
                        },
                        {
                            "fillColors": colors.REPEATED_PRACTICE,
                            "id": "Repeated General Practice  [for legend]",
                            "legendAlpha": 1,
                            "legendColor": colors.REPEATED_PRACTICE,
                            "legendPeriodValueText": "",
                            "legendValueText": "",
                            "lineColor": colors.REPEATED_PRACTICE,
                            "markerType": "square",
                            "title": translate.repeatedGeneralPractice
                        },
                        {
                            "id": "Exam [for legend]",
                            "fillColors": colors.EXAM,
                            "legendColor": colors.EXAM,
                            "title": translate.exam
                        },
                        {
                            "id": "Repeated Exam [for legend]",
                            "legendColor": colors.REPEATED_EXAM,
                            "fillColors": colors.REPEATED_EXAM,
                            "lineColor": colors.REPEATED_EXAM,
                            "title": translate.repeatedExam
                        },
                        {
                            "id": "Suggested Practice [for legend]",
                            "fillColors": colors.SUGGESTED_PRACTICE,
                            "legendColor": colors.SUGGESTED_PRACTICE,
                            "lineColor": colors.SUGGESTED_PRACTICE,
                            "title": translate.suggestedPractice
                        },
                        {
                            "id": "Repeated Suggested Practice [for legend]",
                            "legendColor": colors.REPEATED_SUGGESTED_PRACTICE,
                            "fillColors": colors.REPEATED_SUGGESTED_PRACTICE,
                            "lineColor": colors.REPEATED_SUGGESTED_PRACTICE,
                            "title": translate.repeatedSuggestedPractice
                        },
                        {

                            "fixedColumnWidth": -1,
                            "id": "Predefined Exam [for legend]",
                            "fillColors": colors.PREDEFINED_EXAM,
                            "legendColor": colors.PREDEFINED_EXAM,
                            "lineColor": colors.PREDEFINED_EXAM,
                            "lineThickness": 0,
                            "title": translate.predefinedExam
                        },
                        {
                            "fillColors": colors.REPEATED_PREDEFINED_EXAM,
                            "id": "Repeated Predefined Exam [for legend]",
                            "legendColor": colors.REPEATED_PREDEFINED_EXAM,
                            "title": translate.repeatedPredefinedExam
                        },
                        {
                            "fillColors": colors.POST_CREDIT_PRACTICE,
                            "legendColor": colors.POST_CREDIT_PRACTICE,
                            "id": "Post Credit Practice [for legend]",
                            "title": translate.postCreditPractice
                        },
                        {
                            "fillColors": colors.REPEATED_POST_CREDIT_PRACTICE,
                            "fixedColumnWidth": -1,
                            "id": "Repeated Post Credit Practice [for legend]",
                            "legendColor": colors.REPEATED_POST_CREDIT_PRACTICE,
                            "title": translate.repeatedPostCreditPractice
                        },
                        {
                            "fillColors": colors.WEAK_AREAS_PRACTICE,
                            "fixedColumnWidth": -1,
                            "id": "Weak Areas Practice [for legend]",
                            "legendColor": colors.WEAK_AREAS_PRACTICE,
                            "title": translate.repeatedPostCreditPractice
                        }
                    ],
                    "guides": [],
                    "valueAxes": [
                        {
                            "id": "ValueAxis-2",
                            "maximum": 100,
                            "minimum": 0,
                            "autoGridCount": false,
                            "title": translate.grade
                        }
                    ],
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
                        {
                            "id": "Title-1",
                            "size": 15,
                            "text": this.titleLabel,
                        },
                        {
                            "bold": false,
                            "color": "#0000FF",
                            "id": "Title-3",
                            "text": translate.clickActionLabel
                        }
                    ],
                    "listeners": [{
                        "event": "clickGraphItem",
                        "method": (event) => {
                            this.onClick(event);
                        }
                    }],
                    "dataProvider": []
                };

                this.numberFilter = $filter('number');
                this.allPractices = [];

                this.onClick = (data) => {

                    var item = getItem(data.item);
                    var practice = _.find(this.allPractices, {practiceID: item["Practice ID"]});

                    examService.getPracticeInfo(item["Practice ID"]).then(solution => {
                        $state.go('exams.practice-summary', {examSummary: _.assign({}, practice, {questions: solution.questions})});
                    });
                };

                this.$onInit = () => {
                    examService.getStats().then((practices) => {

                        this.allPractices = practices;

                        chartConf.dataProvider = practices.map(practice => {

                            return {
                                "Practice Date": moment(practice.date).format("hh:mm DD/MM/YYYY"),
                                "Practice Type": $translate.instant('EXAMS.TYPES.'+practice.practiceType),
                                "Practice Color": colors[practice.practiceType],
                                "Practice Grade": this.numberFilter(practice.grade, 1),
                                "Minimum Passing Grade": simulator_config.passingGrade,
                                "Practice ID": practice.practiceID
                            }
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
            }

        });


})();
