define(['jquery', 'draftr/api', 'marked', 'draftr/auth', 'draftr/io'], function ($, api, marked, auth, io) {
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
    $scope.writers      = [];

    auth.user(function (user) {
      if(!user.isAuthenticated) {
        $state.go('home');
      }
      io.socket.emit('write start', {
        articleId: $stateParams.articleId,
        userId:    user.id
      });
    }, true);

    io.socket.on('write new-user', function (user) {
      console.log(arguments);
    });

    $scope.loadArticle = function loadArticle() {
      if ($scope.preview) {
        return;
      }

      if (!$stateParams.articleId) {
        return;
      }

      api()
        .resource('work-space/' + $stateParams.id + '/article/' + $stateParams.articleId)
        .request()
        .then(function (result) {
          if(result) {
            setTimeout(function () {
              $scope.title = result.data.article.title;
              $scope.input = result.data.article.body;

              $scope.previewTitle = marked(result.data.article.title);
              $scope.preview      = marked(result.data.article.body);

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
          .resource('work-space/' + $stateParams.id + '/article/' + $stateParams.articleId)
          .data('title', $scope.title)
          .data('body', $scope.input)
          .request()
          .then(function () {
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
      } else {
       api()
          .method('post')
          .resource('work-space/' + $stateParams.id + '/article')
          .data('title', $scope.title)
          .data('body', $scope.input)
          .request()
          .then(function () {
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
    };

    $scope.loadArticle();
    $scope.inputChange();
  }

  WorkSpaceWriteController.$inject= ['$scope', '$state', '$stateParams'];

  return WorkSpaceWriteController;
});