/**
 * Created by yudarik on 11/1/16.
 */

angular.module('Simulator.components')
    .component('welcome', {
        bindings: {
            config: '<',
            user: '<'
        },
        template: `<div class="alert bg-info closeable" ng-if="$ctrl.showWelcome">
                    <button type="button" class="close" aria-label="Close" ng-click="$ctrl.showWelcome = !$ctrl.showWelcome">
                        <span aria-hidden="true">×</span>
                    </button>
                    <span ng-bind="$ctrl.config.welcomeMessage"></span>
                    </div>`,
        controller: function($uibModal, $translate, simulator_config) {

            this.welcomeMessage = (this.config)? this.config.welcomeMessage : simulator_config.welcomeMessage;
            this.showWelcome = false;

            this.$onInit = () => {
                if (this.config.welcomeMessage !== '' &&
                    this.config.welcomeMessage !== null) {

                    if (this.user.role === 'Candidate' ||
                        (this.user.role === 'Customer' &&
                        !this.config.welcomeMessageForCandidatesOnly)) {
                        this.showWelcome = true;
                    }
                }
            };

        }
    });
