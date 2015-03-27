define(['draftr/api','draftr/auth'], function (api,auth) {
  'use strict';

  function MeWorkSpaceListController($scope) {
    $scope.owner      = null;
    $scope.moderator  = null;
    $scope.workSpaces = null;
    var index, key;

    $scope.loadWorkSpaces = function loadWorkSpaces() {
      api()
        .resource('work-space')
        .request()
        .then(function (res) {
          setTimeout(function () {
            if(res.data !== null) {
              for (index = 0; index < res.data.length; index++) {
                for (key = 0; key < res.data[index].users.length; key++) {
                  if (res.data[index].users[key].user._id === $scope.user.id &&
                      res.data[index].users[key].isOwner === true) {
                    res.data[index].owner = true;
                  }
                }
              }
            }
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
    }

    $scope.del = function del(id) {
      api()
        .method('delete')
        .resource('work-space/' + id + '/user/' + $scope.user.id)
        .request()
        .then(function (res) {
          $scope.loadWorkSpaces();
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

    $scope.loadWorkSpaces();
  }

  return MeWorkSpaceListController;
});
