define(['draftr/api'], function (api) {
  'use strict';

  function WorkSpaceDetailTeamController($scope, $state, $stateParams) {
    $scope.team = null;

    api()
      .resource('work-space/' + $stateParams.id + '/user')
      .request()
      .then(function (res) {
        setTimeout(function () {
          $scope.team = res.data;
          $scope.$apply();
        });
      })
      .catch(function (err) {
        $state.go('home');
      })
    ;
  }

  return WorkSpaceDetailTeamController;
});