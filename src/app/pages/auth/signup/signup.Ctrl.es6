/**
 * Created by arikyudin on 05/06/16.
 */

(function () {
    'use strict';


    angular.module('Simulator.pages.auth')
        .controller('signupController', function($translate, simulator_config, userAuthService, $state){

            this.simulator_config = simulator_config;

            this.user = {};

            /*userAuthService.getUser().then(()=>{
                $state.go('profile');
                //$state.go('exams.distribution');
            });*/

            this.submit = ()=>{
                userAuthService.signup(this.user)
                    .then((response)=>{
                        if (response.status === 'success') {
                            this.message = $translate.instant('AUTH.REGISTERED_SUCCESSFULLY');
                        }
                    })
                    .catch((err)=>{
                        this.message = err.data.description;
                    });
            }
        })

})();