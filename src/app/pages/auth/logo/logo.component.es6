/**
 * Created by yudarik on 3/11/17.
 */
(function (myApp) {
    'use strict';

    angular.module('Simulator.pages.auth')
        .component('logoComponent', {
            /**ngInject*/
            bind: {},
            template: `<p class="row text-center hidden-xs">
                          <a ng-href="{{$ctrl.logo.logoImageLinkURL}}" target="_blank">
                            <img ng-src="{{$ctrl.logo.logoImageURL}}"/>
                          </a>
                        </p>`,
            controller: function(simulator_config) {
                this.logo = {
                    logoImageLinkURL: simulator_config.logoImageLinkURL,
                    logoImageURL : simulator_config.logoImageURL
                };
            }
        })
})();