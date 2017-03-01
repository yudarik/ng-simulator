'use strict';

/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components').component('pageTop', {
        bindings: {
            user: '<'
        },
        templateUrl: 'app/theme/components/pageTop/pageTop.html',
        /** @ngInject */
        controller: ["simulator_config", function (simulator_config) {
            this.config = simulator_config;
        }],
        controllerAs: 'pageTop'
    });
})();