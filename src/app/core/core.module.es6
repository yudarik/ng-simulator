/**
 * Created by arikyudin on 06/06/16.
 */

function getSimulatorBaseUrl() {

    if (window.location.hostname.indexOf('localhost') === -1) {
        return 'rest';
    } else {
        //return 'http://nadlanline.dnsalias.com:8080/BrokerExams/rest';
        //return 'http://nadlanline.dnsalias.com:8080/BrokerExamsOnlyDocs/rest';
        return 'http://nadlanline.dnsalias.com:8080/EnglishSimulator/rest';
        //return 'http://nadlanline.dnsalias.com:8080/BiologyExams/rest';
    }
}

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
            trainingDocumentsOnly:                  null,
            postCreditModeEnabled:                  null,
            sendingLastChanceToEnrollEmail:         null,
            defaultState:                           'dashboard'
        })
        .config(function(RestangularProvider, $translateProvider){

            $translateProvider.useStaticFilesLoader({
                prefix: 'assets/languages/',
                suffix: '.json'
            });
            $translateProvider.registerAvailableLanguageKeys(['en_US', 'he_IL'], {
                'iw_IL': 'he_IL'
            });

            $translateProvider.preferredLanguage('he_IL');
            //$translateProvider.use('he_IL');

            RestangularProvider
                //.setDefaultHttpFields({cache: true})
                .setDefaultHeaders({
                    'Content-Type': 'application/json'
                })
                .setBaseUrl(getSimulatorBaseUrl());

            RestangularProvider.setErrorInterceptor(
                (response) => {
                    switch(response.status) {
                        case 401:
                            window.location = '#/signin';
                            break;
                        case 406:
                        case 302:
                            window.location = '#/signin?from=signout';
                            break;
                        case 440:
                            $window.location.reload(true);
                            break;
                        default:
                            return true;
                    }
                    /*if ( response.status === 401) {
                        window.location.replace('#/signin');
                    } else if (response.status === 406) {
                        window.location.replace('/#/signin?from=signout');
                    }
                     else if (response.status === 440) {
                        $window.location.reload(true);
                    }
                    else {
                        // Some other unknown Error.
                        //toaster.error('error', '',"An unknown error has occurred.<br>Details: " + response.data);
                    }
                    // Continue the promise chain.
                    return true;*/
                }
            );
        })
        .run(function($rootScope, $state, $uibModal, $translate, $timeout, $ocLazyLoad, simulator_config, simulatorService, customerService){

            var $scope = $rootScope.$new();

            $rootScope.appTitle = 'Loading...';

            simulatorService.getStatus().then(config => {
                _.assign(simulator_config, config);

                $translate.use(config.locale);

                $rootScope.appTitle = simulator_config.applicationTitle;
                $rootScope.simulatorConfigLoaded = true;
                $rootScope.appLayout = simulator_config.layout.toLowerCase();

                if ($rootScope.appLayout === 'rtl') {
                    $ocLazyLoad.load([
                        'assets/vendor-files/bootstrap-rtl.css',
                        'assets/vendor-files/angular-locale_he-il.js'
                    ]);
                }

                $rootScope.simulatorConfig = simulator_config;

                if (simulator_config.trainingDocumentsOnly) {
                    simulator_config.defaultState = 'manuals';
                }
            });

            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                if (_.get(toState, 'sidebarMeta.hidden') || _.get($state.get(toState.parent), 'sidebarMeta.hidden')) {
                    event.preventDefault();
                }
            });

            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                if (toState.name === 'signin' && fromState.name === 'signout') {
                    console.log('going to state signin from state signout');
                    /*$timeout(function() {
                        window.location.reload();
                    });*/
                } else {
                    $rootScope.currentState = {toState, toParams};
                    $rootScope.previousState = {fromState, fromParams};
                }
            });

            let deregisterTranslateChangeSuccess = $rootScope.$on('$translateChangeSuccess', function(event, translationResp){
                deregisterTranslateChangeSuccess();

                if (!$state.current.abstract) {
                    $state.reload($state.current.name);
                } else {
                    let deregisterStateChangeListener = $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                        if (toState.name === 'signin' && fromState.name === '') {

                            deregisterStateChangeListener();

                            $timeout(function() {
                                $state.reload($state.current.name);
                            });
                        }
                    });
                }
            });
        })
})();