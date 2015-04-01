define(['draftr/auth'], function (auth) {
  'use strict';

  function MeHomeController($scope, $state, $stateParams) {
    $scope.user = null;

    auth.user(function (user) {
      if(!user.isAuthenticated) {
        $state.go('home');
      }
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
