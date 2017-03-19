/**
 * Created by arikyudin on 09/07/16.
 */

(function () {
    'use strict';
    angular.module('Simulator.core.services', []);
    angular.module('Simulator.core.services')
        .factory('simulatorService', function(Restangular, $q){

        var simulators = Restangular.all('simulators');
        var statusCache = null,
            promise,
            requestInProgress = false;

        function getStatus() {

            if (statusCache) {
                return $q.when(statusCache);
            }
            if (requestInProgress) {
                return $q.when(promise);
            }

            promise = simulators.get('status').then(status => {
                statusCache = status;

                return status
            });

            requestInProgress = true;

            return $q.when(promise);
        }

        function ping() {
            return simulators.get('ping');
        }

        return {getStatus, ping};
    })
})();