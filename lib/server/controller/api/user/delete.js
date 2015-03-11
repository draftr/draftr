var Model           = require('../../../model/user'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error');

module.exports = function dell(req, res) {
  'use strict';

  var errors;

  req.assert('id').isMongoId();

  if ((errors = req.validationErrors())) {
    return res.api(new ValidationError(400, 'Invalid data', errors));
  }

  Model.findOneAndRemove({ _id: req.params.id }, function(err, entity) {
    if (err) {
      return res.api(new StatusError(400, 'Invalid id', err));
    }

    if (!entity) {
      return res.api(new StatusError(400, 'Invalid id', req.params.id));
    }

    return res.api(200, null, null);
  });
};