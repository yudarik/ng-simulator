/**
 * Created by arikyudin on 05/06/16.
 */
(function(){
    angular.module('Simulator.pages.auth')
        .factory('userAuthService', function($rootScope, Restangular, $q){

            var auth = Restangular.all('/auth');

            var getUserRequestInProgress, getUserPromise;

            var Srv = {

                signin: (userDetails) => {
                    return auth.customPOST(userDetails, 'login');
                },
                signup: (userDetails) => {
                    return Restangular.all('candidates').post({emailAddress: userDetails.email});
                },
                signout: () => {

                    Srv.clearCache();

                    return auth.customPOST({}, 'logout');
                },
                getUser: (resetPassword) => {

                    /*if ($rootScope.currentUser) {
                        return $q.when($rootScope.currentUser);
                    }*/

                    if (getUserRequestInProgress) {
                        return $q.when(getUserPromise)
                    }

                    Restangular.setDefaultHttpFields({'withCredentials': true});

                    getUserPromise = $q((resolve, reject) => {

                        auth.customGET('').then(function (user) {
                            if (!resetPassword && !user.tempPassword) {
                                $rootScope.currentUser = user;
                            }
                            //$rootScope.$broadcast('post-login-bean', {user});
                            getUserRequestInProgress = false;

                            resolve(user);
                        }).catch(function (reason) {
                            getUserRequestInProgress = false;

                            reject(reason);
                        });
                    });

                    getUserRequestInProgress = true;

                    return $q.when(getUserPromise);
                },
                getPostLogin: (user) => {
                    return Srv.getUser().then(postLoginData => {
                        return _.assign({}, user, postLoginData);
                    });
                },
                isLoggedIn: () => {
                    return !!$rootScope.currentUser;
                },
                getUserType: () => {
                    return Srv.getUser().then(user => user.role);
                },
                resetPassword(email) {
                    return Restangular.all('/customers/').customPUT($.param(email), 'password', undefined, {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
                },
                clearCache: () => {
                    $rootScope.currentUser = null;
                    getUserRequestInProgress = null;
                    getUserPromise = null;
                }
            };

            return Srv;
        })
        .factory('customerService', function(Restangular, userAuthService, $q) {

            let service, userQuota, getUserQuota, getUserQuotaInProgress;

            function initService() {
                return userAuthService.getUserType().then(type => {
                    if (type === "Customer") {
                        service = Restangular.all('/customers/');
                    } else {
                        service = Restangular.all('/candidates/');
                    }

                    return service;
                });
            }

            function clearCache() {
                service = null;
            }

            function getService() {
                if (service) {
                    return $q.when(service);
                } else {
                    return initService().then(srv => service = srv);
                }
            }

            function getQuota() {
                /*if (userQuota) { //Cache disabled by request in sim-20
                    return $q.when(userQuota);
                }*/
                if (getUserQuotaInProgress) {
                    return $q.when(getUserQuota);
                }
                getUserQuota = $q((resolve, reject) => {
                    return getService().then(srv => {
                        return srv.get('quota');
                        }
                    ).then(quota => {
                            userQuota = quota;
                            getUserQuotaInProgress = false;

                        if (userQuota.totalNewQuestionsQuota === 10000) {
                            //trick to find out if user is Candidate
                            FS.setUserVars({
                                "demoPracticesPerformed_int": userQuota.generalPracticesPerformed
                            });
                        } else {
                            //user is Customer
                            FS.setUserVars({
                                "generalPracticesPerformed_int": userQuota.generalPracticesPerformed,
                                "examsPerformed_int": userQuota.examsPerformed,
                                "suggestedPracticesPerformed_int": userQuota.suggestedPracticesPerformed,
                                "predefinedExamsPerformed_int": userQuota.predefinedExamsPerformed,
                                "leftNewQuestionsQuota_int": userQuota.totalNewQuestionsQuota
                            });
                        }
                            resolve(quota);
                        })
                        .catch(err => {
                            getUserQuotaInProgress = false;
                            reject(err);
                        });
                });

                getUserQuotaInProgress = true;

                return $q.when(getUserQuota);
            }

            function getInfo() {
                return getService().then(srv => srv.get('info')).then(user => user.plain());
            }

            function putInfo(details) {
                let params = $.param(details);

                return getService().then(srv => srv.customPOST(params, 'info', undefined, {'Content-Type': 'application/x-www-form-urlencoded'}));
            }

            function resetPassword(email) {
                return getService().then(srv => srv.customPUT(email, 'password', undefined, {ContentType: 'application/json'}));
            }

            function changePassword(user) {
                let params = $.param(user);
                return getService().then(srv => srv.customPOST(params, 'password', undefined, {'Content-Type': 'application/x-www-form-urlencoded'}));
            }

            return {getQuota, getInfo, putInfo, resetPassword, changePassword, clearCache};
        })
})();