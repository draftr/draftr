define(['draftr/api'], function (api) {
  'use strict';

  function WorkSpaceListController($scope, $state) {
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
      .catch(function (err) {
         $state.go('home');
      })
    ;
  }

  return WorkSpaceListController;
});