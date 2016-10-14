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
            template: '<div>'+
                      '<canvas id="practices_grade" class="chart chart-bar text-right" direction="rtl"'+
                      'chart-data="$ctrl.data" '+
                      'chart-labels="$ctrl.labels" '+
                      'chart-series="$ctrl.series" '+
                      'chart-options="$ctrl.options"'+
                      'chart-click="$ctrl.onClick">'+
                      '</canvas>'+
                      '</div>',
            controller: /** @ngInject */
                function practicesGradeCtrl($translate, $filter, $state, examService) {

                this.labels = [];
                this.data = [];
                this.series = [];

                var translate = {
                    grade: $translate.instant('STATS.DASHBOARD.CHARTS.GENERAL.GRADE'),
                    type: $translate.instant('STATS.DASHBOARD.CHARTS.GENERAL.TYPE'),
                    timeSpent: $translate.instant('STATS.DASHBOARD.CHARTS.GENERAL.TIME_SPENT'),
                    date: $translate.instant('STATS.DASHBOARD.CHARTS.GENERAL.DATE'),
                    practiceID: $translate.instant('STATS.DASHBOARD.CHARTS.GENERAL.PRACTICEID')
                };

                this.options = {
                    responsive: true,
                    title: {
                        display: true,
                        text: this.titleLabel,
                        fontSize: 14
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltips: {
                        mode: 'single',
                        direction: 'rtl',
                        class: 'text-right',
                        style: 'direction:rtl, float:left, text-alight: right',
                        textAlign: 'right',
                        bodyFontSize: 14,
                        bodySpacing: 4,
                        callbacks: {
                            title: function(data) {
                                var item = getItem(data);
                                return item? `${moment(item.date).format('LLL')}` : '';
                            },
                            footer: function(data) {
                                var item = getItem(data);
                                return item? `${translate.practiceID}: ${item.practiceID}` : '';
                            },
                            beforeLabel: function(data) {
                                var item = getItem(data);
                                return item? `${translate.type}: ${$translate.instant('EXAMS.TYPES.'+item.practiceType)}` : '';
                            },
                            label: function(data) {
                                var item = getItem(data);

                                return item? `${translate.grade}: ${$filter('number')(item.grade, 1)}` : '';
                            },
                            afterLabel: function(data) {
                                var item = getItem(data);
                                return item? `${translate.timeSpent}: ${$filter('number')(item.elapsedTimeSecs/60, 2)}` : '';
                            }
                        }
                    }
                };

                this.onClick = (data) => {
                    if (Array.isArray(data) && data[0] && typeof data[0]._index !== 'undefined') {
                        data[0].index = data[0]._index;
                    }

                    var item = getItem(data);

                    examService.getPracticeInfo(item.practiceID).then(solution => {
                        //$state.go('exams.practice-solution', {practiceSolution: solution.questions});
                        $state.go('exams.practice-summary', {examSummary: _.assign({}, item, {questions: solution.questions})});
                    });
                };

                examService.getStats().then((practices) => {

                    this.practices = _.groupBy(_.sortBy(practices, 'date'), 'practiceType');
                    this.seriesKeys = _.keys(this.practices);
                    this.labelsHelper = _.map(_.sortBy(practices, 'date'), 'date');


                    this.series = _.map(this.seriesKeys, key => {
                        return $translate.instant('EXAMS.TYPES.'+key);
                    });
                    this.data = zeros([this.seriesKeys.length, this.labelsHelper.length]);
                    this.dataHelper = angular.copy(this.data);

                    _.forEach(this.practices, (groupValue, groupKey)=>{
                        _.forEach(groupValue, practice => {
                            var x = this.seriesKeys.indexOf(groupKey),
                                y= this.labelsHelper.indexOf(practice.date);

                            this.data[x][y] = practice.grade;
                            this.dataHelper[x][y] = practice;
                        })
                    });
                    this.labels = _.map(this.labelsHelper, (date, index) => {
                        if (moment(date).format('DD/MM/YY').toString() !== moment(this.labelsHelper[index-1]).format('DD/MM/YY').toString()) {
                            return moment(date).format('DD/MM/YY').toString();
                        } else {
                            return '.';
                        }
                    });
                });

                var getItem = (data) => {

                    if (!data || data.yLabel === 0) {
                        return;
                    }

                    if (Array.isArray(data)) {
                        data = data[0];
                    }

                    var datasetIndex = (data.datasetIndex > -1)? data.datasetIndex : data._datasetIndex;

                    return this.dataHelper[datasetIndex][data.index];
                };

                function zeros(dimensions) {
                    var array = [];

                    for (var i = 0; i < dimensions[0]; ++i) {
                        array.push(dimensions.length == 1 ? undefined : zeros(dimensions.slice(1)));
                    }

                    return array;
                }

            }

        });


})();
