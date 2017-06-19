/**
 * Created by arikyudin on 05/06/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.pages.auth')
        .controller('signinController', function($scope, $translate, simulator_config, userAuthService, $state, $stateParams, $timeout){
            /*ngInject*/

            this.simulator_config = simulator_config;

            this.user = {};

            this.submit = ()=>{

                this.formChanged = false;

                userAuthService.signin(this.user)
                    .then(userAuthService.getPostLogin)
                    .then((user)=>{

                        //return $state.go(simulator_config.defaultState);
                        //user.defaultProfile = true;
                        //user.tempPassword = true;
                        //$scope.$emit('post-login-bean', {user});

                        if (user && user.tempPassword) {
                            $state.go('changePassword');
                        } else if (user && user.defaultProfile) {
                            $state.go('profileModal');
                        } else if (user.role === "Customer" || user.role === "Candidate") {
                            $state.go(simulator_config.defaultState);
                        }
                    }).catch((err)=>{
                        if (err.status === 401) {
                            this.message = $translate.instant('AUTH.'+err.data.errorMessage.toUpperCase());
                        } else {
                            this.message = err.data.errorMessage
                        }

                        switch(err.status) {
                            case 401:
                            case 403:
                                this.message = $translate.instant('AUTH.ERROR.'+err.data.errorMessage.toUpperCase());
                                break;


                        }
                    });
            };

            if ($stateParams.from && $stateParams.from === 'signout') {
                $timeout(() => {
                    window.location.reload(true);
                },100);
            }

            $scope.$watchCollection('signin.user', (oldVal, newVal) => {
                if (oldVal === newVal) {
                    return;
                } else {
                    this.formChanged = true;
                }
            });
        })
})();