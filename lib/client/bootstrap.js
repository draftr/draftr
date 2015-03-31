define(['angular', 'draftr/app', 'draftr/io'], function (angular, app, io) {
  'use strict';

  app()
    .then(function () {
      window['💩'] = '1.0.0';

      io.initialize();
      angular.bootstrap(document, ['draftr']);
    })
  ;
});