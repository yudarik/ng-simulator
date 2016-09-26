/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('Simulator.pages.profile')
    .controller('ProfilePageCtrl', ProfilePageCtrl, customerStatsService);

  /** @ngInject */
  function ProfilePageCtrl($scope, fileReader, $toaster, $uibModal, userProfile) {

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
      customerStatsService.putInfo(this.user).then(()=>{
        $toaster.pop('success','','User profile updated successfully');
      }).catch(err =>{
        $toaster.pop('error','','');

      })
    }
  }

})();
