define(['draftr/api', 'draftr/auth'], function (api, auth) {
  'use strict';

  function MeProfileController($scope) {
    $scope.username     = null;
    $scope.password     = null;
    $scope.emailAddress = null;
    $scope.err          = null;
    $scope.user         = null;

    auth.user(function (user) {
      setTimeout(function () {
        $scope.user = user;
        $scope.$apply();
      });
    });
    console.log($scope.user);
    $scope.updateUser = function updateUser() {

      auth.user(function (user) {
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
    }
  }
  MeProfileController.$inject = ['$scope', '$state'];

  return MeProfileController;
});