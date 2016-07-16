/**
 * Created by arikyudin on 03/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.pages.stats', [])
        .config(routeConfig);

    function routeConfig($stateProvider) {

        $stateProvider
            .state('account-stats', {
                url: '/account-stats',
                controller: 'accountStatsCtrl as accountStats',
                templateUrl: 'app/pages/stats/account-stats/account-stats.html',
                resolve: {
                    quota: function(customerStatsService) {
                        return customerStatsService.getQuota();
                    }
                },
                title: 'STATS.ACCOUNT.TITLE',
                sidebarMeta: {
                    order: 400
                }
            })
    }

})();