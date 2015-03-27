define(['draftr/api', 'draftr/auth'], function (api, auth) {
  'use strict';

  function SignInController($scope, $state) {
    $scope.username = null;
    $scope.password = null;
    $scope.err      = null;

    $scope.signIn = function signIn() {
      auth.signIn($scope.username, $scope.password, function (err) {
        console.log(err);
        if (err) {
          setTimeout(function () {
            $scope.err = err;
            $scope.$apply();
          });
          setTimeout(function () {
            $scope.err = null;
            $scope.$apply();
          },2000);
          return;
        }

        $state.go('work-space');
      });
    };
  }

  SignInController.$inject = ['$scope', '$state'];

  return SignInController;
});