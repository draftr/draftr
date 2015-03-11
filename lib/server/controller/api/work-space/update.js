var Model           = require('../../../model/work-space'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error');

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
        return res.api(new StatusError(400, 'Invalid data', err));
      }

      return res.api(200, null, entity.toResObject());
    }
  );
};