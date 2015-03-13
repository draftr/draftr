var Model           = require('../../../model/work-space'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error'),
    util            = require('../../../util');

module.exports = function update(req, res) {
  'use strict';

  req.assert('id').isMongoId();
  req.assert('name').notEmpty().isLength(3, 50);

  var errors;

  if ((errors = req.validationErrors())) {
    return res.api(new ValidationError(400, 'Invalid data', errors));
  }

  Model.findOneAndUpdate(
    { _id: req.params.id },
    { name: req.body.name },
    function(err, entity) {
      if (err) {
        if (util.detectMongoDbDuplicationErrorKey(err)) {
          return res.api(new StatusError(400, 'Duplicate key', 'duplicate'));
        }

        return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
      }

      if (!entity) {
        return res.api(new StatusError(404, 'Cannot find workspace by id "' + req.params.id + '"', 'not_found'));
      }

      return res.api(200, null, entity.toResObject());
    }
  );
};