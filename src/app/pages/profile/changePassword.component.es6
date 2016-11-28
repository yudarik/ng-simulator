/**
 * Created by yudarik on 11/22/16.
 */
(function () {
    'use strict';
    angular.module('Simulator.pages.profile')
        .component('changePassword', {
            bindings: {
                openDialog: '='
            },
            controller: function($uibModal, $translate, $timeout, customerService) {
                this.passwordResetForm = {};

                this.$onInit = function () {
                    this.displayDialog();
                };

                this.displayDialog = ()=> {
                    $uibModal.open({
                        animation: true,
                        controller: function($uibModalInstance) {
                            this.user = {};

                            this.changePassword = () =>{

                                customerService.changePassword(this.user).then(()=>{
                                    this.alert = {
                                        type: 'success',
                                        msg: $translate.instant('USER.PROFILE_PAGE.DETAILS_UPDATED_SUCCESS')
                                    };
                                    $timeout(()=>{
                                        $uibModalInstance.close();
                                    },2000);

                                }).catch(err =>{

                                    if (err.data) {
                                        this.alert = {
                                            type: 'danger',
                                            msg: (err.data.description === "password validation failed")?
                                                $translate.instant('AUTH.ERROR.PASSWORD_VALIDATION_FAILED') : err.data.description
                                        };
                                    }
                                })
                            }
                        },
                        controllerAs: 'passwordModal',
                        templateUrl: 'app/pages/profile/passwordModal.html'
                    }).result.then(() => {

                    }, () => {
                        this.openDialog = !this.openDialog;
                    });
                }
            }
        })

})();