var Model           = require('../../../model/work-space'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error'),
    util            = require('../../../util');

module.exports = function create(req, res) {
  'use strict';

  var errors;

  req.assert('id').isMongoId();
  req.assert('feed').isMongoId();

  if ((errors = req.validationErrors())) {
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
        if (util.detectMongoDbDuplicationErrorKey(err)) {
          return res.api(new StatusError(400, 'Duplicate key', 'duplicate'));
        }

        return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
      }

      return res.api(200, null, entity.toResObject());
    }
  );
};