/**
 * Created by arikyudin on 31/05/16.
 */

(function () {
    'use strict';

    function fullExamCtrl(examConfig) {
        this.timeframe = examConfig.timePerQuestion * examConfig.questions.length;
        this.questions = examConfig.questions;
    }

    angular.module('Simulator.pages.exams.full-exam')
        .controller('fullExamCtrl', fullExamCtrl);
})();