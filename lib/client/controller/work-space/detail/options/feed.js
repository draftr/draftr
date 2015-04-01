define(['draftr/api', 'draftr/auth'], function (api, auth) {
  'use strict';

  function WorkSpaceDetailOptionsFeedController($scope, $state, $stateParams) {
    $scope.err     = null;
    $scope.success = null;
    $scope.feeds   = null;
    $scope.feedUrl = null;

    $scope.loadFeed = function loadFeed() {
      api()
        .resource('work-space/' + $stateParams.id)
        .request()
        .then(function (res) {
          setTimeout(function () {
            $scope.feeds = res.data.feeds;
            $scope.$apply();
          });
        })
      ;
    }

    $scope.addFeed = function addFeed() {
      api()
        .method('post')
        .resource('work-space/' + $stateParams.id + '/feed')
        .data('url', $scope.feedUrl)
        .request()
        .then(function (res) {
          setTimeout(function () {
            $scope.err     = null;
            $scope.success = { message: 'Feed "'+ $scope.feedUrl +'" added'};
            $scope.feedUrl = null;
            $scope.$apply();
            $scope.loadFeed();
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

    $scope.removeFeed = function removeFeed(id) {
      api()
        .method('delete')
        .resource('work-space/' + $stateParams.id + '/feed/' + id)
        .request()
        .then(function (res) {
          setTimeout(function () {
            $scope.success = { message: 'Delete Feed'};
            $scope.$apply();
            $scope.loadFeed();
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
    };

    $scope.loadFeed();
  }

  return WorkSpaceDetailOptionsFeedController;
});