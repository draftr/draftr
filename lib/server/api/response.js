var StatusError     = require('../error/status-error'),
    ValidationError = require('../error/validation-error'),
    draftr             = require('../draftr');

module.exports = function response(statusCode, err, data, cursor) {
  'use strict';

  if (statusCode instanceof Error) {
    err = statusCode;
  }

  if (err instanceof StatusError) {
    statusCode = err.statusCode;
  }

  var send = {
    meta: {
      statusCode: statusCode,
      error: null,
      cursor: cursor || null
    },
    data: data || null
  };

  if ('prod' !== draftr.env) {
    send.meta.environment = draftr.env;
  }

  if (err instanceof Error) {
    send.meta.error = {
      key: (err instanceof StatusError) ? err.key : null,
      message: (err instanceof Error) ? err.message : err
    };

    if ('prod' !== process.env.NODE_ENV) {
      send.meta.error.stack = (err instanceof Error) ? (err.stack || null) : null;
    }

    if (err instanceof ValidationError) {
      send.meta.error.detailed = err.detailed;
    }
  }

  return this
    .status(statusCode)
    .send(send)
  ;
};