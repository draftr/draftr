/*jslint node: true */
'use strict';

var inherit = require('util').inherits;

function StatusError(statusCode, message, key, fileName, lineNumber) {
  this.statusCode = statusCode;
  this.message    = message;
  this.key        = key;

  this.fileName   = fileName;
  this.lineNumber = lineNumber;
}

inherit(StatusError, Error);

module.exports = StatusError;