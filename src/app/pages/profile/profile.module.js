/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('Simulator.pages.profile', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('profile', {
            url: '/profile',
            title: 'USER.PROFILE',
            templateUrl: 'app/pages/profile/profile.html',
            controller: 'ProfilePageCtrl as profile',
            resolve: {
                    userProfile: function(userAuthService) {
                    return userAuthService.getUser();
                }
            }
        });
  }

})();
