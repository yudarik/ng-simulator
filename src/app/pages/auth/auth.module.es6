/**
 * Created by arikyudin on 05/06/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.pages.auth', [])
        .config(routeConfig);

    function routeConfig($stateProvider) {
        $stateProvider
            .state('auth', {
                abstract: true,
                template: '<div ui-view></div>',
                resolve: {
                    user: function(userAuthService) {
                        return userAuthService.getUser();
                    }
                }
            })
            .state('signin', {
                url: '/signin',
                templateUrl: 'app/pages/auth/signin.html',
                controller: 'signinController as signin'
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'app/pages/auth/signup.html',
                controller: 'signupController as signup'
            })
            .state('signout', {
                url: '/signout',
                controller: function(userAuthService){
                    userAuthService.signout();
                }
            })
            .state('forgotPassword', {
                url: '/password-forgot',
                templateUrl: 'app/pages/auth/forgot_password.html',
                controller: 'forgotController as forgot'
            })
    }


})();