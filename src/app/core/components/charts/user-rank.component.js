'use strict';

/**
 * Created by arikyudin on 23/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components.charts').component('userRank', {
        bindings: {
            titleLabel: '<',
            titleTooltip: '<'
        },
        template: '<h4 class="text-center" tooltip="{{::$ctrl.titleTooltip}}">{{::$ctrl.titleLabel}}</h4>\n                        <div id="userRankChart" class="amChart"></div>',
        controller: ["$translate", "statsService", function userRankCtrl($translate, statsService) {
            'ngInject';

            var textLabels = {
                rank: $translate.instant('STATS.DASHBOARD.CHARTS.USERS_RANK.RANK'),
                joinDate: $translate.instant('STATS.DASHBOARD.CHARTS.USERS_RANK.JOINDATE'),
                averageGrade: $translate.instant('STATS.DASHBOARD.CHARTS.USERS_RANK.AVERAGEGRADE'),
                examsPerformed: $translate.instant('STATS.DASHBOARD.CHARTS.USERS_RANK.EXAMSPERFORMED')
            };

            var chartConf = {
                "type": "serial",
                "categoryField": "category",
                "angle": 30,
                "autoMarginOffset": 0,
                "depth3D": 30,
                "startDuration": 1,
                "categoryAxis": {
                    "gridPosition": "start",
                    "axisThickness": 0,
                    "gridCount": 0,
                    "gridThickness": 0,
                    "tickLength": 0,
                    "title": ""
                },
                "trendLines": [],
                "graphs": [{
                    "balloonFunction": function balloonFunction(dataItem) {
                        var context = dataItem.dataContext;
                        return '<p style="text-align: right">\n                                               ' + context.userDetails + '<br/>\n                                               ' + textLabels.rank + ': ' + context.category + '<br/>\n                                               ' + textLabels.joinDate + ': ' + context.dateJoined + '<br/>\n                                               ' + textLabels.averageGrade + ': ' + context.Rank + '<br/>\n                                               ' + textLabels.examsPerformed + ': ' + context.numberOfExamsPerformed + '</p>';
                    },
                    "bullet": "custom",
                    "bulletBorderThickness": 0,
                    "colorField": "Color",
                    "customBulletField": "Icon",
                    "fillAlphas": 1,
                    "fillColorsField": "Color",
                    "gradientOrientation": "horizontal",
                    "id": "AmGraph-1",
                    "labelColorField": "Color",
                    "labelOffset": 2,
                    "labelText": "[[userDetails]]",
                    "maxBulletSize": 500,
                    "minBulletSize": 50,
                    "title": "My Relative Score",
                    "type": "step",
                    "valueField": "Rank",
                    "visibleInLegend": false
                }],
                "guides": [],
                "valueAxes": [{
                    "axisTitleOffset": 0,
                    "id": "ValueAxis-2",
                    "axisAlpha": 0,
                    "fontSize": 4,
                    "labelsEnabled": false,
                    "showFirstLabel": false,
                    "showLastLabel": false,
                    "titleBold": false
                }],
                "allLabels": [],
                "balloon": {},
                "legend": {
                    "enabled": true,
                    "useGraphSettings": true
                },
                "titles": [
                    /*{
                        "id": "Title-1",
                        "size": 15,
                        "text": this.titleLabel,
                        "color": "#666666"
                    }*/
                ],
                "dataProvider": [{
                    "category": "#2",
                    "Color": "Red",
                    "Rank": "3",
                    "Icon": "http://icons.iconarchive.com/icons/icons-land/vista-people/256/Office-Customer-Male-Dark-icon.png",
                    "userDetails": "Nurit"
                }, {
                    "category": "#1",
                    "Color": "Purple",
                    "Rank": "4",
                    "Icon": "http://icons.iconarchive.com/icons/icons-land/vista-people/256/Office-Customer-Male-Dark-icon.png",
                    "userDetails": "Moshe"
                }, {
                    "category": "#3",
                    "Color": "#B8860B",
                    "Rank": "2",
                    "Icon": "http://icons.iconarchive.com/icons/icons-land/vista-people/256/Office-Customer-Male-Dark-icon.png",
                    "userDetails": "Yaakov"
                }, {
                    "category": "#7",
                    "Color": "Green",
                    "Rank": "1",
                    "Icon": "http://icons.iconarchive.com/icons/icons-land/vista-people/256/Occupations-Bartender-Male-Light-icon.png",
                    "userDetails": "You"
                }]
            };

            this.$onInit = function () {
                statsService.getRank().then(function (ranks) {

                    chartConf.dataProvider = ranks.map(function (rank, index) {
                        return _.assign(chartConf.dataProvider[index], {
                            Rank: rank.averageGrade,
                            category: rank.rank,
                            userDetails: getName(rank),
                            averageGrade: rank.averageGrade,
                            dateJoined: moment(rank.dateJoined).format('DD/MM/YY'),
                            numberOfExamsPerformed: rank.numberOfExamsPerformed
                        });
                    });
                    AmCharts.makeChart('userRankChart', chartConf);
                });
            };

            function getName(rank) {

                var anonymous = $translate.instant('STATS.DASHBOARD.CHARTS.USERS_RANK.ANONYMOUS'),
                    you = $translate.instant('STATS.DASHBOARD.CHARTS.USERS_RANK.YOU');

                return rank.name ? you : anonymous;
            }
        }]
    });
})();