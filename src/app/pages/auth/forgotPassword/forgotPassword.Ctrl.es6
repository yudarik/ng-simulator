/**
 * Created by arikyudin on 05/06/16.
 */

(function () {
    'use strict';


    angular.module('Simulator.pages.auth')
        .controller('forgotController', function($scope, $translate, simulator_config, userAuthService){

            this.simulator_config = simulator_config;

            this.user = {};

            this.submit = ()=>{
                this.formChanged = false;

                userAuthService.resetPassword({emailAddress: this.user.email})
                    .then((response)=>{
                        if (response.status === 'success') {
                            this.message = $translate.instant('AUTH.REGISTERED_SUCCESSFULLY');
                        }
                    })
                    .catch((err)=>{
                        this.message = err.data.description;
                    });
            };

            $scope.$watch('forgot.user.email', (oldVal, newVal) => {
                if (oldVal === newVal) {
                    return;
                } else {
                    this.formChanged = true;
                }
            });
        })

})();