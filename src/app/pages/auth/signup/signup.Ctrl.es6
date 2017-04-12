/**
 * Created by arikyudin on 05/06/16.
 */

(function () {
    'use strict';


    angular.module('Simulator.pages.auth')
        .controller('signupController', function($scope, $translate, simulator_config, userAuthService, $state){

            this.simulator_config = simulator_config;

            this.user = {};

            /*userAuthService.getUser().then(()=>{
                $state.go('profile');
                //$state.go('exams.distribution');
            });*/

            this.submit = ()=>{
                this.formChanged = false;

                userAuthService.signup(this.user)
                    .then((response)=>{
                        if (response.status === 'success') {
                            this.message = response.description;//$translate.instant('AUTH.REGISTERED_SUCCESSFULLY');
                        }
                    })
                    .catch((err)=>{
                        this.message = err.data.description;
                    });
            };

            $scope.$watch('signup.user.email', (oldVal, newVal) => {
                if (oldVal === newVal) {
                    return;
                } else {
                    this.formChanged = true;
                }
            });
        })

})();