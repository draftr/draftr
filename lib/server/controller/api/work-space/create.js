var Model           = require('../../../model/work-space'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error'),
    util            = require('../../../util');

module.exports = function create(req, res) {
  'use strict';

  var workSpace, errors;

  req.assert('name').notEmpty().isLength(3, 50);

  if ((errors = req.validationErrors())) {
    return res.api(new ValidationError(400, 'Invalid data', errors));
  }

  workSpace = new Model({
    name: req.body.name,
    users: [
      {
        user: req.user._id,
        isModerator: true,
        isOwner: true
      }
    ]
  });

  workSpace.save(function (err, entity) {
    if (err) {
      if (util.detectMongoDbDuplicationErrorKey(err)) {
        return res.api(new StatusError(400, 'Duplicate key', 'duplicate'));
      }

      return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
    }

    return res.api(201, null, entity.toResObject());
  });
};