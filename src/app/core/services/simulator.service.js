'use strict';

/**
 * Created by arikyudin on 09/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.core').factory('simulatorService', ["Restangular", function (Restangular) {

        var simulators = Restangular.all('simulators');

        function getStatus() {
            return simulators.get('status');
        }

        function ping() {
            return simulators.get('ping');
        }

        return { getStatus: getStatus, ping: ping };
    }]);
})();