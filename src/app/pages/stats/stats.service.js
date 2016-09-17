'use strict';

/**
 * Created by arikyudin on 03/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.pages.stats').factory('customerStatsService', ["Restangular", function (Restangular) {
        var customerStats = Restangular.all('/stats/customer/');
        var customersQuota = Restangular.all('/customers/');

        function getRank() {
            return customerStats.get('rank', { ever: true });
        }

        function getCategories() {
            return customerStats.get('categories');
        }

        function getQuota() {
            return customersQuota.get('quota');
        }

        return { getRank: getRank, getCategories: getCategories, getQuota: getQuota };
    }]).factory('candidateStatsService', ["Restangular", function (Restangular) {
        var candidateStats = Restangular.all('/stats/candidate/');

        function getCategories() {
            return candidateStats.get('categories');
        }

        return { getCategories: getCategories };
    }]);
})();