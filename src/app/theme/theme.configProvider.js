/**
 * Created by k.danovsky on 13.05.2016.
 */

(function () {
  'use strict';

  var basic = {
    default: '#ffffff',
    defaultText: '#666666',
    border: '#dddddd',
    borderDark: '#aaaaaa',
  };

  // main functional color scheme
  var colorScheme = {
    primary: '#209e91',
    info: '#2dacd1',
    success: '#90b900',
    warning: '#dfb81c',
    danger: '#e85656',
  };

  // dashboard colors for charts
  /*var dashboardColors = {
    blueStone: '#005562',
    surfieGreen: '#0e8174',
    silverTree: '#6eba8c',
    gossip: '#b9f2a1',
    white: '#10c4b5',
  };*/
  var dashboardColors = {
    green: '#008000',
    blue: '#0000ff',
    yellow: '#ffff00',
    red: '#ff0000',
    orange: '#ffa500',
    aqua: '#00ffff'
  };

  var practicesColors = {
      "EXAM":  "#FF0000",
      "REPEATED_EXAM": "#F08080",
      "PREDEFINED_EXAM": "#FFFF00",
      "REPEATED_PREDEFINED_EXAM":  "#FFF69C",
      "SUGGESTED_PRACTICE": "#0000FF",
      "REPEATED_SUGGESTED_PRACTICE": "#ADD8E6",
      "PRACTICE":  "#008000",
      "REPEATED_PRACTICE": "#90EE90",
      "POST_CREDIT_PRACTICE":  "#FF00FF",
      "REPEATED_POST_CREDIT_PRACTICE": "#EE82EE",
      "WEAK_AREAS_PRACTICE": "#0000FF",
      "REPEATED_WEAK_AREAS_PRACTICE": "#ADD8E6",
      "DEMO": "#452d80",
      "DEMO_PREDEFINED_EXAM": "#2e7080"
  };

  angular.module('BlurAdmin.theme')
    .provider('baConfig', configProvider);

  /** @ngInject */
  function configProvider(colorHelper) {
    var conf = {
      theme: {
        blur: false,
      },
      colors: {
        default: basic.default,
        defaultText: basic.defaultText,
        border: basic.border,
        borderDark: basic.borderDark,

        primary: colorScheme.primary,
        info: colorScheme.info,
        success: colorScheme.success,
        warning: colorScheme.warning,
        danger: colorScheme.danger,

        primaryLight: colorHelper.tint(colorScheme.primary, 30),
        infoLight: colorHelper.tint(colorScheme.info, 30),
        successLight: colorHelper.tint(colorScheme.success, 30),
        warningLight: colorHelper.tint(colorScheme.warning, 30),
        dangerLight: colorHelper.tint(colorScheme.danger, 30),

        primaryDark: colorHelper.shade(colorScheme.primary, 15),
        infoDark: colorHelper.shade(colorScheme.info, 15),
        successDark: colorHelper.shade(colorScheme.success, 15),
        warningDark: colorHelper.shade(colorScheme.warning, 15),
        dangerDark: colorHelper.shade(colorScheme.danger, 15),

        /*dashboard: {
          blueStone: dashboardColors.blueStone,
          surfieGreen: dashboardColors.surfieGreen,
          silverTree: dashboardColors.silverTree,
          gossip: dashboardColors.gossip,
          white: dashboardColors.white
        },*/
        dashboard: practicesColors
      }
    };

    conf.changeTheme = function(theme) {
      _.merge(conf.theme, theme)
    };

    conf.changeColors = function(colors) {
      _.merge(conf.colors, colors)
    };

    conf.$get = function () {
      delete conf.$get;
      return conf;
    };
    return conf;
  }
})();
