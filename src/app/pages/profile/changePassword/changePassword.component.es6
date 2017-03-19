/**
 * Created by yudarik on 11/22/16.
 */
(function () {
    'use strict';
    angular.module('Simulator.pages.profile')
        .component('changePassword', {
            bindings: {
                openDialog: '<'
            },
            controller: function($uibModal, $state, $translate, $timeout, customerService) {
                this.passwordResetForm = {};

                this.$onInit = function () {
                    //displayDialog();
                };

                this.$onChanges = (changesObj) => {
                    if (changesObj.openDialog && !_.isNil(changesObj.openDialog.currentValue)) {
                        displayDialog();
                    }
                };

                var displayDialog = ()=> {
                    this.dialogInstance = $uibModal.open({
                        animation: true,
                        backdrop  : 'static',
                        keyboard  : false,
                        controller: function($uibModalInstance) {
                            this.user = {};
                            this.$uibModalInstance = $uibModalInstance;

                            this.changePassword = () =>{

                                customerService.changePassword(this.user).then(()=>{
                                    this.alert = {
                                        type: 'success',
                                        msg: $translate.instant('USER.PROFILE_PAGE.PASSWORD_CHANGE_SUCCESS')
                                    };
                                    $timeout(()=>{
                                        this.$uibModalInstance.close();
                                        $state.go('signout');
                                    },5000);
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
                        templateUrl: 'app/pages/profile/changePassword/passwordModal.html'
                    }).result.then((event) => {
                        this.openDialog = !this.openDialog;
                    }, (event) => {
                        this.openDialog = !this.openDialog;
                    });
                }
            }
        })

})();