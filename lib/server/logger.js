var bunyan = require('bunyan');

module.exports = function (env) {
  'use strict';

  var name = 'draftr',
      logger;

  logger = bunyan.createLogger({
    name: name,
    streams: [
      {
        level: 'debug',
        stream: process.stdout
      }
    ]
  });

  if (env !== 'test') {
    process.on('unhandledRejection', function(reason, promise) {
      logger.error('Unhandled rejection', {
        reason: reason,
        promise: promise
      });
    });
  }

  return logger;
};