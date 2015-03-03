var bootstrap = require('./bootstrap'),
    Server    = require('./server');

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

module.exports = function (options) {
  'use strict';

  options = options || {};

  return bootstrap(options.config)
    .then(
      function () {
        return new Server();
      }
    );
};