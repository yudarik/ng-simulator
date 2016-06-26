/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('Simulator.pages.exams',[
      'Simulator.pages.exams.full-exam',
      'Simulator.pages.exams.distribution',
      'Simulator.pages.exams.practice-summary'
  ])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('exams', {
            url: '/exams',
            parent: 'auth',
            abstract: true,
            template: '<div ui-view></div>',
            title: 'EXAMS.TYPES.TITLE',
            sidebarMeta: {
                icon: 'ion-stats-bars',
                order: 150
            }
        });
  }

})();
