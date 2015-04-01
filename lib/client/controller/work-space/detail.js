define(['draftr/api', 'draftr/auth'], function (api, auth) {
  'use strict';

  function WorkSpaceDetailController($scope, $state, $stateParams) {
    $scope.entity = undefined;

    auth.user(function (user) {
      api()
        .resource('work-space/' + $stateParams.id)
        .request()
        .then(function (res) {
          setTimeout(function () {
            res.data.userIsAdmin = false;
            for (var i = 0; i < res.data.users.length; i++) {
              if (res.data.users[i].user._id === user.id &&
                true === res.data.users[i].isAdmin ) {
                res.data.userIsAdmin = true;
              }
            };
            $scope.entity = res.data;
            $scope.$apply();
          });
        })
        .catch(function(err) {
           $state.go('home');
        })
      ;
    });
  }

  WorkSpaceDetailController.$inject= ['$scope', '$state', '$stateParams'];

  return WorkSpaceDetailController;
});