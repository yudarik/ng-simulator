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
        templateUrl: 'app/pages/profile/profile.html',

        /** @ngInject */
        controller: function (toaster, $uibModal, $translate, customerService, simulator_config) {

          this.userProfileForm = {};

          this.upcomingExamEventDates = simulator_config.upcomingExamEventDates.map((date)=>{
            return moment(date).format('DD/MM/YYYY').toString();
          });
          this.user = angular.copy(this.userProfile);
          this.user.examEventDate = new Date();

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
