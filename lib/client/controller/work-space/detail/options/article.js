define(['draftr/api', 'draftr/auth'], function (api, auth) {
  'use strict';

  function WorkSpaceDetailOptionsArticleController($scope, $state, $stateParams) {

    $scope.loadArticle = function loadArticle() {
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

    $scope.removeArticle = function removeArticle(id) {
       api()
        .method('delete')
        .resource('work-space/' + $stateParams.id + '/article/' + id)
        .request()
        .then(function (res) {
          setTimeout(function () {
            $scope.success = { message: 'Delete Article'};
            $scope.$apply();
            $scope.loadArticle();
          });
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

    $scope.loadArticle();
  }

  return WorkSpaceDetailOptionsArticleController;
});