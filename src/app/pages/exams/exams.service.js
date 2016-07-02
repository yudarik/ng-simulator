/**
 * Created by arikyudin on 15/06/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.pages.exams').factory('examService', function($state, Restangular){

        var categories = Restangular.all('/categories'),
            practices = Restangular.all('/practices');

        function listCategories() {
            return categories.get('');
        }

        function getDistribution() {
            return categories.customGET('distribution')
                .then((res)=>{
                    return res;
                })
                .catch(err => {
                    if (err.data && err.data.description) {
                        alert(err.data.description);
                    }
                    return err;
                })
        }

        function getExam(params) {
            return practices.get('practiceToPerform', params);
        }

        function submitExam(examResult) {
            return practices.customPOST(examResult, 'computePracticeResult').then((res)=>{
                $state.go('exams.practice-summary', {examSummary: res});
            }, (err) => {
                console.log(err);
            })
        }

        return {
            listCategories,
            getDistribution,
            getExam,
            submitExam
        };
    });
})();