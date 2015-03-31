define(['draftr/api'], function (api) {
  'use strict';

  function FeedArticleDetailController($scope, $state, $stateParams) {
    $scope.article = null;

    api()
      .resource('article/' + $stateParams.id)
      .request()
      .then(function (res) {
        setTimeout(function () {
          $scope.article = res.data;
          $scope.$apply();
        });
      })
    ;
  }

  return FeedArticleDetailController;

});