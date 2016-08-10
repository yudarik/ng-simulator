/**
 * Created by arikyudin on 23/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components')
        .component('practicesGrade', {
            template: '<div>'+
                      '<canvas id="practices_grade" class="chart chart-bar"'+
                      'chart-data="$ctrl.data" '+
                      'chart-labels="$ctrl.labels" '+
                      'chart-options="$ctrl.options"'+
                      'chart-click="$ctrl.onClick">'+
                      '</canvas>'+
                      '</div>',
            controller: practicesGradeCtrl
        });

    /** @ngInject */
    function practicesGradeCtrl($translate, $filter, $state, examService) {

        this.labels = [];
        this.data = [];
        this.series = [];

        var translate = {
            grade: $translate.instant('STATS.DASHBOARD.CHARTS.GENERAL.GRADE'),
            type: $translate.instant('STATS.DASHBOARD.CHARTS.GENERAL.TYPE'),
            timeSpent: $translate.instant('STATS.DASHBOARD.CHARTS.GENERAL.TIME_SPENT')
        };

        this.options = {
            legend: {
                display: false,
                position: 'top'
            },
            tooltips: {
                mode: 'label',
                callbacks: {
                    /*title: function() {
                        return 'title';
                    },*/
                    label: function(data) {
                        var item = getItem(data);

                        return `${translate.grade}: ${$filter('number')(item.grade, 1)}`
                    },
                    beforeLabel: function(data) {
                        var item = getItem(data);
                        return `${translate.type}: ${$translate.instant('EXAMS.TYPES.'+item.practiceType)}`
                    },
                    afterLabel: function(data) {
                        var item = getItem(data);
                        return `${translate.timeSpent}: ${$filter('number')(item.elapsedTimeSecs/60, 2)}`;
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

            this.practices = practices;

            _.forEach(practices, practice => {
                this.data.push($filter('number')(practice.grade, 1));
                this.labels.push($filter('date')(practice.date));
            });

        });

        var getItem = (data) => {

            if (Array.isArray(data)) {
                data = data[0];
            }
            return this.practices[data.index];
        }
    }

})();
