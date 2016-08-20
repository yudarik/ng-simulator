'use strict';

angular.module('BlurAdmin', [
  'ngAnimate',
  'ngCookies',
  'restangular',
  'ui.bootstrap',
  'ui.sortable',
  'ui.router',
  'ngTouch',
  'toastr',
  'smart-table',
  "xeditable",
  'ui.slimscroll',
  'ngJsTree',
  'angular-progress-button-styles',
  'BlurAdmin.theme'
]);

angular.module('Simulator', [
  'pascalprecht.translate',
  'ngAnimate',
  'ngCookies',
  'restangular',
  'ui.bootstrap',
  'ui.sortable',
  'ui.router',
  'ngTouch',
  'toastr',
  'smart-table',
  "xeditable",
  'ui.slimscroll',
  'ngJsTree',
  'angular-progress-button-styles',
  'BlurAdmin',
  'Simulator.core',
  'Simulator.pages',
  'Simulator.components'
]);