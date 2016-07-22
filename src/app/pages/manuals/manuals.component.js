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
                '<div class="row"',
                '   <div class="panel">',
                '       <div class="panel-body">',
                '           <div class="row">',
                '               <table class="table table-hover">',
                '                   <thead>',
                '                       <tr>',
                '                           <th>{{::\'MANUALS.TABLE_HEADS.DOC_NAME\'|translate}}</th>',
                '                           <th>{{::\'MANUALS.TABLE_HEADS.DOC_LINK\'|translate}}</th>',
                '                       </tr>',
                '                   </thead>',
                '                   <tbody>',
                '                       <tr ng-repeat="manual in $ctrl.manuals">',
                '                           <td class="text-right">{{manual.displayName}}</td>',
                '                           <td><a ng-click="$ctrl.getLink(manual.id)">{{::\'MANUALS.DISPLAY\'|translate}}</td>',
                '                       </tr>',
                '                   </tbody>',
                '               </table>',
                '           </div>',
                '       </div>',
                '   </div>',
                '</div>'
            ].join('')

        });

        function manualsCtrl (manualsService) {
            this.getLink = (id)=>{
                return manualsService.get(id).then(link=>{
                    return link;
                });
            }
        }
})();