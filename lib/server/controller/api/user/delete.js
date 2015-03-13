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
      return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
    }

    if (!entity) {
      return res.api(new StatusError(404, 'Cannot find user by id "' + req.params.id + '"', 'not_found'));
    }

    return res.api(200, null, null);
  });
};