define(['draftr/api','draftr/auth'], function (api,auth) {
  'use strict';

  function MeWorkSpaceCreateController($scope, $state) {
    $scope.name        = null;
    $scope.description = null;
    $scope.err         = null;

    $scope.create = function create() {
      console.log($scope.name,$scope.description);
      api()
        .method('post')
        .resource('work-space')
        .data('name', $scope.name)
        .data('description', $scope.description)
        .request()
        .then(function (res) {
          setTimeout(function () {
            $state.go('me.work-space-list');
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

  return MeWorkSpaceCreateController;
});
