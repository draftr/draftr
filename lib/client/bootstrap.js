define(['angular', 'draftr/app'], function (angular, app) {
  'use strict';

  app()
    .then(function () {
      angular.bootstrap(document, ['draftr']);
    })
  ;
});