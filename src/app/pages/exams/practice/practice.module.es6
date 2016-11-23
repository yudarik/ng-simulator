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
                    template: [ '<div class="panel"><div class="panel-body">',
                        '<h3 class="text-center">{{::"EXAMS.EXAM_CANCEL_ARE_YOU_SURE"|translate}}</h3>',
                        '<br/>',
                        '<br/>',
                        '<p class="text-center ">',
                        '<button class="btn btn-success btn-space" ng-click="ok()">אישור</button>',
                        '<button class="btn btn-default" ng-click="cancel()">ביטול</button>',
                        '</p>',
                        '</div></div>'].join(''),
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
                    practiceType: ''
                },
                template: '<exam config="practice.examConfig" tabindex="1"></exam>',
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
            })
            .state('exams.predefined', {
                url: '/predefined',
                parent: 'exams',
                template: `<div class="col-xs-12 col-md-4" ng-repeat="exam in $ctrl.exams.predefinedExamBeans">
                            <div class="panel panel-success">
                                <div class="panel-heading">
                                    <span class="text-white">{{::exam.displayName}}</span>
                                    <a class="label label-info pull-right" ui-sref="exams.practice({'practiceType': 'PREDEFINED_EXAM'})">{{::'EXAMS.BUTTONS.START'|translate}}</a>
                                </div>
                                <div class="panel-body">
                                    <p><i class="fa fa-info-circle" aria-hidden="true"></i>&nbsp; 
                                        <label>{{::exam.description}}</label>
                                    </p>
                                    <p><i class="fa fa-list-ol" aria-hidden="true"></i>&nbsp;
                                        {{::'EXAMS.PREDEFINED.NUMOFQUEST'|translate}}:&nbsp;
                                        <span class="label label-warning">{{::exam.numberOfQuestionsInExam}}</span>
                                    </p>
                                    <p><i class="fa fa-clock-o"></i>:&nbsp;
                                        {{::'EXAMS.PREDEFINED.TIME'|translate}}:&nbsp;
                                        <span class="label label-warning">{{::exam.time/60|number:2}} ({{::'EXAMS.PREDEFINED.MINUTE'|translate}})</span>
                                    </p>
                                    <p><i class="fa fa-clock-o"></i>&nbsp;
                                        {{::'EXAMS.PREDEFINED.TIME_EXTENDED'|translate}}:&nbsp;
                                        <span class="label label-warning">{{::exam.extendedTime/60|number:2}} ({{::'EXAMS.PREDEFINED.MINUTE'|translate}})</span>
                                    </p>
                                    <p><i class="fa fa-clock-o"></i>&nbsp;
                                        {{::'EXAMS.PREDEFINED.UNLIMITED_TIME'|translate}}:&nbsp;
                                        <span ng-if="::exam.allowUnlimitedTime">
                                            <i class="fa fa-check text-success" aria-hidden="true"></i>
                                        </span>
                                        <span ng-if="::!exam.allowUnlimitedTime">
                                            <i class="fa fa-times text-danger" aria-hidden="true"></i>
                                        </span>                                        
                                    </p>
                                    <p ng-if="::exam.packagesToBuy"><i class="fa fa-trophy" aria-hidden="true"></i>&nbsp;
                                        {{::'EXAMS.PREDEFINED.PACKAGESTOBUY'|translate}}:&nbsp;
                                        <span>{{::exam.packagesToBuy}}</span>
                                    </p>                                    
                                </div>
                            </div>
                          </div>`,
                controller: function(exams){
                    this.exams = exams;
                },
                controllerAs: '$ctrl',
                resolve: {
                    exams: function(examService) {
                        return examService.listPredefined();
                    }
                },
                title: 'EXAMS.TYPES.PREDEFINED_EXAM',
                sidebarMeta: {
                    order: 400
                }
            })
    }
})();