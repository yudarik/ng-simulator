/**
 * Created by arikyudin on 05/06/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.pages.auth')
        .controller('signinController', function($scope, $translate, simulator_config, userAuthService, $state){

            this.simulator_config = simulator_config;

            this.user = {};

            userAuthService.getUser().then(()=>{
                //$state.go('profile');
                $state.go('exams.distribution');
            });

            this.submit = ()=>{
                userAuthService.signin(this.user)
                    .then((user)=>{
                        if (user){
                            if (!user || user.errorMessage) {
                                this.message = $translate.instant('SIGNIN.'+user.errorMessage.toUpperCase());
                            } else {
                                $state.go('exams.distribution');
                            }

                        } else {
                            this.message = 'Username or password is incorrect, please try again';
                        }

                    }).catch((err)=>{
                        if (err.status === -1) {
                            this.message = $translate.instant('SIGNIN.USER_PASSWARD_INCORRECT');
                        } else {
                            this.message = err.data;
                        }

                    });
            }
        })
})();