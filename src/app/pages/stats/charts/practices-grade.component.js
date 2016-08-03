/**
 * Created by arikyudin on 23/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.pages.stats')
        .component('practicesGrade', {
            template: '<div ng-controller="practicesGradeCtrl as grade">'+
                      '<canvas id="pie" class="chart chart-line"'+
                      'chart-data="grade.data" '+
                      'chart-labels="grade.labels" '+
                      'chart-series="grade.series"'+
                      'chart-options="grade.options">'+
                      '</canvas>'+
                      '</div>'
        })
        .controller('practicesGradeCtrl', practicesGradeCtrl);

    /** @ngInject */
    function practicesGradeCtrl($translate, $filter, examService) {

        this.labels = [];
        this.data = [];
        this.series = [];
        this.options = {
            legend: {
                display: true,
                position: 'top'
            }
        };

        examService.getStats().then((practices) => {
            var groups = _.groupBy(practices, 'practiceType');
            var index = -1;

            _.forEach(groups, (group, groupName)=>{
                index++;

                this.series.push($translate.instant('EXAMS.TYPES.'+groupName));

                this.data[index] = [];

                _.forEach(group, (item)=>{

                    this.data[index].push($filter('number')(item.grade, 1));
                    this.labels.push($filter('date')(item.date))
                })
            })
        });

    }

})();
