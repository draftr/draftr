require.config({
  basePath: '/',
  paths: {
    'jquery': '/deps/jquery/src/jquery',
    'angular': '/deps/angular/angular'
  },
  shim: {
    'jquery': {
      exports: 'jQuery'
    },
    'angular': {
      deps: ['jquery'],
      exports: 'angular'
    }
  }
});

require(['draftr/app'], function (app) {
  'use strict';

  app();
});