define(['draftr/api', 'draftr/auth'], function (api, auth) {
  'use strict';

  function MeProfileController($scope) {
    $scope.err             = null;
    $scope.user            = null;
    $scope.confirmPassword = null;

    auth.user(function (user) {
      setTimeout(function () {
        $scope.user = user;
        $scope.$apply();
      });
    });

    $scope.updateUser = function updateUser() {
      auth.user(function (user) {
        api()
          .resource('user/' + user.id)
          .data('username', $scope.user.username)
          .data('emailAddress', $scope.user.emailAddress)
        ;

        auth.update(user.id, $scope.username,$scope.emailAddress , $scope.password, function (err) {
          if (err) {
            setTimeout(function () {
              $scope.err = err;
              $scope.$apply();
            });

            return;
          }
        });
      });
    };
  }

  MeProfileController.$inject = ['$scope', '$state'];

  return MeProfileController;
});