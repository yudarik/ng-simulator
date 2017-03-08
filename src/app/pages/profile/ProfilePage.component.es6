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
        templateUrl: 'app/pages/profile/profile.html',

        /** @ngInject */
        controller: function (toaster, $uibModal, $translate, customerService, simulator_config) {

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
