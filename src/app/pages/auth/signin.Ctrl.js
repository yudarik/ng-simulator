/**
 * Created by arikyudin on 05/06/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.pages.auth')
        .controller('signinController', function($translate, simulator_config, userAuthService, $state){

            this.simulator_config = simulator_config;

            this.user = {};

            userAuthService.getUser().then(()=>{
                $state.go('profile');
                //$state.go('exams.distribution');
            });

            this.submit = ()=>{
                userAuthService.signin(this.user)
                    .then((user)=>{
                        if (user){
                            $state.go('dashboard');
                        }

                    }).catch((err)=>{
                        if (err.status === 401) {
                            this.message = $translate.instant('AUTH.'+err.data.errorMessage.toUpperCase());
                        } else {
                            this.message = err.data.errorMessage
                        }

                    });
            }
        })
})();