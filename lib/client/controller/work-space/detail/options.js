define(['draftr/api'], function (api) {
  'use strict';

  function WorkSpaceDetailOptionsController($scope, $state, $stateParams) {
    $scope.right    = null;
    $scope.user     = null;

    api()
      .resource('user/permission/' + $stateParams.id)
      .request()
      .then(function (result) {
        $scope.right = result.data.right;
        if ($scope.right !== "owner" || $scope.right !== "admin") {
          $state.go('home');
        }
      })
      .catch(function (err) {
        $state.go('home');
      })
    ;

    api()
      .resource('me')
      .request()
      .then(function (result) {
        $scope.user = result.data;
        $state.go('work-space-detail.options.general');
      })
      .catch(function (err) {
        $state.go('home');
      })
    ;
  }

  WorkSpaceDetailOptionsController.$inject= ['$scope', '$state', '$stateParams'];

  return WorkSpaceDetailOptionsController;
});