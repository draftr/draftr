var Model           = require('../../../model/feed'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error'),
    util            = require('../../../util');

module.exports = function create(req, res) {
  'use strict';

  var feed, errors;

  req.assert('url').isURL();

  if ((errors = req.validationErrors())) {
    return res.api(new ValidationError(400, 'Invalid data', errors));
  }

  feed = new Model({
    url: req.body.url
  });

  feed.save(function (err, entity) {
    if (err) {
      if (util.detectMongoDbDuplicationErrorKey(err)) {
        return res.api(new StatusError(400, 'Duplicate key', err));
      }

      return res.api(new StatusError(500, 'Internal Server Error'));
    }

    return res.api(201, null, entity.toResObject());
  });
};