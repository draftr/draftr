define(['angular', 'draftr/app'], function (angular, app) {
  'use strict';

  app()
    .then(function () {
      window['💩'] = '1.0.0';
      angular.bootstrap(document, ['draftr']);
    })
  ;
});