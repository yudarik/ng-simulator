/**
 * Created by arikyudin on 21/06/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components')
        .component('predefinedPractice', {
            /**ngInject*/
            bindings: {
                exams: '<',
                user: '<'
            },
            template: `<div class="col-xs-12 col-md-4 predefined-exam-component" ng-repeat="exam in $ctrl.exams track by exam.id">
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
                                    <div ng-if="::exam.packagesToBuy" class="row col-xs-12 packagesToBuy">
                                        <i class="fa fa-trophy" aria-hidden="true"></i>&nbsp;
                                        {{::'EXAMS.PREDEFINED.PACKAGESTOBUY'|translate}}:&nbsp;
                                        <ul class="pull-left">
                                            <li class="circle" ng-repeat="package in exam.packagesToBuy" ng-bind="::$ctrl.getPackage2BuyName(package)">
                                            </li>
                                        </ul>
                                    </div>
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
                                    <button class="btn btn-md btn-success pull-right navigate2Exam" 
                                        ng-disabled="::$ctrl.isExamQuotaUnavailable(exam)" 
                                        ng-click="$ctrl.navigate(exam)"
                                        ng-bind="$ctrl.getButtonText(exam)"></button>                                  
                                </div>
                            </div>
                          </div>`,
            controller: function($state, $translate, $window, simulator_config){
                this.productsById = this.exams.productsById;
                this.exams = _.orderBy(_.map(this.exams.predefinedExamBeans, (exam) => {
                    return _.assign(exam, {timeFrame: 'NORMAL'});
                }), 'order');
                this.getPackage2BuyName = (id) => {
                    return this.productsById[id].productDisplayName;
                };
                this.getPayPalUrl = () => {
                    return (this.user.role === 'Candidate')?
                        simulator_config.payPalCandidateStoreURL :
                        simulator_config.payPalCustomerStoreURL;
                };
                this.navigate = (exam) => {
                    if (this.isExamAvailable(exam)) {
                        $state.go('exams.practice', {'practiceType': this.getPracticeType(), examParams: exam});
                    } else {
                        $window.open(this.getPayPalUrl(), '_blank')
                    }

                };
                this.getPracticeType = () => {
                    return (this.user.role === 'Candidate')? 'DEMO_PREDEFINED_EXAM' : 'PREDEFINED_EXAM';
                };
                this.isExamAvailable = (exam) => {
                    return exam.available;
                };
                this.isExamQuotaUnavailable = (exam) => {
                    return (this.exams.maxPracticesPerPredefinedExam - exam.practicesPerformed) <= 0;
                };
                this.getButtonText = (exam) => {
                    return this.isExamAvailable(exam)? $translate.instant('EXAMS.BUTTONS.START') : $translate.instant('EXAMS.BUTTONS.BUY_PACKAGE');
                };
                this.getTooltip = (exam) => {
                    return this.isExamQuotaUnavailable(exam)? $translate.instant('EXAMS.BUTTONS.QUOTA_EXCEEDED') : '';
                };
            },
        });

})();