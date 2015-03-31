define(['draftr/api'], function (api, auth) {
  'use strict';

  function SignUpController($scope, $state) {
    $scope.username     = null;
    $scope.emailAddress = null;
    $scope.password     = null;
    $scope.err          = null;

    $scope.signUp = function signUp() {
      api()
        .method('post')
        .resource('user/register')
        .data('username', $scope.username)
        .data('emailAddress', $scope.emailAddress)
        .data('password', $scope.password)
        .request()
        .then(function (res) {
          setTimeout(function () {
            $state.go('signin');
          });

          return;
        })
        .catch(function(e) {

          setTimeout(function () {
            $scope.err = e;
            $scope.$apply();
          });

          setTimeout(function () {
            $scope.err = null;
            $scope.$apply();
          },2000);

          return;
        })
      ;
    };
  }

  SignUpController.$inject = ['$scope', '$state'];

  return SignUpController;
});