define(['draftr/api', 'draftr/auth'], function (api, auth) {
  'use strict';

  function WorkSpaceDetailOptionsSettingsController($scope, $state, $stateParams) {
    $scope.updateWorkSpace = function updateWorkSpace() {
      api()
        .method('post')
        .resource('work-space/' + $stateParams.id)
        .data('name', $scope.entity.name)
        .data('description', $scope.entity.description)
        .request()
        .then(function (res) {
          setTimeout(function () {
            $scope.err = null;
            $scope.success = { message: "WorkSpace updated"};
            $scope.$apply();
            $scope.loadUser();
          });
          setTimeout(function () {
            $scope.success = null;
            $scope.$apply();
          },2000);
        })
        .catch(function(e) {
          setTimeout(function () {
            $scope.err = e;
            $scope.$apply();
          });
          setTimeout(function () {
            $scope.err = null;
            $scope.$apply();
          },2000);

          return;
        })
      ;
    }
  }

  return WorkSpaceDetailOptionsSettingsController;
});