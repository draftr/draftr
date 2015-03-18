define(['draftr/auth'], function (auth) {
  'use strict';

  function HeaderController($scope, $state) {
    $scope.user = undefined;

    auth.user(function (user) {
      setTimeout(function () {
        $scope.user = user;
        $scope.$apply();
      });
    });

    $scope.signOut = function signOut() {
      auth.signOut();
      $state.go('home');
    };
  }

  HeaderController.$inject = ['$scope', '$state'];

  return HeaderController;
});