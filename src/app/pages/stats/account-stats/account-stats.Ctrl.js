"use strict";

/**
 * Created by arikyudin on 16/07/16.
 */

(function () {
    'use strict';

    accountStatsCtrl.$inject = ["quota", "$uibModal"];
    angular.module('Simulator.pages.stats').controller('accountStatsCtrl', accountStatsCtrl);

    function accountStatsCtrl(quota, $uibModal) {

        this.quota = quota;
    }
})();