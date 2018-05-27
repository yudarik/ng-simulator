/**
 * Created by arikyudin on 03/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.pages.stats', [])
        .config(routeConfig)
        .config(chartJsConfig);

    function routeConfig($stateProvider) {

        $stateProvider
            .state('dashboard', {
                url: '/dashboard',
                parent: 'auth',
                templateUrl: 'app/pages/stats/stats.html',
                /** @ngInject */
                controller: function (baSidebarService, user) {

                    if (baSidebarService.isMenuCollapsed()) {
                        baSidebarService.toggleMenuCollapsed();
                    }

                    this.isCandidate = (user.role === "Candidate");
                    this.userType = user.role;
                    if (!this.isCandidate) {
                        //reporting post credit mode is only interesting in the case of customer
                        FS.setUserVars({
                            "postCreditModeActive_bool": user.postCreditModeNow,
                        });
                    }
                },
                controllerAs: 'dashboard',
                resolve: {
                    userType: function (userAuthService) {
                        return userAuthService.getUser();
                    }
                },
                title: 'STATS.DASHBOARD.TITLE',
                sidebarMeta: {
                    icon: 'ion-speedometer',
                    order: 100
                }
            });
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