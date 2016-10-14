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
        template: '<div>' + '<canvas id="practices_grade" class="chart chart-bar text-right" direction="rtl"' + 'chart-data="$ctrl.data" ' + 'chart-labels="$ctrl.labels" ' + 'chart-series="$ctrl.series" ' + 'chart-options="$ctrl.options"' + 'chart-click="$ctrl.onClick">' + '</canvas>' + '</div>',
        controller: /** @ngInject */
        ["$translate", "$filter", "$state", "examService", function practicesGradeCtrl($translate, $filter, $state, examService) {
            var _this = this;

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
                        title: function title(data) {
                            var item = getItem(data);
                            return item ? '' + moment(item.date).format('LLL') : '';
                        },
                        footer: function footer(data) {
                            var item = getItem(data);
                            return item ? translate.practiceID + ': ' + item.practiceID : '';
                        },
                        beforeLabel: function beforeLabel(data) {
                            var item = getItem(data);
                            return item ? translate.type + ': ' + $translate.instant('EXAMS.TYPES.' + item.practiceType) : '';
                        },
                        label: function label(data) {
                            var item = getItem(data);

                            return item ? translate.grade + ': ' + $filter('number')(item.grade, 1) : '';
                        },
                        afterLabel: function afterLabel(data) {
                            var item = getItem(data);
                            return item ? translate.timeSpent + ': ' + $filter('number')(item.elapsedTimeSecs / 60, 2) : '';
                        }
                    }
                }
            };

            this.onClick = function (data) {
                if (Array.isArray(data) && data[0] && typeof data[0]._index !== 'undefined') {
                    data[0].index = data[0]._index;
                }

                var item = getItem(data);

                examService.getPracticeInfo(item.practiceID).then(function (solution) {
                    //$state.go('exams.practice-solution', {practiceSolution: solution.questions});
                    $state.go('exams.practice-summary', { examSummary: _.assign({}, item, { questions: solution.questions }) });
                });
            };

            examService.getStats().then(function (practices) {

                _this.practices = _.groupBy(_.sortBy(practices, 'date'), 'practiceType');
                _this.seriesKeys = _.keys(_this.practices);
                _this.labelsHelper = _.map(_.sortBy(practices, 'date'), 'date');

                _this.series = _.map(_this.seriesKeys, function (key) {
                    return $translate.instant('EXAMS.TYPES.' + key);
                });
                _this.data = zeros([_this.seriesKeys.length, _this.labelsHelper.length]);
                _this.dataHelper = angular.copy(_this.data);

                _.forEach(_this.practices, function (groupValue, groupKey) {
                    _.forEach(groupValue, function (practice) {
                        var x = _this.seriesKeys.indexOf(groupKey),
                            y = _this.labelsHelper.indexOf(practice.date);

                        _this.data[x][y] = practice.grade;
                        _this.dataHelper[x][y] = practice;
                    });
                });
                _this.labels = _.map(_this.labelsHelper, function (date, index) {
                    if (moment(date).format('DD/MM/YY').toString() !== moment(_this.labelsHelper[index - 1]).format('DD/MM/YY').toString()) {
                        return moment(date).format('DD/MM/YY').toString();
                    } else {
                        return '.';
                    }
                });
            });

            var getItem = function getItem(data) {

                if (!data || data.yLabel === 0) {
                    return;
                }

                if (Array.isArray(data)) {
                    data = data[0];
                }

                var datasetIndex = data.datasetIndex > -1 ? data.datasetIndex : data._datasetIndex;

                return _this.dataHelper[datasetIndex][data.index];
            };

            function zeros(dimensions) {
                var array = [];

                for (var i = 0; i < dimensions[0]; ++i) {
                    array.push(dimensions.length == 1 ? undefined : zeros(dimensions.slice(1)));
                }

                return array;
            }
        }]

    });
})();