/**
 * Created by arikyudin on 31/05/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.pages.exams.full-exam', ['Simulator.components'])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('exams.full-exam', {
                url: '/full-exam',
                parent: 'exams',
                params: {
                    examParams: {}
                },
                templateUrl: 'app/pages/exams/full-exam/full-exam.html',
                controller: 'fullExamCtrl as fullExam',
                resolve: {
                    examConfig: function($state, $stateParams, examService) {
                        var config = $stateParams.examParams;

                        return examService.getExam(config)
                            .then(res => res)
                            .catch(err => {
                                $state.go('exams.distribution');
                            })
                    }
                },
                title: 'תרגול כללי',
                sidebarMeta: {
                    order: 300,
                }
            });
    }
})();