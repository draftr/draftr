define(['jquery', 'draftr/api', 'marked'], function ($, api, marked) {
  'use strict';

  function WorkSpaceWriteController($scope, $state, $stateParams) {
    $scope.input = '# Welcome \nLorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.';
    $scope.feeds  = null;

    $scope.inputChange = function inputChange() {
      if (!$scope.input) {
        return;
      }

      setTimeout(function () {
        $scope.preview = marked($scope.input);
        $scope.$apply();
      });
    };

    $scope.inputChange();
  }

  WorkSpaceWriteController.$inject= ['$scope', '$state', '$stateParams'];

  return WorkSpaceWriteController;
});