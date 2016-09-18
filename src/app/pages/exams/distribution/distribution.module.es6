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
            .state('exams.distribution-general', {
                url: '/general-distribution',
                parent: 'exams',
                templateUrl: 'app/pages/exams/distribution/distribution.html',
                controller: 'distributionCtrl as distribution',
                resolve: {
                    dist: function($stateParams, examService) {
                        return $stateParams.distribution || examService.getDistribution();
                    },
                    distributionType: function() {
                        return 'general-practice'
                    },
                    practiceType: function() {
                        return 'PRACTICE';
                    }
                },
                title: 'EXAMS.TYPES.GENERAL_PRACTICE',
                sidebarMeta: {
                    order: 300
                }
            })
            .state('exams.distribution-full', {
                url: '/full-exam-distribution',
                //parent: 'exams',
                templateUrl: 'app/pages/exams/distribution/distribution.html',
                controller: 'distributionCtrl as distribution',
                resolve: {
                    dist: function($stateParams, examService) {
                        return $stateParams.distribution || examService.getDistribution();
                    },
                    distributionType: function() {
                        return 'full-exam'
                    },
                    practiceType: function() {
                        return 'EXAM';
                    }
                },
                title: 'EXAMS.TYPES.FULL_EXAM',
                sidebarMeta: {
                    order: 600
                }
            })
            .state('exams.post-credit', {
                url: '/post-credit-distribution',
                parent: 'exams',
                templateUrl: 'app/pages/exams/distribution/distribution.html',
                controller: 'distributionCtrl as distribution',
                resolve: {
                    dist: function($stateParams, examService) {
                        return $stateParams.distribution || examService.getDistribution();
                    },
                    distributionType: function() {
                        return 'general-practice'
                    },
                    practiceType: function() {
                        return 'POST_CREDIT_PRACTICE';
                    }
                },
                title: 'EXAMS.TYPES.POST_CREDIT_PRACTICE',
                sidebarMeta: {
                    order: 300
                }
            })
    }
})();