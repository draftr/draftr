define('draftr/app',[], function () {
  

  return function app() {
    console.log('Hi');
  };
});
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
  

  app();
});
define("lib/client/main", function(){});

