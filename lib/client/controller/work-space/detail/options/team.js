define(['draftr/api', 'draftr/auth'], function (api, auth) {
  'use strict';

  function WorkSpaceDetailOptionsTeamController($scope, $state, $stateParams) {

    $scope.loadUser = function loadUser() {
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

    $scope.toAdmin = function toAdmin(id) {
      api()
        .method('post')
        .resource('work-space/' + $stateParams.id + '/user/' + id)
        .data('isModerator', true)
        .data('isAdmin', true)
        .request()
        .then(function (res) {
          setTimeout(function () {
            $scope.err = null;
            $scope.success = { message: "User is now Admin"};
            $scope.$apply();
            $scope.loadUser();
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

    $scope.remouveAdmin = function remouveAdmin(id) {
      api()
        .resource('user/permission/' + $stateParams.id)
        .request()
        .then(function (result) {
          if(result.data.right === "owner") {
             api()
              .method('post')
              .resource('work-space/' + $stateParams.id + '/user/' + id)
              .data('isModerator', true)
              .data('isAdmin', false)
              .request()
              .then(function (res) {
                setTimeout(function () {
                  $scope.errUser = null;
                  $scope.success = { message: "Remouve Admin"};
                  $scope.$apply();
                  $scope.loadUser();
                });
                setTimeout(function () {
                  $scope.success = null;
                  $scope.$apply();
                },2000);
              })
              .catch(function(e) {
                setTimeout(function () {
                  $scope.errUser = e;
                  $scope.$apply();
                });
                setTimeout(function () {
                  $scope.errUser = null;
                  $scope.$apply();
                },2000);

                return;
              })
            ;
          }
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
            $scope.loadUser();
          });
        })
      ;
    };

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
            .data('isAdmin', false)
            .request()
            .then(function (res) {
              setTimeout(function () {
                $scope.errUser = null;
                $scope.success = { message: 'User "'+$scope.search+'" added'};
                $scope.$apply();
                $scope.loadUser();
              });
              setTimeout(function () {
                $scope.success = null;
                $scope.$apply();
              },2000);
            })
            .catch(function(e) {
              setTimeout(function () {
                $scope.errUser = e;
                $scope.$apply();
              });
              setTimeout(function () {
                $scope.errUser = null;
                $scope.$apply();
              },2000);
              return;
            })
          ;
        })
        .catch(function(e) {
          setTimeout(function () {
            $scope.errUser = e;
            $scope.$apply();
          });
         setTimeout(function () {
            $scope.errUser = null;
            $scope.$apply();
          },2000);
          return;
        })
      ;
    }

    $scope.loadUser();
  }

  return WorkSpaceDetailOptionsTeamController;
});