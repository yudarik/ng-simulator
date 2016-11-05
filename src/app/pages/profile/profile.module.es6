/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('Simulator.pages.profile', ['Simulator.pages.stats'])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('profile', {
            url: '/profile',
            parent: 'auth',
            title: 'USER.PROFILE',
            template: '<profile-page user-profile="$ctrl.userProfile"></profile-page>',
            controller: function(userProfile) {
                this.userProfile = userProfile;
            },
            controllerAs: '$ctrl',
            resolve: {
                    userProfile: function(customerService) {
                    return customerService.getInfo();
                }
            }
        })
        .state('profileModal', {
            url: '/profile-modal',
            parent: 'auth',
            controller: function ($uibModal, $translate, $timeout, userProfile, customerService, simulator_config) {

                var buttons = {
                    next: $translate.instant('USER.PROFILE_PAGE.NEXT'),
                    prev: $translate.instant('USER.PROFILE_PAGE.PREV')
                };
                var showModal = function (item) {
                    $uibModal.open({
                        animation: true,
                        controller: function($uibModalInstance) {

                            this.user = userProfile;
                            this.currentPage = 1;
                            this.buttons = buttons;
                            this.alert;

                            this.userProfileForm = {};
                            this.upcomingExamEvents = _.map(simulator_config.upcomingExamEventDates, (date)=> {
                                return {date: date};
                            });

                            this.getAlertType = ()=>{
                                if (!this.alert) return;

                                return this.alert.type;
                            };
                            this.updateProfile = () =>{

                                let params = this.user.plain();

                                _.forEach(params, (val, key)=>{

                                    if (_.isEmpty(params[key])) {
                                        params = _.omit(params, key);
                                    }
                                });

                                customerService.putInfo(params).then(()=>{
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
                            }
                        },
                        controllerAs: 'profile',
                        templateUrl: 'app/pages/profile/profileModal.html'
                    }).result.then(function (link) {
                        item.href = link;
                    });
                };
                showModal();
            },
            resolve: {
                userProfile: function(customerService) {
                    return customerService.getInfo();
                }
            }
        })
        .state('chantePassword', {
            url: '/changePassword',
            parent: 'auth',
            controller: function($uibModal, $translate, $timeout, customerService) {
                var showModal = function () {
                    $uibModal.open({
                        animation: true,
                        controller: function($uibModalInstance) {

                            this.alert;
                            this.user = {};

                            this.changePassword = () =>{

                                customerService.changePassword(this.user).then(()=>{
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
                            }
                        },
                        controllerAs: 'passwordModal',
                        templateUrl: 'app/pages/profile/passwordModal.html'
                    }).result.then(function (link) {
                        item.href = link;
                    });
                };
                showModal();
            }
        })
  }

})();
