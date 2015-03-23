define(['draftr/api','draftr/auth'], function (api,auth) {
  'use strict';

  function MeWorkSpaceListController($scope) {
    $scope.owner     = null;
    $scope.moderator = null;

    api()
      .resource('work-space')
      .request()
      .then(function (res) {
        setTimeout(function () {
          $scope.workSpaces = res.data;
          $scope.$apply();
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


    $scope.del = function del(id) {
      api()
        .method('delete')
        .resource('work-space/' + id)
        .request()
        .then(function (res) {
          api()
        .resource('work-space')
        .request()
        .then(function (res) {
          setTimeout(function () {
            $scope.workSpaces = res.data;
            $scope.$apply();
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
  }

  return MeWorkSpaceListController;
});
