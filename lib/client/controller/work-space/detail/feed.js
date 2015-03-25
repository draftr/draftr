define(['draftr/api'], function (api) {
  'use strict';

  function WorkSpaceDetailFeedController($scope, $state, $stateParams) {
    $scope.feeds = null;

    api()
      .resource('work-space/' + $stateParams.id + '/feed')
      .request()
      .then(function (res) {
        setTimeout(function () {
          $scope.feeds = res.data;
          $scope.$apply();
        });
      })
    ;
  }

  return WorkSpaceDetailFeedController;
});