/**
 * Created by arikyudin on 05/06/16.
 */
(function(){
    angular.module('Simulator.pages.auth')
        .factory('userAuthService', function($rootScope, Restangular, $state, $q){

            var auth = Restangular.all('/auth');

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
                           $state.go('signin');
                        })
                },
                getUser: (resetPassword) => {

                    if (!$rootScope.currentUser) {

                        Restangular.setDefaultHttpFields({'withCredentials': true});
                        var defer = $q.defer();

                        auth.customGET('').then(function(user){
                            if (!resetPassword && !user.tempPassword){
                                $rootScope.currentUser = user
                            }
                            $rootScope.$broadcast('post-login-bean', {user});

                            defer.resolve(user);
                        }, function(reason){

                            defer.reject(reason);
                            //$state.go('signin');
                        });

                        return defer.promise;
                    } else {
                        return $q.when($rootScope.currentUser);
                    }
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
                }
            };

            return Srv;
        })
        .factory('customerService', function(Restangular, userAuthService, $q) {

            var service = userAuthService.getUserType().then(type => {
                if (type === "Customer") {
                    return Restangular.all('/customers/');
                } else {
                    return Restangular.all('/candidates/');
                }
            });

            function getService() {
                return $q.when(service);
            }

            function getQuota() {
                return getService().then(srv => srv.get('quota'));
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

            return {getQuota, getInfo, putInfo, resetPassword, changePassword};
        })
})();