/**
 * Created by arikyudin on 06/06/16.
 */

(function () {
    'use strict';
    angular.module('Simulator.core', [
            'Simulator.core.directives',
            'Simulator.core.services',
            'Simulator.components'
    ])
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
        .config(function(RestangularProvider, $translateProvider){

            $translateProvider.useStaticFilesLoader({
                prefix: 'assets/languages/',
                suffix: '.json'
            });
            $translateProvider.registerAvailableLanguageKeys(['en_US', 'he_IL'], {
                'iw_IL': 'he_IL'
            });

            //$translateProvider.preferredLanguage('en_US');
            $translateProvider.use('he_IL');

            RestangularProvider
                .setDefaultHeaders({
                    'Content-Type': 'application/json'
                })
                //.setBaseUrl('rest');
                .setBaseUrl('http://nadlanline.dnsalias.com:8080/BrokerExams/rest');
                //.setBaseUrl('http://nadlanline.dnsalias.com:8080/EnglishSimulator/rest');
                //.setBaseUrl('http://nadlanline.dnsalias.com:8080/BiologyExams/rest');

            RestangularProvider.setErrorInterceptor(
                (response) => {
                    if ( response.status === 401 || response.status === 403) {
                        window.location = '#/signin';
                    }
                    else {
                        // Some other unknown Error.
                        console.log( response );
                        //toaster.error('error', '',"An unknown error has occurred.<br>Details: " + response.data);
                    }
                    // Continue the promise chain.
                    return true;
                }
            );
        })
        .run(function($rootScope, $state, $uibModal, $translate, simulator_config, simulatorService){

            $rootScope.appTitle = 'Loading...';

            simulatorService.getStatus().then(config => {
                _.assign(simulator_config, config);
                $rootScope.appTitle = simulator_config.applicationTitle;
                $rootScope.simulatorConfigLoaded = true;
                $rootScope.appLayout = simulator_config.layout.toLowerCase();
                $rootScope.simulatorConfig = simulator_config;

                if (simulator_config.trainingDocumentsOnly) {
                    $state.get('exams').sidebarMeta.hidden = true;
                    $state.get('dashboard').sidebarMeta.hidden = true;
                }

                if ($state.get('exams.post-credit')) {
                    $state.get('exams.post-credit').sidebarMeta.hidden = !simulator_config.postCreditModeEnabled;
                    $state.get('exams.post-credit').sidebarMeta.disabled = !simulator_config.postCreditModeNow;

                }

                if ($state.get('exams.predefined'))
                    $state.get('exams.predefined').sidebarMeta.hidden = !simulator_config.predefinedExamsEnabled;

                if ($state.get('manuals'))
                    $state.get('manuals').sidebarMeta.disabled = !simulator_config.trainingDocumentsEnabled;
            });
        })
})();