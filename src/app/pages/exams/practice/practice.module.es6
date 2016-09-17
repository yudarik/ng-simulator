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
            .state('exams.practice', {
                url: '/practice',
                parent: 'exams',
                params: {
                    examParams: {},
                    practiceType: ''
                },
                template: '<exam type="practice.practiceType" questions="practice.questions" timeframe="practice.timeframe" tabindex="1"></exam>',
                controller: 'practiceCtrl as practice',
                resolve: {

                    examConfig: function($state, $stateParams, $q, examService) {

                        return examService.getExam($stateParams.practiceType, $stateParams.examParams)
                            .then(res => res)
                            .catch(err => {
                                if (_.get(err.data, 'description')) {

                                    alert(err.data.description);
                                }
                                return $q.reject(err);
                            })
                    },
                    practiceType: function($stateParams) {
                        return $stateParams.practiceType;
                    }
                },
                title: 'EXAMS.TYPES.GENERAL_PRACTICE'
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
                controllerAs: 'solutionCtrl',
                title: 'EXAMS.TYPES.PRACTICE_SOLUTION'
            })
            .state('exams.weak-areas', {
                url: '/weak-areas',
                parent: 'exams',
                template: `<div class="panel col-md-offset-4 col-md-4">
                                <div class="panel-body">
                                    <h3>{{::\'\'|translate}}</h3>
                                    <ol>
                                        <li ng-repeat="item in weakAreas.practiceConfig">
                                            {{::item.category.name}}
                                        </li>
                                    </ol>
                                    <div class="col-md-12">
,                                        <a class="btn btn-default" ui-sref="exams.distribution-general({distribution: weakAreas.getDistribution()})">{{::\'EXAMS.BUTTONS.CONTINUE\'|translate}}</a>
                                    </div>
                                </div>
                            </div>`,
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
            });
    }
})();