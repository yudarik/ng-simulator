/**
 * Created by arikyudin on 25/06/16.
 */

(function () {
    'use strict';
    angular.module('Simulator.pages.exams.practice-summary', [])
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
                    summary: function($stateParams) {
                        return $stateParams.examSummary;
                    }
                },
                title: 'EXAMS.TYPES.PRACTICE_SUMMARY'
            })
    }
})();