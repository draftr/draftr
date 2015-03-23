define(['draftr/api','draftr/auth'], function (api,auth) {
  'use strict';

  function MeWorkSpaceUpdateController($scope, $state, $stateParams) {
    $scope.workSpace = null;

    api()
      .resource('work-space/' + $stateParams.id)
      .request()
      .then(function (res) {
        setTimeout(function () {
          $scope.workSpace = res.data;
          $scope.$apply();
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

    $scope.update = function update() {
      api()
        .method('post')
        .resource('work-space/' + $stateParams.id)
        .data('name', $scope.workSpace.name)
        .data('description', $scope.workSpace.description)
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

  return MeWorkSpaceUpdateController;
});
