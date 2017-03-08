/**
 * Created by arikyudin on 23/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components.charts')
        .component('categoriesCorrectIncorrectLine', {
            bindings: {
                titleLabel: '<'
            },
            template: `<div id="categoriesCorectIncorect" class="amChart"></div>
                        <div id="categoriesCorectIncorectLegend"></div>`,
            controller: function CorrectIncorrectCtrl($translate, baConfig, statsService) {
                'ngInject';

                var layoutColors = baConfig.colors;

                var chartColors = _.values(layoutColors.dashboard);

                var series = {
                    title: $translate.instant('STATS.DASHBOARD.CHARTS.CATEGORIES_LINE.TITLE'),
                    total: $translate.instant('STATS.DASHBOARD.CHARTS.CATEGORIES_LINE.TOTAL_ASKED'),
                    correct: $translate.instant('STATS.DASHBOARD.CHARTS.CATEGORIES_LINE.CORRECT'),
                    incorrect: $translate.instant('STATS.DASHBOARD.CHARTS.CATEGORIES_LINE.INCORRECT'),
                    xaxis: $translate.instant('STATS.DASHBOARD.CHARTS.CATEGORIES_LINE.XAXIS_TITLE')
                };

                function getCorrectSum(cat) {
                    return cat.questionIDsCorrectlyAnswered.length;
                }
                function getIncorrectSum(cat) {
                    return cat.questionIDsIncorrectlyAnswered.length
                }

                var chartConf = {
                    "type": "serial",
                    "categoryField": "category",
                    "startDuration": 1,
                    "theme": "default",
                    "categoryAxis": {
                        "gridPosition": "start",
                        labelRotation: 25,
                        fontSize: 14
                    },
                    "trendLines": [],
                    "graphs": [
                        {
                            "balloonText": "[[title]] of [[category]]:[[value]]",
                            "fillAlphas": 0.7,
                            "id": "AmGraph-1",
                            "lineAlpha": 0,
                            "lineColor": "#008000",
                            "title": series.correct,
                            "valueField": "Correctly Answered",
                            "visibleInLegend": true
                        },
                        {
                            "balloonText": "[[title]] of [[category]]:[[value]]",
                            "fillAlphas": 0.7,
                            "id": "AmGraph-2",
                            "lineAlpha": 0,
                            "lineColor": "#CC0000",
                            "title": series.incorrect,
                            "valueField": "Incorrectly Answered"
                        },
                        {
                            "columnWidth": 0.47,
                            "dashLength": 1,
                            "fixedColumnWidth": 1,
                            "fontSize": 1,
                            "id": "Total Questions",
                            "lineColor": "#0000FF",
                            "lineThickness": 2,
                            "title": series.total,
                            "valueField": "Total"
                        }
                    ],
                    "guides": [],
                    "valueAxes": [
                        {
                            "id": "ValueAxis-1",
                            "title": series.xaxis
                        }
                    ],
                    "allLabels": [],
                    "balloon": {},
                    "legend": {
                        "enabled": true,
                        "forceWidth": true,
                        "divId": "categoriesCorectIncorectLegend",
                        "position": "bottom",
                        "align": "right",
                        "right": 0
                    },
                    "titles": [
                        {
                            "id": "Title-1",
                            "size": 15,
                            "text": series.title
                        }
                    ],
                    "dataProvider": []
                };

                this.$onInit = ()=>{
                    statsService.getCategories().then(categoriesStats => {

                        chartConf.dataProvider = categoriesStats.map(cat => {
                            return {
                                "category": cat.category.name,
                                "Correctly Answered": getCorrectSum(cat),
                                "Incorrectly Answered": getIncorrectSum(cat),
                                "Total": cat.totalQuestionsAskedInCategory
                            };
                        });

                        AmCharts.makeChart('categoriesCorectIncorect',chartConf);
                    });
                };
            },
            resolve: {
                translate: function($translate) {
                    return $translate('STATS.DASHBOARD.CHARTS.CATEGORIES_LINE');
                }
            }
        });




})();
