/**
 * Created by arikyudin on 23/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components')
        .component('userRank', {
            template: '<div ng-controller="userRankCtrl as rank">'+
                      '<canvas id="pie" class="chart chart-horizontal-bar"'+
                      'chart-data="rank.data" '+
                      'chart-labels="rank.labels" '+
                      'chart-series="rank.series"'+
                      'chart-options="rank.options">'+
                      '</canvas>'+
                      '</div>'
        })
        .controller('userRankCtrl', userRankCtrl);

    /** @ngInject */
    function userRankCtrl($translate, customerStatsService) {

        this.labels = [];
        this.data = [];
        this.series = [];
        this.options = {
            legend: {
                display: false,
                position: 'top'
            }
        };

        customerStatsService.getRank().then((ranks) => {
            ranks.splice(0, 0, {
                rank: 10,
                averageGrade: 75
            });
            ranks.reverse();
            _.forEach(ranks, (rank)=>{
                this.labels.push(getName(rank));
                this.data.push(rank.averageGrade);
            });
        });

        function getName(rank) {

            var userRank = $translate.instant('STATS.DASHBOARD.CHARTS.USERS_RANK.RANK') +" "+rank.rank,
                anonymous = $translate.instant('STATS.DASHBOARD.CHARTS.USERS_RANK.ANONYMOUS'),
                you = $translate.instant('STATS.DASHBOARD.CHARTS.USERS_RANK.YOU');

            return (rank.name)? userRank+": "+you : userRank+": "+anonymous;
        }
    }

})();
