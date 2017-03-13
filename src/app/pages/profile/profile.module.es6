/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('Simulator.pages.profile', ['Simulator.pages.stats', 'ui.select'])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('profile', {
            url: '/profile',
            parent: 'auth',
            title: 'USER.PROFILE',
            template: '<profile-page user-profile="$resolve.userProfile[1]" user-type="$resolve.userProfile[0]"></profile-page>',
            controllerAs: '$ctrl',
            resolve: {
                /*userType: function($q, userAuthService) {
                    return userAuthService.getUser().then(user => {
                        return user.role;
                    })
                },*/
                userProfile: function($q, userAuthService, customerService) {
                    return $q.all([userAuthService.getUserType(), customerService.getInfo()]);
                }
            }
        })
        .state('profileModal', {
            url: '/profile-modal',
            parent: 'auth',
            controller: function ($uibModal, $state, $translate, $timeout, userProfile, customerService, simulator_config) {

                var buttons = {
                    next: $translate.instant('USER.PROFILE_PAGE.NEXT'),
                    prev: $translate.instant('USER.PROFILE_PAGE.PREV')
                };
                var showModal = function (item) {
                    $uibModal.open({
                        animation: true,
                        backdrop  : 'static',
                        keyboard  : false,
                        controller: function($uibModalInstance) {
                            this.alert;
                            this.buttons = buttons;
                            this.service = customerService;
                            this.userProfileForm = {};
                            this.examEventOption = 'select';
                            this.upcomingExamEventDates = simulator_config.upcomingExamEventDates.map((date)=>{
                                return date;//moment(date).format('DD/MM/YYYY').toString();
                            });
                            this.user = _.clone(userProfile[1]);
                            this.userType = userProfile[0];

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
                        templateUrl: 'app/pages/profile/profileModal/profileModal.html'
                    }).result.then(function (link) {
                        $state.go(simulator_config.defaultState);
                    });
                };
                showModal();
            },
            resolve: {
                userProfile: function($q, userAuthService, customerService) {
                    return $q.all([userAuthService.getUserType(), customerService.getInfo()]);
                }
            }
        })
        .state('changePasswordModal', {
            url: '/changePasswordModal',
            parent: 'auth',
            template: `<change-password></change-password>`
        });
  }

})();
