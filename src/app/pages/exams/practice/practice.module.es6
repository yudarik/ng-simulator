/**
 * Created by arikyudin on 31/05/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.pages.exams.practice', ['Simulator.components'])
        .config(routeConfig)
        .run(($rootScope, $uibModal, $state)=>{

            let registerStateChangeListener = () => {
                var onRouteChangeOff = $rootScope.$on('$stateChangeStart',
                    function(event, toState, toParams, fromState, fromParams, options){
                        //console.log(fromState.name + ' > '+ toState.name);

                        if (fromState.name === 'exams.practice' && toState.name !== 'exams.practice-summary' && !options.emergencyExit) {
                            event.preventDefault();

                            redirectModal().then(()=>{
                                onRouteChangeOff();
                                $rootScope.$broadcast('cancel-practice');
                                $state.transitionTo(toState, toParams);
                            }, ()=>{
                                //dismiss
                            })
                        } else if (fromState.name === 'exams.practice' && toState.name === 'exams.practice-summary') {
                            onRouteChangeOff();
                        }
                    });

                $rootScope.$on('$destroy', () => onRouteChangeOff());
            };
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
            //registerStateChangeListener();

            $rootScope.$on('$stateChangeSuccess',
                function(event, toState, toParams, fromState, fromParams){

                    if (toState.name === 'exams.practice') {
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
                template: '<exam config="$resolve.examConfig" tabindex="1"></exam>',
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

                                    //alert(err.data.description);
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
                template: '<exam config="$resolve.practiceSummary"></exam>',
                resolve: {
                    practiceSummary: function($stateParams) {
                        return $stateParams.practiceSummary;
                    }
                },
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
                               <practices-grade class="repeated-practice-view" 
                                    title-label="'STATS.DASHBOARD.CHARTS.PRACTICES_GRADE.TITLE'|translate"
                                    user-type="$resolve.userType"></practices-grade>
                            </div>`,
                resolve: {
                    userType: function(userAuthService){
                        return userAuthService.getUserType();
                    }
                },
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