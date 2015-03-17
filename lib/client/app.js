define(
  [
    'module',
    'angular',
    'angular/route',
    'angular/ui-router'
  ],
  function (module, angular) {
    'use strict';

    return function () {
      return new Promise(function (resolve, reject) {
        var config = module.config(),
            app;

        app = angular
          .module('draftr', ['ngRoute', 'ui.router'])
          .run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
            $rootScope.$state       = $state;
            $rootScope.$stateParams = $stateParams;
          }])
          .config([function () {
          }])
        ;

        require(
          config.map(function (item) {
            return item.path;
          }),
          function () {
            var args = Array.prototype.slice.call(arguments);

            args.forEach(function (controller, index) {
              var type = config[index].path.split('/')[1];

              app[type](config[index].name, controller);
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