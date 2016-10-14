/**
 * Created by arikyudin on 05/06/16.
 */

(function () {
    'use strict';


    angular.module('Simulator.pages.auth')
        .controller('forgotController', function($translate, simulator_config, customerService){

            this.simulator_config = simulator_config;

            this.user = {};

            this.submit = ()=>{
                customerService.resetPassword({emailAddress: this.user.email})
                    .then((response)=>{
                        if (response.status === 'success') {
                            this.message = $translate.instant('AUTH.REGISTERED_SUCCESSFULLY');
                        }
                    })
                    .catch((err)=>{
                        if (err.status === 401) {
                            this.message = $translate.instant('SIGNIN.'+err.data.errorMessage.toUpperCase());
                        } else {
                            this.message = err.data.errorMessage
                        }

                    });
            }
        })

})();