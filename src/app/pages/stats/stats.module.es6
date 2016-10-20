/**
 * Created by arikyudin on 03/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.pages.stats', [
        'chart.js'
    ])
        .config(routeConfig)
        .config(chartJsConfig);

    function routeConfig($stateProvider) {

        $stateProvider
            .state('dashboard', {
                url: '/dashboard',
                parent: 'auth',
                templateUrl: 'app/pages/stats/stats.html',
                title: 'STATS.DASHBOARD.TITLE',
                sidebarMeta: {
                    icon: 'ion-speedometer',
                    order: 100
                }
            })
           /* .state('account-stats', {
                url: '/account-stats',
                parent: 'auth',
                controller: 'accountStatsCtrl as accountStats',
                templateUrl: 'app/pages/stats/account-stats/account-stats.html',
                resolve: {
                    quota: function(customerService) {
                        return customerService.getQuota();
                    }
                },
                title: 'STATS.ACCOUNT.TITLE',
                sidebarMeta: {
                    order: 400
                }
            })*/
    }
    function chartJsConfig(ChartJsProvider, baConfigProvider) {
        var layoutColors = baConfigProvider.colors;
        // Configure all charts
        ChartJsProvider.setOptions({
            colours: [ layoutColors.primary, layoutColors.danger, layoutColors.warning, layoutColors.success, layoutColors.info, layoutColors.default, layoutColors.primaryDark, layoutColors.successDark, layoutColors.warningLight, layoutColors.successLight, layoutColors.primaryLight],
            responsive: true,
            scaleFontColor: layoutColors.defaultText,
            scaleLineColor: layoutColors.border,
            pointLabelFontColor: layoutColors.defaultText
        });
        // Configure all line charts
        ChartJsProvider.setOptions('Line', {
            datasetFill: false
        });
    }

})();