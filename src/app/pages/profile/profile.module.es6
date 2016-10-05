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
            templateUrl: 'app/pages/profile/profile.html',
            controller: 'ProfilePageCtrl as profile',
            resolve: {
                    userProfile: function(customerStatsService) {
                    return customerStatsService.getInfo();
                }
            }
        });
  }

})();
