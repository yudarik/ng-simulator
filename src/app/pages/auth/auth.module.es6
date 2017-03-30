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
                controller: function ($rootScope, $state, userAuthService, simulator_config) {

                    $rootScope.currentUser = null;

                    userAuthService.getUser().then(() => {
                        $state.go(simulator_config.defaultState);
                    }).catch(err => {
                        $state.go('signin');
                    });
                }
            })
            .state('auth', {
                abstract: true,
                template: '<div ui-view></div>',
                resolve: {
                    user: (userAuthService,customerService,simulatorService,$state) => {
                        return userAuthService.getUser()
                            .then(user => {
                                if (user && user.tempPassword) {
                                    return $state.go('changePassword');
                                }
                                return user;
                            })
                            .catch(err => $state.go('signin'));
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
                controller: function(userAuthService, customerService){
                    customerService.clearCache();
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
                templateUrl: 'app/pages/auth/changePassword/passwordChange.html',
                controller: 'changePasswordCtrl as passChange',
                resolve: {
                    user: (userAuthService) => {
                        return userAuthService.getUser('resetPassword');
                    }
                }
            })
    }


})();