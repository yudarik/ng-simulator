/**
 * Created by arikyudin on 05/06/16.
 */
(function(){
    angular.module('Simulator.pages.auth')
        .factory('userAuthService', function($rootScope, Restangular, $q, $window){

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

                    $rootScope.currentUser = null;
                    return auth.customPOST({}, 'logout')
                        .then((res)=>{
                        })
                        .catch(()=>{
                            $window.location.reload();
                            //$state.go('signin');
                        });
                },
                getUser: (resetPassword) => {

                    if ($rootScope.currentUser) {
                        return $q.when($rootScope.currentUser);
                    }

                    if (getUserRequestInProgress) {
                        return $q.when(getUserPromise)
                    }

                    Restangular.setDefaultHttpFields({'withCredentials': true});

                    //let defer = $q.defer();

                    getUserPromise = new Promise((resolve, reject) => {
                        auth.customGET('').then(function (user) {
                            if (!resetPassword && !user.tempPassword) {
                                $rootScope.currentUser = user;
                            }
                            $rootScope.$broadcast('post-login-bean', {user});

                            resolve(user);
                        }).catch(function (reason) {
                            getUserRequestInProgress = false;

                            reject(reason);
                        });
                    });

                    getUserRequestInProgress = true;

                    return $q.when(getUserPromise)
                    //return defer.promise;
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
                }
            };

            return Srv;
        })
        .factory('customerService', function(Restangular, userAuthService, $q) {

            let userQuota, getUserQuota, getUserQuotaInProgress;

            let service = userAuthService.getUserType().then(type => {
                if (type === "Customer") {
                    return Restangular.all('/customers/');
                } else {
                    return Restangular.all('/candidates/');
                }
            });

            function initService() {
                return userAuthService.getUserType().then(type => {
                    if (type === "Customer") {
                        return Restangular.all('/customers/');
                    } else {
                        return Restangular.all('/candidates/');
                    }
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
                if (userQuota) {
                    return $q.when(userQuota);
                }
                if (getUserQuotaInProgress) {
                    return $q.when(getUserQuota);
                }
                getUserQuota = getService().then(srv => srv.get('quota')).then(quota => {
                    userQuota = quota;

                    return userQuota;
                });

                getUserQuotaInProgress = true;

                return $q.when(getUserQuota)
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