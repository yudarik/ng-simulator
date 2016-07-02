/**
 * Created by arikyudin on 05/06/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.pages.auth')
        .controller('signinController', function($scope, simulator_config, userAuthService, $state){

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
                            //$state.go('profile');
                            $state.go('exams.distribution');
                        } else {
                            this.message = 'Username or password is incorrect, please try again';
                        }

                    }).catch((err)=>{
                        this.message = err;
                    });
            }
        })
})();