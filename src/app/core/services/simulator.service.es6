/**
 * Created by arikyudin on 09/07/16.
 */

(function () {
    'use strict';
    angular.module('Simulator.core.services', []);
    angular.module('Simulator.core.services')
        .factory('simulatorService', function(Restangular, $q, $rootScope, simulator_config, userAuthService, customerService){

        var simulators = Restangular.all('simulators');
        var statusCache = null,
            promise,
            requestInProgress = false;

        var stateBasedMenuItems = {};

        function getStatus() {

            if (statusCache) {
                return $q.when(statusCache);
            }
            if (requestInProgress) {
                return $q.when(promise);
            }

            promise = simulators.get('status').then(status => {
                statusCache = status;

                return status
            });

            requestInProgress = true;

            return $q.when(promise);
        }

        function ping() {
            return simulators.get('ping');
        }

        function setStateBasedMenuItems() {

            return $q.all([
                userAuthService.getUser(),
                customerService.getQuota()
            ]).then(data => {

                var user = data[0];
                var quota = data[1];


                setHiddenState('exams', simulator_config.trainingDocumentsOnly);
                setHiddenState('dashboard', simulator_config.trainingDocumentsOnly);

                setHiddenState('exams.post-credit', !simulator_config.postCreditModeEnabled);
                setHiddenState('exams.repeated-practice', !simulator_config.postCreditModeEnabled);
                setHiddenState('exams.predefined', !simulator_config.predefinedExamsEnabled);
                setHiddenState('manuals', !simulator_config.trainingDocumentsEnabled);


                if (user.role === "Candidate") {
                    ['exams.distribution-full', 'exams.weak-areas','exams.repeated-practice'].forEach(state => {
                        disableState(state, 'EXAMS.TOOLTIPS.NOT_AVAILABLE_IN_DEMO');
                    });
                }
                setStateStatus('exams.post-credit', quota.leftPostCreditQuestionsQuota <= 0, 'EXAMS.TOOLTIPS.NO_MORE_POST_CREDITS');
                setStateStatus('exams.post-credit', !user.postCreditModeNow, 'EXAMS.TOOLTIPS.POSTCREDIT_DISABLED');


                setStateStatus('exams.distribution-general', quota.leftNewQuestionsQuota <= 0, 'EXAMS.TOOLTIPS.NO_MORE_CREDITS');
                setStateStatus('exams.repeated-practice', quota.leftPostCreditQuestionsQuota <= 0, 'EXAMS.TOOLTIPS.NO_MORE_POST_CREDITS');

                setStateStatus('exams.predefined', !quota.predefinedExamWithQuotasList.length, 'EXAMS.TOOLTIPS.NO_PREDEFINED_EXAMS_AVAILABLE');
                setStateStatus('exams.predefined', _.every(quota.predefinedExamWithQuotasList, {leftQuota: 0}), 'EXAMS.TOOLTIPS.NO_PREDEFINED_EXAMS_AVAILABLE_QUOTA');


                if ((quota.totalNewQuestionsQuota - quota.leftNewQuestionsQuota >= simulator_config.minimumQuestionsToStartSuggesting) &&
                    quota.leftNewQuestionsQuota > 0) {
                    enableState('exams.weak-areas');
                } else {
                    disableState('exams.weak-areas', 'EXAMS.TOOLTIPS.NO_WEAK_AREAS_PRACTICE_AVAILABLE');
                }

                return $q.when('done');
            });
        }

        function initState(stateName) {
            if (!stateBasedMenuItems[stateName]) {
                stateBasedMenuItems[stateName] = {};
            }
        }

        function disableState(stateName, tooltip) {
            if (stateName) {
                initState(stateName);
                stateBasedMenuItems[stateName].disabled = true;
            }
            if (tooltip && stateName) {
                stateBasedMenuItems[stateName].tooltip = tooltip;
            }
        }

        function enableState(stateName) {
            if (stateName) {
                initState(stateName);
                stateBasedMenuItems[stateName].disabled = false;
            }
        }

        function setStateStatus(stateName, status, tooltip) {
            if (stateName) {
                initState(stateName);
                stateBasedMenuItems[stateName].disabled = status;
            }
            if (tooltip && stateName && status) {
                stateBasedMenuItems[stateName].tooltip = tooltip;
            }
        }

        function setHiddenState(stateName, hiddenState) {
            if (stateName){
                initState(stateName);
                stateBasedMenuItems[stateName].hidden = hiddenState;
            }
        }

        function isStateDisabled(stateName) {
            if (stateBasedMenuItems[stateName]) {
                return stateBasedMenuItems[stateName].disabled;
            }
            return false;
        }

        function isStateHidden(stateName) {
            if (stateBasedMenuItems[stateName]) {
                return stateBasedMenuItems[stateName].hidden;
            }
            return false;
        }

        function getStateTooltip(stateName) {
            if (stateBasedMenuItems[stateName]) {
                return stateBasedMenuItems[stateName].tooltip;
            }
            return null;
        }

        return {getStatus, ping, setStateBasedMenuItems, isStateDisabled, isStateHidden, getStateTooltip};
    })
})();