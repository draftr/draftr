define(['draftr/api', 'draftr/auth'], function (api, auth) {
  'use strict';

  function MeProfileController($scope, $state) {
    $scope.err             = null;
    $scope.errPw           = null;
    $scope.success         = null;
    $scope.successPw       = null;
    $scope.confirmPassword = null;
    $scope.password        = null;

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
                $scope.success = {message: "Profile updated"}
                $scope.user    = res.data;
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
      if ($scope.password === $scope.confirmPassword) {
        auth.user(function (user) {
          api()
            .method('post')
            .resource('user/password/' + user.id)
            .data('password', $scope.password)
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
                $scope.errPw = e;
                $scope.$apply();
              });

              return;
            })
          ;
        });
      } else {
        setTimeout(function () {
          $scope.errPw = {
            message: "Invalid value"
          };
          $scope.$apply();
        });
      }
    }
  }

  return MeProfileController;
});