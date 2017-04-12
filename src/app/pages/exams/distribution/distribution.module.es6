/**
 * Created by arikyudin on 31/05/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.pages.exams.distribution', ['Simulator.pages.auth'])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, simulator_config) {

        $stateProvider
            .state('exams.distribution-general', {
                url: '/general-distribution',
                parent: 'exams',
                params: {
                    distribution: null,
                    practiceType: 'PRACTICE'
                },
                templateUrl: 'app/pages/exams/distribution/distribution.html',
                controller: 'distributionCtrl as distribution',
                resolve: {
                    dist: function($stateParams, examService) {
                        return $stateParams.distribution || examService.getDistribution();
                    },
                    distributionType: function() {
                        return 'general-practice'
                    },
                    practiceType: function($stateParams, $state) {
                        $state.get('exams.distribution-general').title = 'EXAMS.TYPES.'+$stateParams.practiceType;

                        return $stateParams.practiceType;
                    }/*,
                    totalQuota: function(customerService) {
                        return customerService.getQuota().then(quota=>{
                            return quota.leftNewQuestionsQuota;
                        }).catch(() => {
                            return null;
                        })
                    }*/
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
                tooltip: 'EXAMS.TOOLTIPS.POSTCREDIT_DISABLED',
                sidebarMeta: {
                    order: 300
                }
            })
    }
})();