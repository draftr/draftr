define(['draftr/api'], function (api) {
  'use strict';

  function WorkSpaceDetailController($scope, $state, $stateParams) {
    $scope.entity = undefined;

    api()
      .resource('work-space/' + $stateParams.id)
      .request()
      .then(function (res) {
        setTimeout(function () {
          $scope.entity = res.data;
          $scope.$apply();
        });
      })
    ;
  }

  WorkSpaceDetailController.$inject= ['$scope', '$state', '$stateParams'];

  return WorkSpaceDetailController;
});