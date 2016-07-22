/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  //angular.module('BlurAdmin.pages', [
  //  //'ui.router',
  ////
  ////  'BlurAdmin.pages.dashboard',
  ////  'BlurAdmin.pages.ui',
  ////  'BlurAdmin.pages.components',
  ////  'BlurAdmin.pages.form',
  ////  'BlurAdmin.pages.tables',
  ////  'BlurAdmin.pages.charts',
  ////  'BlurAdmin.pages.maps',
  ////  'BlurAdmin.pages.profile'
  //]);

  angular.module('Simulator.pages', [
    'ui.router',
    'frapontillo.bootstrap-switch',
    'Simulator.pages.exams',
    'Simulator.pages.auth',
    'Simulator.pages.profile',
    'Simulator.pages.manuals'
  ])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
    //$urlRouterProvider.otherwise('/');
    $urlRouterProvider.otherwise('/signin');

    baSidebarServiceProvider.addStaticItem({
      title: 'Pages',
      icon: 'ion-document',
      subMenu: [{
        title: 'Sign In',
        fixedHref: 'auth.html',
        blank: false
      }, {
        title: 'Sign Up',
        fixedHref: 'reg.html',
        blank: true
      }, {
        title: 'User Profile',
        stateRef: 'profile'
      }, {
        title: '404 Page',
        fixedHref: '404.html',
        blank: true
      }]
    });
  }

})();
