/*jslint node: true */
'use strict';

var inherit     = require('util').inherits,
    StatusError = require('./status-error');

function ValidationError(statusCode, message, detailed, fileName, lineNumber) {
  this.statusCode = statusCode;
  this.message    = message;
  this.key        = 'validation_error';
  this.detailed   = detailed;

  this.fileName   = fileName;
  this.lineNumber = lineNumber;
}

inherit(ValidationError, StatusError);

module.exports = ValidationError;