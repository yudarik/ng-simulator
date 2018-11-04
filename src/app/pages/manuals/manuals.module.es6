/**
 * Created by arikyudin on 20/07/16.
 */

(function () {
    'use strict';
    angular.module('Simulator.pages.manuals', [])
        .config(routeConfig);

    function routeConfig($stateProvider) {
        $stateProvider
            .state('manuals', {
                url: '/manuals',
                parent: 'auth',
                template: '<online-manuals manuals="$resolve.manuals" user="$resolve.user"></online-manuals>',

                resolve: {
                    manuals: function(manualsService){
                        return manualsService.list().then(list=>{

                           // list.onlineManualBeans = list.onlineManualBeans.map(item => _.assign(item, {packagesToBuy: [1,2]}));

                            return {
                                list: _.sortBy(list.onlineManualBeans, 'order'),
                                productsById: list.productsById
                            };
                        });
                    },
                    user: function(userAuthService) {
                        return userAuthService.getUser();
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