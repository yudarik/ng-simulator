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
            controller: function manualsCtrl ($translate, NgTableParams, manualsService) {
                'ngInject';

                this.filter = {
                    pattern: undefined,
                    docType: undefined
                };

                /*this.tableParams = new NgTableParams({
                    group: 'category'
                }, {
                    dataset: this.manuals
                });*/

                this.getUrl = (id)=>{
                    return manualsService.get(id);
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
                        default:
                            return 'panel-default';
                    }
                };

                this.getLinkClass = (manual)=>{
                    if (!manual.docType) return;

                    var type;

                    switch (manual.docType){
                        case 'AUDIO':
                            type = 'fa-volume-up'
                            break;
                        case 'VIDEO':
                            type = 'fa-play';
                            break;
                        case 'DOCUMENT':
                            type = 'fa-file-pdf-o';
                            break;
                    }

                    return type;
                }
            },
/*            template:
                `<div class="row">
                   <div class="panel panel-default">
                       <div class="panel-body">
                           <div class="row"></div>
                           <div class="col-xs-12">
                               <table class="table table-hover table-condensed flip" direction="rtl" ng-table="$ctrl.tableParams">

                                   <colroup>
                                       <col width="50%" />
                                       <col width="40%" />
                                       <col width="10%" />
                                   </colgroup>

                                   <tr ng-repeat-start="group in $groups track by $index" class="ng-table-group flip">
                                        <td colspan="3">
                                            <a href="" ng-click="group.$hideRows = !group.$hideRows">
                                               <span class="glyphicon" ng-class="{'glyphicon-chevron-left': group.$hideRows, 'glyphicon-chevron-down': !group.$hideRows }"></span>
                                               <strong>{{ (group.value !== null)? group.value : 'MANUALS.TABLE_HEADS.OTHER'|translate }}</strong>
                                           </a>
                                       </td>
                                   </tr>
                                   <tr ng-hide="group.$hideRows" ng-repeat="manual in group.data track by manual.id" ng-repeat-end>
                                       <td sortable="'displayName'" data-title="$ctrl.tableHeads.displayName" filter="{displayName: 'text'}" filter-placeholder="search">{{manual.displayName}}</td>
                                       <td sortable="'description'" data-title="$ctrl.tableHeads.description" filter="{description: 'text'}">{{manual.description}}</td>
                                       <td sortable="'docType'" data-title="$ctrl.tableHeads.type">
                                           <a href="{{::$ctrl.getUrl(manual.id)}}" target="_blank"><i class="fa {{$ctrl.getLinkClass(manual)}}">&nbsp;</i></a>
                                       </td>
                                   </tr>
                               </table>
                           </div>
                       </div>
                   </div>
                </div>`*/
            template: `<div class="row">
                            <div class="col-xs-4 form-group">
                                <input class="form-control" type="search" 
                                    placeholder="{{::'MANUALS.SEARCH_PLACEHOLDER'|translate}}"
                                    ng-model="$ctrl.filter.pattern"/>                                
                            </div>
                            <div class="col-xs-8 form-group">
                                <!--<label class="hidden-xs">{{::'MANUALS.FILTER_BY_TYPE'|translate}}</label>-->
                                <div class="btn-group">
                                    <button class="btn btn-warning" uncheckable uib-btn-radio="'AUDIO'" ng-model="$ctrl.filter.docType">{{::'MANUALS.RESOURCE_TYPES.AUDIO'|translate}}</button>                                
                                    <button class="btn btn-danger" uncheckable uib-btn-radio="'VIDEO'" ng-model="$ctrl.filter.docType">{{::'MANUALS.RESOURCE_TYPES.VIDEO'|translate}}</button>                                
                                    <button class="btn btn-success" uncheckable uib-btn-radio="'DOCUMENT'" ng-model="$ctrl.filter.docType">{{::'MANUALS.RESOURCE_TYPES.DOCUMENT'|translate}}</button>                                
                                </div>
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 online-manual-component" ng-repeat="manual in $ctrl.manuals | filter: {displayName: $ctrl.filter.pattern, docType: ($ctrl.filter.docType !== null) ?$ctrl.filter.docType : ''}">
                            <div class="panel" ng-class="$ctrl.getPanelClass(manual.docType)">
                                <div class="panel-heading">
                                    
                                    <i class="pull-right fa {{$ctrl.getLinkClass(manual)}}"></i>
                                </div>
                                <div class="panel-body">
                                    <p>
                                        <label uib-tooltip="{{::manual.description}}">{{::manual.displayName}}</label>
                                    </p>
                                    
                                    <a class="btn btn-md btn-success pull-right displayDoc" href="{{::$ctrl.getUrl(manual.id)}}" target="_blank" ng-bind="::'MANUALS.DISPLAY'|translate"></a>                                  
                                </div>
                            </div>
                          </div>
                        </div>
                        `,
        });
})();