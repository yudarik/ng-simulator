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
                    summary: function($state, $stateParams) {
                        if (!$stateParams.examSummary) {
                            $state.go('dashboard')
                        }
                        return $stateParams.examSummary;
                    }
                },
                title: 'EXAMS.TYPES.PRACTICE_SUMMARY'
            })
    }
})();