define(
  [
    'module',
    'angular',
    'draftr/config',
    'angular/route',
    'angular/ui-router',
    'angular/sanitize'
  ],
  function (module, angular, config) {
    'use strict';

    return function () {
      return new Promise(function (resolve, reject) {
        var definition = module.config(),
            app;

        app = angular
          .module('draftr', ['ngRoute', 'ui.router', 'ngSanitize'])
          .run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
            $rootScope.$state       = $state;
            $rootScope.$stateParams = $stateParams;
          }])
          .config(config)
        ;

        require(
          definition.map(function (item) {
            return item.path;
          }),
          function () {
            var args = Array.prototype.slice.call(arguments);

            args.forEach(function (controller, index) {
              var type = definition[index].path.split('/')[1];

              app[type](definition[index].name, controller);
            });

            resolve(app);
          },
          function (err) {
            reject(err);
          }
        );
      });
    };
  }
);