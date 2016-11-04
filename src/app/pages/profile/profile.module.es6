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
            controller: ($uibModal, userProfile) =>{

                var showModal = function (item) {
                    $uibModal.open({
                        animation: false,
                        controller: /** @ngInject */
                            ($uibModalInstance) => {
                            this.ok = function () {
                                $uibModalInstance.close($scope.link);
                            };
                            this.userProfile = userProfile;
                        },
                        template: '<profile-page user-profile="$ctrl.userProfile"></profile-page>',
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
  }

})();
