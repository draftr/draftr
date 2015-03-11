var Model           = require('../../../model/work-space'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error');

module.exports = function read(req, res) {
  'use strict';

  var errors;

  req.assert('id').isMongoId();

  errors = req.validationErrors();

  if (errors) {
    return res.api(new ValidationError(400, 'Invalid data', errors));
  }

  Model.findOne({ _id: req.params.id }, function(err,workSpace) {
    if (err) {
      return res.api(new ValidationError(400, 'Invalid data', errors));
    }

    req.assert('userId').isMongoId();

    errors = req.validationErrors();

    if (errors) {
      return res.api(200, null, workSpace.users);
    } else {
      workSpace.users.forEach(function(user) {
        return res.api(200, null, user);
      });
    }
  })
};