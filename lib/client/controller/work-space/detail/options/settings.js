define(['draftr/api', 'draftr/auth'], function (api, auth) {
  'use strict';

  function WorkSpaceDetailOptionsSettingsController($scope, $state, $stateParams) {
    $scope.err     = null;
    $scope.success = null;

    $scope.updateWorkSpace = function updateWorkSpace() {
      api()
        .method('post')
        .resource('work-space/' + $stateParams.id)
        .data('name', $scope.entity.name)
        .data('description', $scope.entity.description)
        .request()
        .then(function (res) {
          setTimeout(function () {
            $scope.err     = null;
            $scope.success = { message: "WorkSpace updated"};

            $scope.$apply();
            $scope.loadUser();
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

  return WorkSpaceDetailOptionsSettingsController;
});