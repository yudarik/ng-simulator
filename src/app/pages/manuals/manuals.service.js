/**
 * Created by arikyudin on 20/07/16.
 */

(function () {
    'use strict';
    angular.module('Simulator.pages.manuals')
        .factory('manualsService', function(Restangular){

            var onlineManuals = Restangular.all('onlineManuals');

            function list () {
                return onlineManuals.get('');
            }

            function get (id) {
                return onlineManuals.getRequestedUrl(id);
            }

            return {list, get};
        })
})();