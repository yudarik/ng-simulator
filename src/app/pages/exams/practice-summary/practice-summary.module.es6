/**
 * Created by arikyudin on 25/06/16.
 */

(function () {
    'use strict';
    angular.module('Simulator.pages.exams.practice-summary', ['Simulator.pages.stats'])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('exams.practice-summary', {
                parent: 'exams',
                url: '/practice-summary',
                params: {
                    examSummary: {}
                },
                controller: 'practiceSummaryCtrl as practiceSummary',
                templateUrl: 'app/pages/exams/practice-summary/practice-summary.html',
                resolve: {
                    summary: function($state, $stateParams, $window) {
                        if (!$stateParams.examSummary || _.isEmpty($stateParams.examSummary)) {
                            let examSummary = $window.localStorage.getItem('examSummary');
                            try {
                                return JSON.parse(examSummary);
                            } catch (err) {
                                return false;
                            }
                        }
                        $window.localStorage.setItem('examSummary', JSON.stringify($stateParams.examSummary));
                        return $stateParams.examSummary;
                    },
                    userType: function(userAuthService) {
                        return userAuthService.getUserType();
                    }
                },
                title: 'EXAMS.TYPES.PRACTICE_SUMMARY'
            })
    }
})();