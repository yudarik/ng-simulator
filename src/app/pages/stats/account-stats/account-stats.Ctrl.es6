/**
 * Created by arikyudin on 16/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.pages.stats')
        .controller('accountStatsCtrl', accountStatsCtrl);

    function accountStatsCtrl(quota) {

        this.quota = quota;
    }
})();