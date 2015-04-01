define(['draftr/api','draftr/auth'], function (api,auth) {
  'use strict';

  function WorkSpaceListController($scope, $state) {
    $scope.list = undefined;

    auth.user(function (user) {
      if(!user.isAuthenticated) {
        $state.go('home');
      }
    });

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