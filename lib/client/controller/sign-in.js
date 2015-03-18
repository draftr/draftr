define(['draftr/api', 'draftr/auth'], function (api, auth) {
  'use strict';

  function SignInController($scope) {
    $scope.username        = null;
    $scope.password        = null;
    $scope.isAuthenticated = auth.isAuthenticated();
    $scope.err             = null;

    $scope.signIn = function signIn() {
      api()
        .method('POST')
        .resource('sign-in')
        .data('username', $scope.username)
        .data('password', $scope.password)
        .request()
        .then(function (res) {
          setTimeout(function () {
            auth.accessToken(res.data.accessToken);

            $scope.err = null;
            $scope.$apply();
          });
        })
        .catch(function (err) {
          setTimeout(function () {
            $scope.err = err.message;
            $scope.$apply();
          });
        })
      ;
      console.log($scope.username, $scope.password);
    };
  }

  SignInController.$inject = ['$scope'];

  return SignInController;
});