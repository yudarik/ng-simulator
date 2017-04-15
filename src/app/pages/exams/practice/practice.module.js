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
                template: '<div class="panel"><div class="panel-body">\n                        <h3 class="text-center">{{::"EXAMS.EXAM_CANCEL_ARE_YOU_SURE"|translate}}</h3>\n                        <br/>\n                        <br/>\n                        <p class="text-center ">\n                        <button class="btn btn-success btn-space" ng-click="ok()">{{::\'GENERAL.OK\'|translate}}</button>\n                        <button class="btn btn-default" ng-click="cancel()">{{::\'GENERAL.CANCEL\'|translate}}</button>\n                        </p>\n                        </div></div>',
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

                    return examService.getExam($stateParams.practiceType, $stateParams.examParams).then(function (res) {

                        if (res.practiceType) {
                            $state.get('exams.practice').title = 'EXAMS.TYPES.' + res.practiceType;
                        }

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
            template: '<weak-areas-chart config="$resolve.practiceConfig" \n                                             title-label="::\'STATS.DASHBOARD.CHARTS.WEAK_AREAS.TITLE\'|translate">                                             \n                            </weak-areas-chart>',
            resolve: {
                practiceConfig: ["statsService", function (statsService) {
                    return statsService.getCategories('WEAK_AREAS_PRACTICE');
                }]
            },
            title: 'EXAMS.TYPES.WEAK_AREAS_PRACTICE',
            sidebarMeta: {
                order: 400
            }
        }).state('exams.repeated-practice', {
            url: '/repeated-practice',
            parent: 'exams',
            template: '<div ba-panel ba-panel-class="with-scroll" class="col-xs-12" dir="ltr">\n                               <practices-grade class="repeated-practice-view" title-label="\'STATS.DASHBOARD.CHARTS.PRACTICES_GRADE.TITLE\'|translate"></practices-grade>\n                            </div>',
            title: 'EXAMS.TYPES.REPEATED_ALL',
            sidebarMeta: {
                order: 400
            }
        }).state('exams.predefined', {
            url: '/predefined',
            parent: 'exams',
            template: '<predefined-practice exams="$resolve.exams" user="$resolve.user"></predefined-practice>',
            resolve: {
                exams: ["examService", function (examService) {
                    return examService.listPredefined();
                }],
                user: ["userAuthService", function (userAuthService) {
                    return userAuthService.getUser();
                }]
            },
            title: 'EXAMS.TYPES.PREDEFINED_EXAM',
            sidebarMeta: {
                order: 400
            }
        });
    }
})();