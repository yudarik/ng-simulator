/**
 * Created by arikyudin on 03/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.pages.stats')
        .factory('customerStatsService', function(Restangular){
            var customerStats = Restangular.all('/stats/customer/');

            function getRank() {
                return customerStats.get('rank');
            }

            function getCategories() {
                return customerStats.get('categories');
            }

            return {getRank, getCategories};
        })
        .factory('candidateStatsService', function(Restangular){
            var candidateStats = Restangular.all('/stats/candidate/');

            function getCategories() {
                return candidateStats.get('categories');
            }

            return {getCategories};
        })
})();