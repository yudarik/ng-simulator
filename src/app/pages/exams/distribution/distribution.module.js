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
                //template: `<pre>{{distribution.config|json}}</pre>`,
                controller: 'distributionCtrl as distribution',
                resolve: {
                    categories: function(examService) {
                        return examService.listCategories();
                    },
                    distribution: function(examService) {
                        return examService.getDistribution();
                    }
                },
                title: 'Distribution',
                sidebarMeta: {
                    order: 300,
                }
            });
    }
})();