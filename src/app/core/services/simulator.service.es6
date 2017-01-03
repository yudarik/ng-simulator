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
            statusResolved = true;

        function getStatus() {
            var defer = $q.defer(),
                promise = defer.promise;

            /*if (!statusResolved) {
                return promise;
            } else */
            if (statusCache) {
                defer.resolve(statusCache);
            }

            simulators.get('status').then(status => {
                statusCache = status;

                statusResolved = true;

                defer.resolve(status);
            });

            return promise;
        }

        function ping() {
            return simulators.get('ping');
        }

        return {getStatus, ping};
    })
})();