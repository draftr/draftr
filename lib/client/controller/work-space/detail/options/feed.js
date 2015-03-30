define(['draftr/api', 'draftr/auth'], function (api, auth) {
  'use strict';

  function WorkSpaceDetailOptionsFeedController($scope, $state, $stateParams) {
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
            $scope.err = null;
            $scope.success = { message: 'Feed "'+ $scope.feedUrl +'" added'};
            $scope.$apply();
            $scope.loadFeed();
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

    $scope.removeFeed = function removeFeed(id) {
      api()
        .method('delete')
        .resource('work-space/' + $stateParams.id + '/feed/' + id)
        .request()
        .then(function (res) {
          setTimeout(function () {
            $scope.loadFeed();
          });
        })
      ;
    };

    $scope.loadFeed();
  }

  return WorkSpaceDetailOptionsFeedController;
});