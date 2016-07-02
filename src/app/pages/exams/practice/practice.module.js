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
                template: '<exam questions="fullExam.questions" timeframe="fullExam.timeframe" tabindex="1"></exam>',
                controller: 'fullExamCtrl as fullExam',
                resolve: {

                    examConfig: function($state, $stateParams, $q, examService) {
                        var config = $stateParams.examParams;

                        return examService.getExam(config)
                            .then(res => res)
                            .catch(err => {
                                if (_.get(err.data, 'description')) {

                                    alert(err.data.description);
                                }
                                return $q.reject(err.data.description);
                            })
                    }
                },
                title: 'EXAMS.TYPES.GENERAL_PRACTICE',
                sidebarMeta: {
                    order: 300,
                }
            })
            .state('exams.practice-solution', {
                url: '/practice-solution',
                parent: 'exams',
                params: {
                    practiceSolution: {}
                },
                template: '<exam questions="solutionCtrl.practiceSolution"></exam>',
                resolve: {
                    practiceSolution: function($stateParams) {
                        return $stateParams.practiceSolution;
                    }
                },
                controller: function(practiceSolution) {
                    this.practiceSolution = practiceSolution;
                },
                controllerAs: 'solutionCtrl'
            })
    }
})();