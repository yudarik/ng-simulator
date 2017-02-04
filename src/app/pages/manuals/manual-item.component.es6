/**
 * Created by yudarik on 2/2/17.
 */
(function () {
    'use strict';
    angular.module('Simulator.pages.manuals')
        .component('manualItem', {
            bindings: {
                item: '<',
                productsId: '<',
                user: '<'
            },
            controller: function($window, manualsService,simulator_config) {

                this.getPackage2BuyName = (id) => {
                    return this.productsId[id].productDisplayName;
                };
                this.getTooltip = (manual) => {
                    return manual.available? '': ``
                };
                this.getUrl = (id) => {
                    return manualsService.get(id);
                };
                this.navigate = () => {
                    if (!this.item.available) {
                        $window.open(this.getPayPalUrl(), '_blank');
                    } else {
                        $window.open(this.getUrl(this.item.id), '_blank');
                    }
                };
                this.getPanelClass = (type) => {
                    if (!type) return;
                    switch (type) {
                        case 'AUDIO':
                            return 'panel-warning';
                            break;
                        case 'VIDEO':
                            return 'panel-danger';
                            break;
                        case 'DOCUMENT':
                            return 'panel-success';
                            break;
                        case 'OTHER':
                            return 'panel-info';
                            break;
                        default:
                            return 'panel-default';
                    }
                };
                this.getLinkClass = (docType) => {
                    if (!docType) return;

                    var type;

                    switch (docType) {
                        case 'AUDIO':
                            type = 'fa-volume-up'
                            break;
                        case 'VIDEO':
                            type = 'fa-play';
                            break;
                        case 'DOCUMENT':
                            type = 'fa-file-pdf-o';
                            break;
                        case 'OTHER':
                            type = 'fa-file-text-o';
                            break;
                    }

                    return type;
                };
                this.getPayPalUrl = () => {
                    return (this.user.role === 'Candidate')?
                        simulator_config.payPalCandidateStoreURL :
                        simulator_config.payPalCustomerStoreURL;
                };
            },
            template: `<div class="col-xs-12 online-manual-component">
                            <div class="panel" ng-class="$ctrl.getPanelClass($ctrl.item.docType)">
                                <div class="panel-heading">                                    
                                    <i class="pull-right fa {{$ctrl.getLinkClass($ctrl.item.docType)}}"></i>
                                    <span class="pull-left">{{::$ctrl.item.category || $ctrl.item.displayName}}</span>
                                </div>
                                <div class="panel-body">                               
                                    <p ng-if="$ctrl.item.category">
                                        <span>{{::$ctrl.item.displayName}}</span><br/>
                                        <label ng-bind="::$ctrl.item.description"></label>
                                    </p>
                                    <div ng-if="!$ctrl.item.available">
                                        <label class="control-label" ng-bind="::'MANUALS.AVAILABLE_ON_ORDER_OF'|translate"></label>
                                        <ul><li ng-repeat="package in $ctrl.item.packagesToBuy">{{$ctrl.getPackage2BuyName(package)}}</li></ul>
                                    </div>
                                    
                                    <button class="btn btn-md btn-success pull-right displayDoc" 
                                        ng-click="$ctrl.navigate()" 
                                        ng-disabled="!$ctrl.item.available" 
                                        ng-bind="::'MANUALS.DISPLAY'|translate"></button>                                  
                                </div>
                            </div>
                          </div>`
        });
})();