/**
 * Created by arikyudin on 19/06/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components')
        .filter('timeframe', function(){

            return (input) => {

                var sec_num = parseInt(input, 10); // don't forget the second param
                var hours   = Math.floor(sec_num / 3600);
                var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
                var seconds = sec_num - (hours * 3600) - (minutes * 60);

                if (hours   < 10) {hours   = "0"+hours;}
                if (minutes < 10) {minutes = "0"+minutes;}
                if (seconds < 10) {seconds = "0"+seconds;}
                return hours+':'+minutes+':'+seconds;
            };
        })
})();