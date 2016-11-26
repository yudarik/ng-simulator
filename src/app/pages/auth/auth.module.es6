/**
 * Created by arikyudin on 05/06/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.pages.auth', ['ngMessages'])
        .config(routeConfig);

    function routeConfig($stateProvider) {
        $stateProvider
            .state('setup', {
                abstract: true,
                template: '<div ui-view></div>',
                resolve: {
                    translateReady: ($translate, $q, simulatorService) => {

                        return simulatorService.getStatus().then(config => {

                            $translate.use(config.locale);

                            return $q.when($translate.isReady());
                        }).catch(err => {
                            return false;
                        });
                    }
                },
                controller: function ($rootScope, $state, userAuthService) {

                    $rootScope.currentUser = null;

                    userAuthService.getUser().then(user => {
                        /*if (user.role === "Customer") {
                            $state.go('dashboard');
                        } else {
                            //$state.go('profile');
                        }*/
                        $state.go('dashboard');
                    });
                }
            })
            .state('auth', {
                abstract: true,
                template: '<div ui-view></div>',
                resolve: {
                    user: (userAuthService) => {
                        return userAuthService.getUser();
                    }
                }
            })
            .state('signin', {
                url: '/signin',
                parent: 'setup',
                templateUrl: 'app/pages/auth/signin/signin.html',
                controller: 'signinController as signin'
            })
            .state('signup', {
                url: '/signup',
                parent: 'setup',
                templateUrl: 'app/pages/auth/signup/signup.html',
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
                parent: 'setup',
                templateUrl: 'app/pages/auth/forgotPassword/forgot_password.html',
                controller: 'forgotController as forgot'
            })
            .state('changePassword', {
                url: '/changePassword',
                controllerAs: 'passChange',
                templateUrl: 'app/pages/auth/changePassword/passwordChange.html',
                controller: 'changePasswordCtrl as passChange',
                resolve: {
                    user: (userAuthService) => {
                        return userAuthService.getUser('reset');
                    }
                }
            })
    }


})();