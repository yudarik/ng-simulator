'use strict';

/**
 * Created by arikyudin on 05/06/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.pages.auth').factory('userAuthService', ["$rootScope", "Restangular", "$state", "$q", function ($rootScope, Restangular, $state, $q) {

        var auth = Restangular.all('/auth');

        var Srv = {

            signin: function signin(userDetails) {
                return auth.customPOST(userDetails, 'login');
            },
            signup: function signup(userDetails) {
                return Restangular.all('candidates').post({ emailAddress: userDetails.email });
            },
            signout: function signout() {

                $rootScope.currentUser = null;

                return auth.customPOST({}, 'logout').then(function (res) {}).catch(function () {
                    $state.go('signin');
                });
            },
            getUser: function getUser() {

                if (!$rootScope.currentUser) {

                    Restangular.setDefaultHttpFields({ 'withCredentials': true });

                    return auth.customGET('').then(function (user) {
                        return $rootScope.currentUser = user;
                    }, function (reason) {
                        return $state.go('signin');
                    });
                } else {
                    return $q.when($rootScope.currentUser);
                }
            }
        };

        return Srv;
    }]);
})();