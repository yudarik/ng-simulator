/**
 * Created by arikyudin on 31/05/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.pages.exams.practice', ['Simulator.components'])
        .config(routeConfig)
        .run(($rootScope, $uibModal, $state)=>{

            function registerStateChangeListener() {
                var onRouteChangeOff = $rootScope.$on('$stateChangeStart',
                    function(event, toState, toParams, fromState, fromParams){
                        console.log(fromState.name + ' > '+ toState.name);

                        if (fromState.name === 'exams.practice' && toState.name !== 'exams.practice-summary') {
                            event.preventDefault();

                            redirectModal().then(()=>{
                                onRouteChangeOff();
                                $state.transitionTo(toState, toParams);
                            }, ()=>{
                                //dismiss
                            })
                        }
                    });
            }
            function redirectModal() {
                var modalInstance = $uibModal.open({
                    animation: true,
                    template: `<div class="panel"><div class="panel-body">
                        <h3 class="text-center">{{::"EXAMS.EXAM_CANCEL_ARE_YOU_SURE"|translate}}</h3>
                        <br/>
                        <br/>
                        <p class="text-center ">
                        <button class="btn btn-success btn-space" ng-click="ok()">{{::'GENERAL.OK'|translate}}</button>
                        <button class="btn btn-default" ng-click="cancel()">{{::'GENERAL.CANCEL'|translate}}</button>
                        </p>
                        </div></div>`,
                    controller: function ($uibModalInstance, $scope) {
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

            $rootScope.$on('$stateChangeSuccess',
                function(event, toState, toParams, fromState, fromParams){

                    if (fromState.name === 'exams.practice') {
                        registerStateChangeListener();
                    }
                });
        });

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('exams.practice', {
                url: '/practice',
                parent: 'exams',
                params: {
                    examParams: {},
                    practiceType: 'PRACTICE'
                },
                template: '<exam config="practice.examConfig" tabindex="1"></exam>',
                controller: 'practiceCtrl as practice',
                resolve: {

                    examConfig: function($state, $stateParams, $q, examService) {

                        return examService.getExam($stateParams.practiceType, $stateParams.examParams)
                            .then(res => {

                                if (res.practiceType) {
                                    $state.get('exams.practice').title = 'EXAMS.TYPES.'+res.practiceType;
                                }

                                return res;
                            })
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
                    practiceSummary: {}
                },
                template: '<exam config="solutionCtrl.examConfig"></exam>',
                resolve: {
                    practiceSummary: function($stateParams) {
                        return $stateParams.practiceSummary;
                    }
                },
                controller: function(practiceSummary) {
                    this.examConfig = practiceSummary;
                },
                controllerAs: 'solutionCtrl',
                title: 'EXAMS.TYPES.PRACTICE_SOLUTION'
            })
            .state('exams.weak-areas', {
                url: '/weak-areas',
                parent: 'exams',
                template: `<weak-areas-chart config="$resolve.practiceConfig" 
                                             title-label="::'STATS.DASHBOARD.CHARTS.WEAK_AREAS.TITLE'|translate">                                             
                            </weak-areas-chart>`,
                resolve: {
                    practiceConfig: function(statsService) {
                        return statsService.getCategories('WEAK_AREAS_PRACTICE');
                    }
                },
                title: 'EXAMS.TYPES.WEAK_AREAS_PRACTICE',
                sidebarMeta: {
                    order: 400
                }
            })
            .state('exams.repeated-practice', {
                url: '/repeated-practice',
                parent: 'exams',
                template: `<div ba-panel ba-panel-class="with-scroll" class="col-xs-12" dir="ltr">
                               <practices-grade class="repeated-practice-view" title-label="'STATS.DASHBOARD.CHARTS.PRACTICES_GRADE.TITLE'|translate"></practices-grade>
                            </div>`,
                title: 'EXAMS.TYPES.REPEATED_ALL',
                sidebarMeta: {
                    order: 400
                }
            })
            .state('exams.predefined', {
                url: '/predefined',
                parent: 'exams',
                template: '<predefined-practice exams="$resolve.exams" user="$resolve.user"></predefined-practice>',
                resolve: {
                    exams: function(examService) {
                        return examService.listPredefined();
                    },
                    user: function(userAuthService){
                        return userAuthService.getUser();
                    }
                },
                title: 'EXAMS.TYPES.PREDEFINED_EXAM',
                sidebarMeta: {
                    order: 400
                }
            })
    }
})();