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
          userProfile: '<',
          userType: '<'
        },
        template: `<div ba-panel ba-panel-class="profile-page">
                    <div class="panel-content col-xs-12 col-md-8 pull-left">
                      <form name="userProfileForm" ng-submit="profile.updateProfile(profile.user)" novalidate>
                        <div ng-include="'app/pages/profile/profileTemplate/general-info.html'"></div>
                        <div ng-if="profile.userType === 'Customer'" ng-include="'app/pages/profile/profileTemplate/contact.html'"></div>
                        <div ng-if="profile.userType === 'Customer'" ng-include="'app/pages/profile/profileTemplate/password.html'"></div>
                        <div ng-include="'app/pages/profile/profileTemplate/exam-date.html'"></div>
                        <div ng-include="'app/pages/profile/profileTemplate/email-notification.html'"></div>
                  
                        <button type="submit" class="btn btn-primary btn-with-icon save-profile" ng-disabled="userProfileForm.$invalid">
                          <i class="ion-android-checkmark-circle"></i>{{::'USER.PROFILE_PAGE.UPDATE_PROFILE'|translate}}
                        </button>
                      </form>
                    </div>
                  </div>`,

        /** @ngInject */
        controller: function (toaster, $uibModal, $translate, $state, $timeout, customerService, simulator_config) {

          this.service = customerService;

          this.userProfileForm = {};

          this.examEventOption = 'select';

          this.upcomingExamEventDates = simulator_config.upcomingExamEventDates.map((date)=>{
            return date;//moment(date).format('DD/MM/YYYY').toString();
          });
          this.user = _.clone(this.userProfile);

          this.updateProfile = () =>{

            let params = this.user;

            if (this.user.examEventDate && typeof this.user.examEventDate === "object") {
              params.examEventDate = this.user.examEventDate.getTime();//.format('DD/MM/YYYY').toString();
            } else if (typeof this.user.examEventDate === "number") {
                params.examEventDate = this.user.examEventDate;
            }

            _.forEach(params, (val, key)=>{

              if (_.isNil(val)) {
                  params = _.omit(params, key);
              }
            });


            this.service.putInfo(params).then(()=>{
              toaster.pop('success','',$translate.instant('USER.PROFILE_PAGE.DETAILS_UPDATED_SUCCESS'));
                $timeout(()=>{
                    $state.go('dashboard');
                }, 1000);
            }).catch(err =>{

              if (err.data) {
                toaster.pop('error','', err.data.description);
              }
            });
          };

          this.togglePasswordChange = () => {
            this.showChangePassword = !this.showChangePassword;
          };
        },
        controllerAs: 'profile'
    });
})();
