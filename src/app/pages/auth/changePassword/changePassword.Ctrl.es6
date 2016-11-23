/**
 * Created by yudarik on 11/22/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.pages.auth')
        .controller('changePasswordCtrl', function($uibModal, $translate, $timeout, $state, customerService) {
            this.passwordResetForm = {};
            this.user = {};

            this.changePassword = () =>{

                customerService.changePassword(this.user).then(()=>{
                    this.alert = {
                        type: 'success',
                        msg: $translate.instant('USER.PROFILE_PAGE.DETAILS_UPDATED_SUCCESS')
                    };
                    $timeout(()=>{
                        $state.go('signout');
                    },1000);

                }).catch(err =>{

                    if (err.data) {
                        this.alert = {
                            type: 'danger',
                            msg: (err.data.description === "password validation failed")?
                                $translate.instant('AUTH.ERROR.PASSWORD_VALIDATION_FAILED') : err.data.description
                        };
                    }
                })
            };
        })

})();
