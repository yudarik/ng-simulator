/**
 * Created by arikyudin on 03/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.pages.stats')
        .factory('statsService', function(Restangular, userAuthService, $q){
            var service = userAuthService.getUserType().then(type => {
                if (type === "Customer") {
                    return Restangular.all('/stats/customer/');
                } else {
                    return Restangular.all('/stats/candidate/');
                }
            });

            function getService() {
                return $q.when(service);
            }

            function getRank() {
                return getService().then(srv => srv.get('rank', {ever: true}));
            }

            function getCategories(type) {
                switch (type) {
                    case 'WEAK_AREAS_PRACTICE':
                        return getService().then(srv => srv.get('weaknesses/categories'));
                        break;
                    default:
                        return getService().then(srv => srv.get('categories'));
                }

            }

            return {getRank, getCategories};
        })
})();