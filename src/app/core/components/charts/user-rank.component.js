'use strict';

/**
 * Created by arikyudin on 23/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components.charts').component('userRank', {
        bindings: {
            titleLabel: '<'
        },
        template: '<div id="userRankChart" class="amChart"></div>',
        controller: ["$translate", "customerStatsService", function userRankCtrl($translate, customerStatsService) {
            'ngInject';

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
                    "balloonText": "[[userDetails]]\n" + $translate.instant('STATS.DASHBOARD.CHARTS.USERS_RANK.RANK') + " [[category]]",
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
                "titles": [{
                    "id": "Title-1",
                    "size": 15,
                    "text": this.titleLabel,
                    "color": "#666666"
                }],
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
                customerStatsService.getRank().then(function (ranks) {

                    chartConf.dataProvider = ranks.map(function (rank, index) {
                        return _.assign(chartConf.dataProvider[index], {
                            Rank: rank.rank,
                            category: rank.rank,
                            userDetails: getName(rank)
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