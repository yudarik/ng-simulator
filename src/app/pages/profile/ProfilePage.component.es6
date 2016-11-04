/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('Simulator.pages.profile')
    .component('profilePage', {
      /**ngInject*/
        bindings: {
          userProfile: '<'
        },
        template: `<div ba-panel ba-panel-class="profile-page">
                    <div class="panel-content">
                    <form name="userProfileForm" ng-submit="profile.updateProfile(userProfileForm)" novalidate>
                      <h3 class="with-line">{{::'USER.PROFILE_PAGE.GENERAL_INFO'|translate}}</h3>
                
                      <div class="row">
                        <div class="col-xs-12 col-md-6 pull-left">
                          <div class="form-group row clearfix">
                            <label for="" class="col-sm-3 control-label">{{::'USER.PROFILE_PAGE.FIRST_NAME'|translate}}</label>
                
                            <div class="col-sm-9">
                              <input type="text" class="form-control" name="firstName" placeholder="{{::'USER.PROFILE_PAGE.FIRST_NAME'|translate}}" ng-model="profile.user.firstName" required>
                            </div>
                          </div>
                          <div class="form-group row clearfix">
                            <label for="" class="col-sm-3 control-label">{{::'USER.PROFILE_PAGE.LAST_NAME'|translate}}</label>
                
                            <div class="col-sm-9">
                              <input type="text" class="form-control" name="lastName" placeholder="{{::'USER.PROFILE_PAGE.LAST_NAME'|translate}}" ng-model="profile.user.lastName" required>
                            </div>
                          </div>
                        </div>
                      </div>
                
                      <h3 class="with-line">{{::'USER.PROFILE_PAGE.CHANGE_PASSWORD'|translate}}</h3>
                
                      <div class="row">
                        <div class="col-xs-12 col-md-6 pull-left">
                          <div class="form-group row clearfix">
                            <label for="" class="col-sm-3 control-label">{{::'USER.PROFILE_PAGE.OLDPASSWORD'|translate}}</label>
                
                            <div class="col-sm-9">
                              <input type="password" class="form-control" name="orgPassword" placeholder="{{::'USER.PROFILE_PAGE.OLDPASSWORD'|translate}}" ng-model="profile.user.orgPassword">
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-xs-12 col-md-6 pull-left">
                          <div class="form-group row clearfix">
                            <label for="inputPassword" class="col-sm-3 control-label">{{::'USER.PROFILE_PAGE.PASSWORD'|translate}}</label>
                
                            <div class="col-sm-9">
                              <input type="password" name="newPassword" class="form-control" id="inputPassword" placeholder="{{::'USER.PROFILE_PAGE.PASSWORD'|translate}}" ng-model="profile.user.newPassword">
                            </div>
                          </div>
                        </div>
                        <div class="col-xs-12 col-md-6 pull-left">
                          <div class="form-group row clearfix">
                            <label for="inputConfirmPassword" class="col-sm-3 control-label">{{::'USER.PROFILE_PAGE.CONFIRM_PASSWORD'|translate}}</label>
                
                            <div class="col-sm-9">
                              <input type="password" class="form-control" id="inputConfirmPassword" name="confirmPassword"
                                     placeholder="{{::'USER.PROFILE_PAGE.CONFIRM_PASSWORD'|translate}}"
                                     pattern="/^{{profile.user.newPassword}}$/" ng-model="profile.$newPasswordConfirm">
                              <div ng-messages="profile.$newPasswordConfirm.$error" ng-if="userProfileForm.newPassword.$dirty && userProfileForm.confirmPassword.$dirty">
                                <div ng-message="pattern">{{::'USER.PROFILE_PAGE.PASSWORD_DONOT_MATCH'|translate}}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                
                      <h3 class="with-line">{{::'USER.PROFILE_PAGE.CONTACT_INFO'|translate}}</h3>
                
                      <div class="row">
                        <div class="col-xs-12 col-md-6 pull-left">
                          <div class="form-group row clearfix">
                            <label for="" class="col-sm-3 control-label">{{::'USER.PROFILE_PAGE.EMAIL'|translate}}</label>
                
                            <div class="col-sm-9">
                              <input type="email" class="form-control" name="email" placeholder="{{::'USER.PROFILE_PAGE.EMAIL'|translate}}" ng-value="profile.user.email" disabled >
                            </div>
                          </div>
                          <div class="form-group row clearfix">
                            <label for="" class="col-sm-3 control-label">{{::'USER.PROFILE_PAGE.PHONE'|translate}}</label>
                
                            <div class="col-sm-9">
                              <input type="text" class="form-control" name="telephone" placeholder="" ng-model="profile.user.telephone" required>
                            </div>
                          </div>
                          <div class="form-group row clearfix">
                            <label for="" class="col-sm-3 control-label">{{::'USER.PROFILE_PAGE.BUSINESS_NAME'|translate}}</label>
                
                            <div class="col-sm-9">
                              <input type="text" class="form-control" name="businessName" placeholder="" ng-model="profile.user.businessName" required>
                            </div>
                          </div>
                          <div class="form-group row clearfix">
                            <label for="" class="col-sm-3 control-label">{{::'USER.PROFILE_PAGE.STREET_ADDRESS'|translate}}</label>
                
                            <div class="col-sm-9">
                              <input type="text" class="form-control" name="streetAddress" placeholder="" ng-model="profile.user.streetAddress" required>
                            </div>
                          </div>
                          <div class="form-group row clearfix">
                            <label for="" class="col-sm-3 control-label">{{::'USER.PROFILE_PAGE.CITY_ADDRESS'|translate}}</label>
                
                            <div class="col-sm-9">
                              <input type="text" class="form-control" name="cityAddress" placeholder="" ng-model="profile.user.cityAddress" required>
                            </div>
                          </div>
                        </div>
                      </div>
                
                      <h3 class="with-line">{{::'USER.PROFILE_PAGE.UPCOMING_EXAM'|translate}}</h3>
                
                      <div class="row">
                        <div class="col-xs-12 col-md-6 pull-left">
                          <div class="form-group row clearfix">
                            <label for="" class="col-sm-3 control-label">{{::'USER.PROFILE_PAGE.SELECT_EXAM_DATE'|translate}}</label>
                
                            <div class="col-sm-9">
                              <select class="form-control" ng-model="profile.user.examEventDate">
                                <option ng-repeat="date in profile.upcomingExamEventDates" value="date">{{date}}</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                
                
                      <h3 class="with-line">{{::'USER.PROFILE_PAGE.SEND_EMAIL_NOTIFICATIONS'|translate}}</h3>
                
                      <div class="notification row clearfix">
                        <div class="col-xs-12 col-md-6">
                          <div class="form-group row clearfix">
                            <label class="checkbox-inline custom-checkbox nowrap">
                              <input type="checkbox" ng-model="profile.user.acceptCommercialMail">
                              <span>{{::'USER.PROFILE_PAGE.ACCEPT_COMERCIAL_MAIL'|translate}}</span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <button type="submit" class="btn btn-primary btn-with-icon save-profile">
                        <i class="ion-android-checkmark-circle"></i>{{::'USER.PROFILE_PAGE.UPDATE_PROFILE'|translate}}
                      </button>
                    </form>
                  </div>
                  </div>`,
        /** @ngInject */
        controller: function (toaster, $uibModal, $translate, customerService, simulator_config) {

          this.userProfileForm = {};
          this.upcomingExamEventDates = simulator_config.upcomingExamEventDates;
          this.user = this.userProfile;

          this.updateProfile = () =>{

            let params = this.user.plain();

            _.forEach(params, (val, key)=>{

              if (_.isEmpty(params[key])) {
                params = _.omit(params, key);
              }
            });

            customerService.putInfo(params).then(()=>{
              toaster.pop('success','',$translate.instant('USER.PROFILE_PAGE.DETAILS_UPDATED_SUCCESS'));
            }).catch(err =>{

              if (err.data) {
                toaster.pop('error','', err.data.description);
              }
            })
          }
        },
        controllerAs: 'profile'
    });
})();
