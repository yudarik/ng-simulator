/**
 * Created by yudarik on 11/1/16.
 */

angular.module('Simulator.components')
    .component('welcome', {
        bindings: {
            config: '<',
            user: '<'
        },
        controller: function($uibModal, $translate, simulator_config) {

            var config = this.config || simulator_config;
            var translate = {
                ok : $translate.instant('AUTH.WELCOME.MESSAGE.OK_BTN')
            };

            this.$onInit = () => {
                if (this.user.firstLogin &&
                    this.config.welcomeMessage !== '' &&
                    this.config.welcomeMessage !== null) {

                    if (this.user.role === 'Candidate' ||
                        (this.user.role === 'Customer' &&
                        !this.config.welcomeMessageForCandidatesOnly)) {
                        showWelcome();
                    }
                }
            };

            function showWelcome() {
                var modal = $uibModal.open({
                    animation: true,
                        template: `<div class="col-md-12" ba-panel>
                                        <div class="text-center">
                                            <h3 ng-bind="$ctrl.title" class="text-center"></h3>
                                            <br/>
                                            <button class="btn btn-success btn-sm"
                                                ng-click="$ctrl.close()" ng-bind="$ctrl.closeText">
                                            </button>
                                        </div>
                                    </div>`,
                    controller: function($uibModalInstance) {
                        this.title = config.welcomeMessage;
                        this.closeText = translate.ok;

                        this.close = ()=>{
                            $uibModalInstance.close();
                        }
                    },
                    controllerAs: '$ctrl'
                });

                modal.result.then(()=>{

                });
            }
        },
        resolve: {
            translate: function($translate){
                return $translate('AUTH.WELCOME')
            }
        }
    });
