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

        function listPredefined() {
            return practices.get('predefinedExams');
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

        function getExam(type, params) {

            _.assign(params, {practiceType: type});

            var api = 'practiceToPerform';

            switch(type) {
                case 'POST_CREDIT_PRACTICE':
                    api = 'postCreditPracticeToPerform';
                    break;
                case 'PRACTICE':
                    api = 'practiceToPerform';
                    break;
                case 'REPEAT':
                    api = 'repeatPractice';
                    break;
                default:
                    api = 'practiceToPerform';
            }

            return practices.get(api, params);
        }

        function getPredefinedExam(params) {
            var api = 'predefinedExams/predefinedExamToPerform';
            return practices.get(api, params);
        }

        function submitExam(examResult) {

            console.log('Submit Exam service reached');


            return practices.customPOST(examResult, 'computePracticeResult').then((res)=>{
                $state.go('exams.practice-summary', {examSummary: res});
            }, (err) => {
                console.log(err);
            })
        }

        function getStats() {
            return practices.get('');
        }

        function getPracticeInfo(id) {
            return practices.get(id);
        }

        function getQuestionImage(id) {
            return `getQuestionImage?questionID=${id}`;
            //return `http://nadlanline.dnsalias.com:8080/BiologyExams/getQuestionImage?questionID=${id}`;
        }

        return {
            listCategories,
            listPredefined,
            getDistribution,
            getPredefinedExam,
            getExam,
            submitExam,
            getStats,
            getPracticeInfo,
            getQuestionImage
        };
    });
})();