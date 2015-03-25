define(['draftr/api'], function (api) {
  'use strict';

  function WorkSpaceDetailOptionsController($scope, $state, $stateParams) {
    $scope.feeds    = null;
    $scope.team     = null;
    $scope.articles = null;
    $scope.errUser  = null;
    $scope.errFeed  = null;
    $scope.feedUrl  = null;
    $scope.search   = null;

    api()
      .resource('user/permission/' + $stateParams.id)
      .request()
      .then(function (result) {
        if(result.data.isAllowed === false) {
          $state.go('work-space');
        }
      }).
      catch(function(e) {
        $state.go('work-space');
      })
    ;

    function loadFeed() {
      var index, key;

      api()
        .resource('feed')
        .request()
        .then(function (inactiveFeeds) {
          api()
            .resource('work-space/' + $stateParams.id + '/feed')
            .request()
            .then(function (activeFeeds) {
              for (index = 0; index < inactiveFeeds.data.length; index++) {
                for (key = 0; key < activeFeeds.data.length; key++) {
                  if( activeFeeds.data[key]._id === inactiveFeeds.data[index].id) {
                  inactiveFeeds.data[index].isActive = true;
                  }
                };
              };
              setTimeout(function () {
                $scope.feeds = inactiveFeeds.data;
                $scope.$apply();
              });
            })
          ;
        })
      ;
    }

    function loadUser() {
      api()
        .resource('work-space/' + $stateParams.id + '/user')
        .request()
        .then(function (res) {
          setTimeout(function () {
            $scope.team = res.data;
            $scope.$apply();
          });
        })
      ;
    }

    function loadArticle() {
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

    $scope.addNewUser = function addNewUser() {
       api()
        .method('post')
        .resource('user/search')
        .data('search', $scope.search)
        .request()
        .then(function (res) {
          api()
            .method('post')
            .resource('work-space/' + $stateParams.id + '/user')
            .data('user', res.data.id)
            .data('isModerator', true)
            .data('isOwner', false)
            .request()
            .then(function (res) {
              setTimeout(function () {
                $scope.errUser = null;
                $scope.$apply();
                loadUser();
              });
            })
            .catch(function(e) {
              setTimeout(function () {
                $scope.errUser = e;
                $scope.$apply();
              });

              return;
            })
          ;
        })
        .catch(function(e) {
          setTimeout(function () {
            $scope.errUser = e;
            $scope.$apply();
          });

          return;
        })
    }

    $scope.addNewFeed = function addNewFeed(id) {
      api()
        .method('post')
        .resource('work-space/' + $stateParams.id + '/feed')
        .data('url', $scope.feedUrl)
        .request()
        .then(function (res) {
          setTimeout(function () {
            $scope.errFeed = null;
            $scope.$apply();
            loadFeed();
          });
        })
        .catch(function(e) {
          setTimeout(function () {
            $scope.errFeed = e;
            $scope.$apply();
          });

          return;
        })
      ;
    }

    $scope.addFeed = function addFeed(id) {
      api()
        .method('post')
        .resource('work-space/' + $stateParams.id + '/feed')
        .data('feedId', id)
        .request()
        .then(function (res) {
          setTimeout(function () {
            loadFeed();
          });
        })
      ;
    }

    $scope.removeUser = function removeUser(id) {
      api()
        .method('delete')
        .resource('work-space/' + $stateParams.id + '/user/' + id)
        .request()
        .then(function (res) {
          setTimeout(function () {
            loadUser();
          });
        })
      ;
    };

    $scope.removeFeed = function removeFeed(id) {
      api()
        .method('delete')
        .resource('work-space/' + $stateParams.id + '/feed/' + id)
        .request()
        .then(function (res) {
          setTimeout(function () {
            loadFeed();
          });
        })
      ;
    };

    $scope.removeArticle = function removeArticle(id) {
       api()
        .method('delete')
        .resource('work-space/' + $stateParams.id + '/article/' + id)
        .request()
        .then(function (res) {
          setTimeout(function () {
            loadArticle();
          });
        })
      ;
    };

    loadUser();
    loadFeed();
    loadArticle();
  }

  return WorkSpaceDetailOptionsController;
});