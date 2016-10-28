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

            $translateProvider.preferredLanguage('he_IL');

            RestangularProvider
                .setDefaultHeaders({
                    'Content-Type': 'application/json'
                })
                //.setBaseUrl('rest');
                .setBaseUrl('http://nadlanline.dnsalias.com:8080/BrokerExams/rest');
                //.setBaseUrl('http://nadlanline.dnsalias.com:8080/BiologyExams/rest');

            RestangularProvider.setErrorInterceptor(
                function ( response ) {
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
        .run(function($rootScope, $state, $uibModal, simulator_config, simulatorService){

            $rootScope.appTitle = 'Loading...';

            simulatorService.getStatus().then(config => {
                _.assign(simulator_config, config);
                $rootScope.appTitle = simulator_config.applicationTitle;
                $rootScope.simulatorConfigLoaded = true;

                if ($state.get('exams.post-credit'))
                    $state.get('exams.post-credit').sidebarMeta.disabled = !simulator_config.postCreditModeEnabled;

                if ($state.get('exams.predefined'))
                    $state.get('exams.predefined').sidebarMeta.disabled = !simulator_config.predefinedExamsEnabled;

                if ($state.get('manuals'))
                    $state.get('manuals').sidebarMeta.disabled = !simulator_config.trainingDocumentsEnabled;
            });

            function registerStateChangeListener() {
                var onRouteChangeOff = $rootScope.$on('$stateChangeStart',
                    function(event, toState, toParams, fromState, fromParams){
                        console.log(fromState.name + ' > '+ toState.name);

                        if (fromState.name === 'exams.practice' && toState.name !== 'exams.practice-summary') {
                            event.preventDefault();

                            redirectModal().then(()=>{
                                onRouteChangeOff();
                                $state.transitionTo(toState, toParams);
                            }, ()=>{
                                //dismiss
                            })
                        }
                    });
            }
            registerStateChangeListener();

            $rootScope.$on('$stateChangeSuccess',
                function(event, toState, toParams, fromState, fromParams){

                    if (fromState.name === 'exams.practice') {
                        registerStateChangeListener();
                    }
                });


            function redirectModal() {
                var modalInstance = $uibModal.open({
                    animation: true,
                    template: [ '<div class="panel"><div class="panel-body">',
                        '<h3 class="text-center">{{::"EXAMS.EXAM_CANCEL_ARE_YOU_SURE"|translate}}</h3>',
                        '<br/>',
                        '<br/>',
                        '<p class="text-center ">',
                        '<button class="btn btn-success btn-space" ng-click="ok()">אישור</button>',
                        '<button class="btn btn-default" ng-click="cancel()">ביטול</button>',
                        '</p>',
                        '</div></div>'].join(''),
                    controller: function ($uibModalInstance, $scope) {
                        $scope.ok = function () {
                            $uibModalInstance.close();
                        };

                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                    },
                    size: 'small'
                });

                return modalInstance.result;
            }

        })
})();