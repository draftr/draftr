define(['jquery', 'draftr/api', 'marked'], function ($, api, marked) {
  'use strict';

  function WorkSpaceWriteController($scope, $state, $stateParams) {
    $scope.input        = null;
    $scope.feeds        = null;
    $scope.title        = null;
    $scope.preview      = null;
    $scope.previewTitle = null;
    $scope.success      = null;
    $scope.err          = null;
    $scope.id           = $stateParams.id;

    $scope.loadArticle = function loadArticle() {
      if($scope.preview) {
        return;
      }
      if(!$stateParams.articleId) {
        return;
      }

      api()
        .resource('article/' + $stateParams.articleId)
        .request()
        .then(function (article) {
          if(article) {
            setTimeout(function () {
              $scope.title = article.data.title;
              $scope.input = article.data.body;

              $scope.previewTitle = marked(article.data.title);
              $scope.preview      = marked(article.data.body);

              $scope.$apply();
            });
          }
        })
        .catch(function(e) {
          setTimeout(function () {
            $scope.err = e;
            $scope.$apply();
          });

          return;
        })
      ;
    };

    $scope.loadFeeds = function loadFeeds() {
      api()
        .resource('work-space/' + $stateParams.id + '/feed')
        .request()
        .then(function (res) {
          setTimeout(function () {
            $scope.feeds = res.data;
            $scope.$apply();
          });

          return;
        })
      ;
    };
    $scope.loadFeeds();
    $scope.inputTitleChange = function inputTitleChange() {
      if (!$scope.title) {
        return;
      }

      setTimeout(function () {
        $scope.previewTitle = marked($scope.title);
        $scope.$apply();
      });
    };

    $scope.inputChange = function inputChange() {
      if (!$scope.input) {
        return;
      }

      setTimeout(function () {
        $scope.preview = marked($scope.input);
        $scope.$apply();
      });
    };

     $scope.inputUrlChange = function inputUrlChange() {
      if (!$scope.url) {
        return;
      }

      setTimeout(function () {
        $scope.previewUrl = marked($scope.url);
        $scope.$apply();
      });
    };

    $scope.saveArticle = function saveArticle() {
      if($stateParams.articleId) {
        api()
          .method('post')
          .resource('article/' + $stateParams.articleId)
          .data('title', $scope.title)
          .data('body', $scope.input)
          .request()
          .then(function (article) {
            setTimeout(function () {
              $scope.success = true;
              $scope.$apply();
            });
            setTimeout(function () {
              $scope.success = null;
              $scope.$apply();
            },2000);
            return;
          })
          .catch(function(e) {
            setTimeout(function () {
              console.log(e);
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
      } else {
       api()
          .method('post')
          .resource('work-space/' + $stateParams.id + '/article')
          .data('title', $scope.title)
          .data('body', $scope.input)
          .request()
          .then(function (article) {
            setTimeout(function () {
              $scope.success = true;
              $scope.$apply();
            });

            setTimeout(function () {
              $scope.success = null;
              $scope.$apply();
            },2000);

            return;

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

    $scope.loadArticle();
    $scope.inputChange();
  }

  WorkSpaceWriteController.$inject= ['$scope', '$state', '$stateParams'];

  return WorkSpaceWriteController;
});