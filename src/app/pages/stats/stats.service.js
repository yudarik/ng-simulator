/**
 * Created by arikyudin on 03/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.pages.stats')
        .factory('customerStatsService', function(Restangular){
            var customerStats = Restangular.all('/stats/customer/');
            var customersQuota = Restangular.all('/customers/');

            function getRank() {
                return customerStats.get('rank');
            }

            function getCategories() {
                return customerStats.get('categories');
            }

            function getQuota() {
                return customersQuota.get('quota');
            }

            return {getRank, getCategories, getQuota};
        })
        .factory('candidateStatsService', function(Restangular){
            var candidateStats = Restangular.all('/stats/candidate/');

            function getCategories() {
                return candidateStats.get('categories');
            }

            return {getCategories};
        })
})();