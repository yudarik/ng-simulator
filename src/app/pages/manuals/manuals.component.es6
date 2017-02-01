/**
 * Created by arikyudin on 20/07/16.
 */

(function () {
    'use strict';
    angular.module('Simulator.pages.manuals')
        .component('onlineManuals', {
            bindings: {
                manuals: '='
            },
            controller: function manualsCtrl ($translate, $window, manualsService) {
                'ngInject';

                this.list = this.manuals.list

                this.filter = {
                    pattern: undefined,
                    docType: undefined
                };

                this.getUrl = (id) => {
                    return manualsService.get(id);
                };
                this.navigate = (manual) => {
                    if (!manual.available) return;
                    $window.open(this.getUrl(manual.id), '_blank');
                };

                this.tableHeads = {
                    displayName: $translate.instant('MANUALS.TABLE_HEADS.DOC_NAME'),
                    description: $translate.instant('MANUALS.TABLE_HEADS.DOC_DESC'),
                    link: $translate.instant('MANUALS.TABLE_HEADS.DOC_LINK'),
                    category: $translate.instant('MANUALS.TABLE_HEADS.CATEGORY'),
                    type: $translate.instant('MANUALS.TABLE_HEADS.TYPE')
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

                this.getPackage2BuyName = (id) => {
                    return this.manuals.productsById[id].productDisplayName;
                };
                this.getTooltip = (manual) => {
                    return manual.available? '': ``
                }
            },
            template: `<div class="row manuals-page">
                            <div class="col-xs-4 form-group">
                                <input class="form-control" type="search" 
                                    placeholder="{{::'MANUALS.SEARCH_PLACEHOLDER'|translate}}"
                                    ng-model="$ctrl.filter.pattern"/>                                
                            </div>
                            <div class="col-xs-8 form-group">
                                <!--<label class="hidden-xs">{{::'MANUALS.FILTER_BY_TYPE'|translate}}</label>-->
                                <div class="btn-group">
                                    <button class="btn btn-with-icon btn-warning" uncheckable uib-btn-radio="'AUDIO'" ng-model="$ctrl.filter.docType"><i class="pull-right fa {{$ctrl.getLinkClass('AUDIO')}}"></i>{{::'MANUALS.RESOURCE_TYPES.AUDIO'|translate}}</button>                                
                                    <button class="btn btn-with-icon btn-danger" uncheckable uib-btn-radio="'VIDEO'" ng-model="$ctrl.filter.docType"><i class="pull-right fa {{$ctrl.getLinkClass('VIDEO')}}"></i>{{::'MANUALS.RESOURCE_TYPES.VIDEO'|translate}}</button>                                
                                    <button class="btn btn-with-icon btn-success" uncheckable uib-btn-radio="'DOCUMENT'" ng-model="$ctrl.filter.docType"><i class="pull-right fa {{$ctrl.getLinkClass('DOCUMENT')}}"></i>{{::'MANUALS.RESOURCE_TYPES.DOCUMENT'|translate}}</button>                                
                                    <button class="btn btn-with-icon btn-info" uncheckable uib-btn-radio="'OTHER'" ng-model="$ctrl.filter.docType"><i class="pull-right fa {{$ctrl.getLinkClass('OTHER')}}"></i>{{::'MANUALS.RESOURCE_TYPES.OTHER'|translate}}</button>                                
                                </div>
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 online-manual-component" ng-repeat="manual in $ctrl.list | filter: {displayName: $ctrl.filter.pattern, docType: ($ctrl.filter.docType !== null) ?$ctrl.filter.docType : ''} | orderBy: 'order'">
                            <div class="panel" ng-class="$ctrl.getPanelClass(manual.docType)">
                                <div class="panel-heading">                                    
                                    <i class="pull-right fa {{$ctrl.getLinkClass(manual.docType)}}"></i>
                                    <span class="pull-left">{{::manual.category}}</span>
                                </div>
                                <div class="panel-body">    
                                    <div class="panel-overlay" ng-if-="manual.available === false">
                                        <label class="control-label" ng-bind="::'MANUALS.AVAILABLE_ON_ORDER_OF'|translate"></label>
                                        <ul><li ng-repeat="package in manual.packagesToBuy">{{$ctrl.getPackage2BuyName(package)}}</li></ul>
                                    </div>
                                    <p>
                                        <span>{{::manual.displayName}}</span><br/>
                                        <label ng-bind="::manual.description"></label>
                                    </p>
                                    
                                    <button class="btn btn-md btn-success pull-right displayDoc" 
                                        ng-click="$ctrl.navigate(manual)" 
                                        ng-disabled="!manual.available" 
                                        ng-bind="::'MANUALS.DISPLAY'|translate"></button>                                  
                                </div>
                            </div>
                          </div>
                        </div>
                        `,
        });
})();