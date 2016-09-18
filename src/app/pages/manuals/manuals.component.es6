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

                this.tableParams = new NgTableParams({
                    group: 'category'
                }, {
                    dataset: this.manuals
                });

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
            template:
                `<div class="row">
                   <div class="panel panel-default">
                       <div class="panel-body">
                           <div class="col-xs-12">
                               <table class="table table-hover table-condensed flip" direction="rtl" ng-table="$ctrl.tableParams">
                                   <colroup>
                                       <col width="50%" />
                                       <col width="40%" />
                                       <col width="10%" />
                                   </colgroup>
                                   <tr ng-repeat-start="group in $groups" class="ng-table-group flip">
                                        <td colspan="3">
                                            <a href="" ng-click="group.$hideRows = !group.$hideRows">
                                               <span class="glyphicon" ng-class="{'glyphicon-chevron-left': group.$hideRows, 'glyphicon-chevron-down': !group.$hideRows }"></span>
                                               <strong>{{ (group.value !== null)? group.value : 'MANUALS.TABLE_HEADS.OTHER'|translate }}</strong>
                                           </a>
                                       </td>
                                   </tr>
                                   <tr ng-hide="group.$hideRows" ng-repeat="manual in group.data" ng-repeat-end>
                                       <td sortable="'displayName'" data-title="$ctrl.tableHeads.displayName">{{manual.displayName}}</td>
                                       <td sortable="'description'" data-title="$ctrl.tableHeads.description">{{manual.description}}</td>
                                       <td sortable="'docType'" data-title="$ctrl.tableHeads.type">
                                           <a href="{{::$ctrl.getUrl(manual.id)}}" target="_blank"><i class="fa {{$ctrl.getLinkClass(manual)}}">&nbsp;</i></a>
                                       </td>
                                   </tr>
                               </table>
                           </div>
                       </div>
                   </div>
                </div>`
        });
})();