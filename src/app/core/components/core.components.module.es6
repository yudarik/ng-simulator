/**
 * Created by arikyudin on 31/05/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components.auth', []);

    angular.module('Simulator.components', [
        'Simulator.components.auth',
        'Simulator.components.charts',
        'Simulator.core.directives'
    ])
})();