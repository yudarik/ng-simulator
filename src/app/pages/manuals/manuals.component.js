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
            controller: manualsCtrl,
            template: [
                '<div class="row">',
                '   <div class="panel">',
                '       <div class="panel-body">',
                '           <div class="row">',
                '               <table class="table table-hover table-condensed" direction="rtl" ng-table="$ctrl.tableParams">',
                '                   <colroup>',
                '                       <col width="40%" />',
                '                       <col width="40%" />',
                '                       <col width="20%" />',
                '                   </colgroup>',
            '                       <tr ng-repeat-start="group in $groups" class="ng-table-group">',
                                        '<td colspan="3">',
                                            '<a href="" ng-click="group.$hideRows = !group.$hideRows">',
                '                               <span class="glyphicon" ng-class="{ \'glyphicon-chevron-right\': group.$hideRows, \'glyphicon-chevron-down\': !group.$hideRows }"></span>',
                        '                       <strong>{{ group.value }}</strong>',
                '                           </a>',
                    '                   </td>',
                '                   </tr>',
                '                   <tr ng-hide="group.$hideRows" ng-repeat="manual in group.data" ng-repeat-end>',
                '                       <td sortable="\'category\'" data-title="$ctrl.tableHeads.category" groupable="\'category\'" ng-if="false">{{manual.category}}</td>',
                '                       <td sortable="\'displayName\'" data-title="$ctrl.tableHeads.displayName" groupable="\'displayName\'">{{manual.displayName}}</td>',
                '                       <td sortable="\'description\'" data-title="$ctrl.tableHeads.description" groupable="\'description\'">{{manual.description}}</td>',
                '                       <td sortable="\'docType\'" data-title="$ctrl.tableHeads.type" groupable="\'docType\'">',
                '                           <a href="{{::$ctrl.getUrl(manual.id)}}" target="_blank"><i class="fa {{$ctrl.getLinkClass(manual)}}">&nbsp;</i></a>',
            '                           </td>',
                '                   </tr>',
                '               </table>',
                '           </div>',
                '       </div>',
                '   </div>',
                '</div>'
            ].join('')

        });

        function manualsCtrl ($translate, NgTableParams, manualsService) {

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
        }
})();