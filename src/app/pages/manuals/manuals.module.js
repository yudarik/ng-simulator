'use strict';

/**
 * Created by arikyudin on 20/07/16.
 */

(function () {
    'use strict';

    routeConfig.$inject = ["$stateProvider"];
    angular.module('Simulator.pages.manuals', ['ngTable']).config(routeConfig);

    function routeConfig($stateProvider) {
        $stateProvider.state('manuals', {
            url: '/manuals',
            parent: 'auth',
            template: '<online-manuals manuals="manualsCtrl.manuals"></online-manuals>',
            controller: ["manuals", function (manuals) {
                this.manuals = manuals;
            }],
            controllerAs: 'manualsCtrl',
            resolve: {
                manuals: ["manualsService", function (manualsService) {
                    return manualsService.list().then(function (list) {
                        return _.sortBy(list, 'order');
                    });
                }]
            },
            title: 'MANUALS.TITLE',
            sidebarMeta: {
                icon: 'ion-university',
                order: '300'
            }
        });
    }
})();