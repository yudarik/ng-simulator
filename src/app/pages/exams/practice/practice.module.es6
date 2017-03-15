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
                template: `<weak-areas-chart config="$resolve.practiceConfig"></weak-areas-chart>`,
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
                template: `<div class="col-xs-12 col-md-4 predefined-exam-component" ng-repeat="exam in $ctrl.exams">
                            <div class="panel panel-success">
                                <div class="panel-heading">
                                    <span class="text-white">{{::exam.displayName}}</span>
                                </div>                                
                                <div class="panel-body">
                                    <div class="panel-overlay" ng-if=$ctrl.isExamQuotaUnavailable(exam)><p ng-bind="::$ctrl.getTooltip(exam)"></p></div>
                                    <p><label>{{::exam.description}}</label>
                                    </p>
                                    <p><i class="fa fa-list-ol" aria-hidden="true"></i>&nbsp;
                                        {{::'EXAMS.PREDEFINED.NUMOFQUEST'|translate}}:&nbsp;
                                        <span class="label label-warning">{{::exam.numberOfQuestionsInExam}}</span>
                                    </p>
                                    <p ng-if="::exam.packagesToBuy" class="row col-xs-12">
                                        <i class="fa fa-trophy" aria-hidden="true"></i>&nbsp;
                                        {{::'EXAMS.PREDEFINED.PACKAGESTOBUY'|translate}}:&nbsp;
                                        <div>
                                            <ul class="pull-left">
                                                <li class="circle" ng-repeat="package in exam.packagesToBuy" ng-bind="::$ctrl.getPackage2BuyName(package)">
                                                </li>
                                            </ul>
                                        </div>
                                    </p>
                                    <div class="pull-left timeFrame" ng-if="::!exam.packagesToBuy">                                        
                                        <ul class="col-md-4">
                                            <li class="pull-left">
                                                <label class="radio-inline custom-radio nowrap">                                                    
                                                    <input type="radio" name="timeFrame{{::exam.id}}" value="UNLIMITED" 
                                                           ng-model="exam.timeFrame" ng-disabled="!exam.allowUnlimitedTime"
                                                           ng-checked="exam.timeFrame === 'UNLIMITED'"><span>{{::'EXAMS.DISTRIBUTION.TIMEFRAME.UNLIMITED'|translate}}</span>
                                                </label>
                                            </li>
                                            <li class="pull-left">
                                                <label class="radio-inline custom-radio nowrap">
                                                    <input type="radio" name="timeFrame{{::exam.id}}" value="NORMAL" ng-model="exam.timeFrame"
                                                           ng-checked="exam.timeFrame === 'NORMAL'">
                                                    <span>{{::'EXAMS.DISTRIBUTION.TIMEFRAME.REGULAR'|translate}}</span>
                                                </label>
                                            </li>
                                            <li class="pull-left">
                                                <label class="radio-inline custom-radio nowrap">
                                                    <input type="radio" name="timeFrame{{::exam.id}}" value="EXTENDED" ng-model="exam.timeFrame"
                                                           ng-checked="exam.timeFrame === 'EXTENDED'"><span>{{::'EXAMS.DISTRIBUTION.TIMEFRAME.EXTENDED'|translate}}</span>
                                                </label>
                                            </li>
                                        </ul>
                                    </div>                                  
                                    <button class="btn btn-md btn-success pull-right" 
                                        ng-disabled="::$ctrl.isExamQuotaUnavailable(exam)" 
                                        ng-click="$ctrl.navigate(exam)"
                                        ng-bind="$ctrl.getButtonText(exam)"></button>                                  
                                </div>
                            </div>
                          </div>`,
                controller: function($state, $translate, $window, exams, simulator_config, user){
                    this.productsById = exams.productsById;
                    this.exams = _.orderBy(_.map(exams.predefinedExamBeans, (exam) => {
                        return _.assign(exam, {timeFrame: 'NORMAL'});
                    }), 'order');
                    this.getPackage2BuyName = (id) => {
                        return this.productsById[id].productDisplayName;
                    };
                    this.getPayPalUrl = () => {
                        return (user.role === 'Candidate')?
                            simulator_config.payPalCandidateStoreURL :
                            simulator_config.payPalCustomerStoreURL;
                    };
                    this.navigate = (exam) => {
                        if (this.isExamAvailable(exam)) {
                            $state.go('exams.practice', {'practiceType': 'PREDEFINED_EXAM', examParams: exam});
                        } else {
                            $window.open(this.getPayPalUrl(), '_blank')
                        }

                    };
                    this.isExamAvailable = (exam) => {
                        return exam.available;
                    };
                    this.isExamQuotaUnavailable = (exam) => {
                        return (exams.maxPracticesPerPredefinedExam - exam.practicesPerformed) <= 0;
                    };
                    this.getButtonText = (exam) => {
                        return this.isExamAvailable(exam)? $translate.instant('EXAMS.BUTTONS.START') : $translate.instant('EXAMS.BUTTONS.BUY_PACKAGE');
                    }
                    this.getTooltip = (exam) => {
                        return this.isExamQuotaUnavailable(exam)? $translate.instant('EXAMS.BUTTONS.QUOTA_EXCEEDED') : '';
                    }
                },
                controllerAs: '$ctrl',
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