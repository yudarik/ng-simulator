/**
 * Created by yudarik on 3/14/17.
 */
(function () {
    'use strict';

    angular.module('Simulator.pages.profile')
        .component('profileModal', {
            bindings: {
                userProfile: '<',
                userType: '<'
            },
            controller: function ($uibModal, $state, $q, $translate, $timeout, customerService, simulator_config) {

                var buttons = {
                    next: $translate.instant('USER.PROFILE_PAGE.NEXT'),
                    prev: $translate.instant('USER.PROFILE_PAGE.PREV')
                };

                this.$onInit = () => {
                    $uibModal.open({
                        animation: true,
                        backdrop  : 'static',
                        keyboard  : false,
                        controller: function($uibModalInstance, userProfile, userType) {

                            this.alert;
                            this.buttons = buttons;
                            this.service = customerService;
                            this.userProfileForm = {};
                            this.user = _.clone(userProfile);
                            this.userType = userType;
                            this.upcomingExamEventDates = [];

                            if (simulator_config.upcomingExamEventDates.length) {
                                this.upcomingExamEventDates = simulator_config.upcomingExamEventDates.map((date)=>{
                                    return date;//moment(date).format('DD/MM/YYYY').toString();
                                });
                                this.user.examEventDate = this.upcomingExamEventDates[0];
                                this.examEventOption = 'select';
                            } else {
                                this.examEventOption = 'other';
                            }

                            this.getAlertType = ()=>{
                                if (!this.alert) return;

                                return this.alert.type;
                            };
                            this.updateProfile = () =>{

                                let params = this.user;

                                if (this.user.examEventDate && typeof this.user.examEventDate === "object") {
                                    params.examEventDate = this.user.examEventDate.getTime();//.format('DD/MM/YYYY').toString();
                                } else if (typeof this.user.examEventDate === "number") {
                                    params.examEventDate = this.user.examEventDate;
                                }

                                _.forEach(params, (val, key)=>{

                                    if (_.isNil(val)) {
                                        params = _.omit(params, key);
                                    }
                                });

                                this.service.putInfo(params).then(()=>{
                                    this.alert = {
                                        type: 'success',
                                        msg: $translate.instant('USER.PROFILE_PAGE.DETAILS_UPDATED_SUCCESS')
                                    };
                                    $timeout(()=>{
                                        $uibModalInstance.close();
                                    },1000);

                                }).catch(err =>{

                                    if (err.data) {
                                        this.error = err.data.description;
                                        this.alert = {
                                            type: 'danger',
                                            msg: err.data.description
                                        };
                                    }
                                })
                            };
                        },
                        controllerAs: 'profile',
                        template: `<div class="modal-content profile-modal col-xs-12">
                            <h2 class="text-center" ng-bind="::'AUTH.INITIAL_PROFILE_SETUP_TITLE'|translate"></h2>
                          <form name="userProfileForm" ng-submit="profile.updateProfile(userProfileForm)" novalidate>
                              <div ng-include="'app/pages/profile/profileTemplate/general-info.html'"></div>
                              <div ng-if="profile.userType === 'Customer'"
                                   ng-include="'app/pages/profile/profileTemplate/contact.html'"></div>
                              <div ng-include="'app/pages/profile/profileTemplate/exam-date.html'"></div>
                        
                            <p class="col-md-12 pull-left text-{{profile.getAlertType()}} pull-left" ng-if="profile.alert" ng-bind="profile.alert.msg">
                            </p>
                        
                            <button type="submit" class="btn btn-primary btn-with-icon" ng-disabled="userProfileForm.$invalid">
                              <i class="ion-android-checkmark-circle"></i>{{::'USER.PROFILE_PAGE.UPDATE_PROFILE'|translate}}
                            </button>
                          </form>
                        </div>`,
                        resolve: {
                            userProfile: ($q) => {
                                return $q.when(this.userProfile);
                            },
                            userType: ($q) => {
                                return $q.when(this.userType);
                            }
                        }
                    }).result.then(function (link) {
                        $state.go(simulator_config.defaultState);
                    });
                };
            },
        })
})();