define(['draftr/auth'], function (auth) {
  'use strict';

  function MeHomeController($scope, $state, $stateParams) {
    $scope.user = null;
    auth.user(function (user) {
      setTimeout(function () {
        $scope.user = user;
        $scope.$apply();
      });
    });

    $state.go('me.profile');

  }

  MeHomeController.$inject= ['$scope', '$state', '$stateParams'];

  return MeHomeController;
});
