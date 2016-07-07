/**
 * Created by arikyudin on 31/05/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.pages.exams.distribution', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('exams.distribution', {
                url: '/distribution',
                parent: 'exams',
                templateUrl: 'app/pages/exams/distribution/distribution.html',
                controller: 'distributionCtrl as distribution',
                resolve: {
                    distribution: function($stateParams, examService) {
                        return $stateParams.distribution || examService.getDistribution();
                    }
                },
                title: 'EXAMS.TYPES.GENERAL_PRACTICE',
                sidebarMeta: {
                    order: 300,
                }
            });
    }
})();