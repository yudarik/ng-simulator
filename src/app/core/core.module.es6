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
                .setDefaultHeaders({
                    'Content-Type': 'application/json'
                })
                //.setBaseUrl('rest'); // Production Build
                .setBaseUrl('http://nadlanline.dnsalias.com:8080/BrokerExams/rest');
                //.setBaseUrl('http://nadlanline.dnsalias.com:8080/BrokerExamsOnlyDocs/rest');
                //.setBaseUrl('http://nadlanline.dnsalias.com:8080/EnglishSimulator/rest');
                //.setBaseUrl('http://nadlanline.dnsalias.com:8080/BiologyExams/rest');

            RestangularProvider.setErrorInterceptor(
                (response) => {
                    if ( response.status === 401/* || response.status === 403*/) {
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
        .run(function($rootScope, $state, $uibModal, $translate, $css, simulator_config, simulatorService, customerService){

            $rootScope.appTitle = 'Loading...';

            simulatorService.getStatus().then(config => {
                _.assign(simulator_config, config);

                $translate.use(config.locale);

                $rootScope.appTitle = simulator_config.applicationTitle;
                $rootScope.simulatorConfigLoaded = true;
                $rootScope.appLayout = simulator_config.layout.toLowerCase();

                if ($rootScope.appLayout === 'rtl') {
                    $css.add('assets/vendor-files/bootstrap-rtl.css');
                }

                $rootScope.simulatorConfig = simulator_config;

                if (simulator_config.trainingDocumentsOnly) {
                    $state.get('exams').sidebarMeta.hidden = true;
                    $state.get('dashboard').sidebarMeta.hidden = true;
                    simulator_config.defaultState = 'manuals';
                }

                if ($state.get('exams.post-credit')) {
                    $state.get('exams.post-credit').sidebarMeta.hidden = !simulator_config.postCreditModeEnabled;
                    $state.get('exams.post-credit').sidebarMeta.disabled = true;
                }

                if ($state.get('exams.repeated-practice')) {
                    $state.get('exams.repeated-practice').sidebarMeta.hidden = !simulator_config.postCreditModeEnabled;
                }

                if ($state.get('exams.predefined'))
                    $state.get('exams.predefined').sidebarMeta.hidden = !simulator_config.predefinedExamsEnabled;

                if ($state.get('manuals'))
                    $state.get('manuals').sidebarMeta.hidden = !simulator_config.trainingDocumentsEnabled;
            });

            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                if (_.get(toState, 'sidebarMeta.hidden') || _.get($state.get(toState.parent), 'sidebarMeta.hidden')) {
                    event.preventDefault();
                }
            });

            $rootScope.$on('post-login-bean', function(event, data) {
                if (data.user) {

                    customerService.getQuota().then(setStateBasedMenuItems(data.user));
                }
            });

            function setStateBasedMenuItems(user) {

                return (quota) => {
                    $state.get('exams.post-credit').sidebarMeta.disabled = !user.postCreditModeNow;

                    if (user.role === "Candidate") {
                        ['exams.distribution-full', 'exams.weak-areas','exams.repeated-practice'].forEach(state => {
                            $state.get(state).sidebarMeta.disabled = true;
                            $state.get(state).tooltip = 'EXAMS.TOOLTIPS.NOT_AVAILABLE_IN_DEMO';
                        });
                    }

                    if (quota.leftNewQuestionsQuota <= 0) {
                        disableState('exams.distribution-general', 'EXAMS.TOOLTIPS.NO_MORE_CREDITS');
                    }

                    if (quota.leftPostCreditQuestionsQuota <= 0) {
                        disableState('exams.repeated-practice', 'EXAMS.TOOLTIPS.NO_MORE_POST_CREDITS');
                        disableState('exams.post-credit', 'EXAMS.TOOLTIPS.NO_MORE_POST_CREDITS');
                    } else {
                        enableState('exams.repeated-practice');
                        enableState('exams.post-credit');
                    }

                    if (!quota.predefinedExamWithQuotasList.length) {
                        disableState('exams.predefined', 'NO_PREDEFINED_EXAMS_AVAILABLE');
                    } else if (_.every(quota.predefinedExamWithQuotasList, {leftQuota: 0})) {
                        disableState('exams.predefined', 'NO_PREDEFINED_EXAMS_AVAILABLE_QUOTA');
                    }

                    if ((quota.totalNewQuestionsQuota - quota.leftNewQuestionsQuota >= quota.minimumQuestionsToStartSuggesting) &&
                        quota.leftNewQuestionsQuota > 0) {
                        enableState('exams.weak-areas');
                    } else {
                        disableState('exams.weak-areas', 'NO_WEAk_AREAS_PRACTICE_AVAILABLE');
                    }
                };
            }

            function disableState(stateName, tooltip) {
                if (stateName) {
                    $state.get(stateName).sidebarMeta.disabled = true;
                }
                if (tooltip && stateName) {
                    $state.get(stateName).tooltip = tooltip;
                }
            }
            function enableState(stateName) {
                if (stateName) {
                    $state.get(stateName).sidebarMeta.disabled = false;
                }
            }
        })
})();