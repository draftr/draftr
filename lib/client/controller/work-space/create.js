define(['draftr/api'], function (api) {
  'use strict';

  function WorkSpaceCreateController($scope, $state) {
    $scope.name        = null;
    $scope.description = null;
    $scope.err         = null;

    $scope.create = function create() {
      api()
        .method('post')
        .resource('work-space')
        .data('name', $scope.name)
        .data('description', $scope.description)
        .request()
        .then(function (res) {
          setTimeout(function () {
            $state.go('work-space');
          });

          return;
        })
        .catch(function(e) {
          setTimeout(function () {
            $scope.err = e;
            $scope.$apply();
          });

          return;
        })
      ;
    }
  }

  return WorkSpaceCreateController;
});