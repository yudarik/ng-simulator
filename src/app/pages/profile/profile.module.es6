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
            template: `<profile-modal user-profile="$resolve.userProfile[1]" user-type="$resolve.userProfile[0]"></profile-modal>`,
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
