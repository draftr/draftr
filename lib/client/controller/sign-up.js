define(['draftr/api', 'draftr/auth'], function (api, auth) {
  'use strict';

  function SignUpController($scope, $state) {
    $scope.username     = null;
    $scope.emailAddress = null;
    $scope.password     = null;
    $scope.err          = null;

    $scope.signUp = function signUp() {
      auth.signUp($scope.username, $scope.emailAddress, $scope.password, function (err) {
        if (err) {
          setTimeout(function () {
            $scope.err = err;
            $scope.$apply();
          });

          return;
        }

        $state.go('signin');
      });
    };
  }

  SignUpController.$inject = ['$scope', '$state'];

  return SignUpController;
});