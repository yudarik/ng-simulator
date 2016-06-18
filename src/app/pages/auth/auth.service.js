/**
 * Created by arikyudin on 05/06/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.pages.auth')
        .factory('userAuthService', function($rootScope, Restangular, $state, $q){

            var auth = Restangular.all('/auth');

            var Srv = {

                signin: function(userDetails) {
                    return auth.customPOST(userDetails, 'login');

                },
                signout: function() {

                    $rootScope.currentUser = null;

                    return auth.customPOST({}, 'logout')
                        .then((res)=>{

                        })
                        .catch(()=>{
                           $state.go('signin');
                        })
                },
                getUser: function() {

                    if (!$rootScope.currentUser) {

                        Restangular.setDefaultHttpFields({'withCredentials':true});

                        return auth.customGET('').then(function(user){
                            return $rootScope.currentUser = user;
                        }, function(reason){
                            return $state.go('signin');
                        });
                    } else {
                        return $q.when($rootScope.currentUser);
                    }

                }
            };

            return Srv;
        })

})();