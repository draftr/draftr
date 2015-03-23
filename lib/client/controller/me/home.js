define(['draftr/auth'], function (auth) {
  'use strict';

  function MeHomeController($scope) {
    $scope.user = null;
    auth.user(function (user) {
      setTimeout(function () {
        $scope.user = user;
        $scope.$apply();
      });
    });
  }

  return MeHomeController;
});
