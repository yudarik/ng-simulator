(function(){

    angular.module('Simulator.components.auth')
        .component('loginForm', {
            bindings: {},
            template: `<div class="auth-block panel-body">
                        <h1 ng-bind="::'AUTH.SIMULATOR_SIGNIN'|translate"></h1>
                        <a ui-sref="signup" class="auth-link" ng-bind="::'AUTH.NEW_ACCOUNT_REGISTER'|translate"></a>
                    
                        <form name="loginform" class="form-horizontal" ng-model="$ctrl.user" ng-submit="$ctrl.submit()" novalidate>
                          <div class="form-group">
                            <label class="col-sm-4 control-label" ng-bind="::'AUTH.EMAIL'|translate"></label>
                    
                            <div class="col-sm-8">
                              <input type="email" class="form-control" name="email" placeholder="{{::'AUTH.EMAIL'|translate}}" ng-model="$ctrl.user.username" required="required">
                              <div class="text-default" ng-messages="loginform.email.$error" role="alert">
                                <span class="sub-little-text float-left" ng-message="required" ng-bind="::'GENERAL.REQUIRED'|translate"></span>
                                <span class="sub-little-text float-left" ng-message="email" ng-bind="::'AUTH.ERROR.EMAIL'|translate"></span>
                              </div>
                            </div>
                          </div>
                          <div class="form-group">
                            <label class="col-sm-4 control-label" ng-bind="::'AUTH.PASSWORD'|translate"></label>
                    
                            <div class="col-sm-8">
                              <input type="password" class="form-control" name="password" placeholder="{{::'AUTH.PASSWORD'|translate}}" ng-model="$ctrl.user.password">
                            </div>
                          </div>
                    
                          <div class="form-group" ng-if="$ctrl.message && !$ctrl.formChanged">
                            <div class="col-sm-offset-4 col-sm-8">
                                <span class="text-default" ng-bind="$ctrl.message"></span>
                            </div>
                          </div>
                          <div class="form-group">
                            <div class="col-sm-offset-4 col-sm-8 submit-area">
                              <button type="submit" class="btn btn-default btn-auth pull-right" ng-disabled="loginform.$invalid" ng-bind="::'AUTH.LOGIN_BTN'|translate"></button>
                              <a ui-sref="forgotPassword" class="forgot-pass pull-left" ng-bind="::'AUTH.FORGOT_PASSWORD'|translate"></a>
                            </div>
                          </div>
                    
                        </form>
                      </div>`,
            controller: function($scope, $translate, simulator_config, userAuthService, $state, $stateParams, $timeout) {
                'ngInject';

                this.simulator_config = simulator_config;

                this.user = {};

                this.submit = ()=>{

                    this.formChanged = false;

                    userAuthService.signin(this.user)
                        .then(userAuthService.getPostLogin)
                        .then((user)=>{

                            //return $state.go(simulator_config.defaultState);
                            //user.defaultProfile = true;
                            //user.tempPassword = true;
                            //$scope.$emit('post-login-bean', {user});

                            if (user && user.tempPassword) {
                                $state.go('changePassword');
                            } else if (user && user.defaultProfile) {
                                $state.go('profileModal');
                            } else if (user.role === "Customer" || user.role === "Candidate") {
                                $state.go(simulator_config.defaultState);
                            }
                            if (user) {
                                //update fullstory extra user details
                                let displayName = user.firstName + ' ' + user.lastName;
                                let vars;
                                if (displayName.trim().length === 0) {
                                    vars = {
                                        //system fields
                                        email: user.username,
                                        //custom fields
                                        userMode_str: user.role,
                                    }
                                } else {
                                    vars = {
                                        //system fields
                                        email: user.username,
                                        displayName: displayName,
                                        //custom fields
                                        userMode_str: user.role,
                                    }
                                }
                                FS.identify(user.role + '_' + user.username, vars);
                            }
                        }).catch((err)=>{
                            switch(err.status) {
                                case 401:
                                case 403:
                                    this.message = $translate.instant('AUTH.ERROR.'+_.get(err, 'data.errorMessage').toUpperCase());
                                    break;
                                case -1:
                                    this.message = $translate.instant('AUTH.ERROR.NO_CONNECTION');
                                    break;
                                default:
                                    this.message = _.get(err, 'data.errorMessage');
                            }
                        });
                };

                if ($stateParams.from && $stateParams.from === 'signout') {
                    $timeout(() => {
                        window.location.reload(true);
                    },100);
                }

                $scope.$watchCollection('$ctrl.user', (oldVal, newVal) => {
                    if (oldVal === newVal) {
                        return;
                    } else {
                        this.formChanged = true;
                    }
                });
            }
        })
})();