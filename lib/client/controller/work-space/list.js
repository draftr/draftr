define(['draftr/api'], function (api) {
  'use strict';

  function WorkSpaceListController($scope) {
    $scope.list = undefined;

    api()
      .resource('work-space')
      .request()
      .then(function (res) {
        setTimeout(function () {
          $scope.list = res.data;
          $scope.$apply();
        });
      })
    ;
  }

  return WorkSpaceListController;
});