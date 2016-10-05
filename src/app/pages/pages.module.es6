/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('Simulator.pages', [
    'ui.router',
    'toaster',

    'frapontillo.bootstrap-switch',
    'Simulator.pages.exams',
    'Simulator.pages.auth',
    'Simulator.pages.profile',
    'Simulator.pages.manuals',
    'Simulator.pages.stats'
  ])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
    //$urlRouterProvider.otherwise('/');
    $urlRouterProvider.otherwise('/signin');
  }

})();
