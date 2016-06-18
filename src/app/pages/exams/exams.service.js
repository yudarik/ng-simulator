/**
 * Created by arikyudin on 15/06/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.pages.exams').factory('examService', function(Restangular){

        var categories = Restangular.all('/categories'),
            practices = Restangular.all('/practices');

        function listCategories() {
            return categories.get('');
        }

        function getDistribution() {
            return categories.customGET('distribution');
        }

        function getExam(params) {
            return practices.get('practiceToPerform', params);
        }

        return {
            listCategories,
            getDistribution,
            getExam
        };
    });
})();