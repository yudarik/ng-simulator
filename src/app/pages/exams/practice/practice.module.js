'use strict';

/**
 * Created by arikyudin on 31/05/16.
 */

(function () {
    'use strict';

    routeConfig.$inject = ["$stateProvider"];
    angular.module('Simulator.pages.exams.practice', ['Simulator.components']).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider.state('exams.practice', {
            url: '/practice',
            parent: 'exams',
            params: {
                examParams: {},
                practiceType: ''
            },
            template: '<exam config="practice.examConfig" tabindex="1"></exam>',
            controller: 'practiceCtrl as practice',
            resolve: {

                examConfig: ["$state", "$stateParams", "$q", "examService", function ($state, $stateParams, $q, examService) {

                    return examService.getExam($stateParams.practiceType, $stateParams.examParams).then(function (res) {
                        return res;
                    }).catch(function (err) {
                        if (_.get(err.data, 'description')) {

                            alert(err.data.description);
                        }
                        return $q.reject(err);
                    });
                }],
                practiceType: ["$stateParams", function ($stateParams) {
                    return $stateParams.practiceType;
                }]
            },
            title: 'EXAMS.TYPES.GENERAL_PRACTICE'
        }).state('exams.practice-solution', {
            url: '/practice-solution',
            parent: 'exams',
            params: {
                practiceSummary: {}
            },
            template: '<exam config="solutionCtrl.examConfig"></exam>',
            resolve: {
                practiceSummary: ["$stateParams", function ($stateParams) {
                    return $stateParams.practiceSummary;
                }]
            },
            controller: ["practiceSummary", function (practiceSummary) {
                this.examConfig = practiceSummary;
            }],
            controllerAs: 'solutionCtrl',
            title: 'EXAMS.TYPES.PRACTICE_SOLUTION'
        }).state('exams.weak-areas', {
            url: '/weak-areas',
            parent: 'exams',
            template: '<div class="panel col-md-offset-4 col-md-4">\n                                <div class="panel-body">\n                                    <h3>{{::\'\'|translate}}</h3>\n                                    <ol>\n                                        <li ng-repeat="item in weakAreas.practiceConfig">\n                                            {{::item.category.name}}\n                                        </li>\n                                    </ol>\n                                    <div class="col-md-12">\n,                                        <a class="btn btn-default" ui-sref="exams.distribution-general({distribution: weakAreas.getDistribution()})">{{::\'EXAMS.BUTTONS.CONTINUE\'|translate}}</a>\n                                    </div>\n                                </div>\n                            </div>',
            resolve: {
                practiceConfig: ["customerStatsService", function (customerStatsService) {
                    return customerStatsService.getCategories();
                }]
            },
            controller: ["$filter", "practiceConfig", function ($filter, practiceConfig) {
                var _this = this;

                this.practiceConfig = $filter('orderBy')(practiceConfig, function (item) {
                    return item.totalQuestionsAskedInCategory - item.questionIDsCorrectlyAnswered.length;
                }, true);

                this.getDistribution = function () {
                    return {
                        categories: _.map(_this.practiceConfig, function (item) {
                            return item.category;
                        }),
                        questionsInExam: _this.practiceConfig.length
                    };
                };
            }],
            controllerAs: 'weakAreas',
            title: 'EXAMS.TYPES.WEAK_AREAS',
            sidebarMeta: {
                order: 400
            }
        });
    }
})();