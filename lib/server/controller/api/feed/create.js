var Model           = require('../../../model/feed'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error');

module.exports = function create(req, res) {
  'use strict';

  var feed, errors;

  req.assert('url').isURL();

  errors = req.validationErrors();

  if (errors) {
    return res.api(new ValidationError(400, 'Invalid data', errors));
  }

  feed = new Model({
    url: req.body.url
  });

  feed.save(function (err, entity) {
    if (err) {
      return res.api(new StatusError(400, 'Duplicate key', err));
    }

    return res.api(200, null, entity.toResObject());
  });
};