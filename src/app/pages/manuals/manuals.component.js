'use strict';

/**
 * Created by arikyudin on 20/07/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.pages.manuals').component('onlineManuals', {
        bindings: {
            manuals: '='
        },
        controller: ["$translate", "NgTableParams", "manualsService", function manualsCtrl($translate, NgTableParams, manualsService) {
            'ngInject';

            this.tableParams = new NgTableParams({
                group: 'category'
            }, {
                dataset: this.manuals
            });

            this.getUrl = function (id) {
                return manualsService.get(id);
            };

            this.tableHeads = {
                displayName: $translate.instant('MANUALS.TABLE_HEADS.DOC_NAME'),
                description: $translate.instant('MANUALS.TABLE_HEADS.DOC_DESC'),
                link: $translate.instant('MANUALS.TABLE_HEADS.DOC_LINK'),
                category: $translate.instant('MANUALS.TABLE_HEADS.CATEGORY'),
                type: $translate.instant('MANUALS.TABLE_HEADS.TYPE')
            };

            this.getLinkClass = function (manual) {
                if (!manual.docType) return;

                var type;

                switch (manual.docType) {
                    case 'AUDIO':
                        type = 'fa-volume-up';
                        break;
                    case 'VIDEO':
                        type = 'fa-play';
                        break;
                    case 'DOCUMENT':
                        type = 'fa-file-pdf-o';
                        break;
                }

                return type;
            };
        }],
        template: '<div class="row">\n                   <div class="panel panel-default">\n                       <div class="panel-body">\n                           <div class="col-xs-12">\n                               <table class="table table-hover table-condensed flip" direction="rtl" ng-table="$ctrl.tableParams">\n                                   <colroup>\n                                       <col width="50%" />\n                                       <col width="40%" />\n                                       <col width="10%" />\n                                   </colgroup>\n                                   <tr ng-repeat-start="group in $groups" class="ng-table-group flip">\n                                        <td colspan="3">\n                                            <a href="" ng-click="group.$hideRows = !group.$hideRows">\n                                               <span class="glyphicon" ng-class="{\'glyphicon-chevron-left\': group.$hideRows, \'glyphicon-chevron-down\': !group.$hideRows }"></span>\n                                               <strong>{{ (group.value !== null)? group.value : \'MANUALS.TABLE_HEADS.OTHER\'|translate }}</strong>\n                                           </a>\n                                       </td>\n                                   </tr>\n                                   <tr ng-hide="group.$hideRows" ng-repeat="manual in group.data" ng-repeat-end>\n                                       <td sortable="\'displayName\'" data-title="$ctrl.tableHeads.displayName">{{manual.displayName}}</td>\n                                       <td sortable="\'description\'" data-title="$ctrl.tableHeads.description">{{manual.description}}</td>\n                                       <td sortable="\'docType\'" data-title="$ctrl.tableHeads.type">\n                                           <a href="{{::$ctrl.getUrl(manual.id)}}" target="_blank"><i class="fa {{$ctrl.getLinkClass(manual)}}">&nbsp;</i></a>\n                                       </td>\n                                   </tr>\n                               </table>\n                           </div>\n                       </div>\n                   </div>\n                </div>'
    });
})();