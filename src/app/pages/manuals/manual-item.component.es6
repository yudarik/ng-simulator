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
            controller: function($window, $translate, manualsService,simulator_config) {

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

                this.getButtonLabel = () => {
                    if(this.item.available) {
                        return $translate.instant('MANUALS.DISPLAY')
                    }
                    return $translate.instant('MANUALS.BUY_PACKAGE');
                }
            },
            template: `<div class="online-manual-component">
                            <div class="panel" ng-class="$ctrl.getPanelClass($ctrl.item.docType)">
                                <div class="panel-heading">                                    
                                    <i class="pull-right fa {{$ctrl.getLinkClass($ctrl.item.docType)}}"></i>
                                    <span class="pull-left" uib-tooltip="{{::$ctrl.item.displayName}}">{{::$ctrl.item.displayName}}</span>
                                </div>
                                <div class="panel-body">                               
                                    <p ng-if="$ctrl.item.category">
                                        <span class="label label-info">{{::$ctrl.item.category}}</span><br/>
                                        <p ng-bind="::$ctrl.item.description"></p>
                                    </p>
                                    <div ng-if="!$ctrl.item.available">
                                        <p class="control-label"><i class="fa fa-trophy" aria-hidden="true"></i>&nbsp;<span ng-bind="::'MANUALS.AVAILABLE_ON_ORDER_OF'|translate"></span></p>
                                        <ul><li class="circle" ng-repeat="package in $ctrl.item.packagesToBuy">{{$ctrl.getPackage2BuyName(package)}}</li></ul>
                                    </div>                
                                </div>
                            </div>
                            <button class="btn btn-md btn-success pull-right displayDoc" 
                                        ng-click="$ctrl.navigate()"                                        
                                        >{{$ctrl.getButtonLabel()}}</button>
                          </div>`
        });
})();