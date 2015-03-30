define(['draftr/api'], function (api) {
  'use strict';

  function WorkSpaceDetailOptionsController($scope, $state, $stateParams) {
    $scope.feeds      = null;
    $scope.team       = null;
    $scope.articles   = null;
    $scope.err        = null;
    $scope.feedUrl    = null;
    $scope.search     = null;
    $scope.success    = null;
    $scope.right      = null;
    $scope.user       = null;

    $scope.deleteWorkSpace = function deleteWorkSpace() {
      console.log($scope.right);
      if($scope.right === "owner") {
        api()
          .method('delete')
          .resource('work-space/' + $stateParams.id)
          .request()
          .then(function (res) {
            setTimeout(function () {
              $state.go('home');
            });
          })
          .catch(function(e) {
            console.log(e);
            setTimeout(function () {
              $scope.errFeed = e;
              $scope.$apply();
            });
            setTimeout(function () {
              $scope.errFeed = null;
              $scope.$apply();
            },2000);
            return;
          })
        ;
      } else {
        setTimeout(function () {
          $scope.errFeed = { message: "Only the Owner can remouve the WorkSpace"};
          $scope.$apply();
        });
        setTimeout(function () {
          $scope.errFeed = null;
          $scope.$apply();
        },2000);
      }
    }

    api()
      .resource('user/permission/' + $stateParams.id)
      .request()
      .then(function (result) {
        $scope.right = result.data.right;
      })
    ;

    api()
      .resource('me')
      .request()
      .then(function (result) {
        $scope.user = result.data;
        $state.go('work-space-detail.options.settings');
      })
    ;
  }

  return WorkSpaceDetailOptionsController;
});