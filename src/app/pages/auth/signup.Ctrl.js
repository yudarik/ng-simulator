'use strict';

/**
 * Created by arikyudin on 05/06/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.pages.auth').controller('signupController', ["$translate", "simulator_config", "userAuthService", "$state", function ($translate, simulator_config, userAuthService, $state) {
        var _this = this;

        this.simulator_config = simulator_config;

        this.user = {};

        /*userAuthService.getUser().then(()=>{
            $state.go('profile');
            //$state.go('exams.distribution');
        });*/

        this.submit = function () {
            userAuthService.signup(_this.user).then(function (response) {
                if (response.status === 'success') {
                    _this.message = $translate.instant('AUTH.REGISTERED_SUCCESSFULLY');
                }
            });
            /*.catch((err)=>{
                if (err.status === 401) {
                    this.message = $translate.instant('SIGNIN.'+err.data.errorMessage.toUpperCase());
                } else {
                    this.message = err.data.errorMessage
                }
             });*/
        };
    }]);
})();