"use strict";

/**
 * Created by arikyudin on 31/05/16.
 */

(function () {
    'use strict';

    practiceCtrl.$inject = ["$rootScope", "examConfig", "practiceType"];
    function practiceCtrl($rootScope, examConfig, practiceType) {
        /*this.timeframe = examConfig.timePerQuestion * examConfig.questions.length;
        this.questions = examConfig.questions;
        this.practiceType = examConfig.practiceType;*/
        this.examConfig = examConfig;
    }

    angular.module('Simulator.pages.exams.practice').controller('practiceCtrl', practiceCtrl);
})();