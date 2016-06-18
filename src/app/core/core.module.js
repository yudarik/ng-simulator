/**
 * Created by arikyudin on 06/06/16.
 */

(function () {
    'use strict';
    angular.module('Simulator.core', [])
        .config(function(RestangularProvider){
            RestangularProvider
                .setDefaultHeaders({
                    'Content-Type': 'application/json'
                })
                .setBaseUrl('http://nadlanline.dnsalias.com:8080/BrokerExams/rest');

        });
})();