"use strict";

/**
 * Created by arikyudin on 31/05/16.
 */

(function () {
    'use strict';

    practiceCtrl.$inject = ["examConfig", "practiceType"];
    function practiceCtrl(examConfig, practiceType) {
        this.timeframe = examConfig.timePerQuestion * examConfig.questions.length;
        this.questions = examConfig.questions;
        this.practiceType = practiceType;
    }

    angular.module('Simulator.pages.exams.practice').controller('practiceCtrl', practiceCtrl);
})();