define(['draftr/api'], function (api) {
  'use strict';

  function WorkSpaceDetailArticleController($scope, $state, $stateParams) {
    $scope.articles = null;

    api()
      .resource('work-space/' + $stateParams.id + '/article')
      .request()
      .then(function (res) {
        setTimeout(function () {
          $scope.articles = res.data;
          $scope.$apply();
        });
      })
    ;
  }

  return WorkSpaceDetailArticleController;
});