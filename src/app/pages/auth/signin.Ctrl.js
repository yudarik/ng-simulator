'use strict';

/**
 * Created by arikyudin on 05/06/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.pages.auth').controller('signinController', ["$translate", "simulator_config", "userAuthService", "$state", function ($translate, simulator_config, userAuthService, $state) {
        var _this = this;

        this.simulator_config = simulator_config;

        this.user = {};

        userAuthService.getUser().then(function () {
            $state.go('profile');
            //$state.go('exams.distribution');
        });

        this.submit = function () {
            userAuthService.signin(_this.user).then(function (user) {
                if (user) {
                    $state.go('dashboard');
                }
            }).catch(function (err) {
                if (err.status === 401) {
                    _this.message = $translate.instant('AUTH.' + err.data.errorMessage.toUpperCase());
                } else {
                    _this.message = err.data.errorMessage;
                }
            });
        };
    }]);
})();