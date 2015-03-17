define(['draftr/api', 'draftr/auth'], function (api, auth) {
  'use strict';

  function SignInController($scope) {
    $scope.username        = null;
    $scope.password        = null;
    $scope.isAuthenticated = auth.isAuthenticated();
    $scope.flashMessage    = null;

    $scope.signIn = function signIn() {
      api()
        .method('POST')
        .resource('sign-in')
        .data('username', $scope.username)
        .data('password', $scope.password)
        .request()
        .then(function (data) {
          console.log(data);
        })
        .catch(function (err) {
          $scope.flashMessage = {
            type: 'error',
            text: err
          };
        })
      ;
      console.log($scope.username, $scope.password);
    };
  }

  SignInController.$inject = ['$scope'];

  return SignInController;
});