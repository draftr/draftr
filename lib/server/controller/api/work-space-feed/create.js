var Model           = require('../../../model/work-space'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error');

module.exports = function create(req, res) {
  'use strict';

  var errors;

  req.assert('id').isMongoId();
  req.assert('feed').isMongoId();

  errors = req.validationErrors();

  if (errors) {
    return res.api(new ValidationError(400, 'Invalid data', errors));
  }

 Model.findOneAndUpdate(
    { _id: req.params.id },
    { $push:
      {
      feeds:
        req.body.feed
      }
    },
    function(err, entity) {
      if (err) {
        return res.api(new StatusError(400, 'Invalid data', err));
      }

      return res.api(200, null, entity.toResObject());
    }
  );
};