/**
 * Created by arikyudin on 20/07/16.
 */

(function () {
    'use strict';
    angular.module('Simulator.pages.manuals')
        .component('onlineManuals', {
            bindings: {
                manuals: '=',
                user: '<'
            },
            controller: function manualsCtrl($scope, $translate, angularGridInstance) {
                'ngInject';

                this.list = this.manuals.list;

                this.filter = {
                    pattern: undefined,
                    docType: undefined,
                    availability: undefined
                };

                this.tableHeads = {
                    displayName: $translate.instant('MANUALS.TABLE_HEADS.DOC_NAME'),
                    description: $translate.instant('MANUALS.TABLE_HEADS.DOC_DESC'),
                    link: $translate.instant('MANUALS.TABLE_HEADS.DOC_LINK'),
                    category: $translate.instant('MANUALS.TABLE_HEADS.CATEGORY'),
                    type: $translate.instant('MANUALS.TABLE_HEADS.TYPE')
                };

                //sort by order parameter
                this.sortByOrderIndex = function () {
                    this.list.sort(function (a, b) {
                        return a.order - b.order;
                    });
                };

                this.getLinkClass = (docType) => {
                    if (!docType) return;

                    var type;

                    switch (docType) {
                        case 'AUDIO':
                            type = 'fa-volume-up';
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

                this.gridRefresh = () => {
                    this.sortByOrderIndex();
                    angularGridInstance.gallery.refresh();
                };

                this.sortByOrderIndex();
            },
            template: `<div class="row manuals-page">
                            <div class="col-xs-12">
                                <div class="col-xs-12 col-sm-4 form-group">
                                    <input class="form-control" type="search" ng-change="$ctrl.gridRefresh()"
                                        placeholder="{{::'MANUALS.SEARCH_PLACEHOLDER'|translate}}"
                                        ng-model="$ctrl.filter.pattern"/>                                
                                </div>
                                <div class="col-xs-12 col-sm-8 text-center form-group">
                                    <!--<label class="hidden-xs">{{::'MANUALS.FILTER_BY_TYPE'|translate}}</label>-->
                                    <div class="btn-group filter-buttons">
                                        <button class="btn btn-with-icon btn-warning" uncheckable uib-btn-radio="'AUDIO'" ng-model="$ctrl.filter.docType" ng-click="$ctrl.gridRefresh()"><i class="pull-right fa {{$ctrl.getLinkClass('AUDIO')}}"></i>{{::'MANUALS.RESOURCE_TYPES.AUDIO'|translate}}</button>                                
                                        <button class="btn btn-with-icon btn-danger" uncheckable uib-btn-radio="'VIDEO'" ng-model="$ctrl.filter.docType" ng-click="$ctrl.gridRefresh()"><i class="pull-right fa {{$ctrl.getLinkClass('VIDEO')}}"></i>{{::'MANUALS.RESOURCE_TYPES.VIDEO'|translate}}</button>                                
                                        <button class="btn btn-with-icon btn-success" uncheckable uib-btn-radio="'DOCUMENT'" ng-model="$ctrl.filter.docType" ng-click="$ctrl.gridRefresh()"><i class="pull-right fa {{$ctrl.getLinkClass('DOCUMENT')}}"></i>{{::'MANUALS.RESOURCE_TYPES.DOCUMENT'|translate}}</button>                                
                                        <button class="btn btn-with-icon btn-info" uncheckable uib-btn-radio="'OTHER'" ng-model="$ctrl.filter.docType" ng-click="$ctrl.gridRefresh()"><i class="pull-right fa {{$ctrl.getLinkClass('OTHER')}}"></i>{{::'MANUALS.RESOURCE_TYPES.OTHER'|translate}}</button>                                
                                    </div>
                                </div>
                                <div class="cal-xs-12 col-sm-8">
                                    <div class="checkbox">
                                       <label><input type="checkbox" ng-model="$ctrl.filter.availability" ng-click="$ctrl.gridRefresh()" ng-false-value="null">{{::'MANUALS.RESOURCE_TYPES.AVAILABLE'|translate}}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr>
                        <ul class="dynamic-grid" angular-grid="$ctrl.list" grid-width="300" gutter-size="10" angular-grid-id="gallery" refresh-on-img-load="false" direction="rtol">

                            <li class="grid" data-ng-repeat="manual in $ctrl.list | filter: $ctrl.filter.pattern | filter: {docType: ($ctrl.filter.docType !== null)? $ctrl.filter.docType : '', available: ($ctrl.filter.availability !== null)? $ctrl.filter.availability : ''}"> 
                                <manual-item class="" item="manual" products-id="$ctrl.manuals.productsById" user="$ctrl.user"></manual-item>                         
                            </li>                            
                        </ul>`,
        });
})();