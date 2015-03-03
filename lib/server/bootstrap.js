'use strict';

var Promise    = require('bluebird'),
    loadConfig = require('./config'),
    draftr        = require('./draftr');

module.exports = function (path) {
  return loadConfig(process.env.BG_URL_SHORTENER_CONFIG || path || process.cwd() + '/config.js')
    .then(
      function (config) {
        return draftr.init(config);
      }
    )
    .then(function () {
      Promise.resolve();
    })
    .catch(function (error) {
      Promise.reject(error);
    });
};