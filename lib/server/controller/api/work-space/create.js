var Model           = require('../../../model/work-space'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error');

module.exports = function create(req, res) {
  'use strict';

  var workSpace, errors;

  req.assert('name').notEmpty().isLength(3, 50);

  errors = req.validationErrors();

  if (errors) {
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
    console.log(err);
    if (err) {
      return res.api(new StatusError(400, 'Duplicate key', err));
    }

    return res.api(200, null, entity.toResObject());
  });
};