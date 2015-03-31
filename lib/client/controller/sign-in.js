define(['draftr/api', 'draftr/auth'], function (api, auth) {
  'use strict';

  function SignInController($scope, $state) {
    $scope.username = null;
    $scope.password = null;
    $scope.err      = null;

    $scope.signIn = function signIn() {
      auth.signIn($scope.username, $scope.password, function (err) {
        if (err) {
          setTimeout(function () {
            console.log(err);
            $scope.err = err;
            $scope.$apply();
          });

          return;
        }

        $state.go('work-space');
      });
    };
  }

  SignInController.$inject = ['$scope', '$state'];

  return SignInController;
});