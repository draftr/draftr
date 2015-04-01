define(['draftr/api', 'draftr/auth'], function (api, auth) {
  'use strict';

  function WorkSpaceCreateController($scope, $state) {
    $scope.name        = null;
    $scope.description = null;
    $scope.err         = null;

    auth.user(function (user) {
      if(!user.isAuthenticated) {
        $state.go('home');
      }
    });

    $scope.create = function create() {
      api()
        .method('POST')
        .resource('work-space')
        .data('name', $scope.name)
        .data('description', $scope.description || null)
        .request()
        .then(function () {
          $scope.name        = null;
          $scope.description = null;
          $scope.err         = null;
          setTimeout(function () {
            $state.go('work-space');
          });

          return;
        })
        .catch(function(err) {
          setTimeout(function () {
            $scope.err = err;
            $scope.$apply();
          });

          return;
        })
      ;
    };
  }

  return WorkSpaceCreateController;
});