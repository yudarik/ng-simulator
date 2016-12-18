/**
 * Created by arikyudin on 05/06/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.pages.auth')
        .controller('signinController', function($translate, simulator_config, userAuthService, $state){

            this.simulator_config = simulator_config;

            this.user = {};

            this.submit = ()=>{
                userAuthService.signin(this.user)
                    .then((user)=>{
                        if (user && user.tempPassword) {
                            $state.go('changePassword');
                        } else if (user && user.firstLogin) {
                            $state.go('profileModal');
                        } else if (user.role === "Customer") {
                            $state.go(simulator_config.defaultState);
                        } else {
                            $state.go('profile');
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
            }
        })
})();