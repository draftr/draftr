var Promise     = require('bluebird'),
    fs          = require('fs'),
    _           = require('underscore'),
    deepExtend  = require('underscore-deep-extend');

_.mixin({ deepExtend: deepExtend(_) });

module.exports = function loadConfig(path, env) {
  'use strict';

  env = env || process.env.NODE_ENV;

  return new Promise(function (resolve, reject) {
    fs.exists(path, function (isPresent) {
      if (!isPresent) {
        return reject(new Error('Cannot find config file ' + path));
      }

      var data = require(path),
          config;

      config = _.deepExtend(data.prod, data[env]);
      resolve(config);
    });
  });
};