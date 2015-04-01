define(['draftr/api', 'draftr/auth'], function (api, auth) {
  'use strict';

  function WorkSpaceDetailOptionsGeneralController($scope, $state, $stateParams) {
    $scope.err     = null;
    $scope.success = null;

    $scope.updateWorkSpace = function updateWorkSpace() {
      api()
        .method('post')
        .resource('work-space/' + $stateParams.id)
        .data('name', $scope.entity.name)
        .data('description', $scope.entity.description)
        .request()
        .then(function (res) {
          setTimeout(function () {
            $scope.err     = null;
            $scope.success = { message: "WorkSpace updated"};

            $scope.$apply();
            $scope.loadUser();
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

    $scope.deleteWorkSpace = function deleteWorkSpace() {
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
          $scope.errFeed = { message: "Only the Owner can remove the WorkSpace"};
          $scope.$apply();
        });
        setTimeout(function () {
          $scope.errFeed = null;
          $scope.$apply();
        },2000);
      }
    }
  }

  return WorkSpaceDetailOptionsGeneralController;
});