/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('Simulator.pages.profile')
    .controller('ProfilePageCtrl', ProfilePageCtrl);

  /** @ngInject */
  function ProfilePageCtrl($scope, toaster, $uibModal, userProfile, customerStatsService, simulator_config) {

    this.userProfileForm = {};
    this.upcomingExamEventDates = simulator_config.upcomingExamEventDates;
    this.user = userProfile;

    $scope.showModal = function (item) {
      $uibModal.open({
        animation: false,
        controller: 'ProfileModalCtrl',
        templateUrl: 'app/pages/profile/profileModal.html'
      }).result.then(function (link) {
          item.href = link;
        });
    };

    this.updateProfile = () =>{

      let params = this.user.plain();

      _.forEach(params, (val, key)=>{

        if (_.isEmpty(params[key])) {
          params = _.omit(params, key);
        }
      });

      customerStatsService.putInfo(params).then(()=>{
        toaster.pop('success','','User profile updated successfully');
      }).catch(err =>{

        if (err.data) {
          toaster.pop('error','', err.data.description);
        }
      })
    }
  }

})();
