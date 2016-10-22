/**
 * Created by arikyudin on 09/07/16.
 */

(function () {
    'use strict';
    angular.module('Simulator.core.services', []);
    angular.module('Simulator.core.services')
        .factory('simulatorService', function(Restangular){

        var simulators = Restangular.all('simulators');

        function getStatus() {
            return simulators.get('status');
        }

        function ping() {
            return simulators.get('ping');
        }

        return {getStatus, ping};
    })
})();