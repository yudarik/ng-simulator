/**
 * Created by arikyudin on 31/05/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.pages.exams.distribution', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {

        var allStatesConfig = {
            url: '/general-distribution',
            parent: 'exams',
            templateUrl: 'app/pages/exams/distribution/distribution.html',
            controller: 'distributionCtrl as distribution',
            resolve: {
                distribution: function($stateParams, examService) {
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
                order: 300,
            }
        };

        $stateProvider
            .state('exams.distribution-general', allStatesConfig)
            .state('exams.distribution-full', _.assign({}, allStatesConfig, {
                url: '/full-exam-distribution',
                resolve: {
                    distributionType: function() {
                        return 'full-exam'
                    },
                    practiceType: function() {
                        return 'EXAM';
                    }
                },
                title: 'EXAMS.TYPES.FULL_EXAM'
            }))
            .state('exams.post-credit', _.assign({}, allStatesConfig, {
                url: '/post-credit-distribution',
                resolve: {
                    practiceType: function() {
                        return 'POST-CREDIT';
                    }
                },
                title: 'EXAMS.TYPES.POST_CREDIT ',
            }))
    }
})();