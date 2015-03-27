define(['draftr/api', 'draftr/auth'], function (api, auth) {
  'use strict';

  function MeProfileController($scope, $state) {
    $scope.err             = null;
    $scope.success         = null;
    $scope.confirmPassword = null;
    $scope.errPassword     = null;

    $scope.updateProfile = function updateUser() {
      auth.user(function (user) {
        if (user.username !== $scope.user.username || user.emailAddress !== $scope.user.emailAddress) {
          api()
            .method('post')
            .resource('user/' + user.id)
            .data('username', $scope.user.username)
            .data('emailAddress', $scope.user.emailAddress)
            .request()
            .then(function (res) {
              setTimeout(function () {
                $scope.user = user;
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
        } else {
          setTimeout(function () {
            $scope.err = {
              message: "No changes"
            };
            $scope.$apply();
          });
        }
      });
    };

    $scope.changePassword = function changePassword() {
      if ($scope.user.password === $scope.confirmPassword) {
        auth.user(function (user) {
          api()
            .method('post')
            .resource('user/password/' + user.id)
            .data('password', $scope.user.password)
            .request()
            .then(function (res) {
              setTimeout(function () {
                auth.signOut();
                $state.go('signin');
              });

              return;
            })
            .catch(function (e) {
              setTimeout(function () {
                $scope.err = e;
                $scope.$apply();
              });
              return;
            })
          ;
        });
      } else {
        setTimeout(function () {
          $scope.errPassword = {
            message: "New password an Confirm password must be the same"
          };
          $scope.$apply();
        });
      }
    }
  }

  MeProfileController.$inject= ['$scope', '$state', '$stateParams'];

  return MeProfileController;
});