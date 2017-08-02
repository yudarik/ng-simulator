/**
 * Created by arikyudin on 09/10/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components.charts', [])
        .config((ChartJsProvider)=>{

            Chart.defaults.global.defaultFontSize = 14;
            Chart.defaults.global.legend.fontSize = 12;

            ChartJsProvider.setOptions({
                colors: [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360']
            });
        })

})();