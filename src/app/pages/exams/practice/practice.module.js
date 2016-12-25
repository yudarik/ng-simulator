'use strict';

/**
 * Created by arikyudin on 31/05/16.
 */

(function () {
    'use strict';

    routeConfig.$inject = ["$stateProvider"];
    angular.module('Simulator.pages.exams.practice', ['Simulator.components']).config(routeConfig).run(function ($rootScope, $uibModal, $state) {

        function registerStateChangeListener() {
            var onRouteChangeOff = $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                console.log(fromState.name + ' > ' + toState.name);

                if (fromState.name === 'exams.practice' && toState.name !== 'exams.practice-summary') {
                    event.preventDefault();

                    redirectModal().then(function () {
                        onRouteChangeOff();
                        $state.transitionTo(toState, toParams);
                    }, function () {
                        //dismiss
                    });
                }
            });
        }
        function redirectModal() {
            var modalInstance = $uibModal.open({
                animation: true,
                template: ['<div class="panel"><div class="panel-body">', '<h3 class="text-center">{{::"EXAMS.EXAM_CANCEL_ARE_YOU_SURE"|translate}}</h3>', '<br/>', '<br/>', '<p class="text-center ">', '<button class="btn btn-success btn-space" ng-click="ok()">אישור</button>', '<button class="btn btn-default" ng-click="cancel()">ביטול</button>', '</p>', '</div></div>'].join(''),
                controller: function controller($uibModalInstance, $scope) {
                    $scope.ok = function () {
                        $uibModalInstance.close();
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                size: 'small'
            });

            return modalInstance.result;
        }
        registerStateChangeListener();

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

            if (fromState.name === 'exams.practice') {
                registerStateChangeListener();
            }
        });
    });

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider.state('exams.practice', {
            url: '/practice',
            parent: 'exams',
            params: {
                examParams: {},
                practiceType: 'PRACTICE'
            },
            template: '<exam config="practice.examConfig" tabindex="1"></exam>',
            controller: 'practiceCtrl as practice',
            resolve: {

                examConfig: ["$state", "$stateParams", "$q", "examService", function ($state, $stateParams, $q, examService) {

                    if ($stateParams.practiceType) {
                        $state.get('exams.practice').title = 'EXAMS.TYPES.' + $stateParams.practiceType;
                    }
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
            template: '<div class="panel col-md-offset-4 col-md-4">\n                                <div class="panel-body">\n                                    <h3>{{::\'\'|translate}}</h3>\n                                    <ol>\n                                        <li ng-repeat="category in weakAreas.practiceConfig.categories">\n                                            {{::category.name}}\n                                        </li>\n                                    </ol>\n                                    <div class="col-md-12">\n,                                        <a class="btn btn-default" ui-sref="exams.distribution-general({distribution: weakAreas.practiceConfig, practiceType: \'WEAK_AREAS_PRACTICE\'})">{{::\'EXAMS.BUTTONS.CONTINUE\'|translate}}</a>\n                                    </div>\n                                </div>\n                            </div>',
            resolve: {
                practiceConfig: ["customerStatsService", function (customerStatsService) {
                    return customerStatsService.getCategories('WEAK_AREAS_PRACTICE');
                }]
            },
            controller: ["$filter", "practiceConfig", function ($filter, practiceConfig) {
                var _this = this;

                this.practiceConfig = practiceConfig; /*$filter('orderBy')(practiceConfig, (item)=>{
                                                      return item.totalQuestionsAskedInCategory - item.questionIDsCorrectlyAnswered.length;
                                                      }, true);*/

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
            title: 'EXAMS.TYPES.WEAK_AREAS_PRACTICE',
            sidebarMeta: {
                order: 400
            }
        }).state('exams.repeated-practice', {
            url: '/repeated-practice',
            parent: 'exams',
            template: '<div class="panel col-md-12">\n                                <div class="panel-body">\n                                    <practices-grade class="repeated-practice-view" title-label="\'STATS.DASHBOARD.CHARTS.PRACTICES_GRADE.TITLE\'|translate"></practices-grade>\n                                </div>\n                            </div>',
            title: 'EXAMS.TYPES.REPEATED_POST_CREDIT_PRACTICE',
            sidebarMeta: {
                order: 400
            }
        }).state('exams.predefined', {
            url: '/predefined',
            parent: 'exams',
            template: '<div class="col-xs-12 col-md-4 predefined-exam-component" ng-repeat="exam in $ctrl.exams">\n                            <div class="panel panel-success">\n                                <div class="panel-heading">\n                                    <span class="text-white">{{::exam.displayName}}</span>\n                                </div>\n                                <div class="panel-body">\n                                    <p><label>{{::exam.description}}</label>\n                                    </p>\n                                    <p><i class="fa fa-list-ol" aria-hidden="true"></i>&nbsp;\n                                        {{::\'EXAMS.PREDEFINED.NUMOFQUEST\'|translate}}:&nbsp;\n                                        <span class="label label-warning">{{::exam.numberOfQuestionsInExam}}</span>\n                                    </p>\n                                    <p ng-if="::exam.packagesToBuy.length>0" class="row col-xs-12">\n                                        <i class="fa fa-trophy" aria-hidden="true"></i>&nbsp;\n                                        {{::\'EXAMS.PREDEFINED.PACKAGESTOBUY\'|translate}}:&nbsp;\n                                        <span>{{::exam.packagesToBuy.toString()}}</span>\n                                    </p>\n                                    <div class="pull-left timeFrame">                                        \n                                        <ul class="col-md-4">\n                                            <li class="pull-left">\n                                                <label class="radio-inline custom-radio nowrap">                                                    \n                                                    <input type="radio" name="timeFrame{{::exam.id}}" value="UNLIMITED" \n                                                           ng-model="exam.timeFrame" ng-disabled="!exam.allowUnlimitedTime"\n                                                           ng-checked="exam.timeFrame === \'UNLIMITED\'"><span>{{::\'EXAMS.DISTRIBUTION.TIMEFRAME.UNLIMITED\'|translate}}</span>\n                                                </label>\n                                            </li>\n                                            <li class="pull-left">\n                                                <label class="radio-inline custom-radio nowrap">\n                                                    <input type="radio" name="timeFrame{{::exam.id}}" value="NORMAL" ng-model="exam.timeFrame"\n                                                           ng-checked="exam.timeFrame === \'NORMAL\'">\n                                                    <span>{{::\'EXAMS.DISTRIBUTION.TIMEFRAME.REGULAR\'|translate}}</span>\n                                                </label>\n                                            </li>\n                                            <li class="pull-left">\n                                                <label class="radio-inline custom-radio nowrap">\n                                                    <input type="radio" name="timeFrame{{::exam.id}}" value="EXTENDED" ng-model="exam.timeFrame"\n                                                           ng-checked="exam.timeFrame === \'EXTENDED\'"><span>{{::\'EXAMS.DISTRIBUTION.TIMEFRAME.EXTENDED\'|translate}}</span>\n                                                </label>\n                                            </li>\n                                        </ul>\n                                    </div>\n                                    <a class="btn btn-md btn-success pull-right" ui-sref="exams.practice({\'practiceType\': \'PREDEFINED_EXAM\', examParams: exam})">{{::\'EXAMS.BUTTONS.START\'|translate}}</a>                                  \n                                </div>\n                            </div>\n                          </div>',
            controller: ["exams", function (exams) {
                this.exams = _.map(exams.predefinedExamBeans, function (exam) {
                    return _.assign(exam, { timeFrame: 'NORMAL' });
                });
            }],
            controllerAs: '$ctrl',
            resolve: {
                exams: ["examService", function (examService) {
                    return examService.listPredefined();
                }]
            },
            title: 'EXAMS.TYPES.PREDEFINED_EXAM',
            sidebarMeta: {
                order: 400
            }
        });
    }
})();