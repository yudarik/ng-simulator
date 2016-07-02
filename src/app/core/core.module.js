/**
 * Created by arikyudin on 06/06/16.
 */

(function () {
    'use strict';
    angular.module('Simulator.core', [])
        .config(function(RestangularProvider, $translateProvider){

            $translateProvider.useStaticFilesLoader({
                prefix: '/assets/languages/',
                suffix: '.json'
            });

            $translateProvider.preferredLanguage('he_IL');

            RestangularProvider
                .setDefaultHeaders({
                    'Content-Type': 'application/json'
                })
                .setBaseUrl('http://nadlanline.dnsalias.com:8080/BrokerExams/rest');
        })
        .constant('simulator_config',{
            companyLinkURL:                         null,
            logoImageURL:                           null,
            logoImageLinkURL:                       null,
            tipsForSuccessLinkURL:                  null,
            welcomeMessage:                         null,
            welcomeMessageForCandidatesOnly:        null,
            minimumQuestionsToStartSuggesting:      null,
            applicationTitle:                       null,
            payPalCandidateStoreURL:                null,
            payPalCustomerStoreURL:                 null,
            showQuestionCategoryInAnswersPage:      null,
            showSavePracticeButton:                 null,
            answersPerQuestionNumber:               null,
            predefinedExamsEnabled:                 null,
            trainingDocumentsEnabled:               null,
            postCreditModeEnabled:                  null,
            sendingLastChanceToEnrollEmail:         null
        })
        .run(function(simulator_config, Restangular){
            var simulators = Restangular.all('simulators');

            simulators.get('status').then(config => {
                _.assign(simulator_config, config);
            })
        })
})();