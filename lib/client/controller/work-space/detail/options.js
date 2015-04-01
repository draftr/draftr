define(['draftr/api', 'draftr/auth'], function (api, auth) {
  'use strict';

  function WorkSpaceDetailOptionsController($scope, $state, $stateParams) {
    $scope.right    = null;
    $scope.user     = null;

    auth.user(function (user) {
      if(!user.isAuthenticated) {
        $state.go('home');
      }
    });

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