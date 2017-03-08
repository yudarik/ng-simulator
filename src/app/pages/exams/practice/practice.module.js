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
            template: '<div class="panel col-md-offset-4 col-md-4">\n                                <div class="panel-body">\n                                    <h3>{{::\'\'|translate}}</h3>\n                                    <ol>\n                                        <li ng-repeat="category in weakAreas.practiceConfig.categories">\n                                            {{::category.name}}\n                                        </li>\n                                    </ol>\n                                    <div class="col-md-12">\n,                                        <a class="btn btn-default" ui-sref="exams.distribution-general({distribution: weakAreas.practiceConfig, practiceType: \'WEAK_AREAS_PRACTICE\'})">{{::\'EXAMS.BUTTONS.CONTINUE\'|translate}}</a>\n                                    </div>\n                                </div>\n                            </div>',
            resolve: {
                practiceConfig: ["statsService", function (statsService) {
                    return statsService.getCategories('WEAK_AREAS_PRACTICE');
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
            template: '<div ba-panel ba-panel-class="with-scroll" class="col-xs-12" dir="ltr">\n                               <practices-grade class="repeated-practice-view" title-label="\'STATS.DASHBOARD.CHARTS.PRACTICES_GRADE.TITLE\'|translate"></practices-grade>\n                            </div>',
            title: 'EXAMS.TYPES.REPEATED_ALL',
            sidebarMeta: {
                order: 400
            }
        }).state('exams.predefined', {
            url: '/predefined',
            parent: 'exams',
            template: '<div class="col-xs-12 col-md-4 predefined-exam-component" ng-repeat="exam in $ctrl.exams">\n                            <div class="panel panel-success">\n                                <div class="panel-heading">\n                                    <span class="text-white">{{::exam.displayName}}</span>\n                                </div>                                \n                                <div class="panel-body">\n                                    <div class="panel-overlay" ng-if=$ctrl.isExamQuotaUnavailable(exam)><p ng-bind="::$ctrl.getTooltip(exam)"></p></div>\n                                    <p><label>{{::exam.description}}</label>\n                                    </p>\n                                    <p><i class="fa fa-list-ol" aria-hidden="true"></i>&nbsp;\n                                        {{::\'EXAMS.PREDEFINED.NUMOFQUEST\'|translate}}:&nbsp;\n                                        <span class="label label-warning">{{::exam.numberOfQuestionsInExam}}</span>\n                                    </p>\n                                    <p ng-if="::exam.packagesToBuy" class="row col-xs-12">\n                                        <i class="fa fa-trophy" aria-hidden="true"></i>&nbsp;\n                                        {{::\'EXAMS.PREDEFINED.PACKAGESTOBUY\'|translate}}:&nbsp;\n                                        <div>\n                                            <ul class="pull-left">\n                                                <li class="circle" ng-repeat="package in exam.packagesToBuy" ng-bind="::$ctrl.getPackage2BuyName(package)">\n                                                </li>\n                                            </ul>\n                                        </div>\n                                    </p>\n                                    <div class="pull-left timeFrame" ng-if="::!exam.packagesToBuy">                                        \n                                        <ul class="col-md-4">\n                                            <li class="pull-left">\n                                                <label class="radio-inline custom-radio nowrap">                                                    \n                                                    <input type="radio" name="timeFrame{{::exam.id}}" value="UNLIMITED" \n                                                           ng-model="exam.timeFrame" ng-disabled="!exam.allowUnlimitedTime"\n                                                           ng-checked="exam.timeFrame === \'UNLIMITED\'"><span>{{::\'EXAMS.DISTRIBUTION.TIMEFRAME.UNLIMITED\'|translate}}</span>\n                                                </label>\n                                            </li>\n                                            <li class="pull-left">\n                                                <label class="radio-inline custom-radio nowrap">\n                                                    <input type="radio" name="timeFrame{{::exam.id}}" value="NORMAL" ng-model="exam.timeFrame"\n                                                           ng-checked="exam.timeFrame === \'NORMAL\'">\n                                                    <span>{{::\'EXAMS.DISTRIBUTION.TIMEFRAME.REGULAR\'|translate}}</span>\n                                                </label>\n                                            </li>\n                                            <li class="pull-left">\n                                                <label class="radio-inline custom-radio nowrap">\n                                                    <input type="radio" name="timeFrame{{::exam.id}}" value="EXTENDED" ng-model="exam.timeFrame"\n                                                           ng-checked="exam.timeFrame === \'EXTENDED\'"><span>{{::\'EXAMS.DISTRIBUTION.TIMEFRAME.EXTENDED\'|translate}}</span>\n                                                </label>\n                                            </li>\n                                        </ul>\n                                    </div>                                  \n                                    <button class="btn btn-md btn-success pull-right" \n                                        ng-disabled="::$ctrl.isExamQuotaUnavailable(exam)" \n                                        ng-click="$ctrl.navigate(exam)"\n                                        ng-bind="$ctrl.getButtonText(exam)"></button>                                  \n                                </div>\n                            </div>\n                          </div>',
            controller: ["$state", "$translate", "$window", "exams", "simulator_config", "user", function ($state, $translate, $window, exams, simulator_config, user) {
                var _this2 = this;

                this.productsById = exams.productsById;
                this.exams = _.orderBy(_.map(exams.predefinedExamBeans, function (exam) {
                    return _.assign(exam, { timeFrame: 'NORMAL' });
                }), 'order');
                this.getPackage2BuyName = function (id) {
                    return _this2.productsById[id].productDisplayName;
                };
                this.getPayPalUrl = function () {
                    return user.role === 'Candidate' ? simulator_config.payPalCandidateStoreURL : simulator_config.payPalCustomerStoreURL;
                };
                this.navigate = function (exam) {
                    if (_this2.isExamAvailable(exam)) {
                        $state.go('exams.practice', { 'practiceType': 'PREDEFINED_EXAM', examParams: exam });
                    } else {
                        $window.open(_this2.getPayPalUrl(), '_blank');
                    }
                };
                this.isExamAvailable = function (exam) {
                    return exam.available;
                };
                this.isExamQuotaUnavailable = function (exam) {
                    return exams.maxPracticesPerPredefinedExam - exam.practicesPerformed <= 0;
                };
                this.getButtonText = function (exam) {
                    return _this2.isExamAvailable(exam) ? $translate.instant('EXAMS.BUTTONS.START') : $translate.instant('EXAMS.BUTTONS.BUY_PACKAGE');
                };
                this.getTooltip = function (exam) {
                    return _this2.isExamQuotaUnavailable(exam) ? $translate.instant('EXAMS.BUTTONS.QUOTA_EXCEEDED') : '';
                };
            }],
            controllerAs: '$ctrl',
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