/**
 * Created by arikyudin on 20/07/16.
 */

(function () {
    'use strict';
    angular.module('Simulator.pages.manuals', ['ngTable'])
        .config(routeConfig);

    function routeConfig($stateProvider) {
        $stateProvider
            .state('manuals', {
                url: '/manuals',
                parent: 'auth',
                template: '<online-manuals manuals="manualsCtrl.manuals"></online-manuals>',
                controller: function(manuals){
                    this.manuals = manuals;
                },
                controllerAs: 'manualsCtrl',
                resolve: {
                    manuals: function(manualsService){
                        return manualsService.list().then(list=>{
                            return _.sortBy(list.onlineManualBeans, 'order');
                        });
                    }
                },
                title: 'MANUALS.TITLE',
                sidebarMeta: {
                    icon: 'ion-university',
                    order: '300'
                }
            })
    }
})();