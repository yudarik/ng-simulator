/**
 * Created by arikyudin on 23/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components.charts')
        .component('userRank', {
            bindings: {
                titleLabel: '<',
                titleTooltip: '<'
            },
            template: `<h4 class="text-center" uib-tooltip="{{::$ctrl.titleTooltip}}">{{::$ctrl.titleLabel}}</h4>
                        <div id="userRankChart" class="amChart"></div>`,
            controller: function userRankCtrl($translate, statsService) {
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
                    "autoMargins": true,
                    "depth3D": 20,
                    "startDuration": 1,
                    "fontSize": 14,
                    "fontFamily": "'Arimo', sans-serif",
                    "categoryAxis": {
                        "gridPosition": "start",
                        "axisThickness": 0,
                        "gridCount": 0,
                        "gridThickness": 0,
                        "tickLength": 0,
                        "title": ""
                    },
                    "trendLines": [],
                    "graphs": [
                        {
                            "balloonFunction": function(dataItem) {
                                var context = dataItem.dataContext;
                                return `<p style="text-align: right">
                                               ${context.userDetails}<br/>
                                               ${textLabels.rank}: ${context.category}<br/>
                                               ${textLabels.joinDate}: ${context.dateJoined}<br/>
                                               ${textLabels.averageGrade}: ${context.averageGrade}<br/>
                                               ${textLabels.examsPerformed}: ${context.numberOfExamsPerformed}</p>`;
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
                        }
                    ],
                    "guides": [],
                    "valueAxes": [
                        {
                            "axisTitleOffset": 0,
                            "id": "ValueAxis-2",
                            "axisAlpha": 0,
                            "fontSize": 4,
                            "labelsEnabled": false,
                            "showFirstLabel": false,
                            "showLastLabel": false,
                            "titleBold": false
                        }
                    ],
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
                    "dataProvider": [
                        {
                            "category": "#2",
                            "Color": "Red",
                            "Rank": "3",
                            "Icon": "http://icons.iconarchive.com/icons/icons-land/vista-people/256/Office-Customer-Male-Dark-icon.png",
                            "userDetails": "Nurit"
                        },
                        {
                            "category": "#1",
                            "Color": "Purple",
                            "Rank": "4",
                            "Icon": "http://icons.iconarchive.com/icons/icons-land/vista-people/256/Office-Customer-Male-Dark-icon.png",
                            "userDetails": "Moshe"
                        },
                        {
                            "category": "#3",
                            "Color": "#B8860B",
                            "Rank": "2",
                            "Icon": "http://icons.iconarchive.com/icons/icons-land/vista-people/256/Office-Customer-Male-Dark-icon.png",
                            "userDetails": "Yaakov"
                        },
                        {
                            "category": "#7",
                            "Color": "Green",
                            "Rank": "1",
                            "Icon": "http://icons.iconarchive.com/icons/icons-land/vista-people/256/Occupations-Bartender-Male-Light-icon.png",
                            "userDetails": "You"
                        }
                    ]
                };

                this.$onInit = () =>{
                    statsService.getRank().then((ranks) => {

                        if (ranks.status === 'other') {
                            chartConf.dataProvider = [];

                        } else if (ranks.content) {

                            chartConf.dataProvider = ranks.content.map((rank,index) => {
                                return _.assign(chartConf.dataProvider[index], {
                                    Rank: rank.averageGrade,
                                    category: rank.rank,
                                    userDetails: getName(rank),
                                    averageGrade: rank.averageGrade,
                                    dateJoined: moment(rank.dateJoined).format('DD/MM/YY'),
                                    numberOfExamsPerformed: rank.numberOfExamsPerformed
                                });
                            }).sort((a,b) => a.Rank - b.Rank);
                        }

                        let chart = AmCharts.makeChart('userRankChart',chartConf);


                        if (!chartConf.dataProvider.length && ranks.description) {
                            chart.addLabel("50%", "50%", ranks.description, "middle", 15);
                            chart.validateNow();
                        }
                        if (chartConf.dataProvider.length &&
                            chartConf.dataProvider[chartConf.dataProvider.length - 1].Rank > 90) {

                            chartConf.valueAxes[0].maximum = chartConf.valueAxes[0].max + 1;
                            chart.validateNow();
                        }
                    });

                };



                function getName(rank) {

                    var anonymous = $translate.instant('STATS.DASHBOARD.CHARTS.USERS_RANK.ANONYMOUS'),
                        you = $translate.instant('STATS.DASHBOARD.CHARTS.USERS_RANK.YOU');

                    return (rank.name)? you : anonymous;
                }
            }
        });



})();
