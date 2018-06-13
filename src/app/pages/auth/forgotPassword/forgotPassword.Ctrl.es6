/**
 * Created by arikyudin on 05/06/16.
 */

(function () {
    'use strict';


    angular.module('Simulator.pages.auth')
        .controller('forgotController', function($scope, $translate, simulator_config, userAuthService){

            this.$onInit = () => {
                this.displayLoginBtn = false;
                this.simulator_config = simulator_config;
                this.user = {};
            }

            this.submit = ()=>{
                this.formChanged = false;

                userAuthService.resetPassword({emailAddress: this.user.email})
                    .then((response)=>{
                        if (response || response.status === 'success') {
                            this.displayLoginBtn = !this.displayLoginBtn;
                            this.message = response.description;//$translate.instant('AUTH.PASSWORD_RESET_EMAIL_SENT');
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