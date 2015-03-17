(function (requirejs) {
  'use strict';

  requirejs.config({
    basePath: '/',
    paths: {
      'draftr':            '/js/draftr',
      'jquery':            '/deps/jquery/dist/jquery',
      'angular':           '/deps/angular/angular',
      'angular/route':     '/deps/angular-route/angular-route',
      'angular/ui-router': '/deps/angular-ui-router/release/angular-ui-router',
      'bluebird':          '/deps/bluebird/js/browser/bluebird',
    },
    shim: {
      'angular':           { 'exports': 'angular', 'deps': ['jquery'] },
      'jquery':            { 'exports': 'jQuery' },
      'angular/ui-router': { 'deps': ['angular'] },
      'angular/route':     { 'deps': ['angular'] }
    },
    config: {
      'draftr/app': [
        { path: 'draftr/controller/main', name: 'MainController' }
      ]
    }
  });

  require(['draftr/bootstrap'], function () {});
})(window.requirejs);