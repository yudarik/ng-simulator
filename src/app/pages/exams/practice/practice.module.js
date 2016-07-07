/**
 * Created by arikyudin on 31/05/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.pages.exams.practice', ['Simulator.components'])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('exams.general-practice', {
                url: '/general-practice',
                parent: 'exams',
                params: {
                    examParams: {}
                },
                template: '<exam questions="general.questions" timeframe="general.timeframe" tabindex="1"></exam>',
                controller: 'generalPracticeCtrl as general',
                resolve: {

                    examConfig: function($state, $stateParams, $q, examService) {
                        var config = $stateParams.examParams;

                        return examService.getExam(config)
                            .then(res => res)
                            .catch(err => {
                                if (_.get(err.data, 'description')) {

                                    alert(err.data.description);
                                }
                                return $q.reject(err);
                            })
                    }
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
            .state('exams.weak-areas', {
                url: '/weak-areas',
                parent: 'exams',
                template: ['<div class="panel col-md-offset-4 col-md-4">',
                                '<div class="panel-body">',
                                    '<h3>{{::\'\'|translate}}</h3>',
                                    '<ol>',
                                        '<li ng-repeat="item in weakAreas.practiceConfig">',
                                            '{{::item.category.name}}',
                                        '</li>',
                                    '</ol>',
                                    '<div class="col-md-12">',
,                                        '<a class="btn btn-default" ui-sref="exams.distribution({distribution: weakAreas.getDistribution()})">{{::\'EXAMS.BUTTONS.CONTINUE\'|translate}}</a>',
                                    '</div>',
                                '</div>',
                            '</div>'
                        ].join(''),
                resolve: {
                    practiceConfig: function(customerStatsService) {
                        return customerStatsService.getCategories();
                    }
                },
                controller: function($filter, practiceConfig) {
                    this.practiceConfig = $filter('orderBy')(practiceConfig, (item)=>{
                        return item.totalQuestionsAskedInCategory - item.questionIDsCorrectlyAnswered.length;
                    }, true);

                    this.getDistribution = () => {
                        return {
                            categories: _.map(this.practiceConfig, (item)=> {
                                return item.category;
                            }),
                            questionsInExam: this.practiceConfig.length
                        };
                    }
                },
                controllerAs: 'weakAreas',
                title: 'EXAMS.TYPES.WEAK_AREAS',
                sidebarMeta: {
                    order: 400
                }
            })
            .state('exams.full-exam', {
                url: '/full-exam',
                parent: 'exams',
                params: {
                    examParams: {}
                },
                template: '<exam questions="general.questions" timeframe="general.timeframe" tabindex="1"></exam>',
                controller: function() {

                },
                resolve: {

                }
            })
            .state('exams.post-credit', {
                url: '/post-credit',
                parent: 'exams',
                //template: '<exam questions="general.questions" timeframe="general.timeframe" tabindex="1"></exam>',
                template: '<pre style="direction: ltr">{{::postCredit.quota | json}}</pre>',
                controller: function(quota) {
                    this.quota = quota;
                },
                controllerAs: 'postCredit',
                resolve: {
                    quota: function(customerStatsService) {
                        return customerStatsService.getQuota();
                    }
                },
                title: 'EXAMS.TYPES.SDSD',
                sidebarMeta: {
                    order: 400
                }
            })
    }
})();